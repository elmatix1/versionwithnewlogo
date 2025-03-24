
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type MaintenanceTaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';
export type MaintenanceTaskPriority = 'high' | 'normal' | 'low';
export type MaintenanceTaskType = 'repair' | 'inspection' | 'service' | 'other';

export interface MaintenanceTask {
  id: string;
  vehicle: string;
  type: MaintenanceTaskType;
  description: string;
  status: MaintenanceTaskStatus;
  priority: MaintenanceTaskPriority;
  assignedTo: string;
  dueDate: string;
  createdAt?: string;
  completedAt?: string;
  notes?: string;
}

export function useMaintenanceTasks() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les tâches de maintenance depuis Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('maintenance_tasks')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        // Convertir les données pour correspondre à l'interface MaintenanceTask
        const formattedTasks = data.map(task => ({
          id: task.id.toString(),
          vehicle: task.vehicle,
          type: task.type as MaintenanceTaskType,
          description: task.description,
          status: task.status as MaintenanceTaskStatus,
          priority: task.priority as MaintenanceTaskPriority,
          assignedTo: task.assigned_to,
          dueDate: task.due_date,
          createdAt: task.created_at,
          completedAt: task.completed_at,
          notes: task.notes
        }));
        
        setTasks(formattedTasks);
      } catch (err: any) {
        console.error('Erreur lors de la récupération des tâches de maintenance:', err);
        setError(err.message);
        toast.error("Erreur lors du chargement des tâches de maintenance", {
          description: err.message
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
    
    // Configurer le canal en temps réel
    const channel = supabase
      .channel('public:maintenance_tasks')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'maintenance_tasks' }, 
        (payload) => {
          console.log('Changement détecté dans les tâches de maintenance:', payload);
          fetchTasks();
        }
      )
      .subscribe();
    
    // Nettoyer l'abonnement
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Ajouter une tâche de maintenance
  const addTask = async (taskData: Omit<MaintenanceTask, 'id' | 'createdAt'>) => {
    try {
      const now = new Date().toISOString();
      
      // Préparer les données pour l'insertion
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .insert([{
          vehicle: taskData.vehicle,
          type: taskData.type,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          assigned_to: taskData.assignedTo,
          due_date: taskData.dueDate,
          created_at: now,
          completed_at: taskData.completedAt,
          notes: taskData.notes
        }])
        .select();
      
      if (error) {
        throw error;
      }
      
      // Convertir la nouvelle tâche au format MaintenanceTask
      const newTask: MaintenanceTask = {
        id: data[0].id.toString(),
        vehicle: data[0].vehicle,
        type: data[0].type as MaintenanceTaskType,
        description: data[0].description,
        status: data[0].status as MaintenanceTaskStatus,
        priority: data[0].priority as MaintenanceTaskPriority,
        assignedTo: data[0].assigned_to,
        dueDate: data[0].due_date,
        createdAt: data[0].created_at,
        completedAt: data[0].completed_at,
        notes: data[0].notes
      };
      
      toast.success("Tâche ajoutée avec succès", {
        description: `La tâche de maintenance pour ${newTask.vehicle} a été créée.`
      });
      
      return newTask;
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout d\'une tâche de maintenance:', err);
      toast.error("Erreur lors de l'ajout de la tâche", {
        description: err.message
      });
      throw err;
    }
  };
  
  // Mettre à jour une tâche de maintenance
  const updateTask = async (id: string, updates: Partial<MaintenanceTask>) => {
    try {
      // Préparer les données pour la mise à jour
      const updateData: any = {};
      
      if (updates.vehicle) updateData.vehicle = updates.vehicle;
      if (updates.type) updateData.type = updates.type;
      if (updates.description) updateData.description = updates.description;
      if (updates.status) {
        updateData.status = updates.status;
        // Si le statut passe à completed, ajouter l'horodatage
        if (updates.status === 'completed') {
          updateData.completed_at = new Date().toISOString();
        }
      }
      if (updates.priority) updateData.priority = updates.priority;
      if (updates.assignedTo) updateData.assigned_to = updates.assignedTo;
      if (updates.dueDate) updateData.due_date = updates.dueDate;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      
      const { error } = await supabase
        .from('maintenance_tasks')
        .update(updateData)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast.success("Tâche mise à jour", {
        description: "Les informations de la tâche ont été mises à jour."
      });
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour d\'une tâche de maintenance:', err);
      toast.error("Erreur lors de la mise à jour de la tâche", {
        description: err.message
      });
      throw err;
    }
  };
  
  // Supprimer une tâche de maintenance
  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_tasks')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast.success("Tâche supprimée", {
        description: "La tâche a été supprimée avec succès."
      });
    } catch (err: any) {
      console.error('Erreur lors de la suppression d\'une tâche de maintenance:', err);
      toast.error("Erreur lors de la suppression de la tâche", {
        description: err.message
      });
      throw err;
    }
  };

  // Obtenir les statistiques par statut
  const getStatusCounts = () => {
    return tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<MaintenanceTaskStatus, number>);
  };

  // Obtenir les statistiques par priorité
  const getPriorityCounts = () => {
    return tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<MaintenanceTaskPriority, number>);
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    getStatusCounts,
    getPriorityCounts
  };
}
