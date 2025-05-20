
import { useState, useEffect } from 'react';
import { 
  fetchMaintenanceTasks, 
  addMaintenanceTask, 
  updateMaintenanceTask, 
  deleteMaintenanceTask,
  subscribeToTaskChanges 
} from './maintenance/useMaintenanceTasksApi';
import { useMaintenanceStats } from './maintenance/useMaintenanceStats';

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
  
  // Récupérer les tâches de maintenance
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const data = await fetchMaintenanceTasks();
        setTasks(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadTasks();
    
    // Configurer le canal en temps réel
    const unsubscribe = subscribeToTaskChanges(loadTasks);
    
    // Nettoyer l'abonnement
    return unsubscribe;
  }, []);

  // Ajouter une tâche de maintenance
  const addTask = async (taskData: Omit<MaintenanceTask, 'id' | 'createdAt'>) => {
    const newTask = await addMaintenanceTask(taskData);
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };
  
  // Mettre à jour une tâche de maintenance
  const updateTask = async (id: string, updates: Partial<MaintenanceTask>) => {
    await updateMaintenanceTask(id, updates);
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
  };
  
  // Supprimer une tâche de maintenance
  const deleteTask = async (id: string) => {
    await deleteMaintenanceTask(id);
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Filtrer les tâches par statut
  const getFilteredTasks = (status: string) => {
    if (status === 'all') return tasks;
    return tasks.filter(task => task.status === status as MaintenanceTaskStatus);
  };

  // Utiliser les statistiques
  const stats = useMaintenanceStats(tasks);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    getFilteredTasks,
    getStatusCounts: stats.getStatusCounts,
    getPriorityCounts: stats.getPriorityCounts,
    statistics: stats.calculateTaskStatistics()
  };
}
