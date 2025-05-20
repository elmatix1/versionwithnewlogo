
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  MaintenanceTask, 
  MaintenanceTaskStatus, 
  MaintenanceTaskPriority, 
  MaintenanceTaskType 
} from '../useMaintenanceTasks';

const mapTaskFromDatabase = (task: any): MaintenanceTask => ({
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
});

export const fetchMaintenanceTasks = async (): Promise<MaintenanceTask[]> => {
  try {
    const { data, error } = await supabase
      .from('maintenance_tasks')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    const formattedTasks = data.map(mapTaskFromDatabase);
    console.log('Tâches de maintenance récupérées:', formattedTasks);
    return formattedTasks;
  } catch (err: any) {
    console.error('Erreur lors de la récupération des tâches de maintenance:', err);
    toast.error("Erreur lors du chargement des tâches de maintenance", {
      description: err.message
    });
    throw err;
  }
};

export const addMaintenanceTask = async (
  taskData: Omit<MaintenanceTask, 'id' | 'createdAt'>
): Promise<MaintenanceTask> => {
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
        assigned_to: taskData.assignedTo,
        due_date: taskData.dueDate,
        created_at: now,
        completed_at: taskData.completedAt,
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
    const newTask = mapTaskFromDatabase(data[0]);
    console.log('Tâche ajoutée avec succès:', newTask);
    
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

export const updateMaintenanceTask = async (
  id: string, 
  updates: Partial<MaintenanceTask>
): Promise<void> => {
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
      .eq('id', parseInt(id));
    
    if (error) {
      console.error('Erreur Supabase lors de la mise à jour d\'une tâche de maintenance:', error);
      throw error;
    }
    
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

export const deleteMaintenanceTask = async (id: string): Promise<void> => {
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

export const subscribeToTaskChanges = (onDataChange: () => void) => {
  const channel = supabase
    .channel('public:maintenance_tasks')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'maintenance_tasks' }, 
      (payload) => {
        console.log('Changement détecté dans les tâches de maintenance:', payload);
        onDataChange();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
