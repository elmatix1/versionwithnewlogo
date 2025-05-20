
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import MaintenanceStats from '@/components/maintenance/MaintenanceStats';
import VehicleDocViewer from '@/components/maintenance/VehicleDocViewer';

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
  const [showStats, setShowStats] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  
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

  const handleShowStats = () => {
    setShowStats(true);
    setShowDocs(false);
  };

  const handleShowDocs = () => {
    setShowDocs(true);
    setShowStats(false);
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

      {!showStats && !showDocs && (
        <FeatureCards 
          onShowStats={handleShowStats}
          onShowDocs={handleShowDocs}
        />
      )}

      {showStats && (
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Statistiques de maintenance</CardTitle>
                <CardDescription>Analyse des performances et coûts</CardDescription>
              </div>
              <Button onClick={() => setShowStats(false)} variant="outline">Retour</Button>
            </div>
          </CardHeader>
          <CardContent>
            <MaintenanceStats />
          </CardContent>
        </Card>
      )}

      {showDocs && (
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Documentation technique</CardTitle>
                <CardDescription>Manuels et fiches techniques des véhicules</CardDescription>
              </div>
              <Button onClick={() => setShowDocs(false)} variant="outline">Retour</Button>
            </div>
          </CardHeader>
          <CardContent>
            <VehicleDocViewer />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Maintenance;
