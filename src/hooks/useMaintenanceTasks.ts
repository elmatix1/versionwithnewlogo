
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
          assignedTo: task.assignedTo,
          dueDate: task.dueDate,
          createdAt: task.createdAt,
          completedAt: task.completedAt,
          notes: task.notes
        }));
        
        setTasks(formattedTasks);
        console.log('Tâches de maintenance récupérées:', formattedTasks);
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
      console.log('Tentative d\'ajout de tâche de maintenance:', taskData);
      
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
          assignedTo: taskData.assignedTo,
          dueDate: taskData.dueDate,
          createdAt: now,
          completedAt: taskData.completedAt,
          notes: taskData.notes
        }])
        .select();
      
      if (error) {
        console.error('Erreur Supabase lors de l\'ajout d\'une tâche de maintenance:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('Aucune donnée retournée après l\'insertion');
      }
      
      // Convertir la nouvelle tâche au format MaintenanceTask
      const newTask: MaintenanceTask = {
        id: data[0].id.toString(),
        vehicle: data[0].vehicle,
        type: data[0].type as MaintenanceTaskType,
        description: data[0].description,
        status: data[0].status as MaintenanceTaskStatus,
        priority: data[0].priority as MaintenanceTaskPriority,
        assignedTo: data[0].assignedTo,
        dueDate: data[0].dueDate,
        createdAt: data[0].createdAt,
        completedAt: data[0].completedAt,
        notes: data[0].notes
      };
      
      console.log('Tâche ajoutée avec succès:', newTask);
      
      // Mettre à jour l'état local avec la nouvelle tâche
      setTasks(prev => [...prev, newTask]);
      
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
      console.log('Tentative de mise à jour de la tâche de maintenance:', id, updates);
      
      // Préparer les données pour la mise à jour
      const updateData: any = {};
      
      if (updates.vehicle) updateData.vehicle = updates.vehicle;
      if (updates.type) updateData.type = updates.type;
      if (updates.description) updateData.description = updates.description;
      if (updates.status) {
        updateData.status = updates.status;
        // Si le statut passe à completed, ajouter l'horodatage
        if (updates.status === 'completed') {
          updateData.completedAt = new Date().toISOString();
        }
      }
      if (updates.priority) updateData.priority = updates.priority;
      if (updates.assignedTo) updateData.assignedTo = updates.assignedTo;
      if (updates.dueDate) updateData.dueDate = updates.dueDate;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      
      const { error } = await supabase
        .from('maintenance_tasks')
        .update(updateData)
        .eq('id', parseInt(id));
      
      if (error) {
        console.error('Erreur Supabase lors de la mise à jour d\'une tâche de maintenance:', error);
        throw error;
      }
      
      // Mettre à jour l'état local avec les modifications
      setTasks(prev => 
        prev.map(task => 
          task.id === id 
            ? { 
                ...task, 
                ...updates,
                completedAt: updates.status === 'completed' ? new Date().toISOString() : task.completedAt 
              } 
            : task
        )
      );
      
      console.log('Tâche mise à jour avec succès');
      
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
      console.log('Tentative de suppression de la tâche de maintenance:', id);
      
      const { error } = await supabase
        .from('maintenance_tasks')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) {
        console.error('Erreur Supabase lors de la suppression d\'une tâche de maintenance:', error);
        throw error;
      }
      
      // Mettre à jour l'état local en supprimant la tâche
      setTasks(prev => prev.filter(task => task.id !== id));
      
      console.log('Tâche supprimée avec succès');
      
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
