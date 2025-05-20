
import { MaintenanceTask, MaintenanceTaskStatus, MaintenanceTaskPriority } from '../useMaintenanceTasks';

export const useMaintenanceStats = (tasks: MaintenanceTask[]) => {
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

  // Compter les tâches par statut
  const countByStatus = (status: MaintenanceTaskStatus) => {
    return tasks.filter(t => t.status === status).length;
  };

  // Calculer les statistiques des tâches
  const calculateTaskStatistics = () => {
    return {
      pending: countByStatus('pending'),
      inProgress: countByStatus('in-progress'),
      completed: countByStatus('completed'),
      cancelled: countByStatus('cancelled'),
      total: tasks.length,
      priorityHigh: tasks.filter(t => t.priority === 'high').length,
      priorityNormal: tasks.filter(t => t.priority === 'normal').length,
      priorityLow: tasks.filter(t => t.priority === 'low').length,
    };
  };

  return {
    getStatusCounts,
    getPriorityCounts,
    calculateTaskStatistics
  };
};
