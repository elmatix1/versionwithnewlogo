
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MaintenanceTask, MaintenanceTaskStatus, MaintenanceTaskType, MaintenanceTaskPriority } from '@/hooks/useMaintenanceTasks';
import TasksTable from './TasksTable';

interface TasksTabViewProps {
  tasks: MaintenanceTask[];
  getFilteredTasks: (status: string) => MaintenanceTask[];
  onUpdateTaskType: (taskId: string, type: MaintenanceTaskType) => void;
  onUpdateTaskStatus: (taskId: string, status: MaintenanceTaskStatus) => void;
  onUpdateTaskPriority: (taskId: string, priority: MaintenanceTaskPriority) => void;
}

const TasksTabView: React.FC<TasksTabViewProps> = ({
  tasks,
  getFilteredTasks,
  onUpdateTaskType,
  onUpdateTaskStatus,
  onUpdateTaskPriority
}) => {
  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-4">
        <TabsTrigger value="all">Toutes</TabsTrigger>
        <TabsTrigger value="pending">En attente</TabsTrigger>
        <TabsTrigger value="in-progress">En cours</TabsTrigger>
        <TabsTrigger value="completed">Terminées</TabsTrigger>
        <TabsTrigger value="cancelled">Annulées</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="m-0">
        <TasksTable 
          tasks={tasks}
          onUpdateTaskType={onUpdateTaskType}
          onUpdateTaskStatus={onUpdateTaskStatus}
          onUpdateTaskPriority={onUpdateTaskPriority}
        />
      </TabsContent>
      
      {["pending", "in-progress", "completed", "cancelled"].map((status) => (
        <TabsContent key={status} value={status} className="m-0">
          <TasksTable 
            tasks={getFilteredTasks(status)}
            onUpdateTaskType={onUpdateTaskType}
            onUpdateTaskStatus={onUpdateTaskStatus}
            onUpdateTaskPriority={onUpdateTaskPriority}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TasksTabView;
