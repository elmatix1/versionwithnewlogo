
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format } from 'date-fns';
import { toast } from "sonner";
import { useMaintenanceTasks, MaintenanceTaskStatus, MaintenanceTaskType, MaintenanceTaskPriority } from '@/hooks/useMaintenanceTasks';
import { MaintenanceFormValues } from '@/components/maintenance/TaskCreationForm';

import StatCards from '@/components/maintenance/StatCards';
import TasksTabView from '@/components/maintenance/TasksTabView';
import FeatureCards from '@/components/maintenance/FeatureCards';
import TaskDialog from '@/components/maintenance/TaskDialog';
import Loading from '@/components/maintenance/Loading';
import Error from '@/components/maintenance/Error';

const Maintenance: React.FC = () => {
  const { 
    tasks, 
    loading, 
    error, 
    addTask, 
    updateTask,
    getFilteredTasks,
    statistics 
  } = useMaintenanceTasks();

  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  
  const handleUpdateTaskStatus = (taskId: string, newStatus: MaintenanceTaskStatus) => {
    updateTask(taskId, { status: newStatus })
      .then(() => {
        toast.success(`Statut de la tâche mis à jour`);
      })
      .catch((error) => {
        toast.error(`Erreur lors de la mise à jour du statut`, {
          description: error.message
        });
      });
  };

  const handleUpdateTaskType = (taskId: string, newType: MaintenanceTaskType) => {
    updateTask(taskId, { type: newType })
      .then(() => {
        toast.success(`Type de la tâche mis à jour`);
      })
      .catch((error) => {
        toast.error(`Erreur lors de la mise à jour du type`, {
          description: error.message
        });
      });
  };

  const handleUpdateTaskPriority = (taskId: string, newPriority: MaintenanceTaskPriority) => {
    updateTask(taskId, { priority: newPriority })
      .then(() => {
        toast.success(`Priorité de la tâche mise à jour`);
      })
      .catch((error) => {
        toast.error(`Erreur lors de la mise à jour de la priorité`, {
          description: error.message
        });
      });
  };

  const handleAddNewTask = (formData: MaintenanceFormValues) => {
    const formattedDate = format(formData.dueDate, 'yyyy-MM-dd');
    
    const taskData = {
      vehicle: formData.vehicle,
      type: formData.type,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      assignedTo: formData.assignedTo,
      dueDate: formattedDate,
      notes: formData.notes || ''
    };
    
    addTask(taskData)
      .then(() => {
        setNewTaskDialogOpen(false);
        toast.success("Nouvelle tâche créée");
      })
      .catch((error) => {
        toast.error("Erreur lors de la création de la tâche", {
          description: error.message
        });
      });
  };

  const handleShowStatsMessage = () => {
    toast.info("Fonctionnalité en développement", {
      description: "Les statistiques détaillées seront disponibles prochainement"
    });
  };

  const handleShowDocsMessage = () => {
    toast.info("Fonctionnalité en développement", {
      description: "La documentation technique sera disponible prochainement"
    });
  };

  // Afficher un message de chargement
  if (loading) {
    return <Loading />;
  }

  // Afficher un message d'erreur
  if (error) {
    return <Error message={error} />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Maintenance des véhicules</h1>
        <p className="text-muted-foreground">Suivez et gérez les opérations de maintenance</p>
      </div>

      <StatCards 
        pendingCount={statistics.pending}
        inProgressCount={statistics.inProgress}
        completedCount={statistics.completed}
        cancelledCount={statistics.cancelled}
      />

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tâches de maintenance</CardTitle>
              <CardDescription>Suivi des interventions sur les véhicules</CardDescription>
            </div>
            <TaskDialog
              open={newTaskDialogOpen}
              onOpenChange={setNewTaskDialogOpen}
              onSubmit={handleAddNewTask}
            />
          </div>
        </CardHeader>
        <CardContent>
          <TasksTabView 
            tasks={tasks}
            getFilteredTasks={getFilteredTasks}
            onUpdateTaskType={handleUpdateTaskType}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onUpdateTaskPriority={handleUpdateTaskPriority}
          />
        </CardContent>
      </Card>

      <FeatureCards 
        onShowStats={handleShowStatsMessage}
        onShowDocs={handleShowDocsMessage}
      />
    </div>
  );
};

export default Maintenance;
