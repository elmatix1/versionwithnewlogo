
import { useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage';

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

const STORAGE_KEY = 'tms-maintenance-tasks';

export function useMaintenanceTasks() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>(() => 
    loadFromLocalStorage<MaintenanceTask[]>(STORAGE_KEY, [])
  );

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEY, tasks);
  }, [tasks]);

  const addTask = (taskData: Omit<MaintenanceTask, 'id' | 'createdAt'>) => {
    const newTask: MaintenanceTask = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...taskData
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<MaintenanceTask>) => {
    setTasks(prev => 
      prev.map(task => {
        if (task.id === id) {
          // If status is changing to completed, add completedAt timestamp
          if (updates.status === 'completed' && task.status !== 'completed') {
            updates.completedAt = new Date().toISOString();
          }
          return { ...task, ...updates };
        }
        return task;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Get counts by status
  const getStatusCounts = () => {
    return tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<MaintenanceTaskStatus, number>);
  };

  // Get counts by priority
  const getPriorityCounts = () => {
    return tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<MaintenanceTaskPriority, number>);
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getStatusCounts,
    getPriorityCounts
  };
}
