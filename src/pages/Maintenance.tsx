
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Plus,
  FileText,
  BarChart
} from 'lucide-react';
import { toast } from "sonner";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import TaskCreationForm, { MaintenanceFormValues } from '@/components/maintenance/TaskCreationForm';
import { useMaintenanceTasks, MaintenanceTask, MaintenanceTaskStatus, MaintenanceTaskType, MaintenanceTaskPriority } from '@/hooks/useMaintenanceTasks';

const Maintenance: React.FC = () => {
  const { 
    tasks, 
    loading, 
    error, 
    addTask, 
    updateTask, 
    deleteTask,
    getStatusCounts 
  } = useMaintenanceTasks();

  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [showStatsMessage, setShowStatsMessage] = useState(false);
  const [showDocsMessage, setShowDocsMessage] = useState(false);
  
  const statusConfig = {
    'pending': { 
      label: 'En attente', 
      className: 'bg-blue-500' 
    },
    'in-progress': { 
      label: 'En cours', 
      className: 'bg-amber-500' 
    },
    'completed': { 
      label: 'Terminée', 
      className: 'bg-green-500' 
    },
    'cancelled': { 
      label: 'Annulée', 
      className: 'bg-red-500' 
    }
  };

  const priorityConfig = {
    'low': { 
      label: 'Basse', 
      className: 'border-gray-500 text-gray-600' 
    },
    'normal': { 
      label: 'Moyenne', 
      className: 'border-blue-500 text-blue-600' 
    },
    'high': { 
      label: 'Haute', 
      className: 'border-amber-500 text-amber-600' 
    }
  };

  const typeConfig = {
    'repair': { 
      label: 'Réparation', 
      className: 'bg-amber-100 text-amber-800' 
    },
    'service': { 
      label: 'Entretien', 
      className: 'bg-blue-100 text-blue-800' 
    },
    'inspection': { 
      label: 'Inspection', 
      className: 'bg-green-100 text-green-800' 
    },
    'other': { 
      label: 'Autre', 
      className: 'bg-gray-100 text-gray-800' 
    }
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: MaintenanceTaskStatus) => {
    updateTask(taskId, { status: newStatus })
      .then(() => {
        toast.success(`Statut de la tâche mis à jour`, {
          description: `La tâche ${taskId} est maintenant "${statusConfig[newStatus].label}"`
        });
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
        toast.success(`Type de la tâche mis à jour`, {
          description: `La tâche ${taskId} est maintenant de type "${typeConfig[newType].label}"`
        });
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
        toast.success(`Priorité de la tâche mise à jour`, {
          description: `La tâche ${taskId} est maintenant "${priorityConfig[newPriority].label}"`
        });
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
      .then((newTask) => {
        setNewTaskDialogOpen(false);
        toast.success("Nouvelle tâche créée", {
          description: `La tâche ${newTask.id} a été ajoutée avec succès`
        });
      })
      .catch((error) => {
        toast.error("Erreur lors de la création de la tâche", {
          description: error.message
        });
      });
  };

  const handleShowStatsMessage = () => {
    setShowStatsMessage(true);
    setTimeout(() => setShowStatsMessage(false), 3000);
    toast.info("Fonctionnalité en développement", {
      description: "Les statistiques détaillées seront disponibles prochainement"
    });
  };

  const handleShowDocsMessage = () => {
    setShowDocsMessage(true);
    setTimeout(() => setShowDocsMessage(false), 3000);
    toast.info("Fonctionnalité en développement", {
      description: "La documentation technique sera disponible prochainement"
    });
  };

  const getFilteredTasks = (status: string) => {
    if (status === 'all') return tasks;
    return tasks.filter(task => task.status === status as MaintenanceTaskStatus);
  };

  // Afficher un message de chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg font-medium">Chargement des tâches de maintenance...</p>
        </div>
      </div>
    );
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md p-6 bg-red-50 rounded-lg border border-red-200">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-red-700 mb-2">Erreur de chargement</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  // Compteurs pour les tâches par statut
  const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasksCount = tasks.filter(t => t.status === 'in-progress').length;
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const cancelledTasksCount = tasks.filter(t => t.status === 'cancelled').length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Maintenance des véhicules</h1>
        <p className="text-muted-foreground">Suivez et gérez les opérations de maintenance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tâches planifiées</p>
                <p className="text-2xl font-bold">{pendingTasksCount}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En cours</p>
                <p className="text-2xl font-bold">{inProgressTasksCount}</p>
              </div>
              <div className="rounded-full bg-amber-100 p-3 text-amber-600">
                <Wrench className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Terminées</p>
                <p className="text-2xl font-bold">{completedTasksCount}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Annulées</p>
                <p className="text-2xl font-bold">{cancelledTasksCount}</p>
              </div>
              <div className="rounded-full bg-red-100 p-3 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tâches de maintenance</CardTitle>
              <CardDescription>Suivi des interventions sur les véhicules</CardDescription>
            </div>
            <Dialog open={newTaskDialogOpen} onOpenChange={setNewTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  <span>Nouvelle tâche</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Créer une nouvelle tâche</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations pour créer une nouvelle tâche de maintenance
                  </DialogDescription>
                </DialogHeader>
                <TaskCreationForm 
                  onSubmit={handleAddNewTask}
                  onCancel={() => setNewTaskDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="in-progress">En cours</TabsTrigger>
              <TabsTrigger value="completed">Terminées</TabsTrigger>
              <TabsTrigger value="cancelled">Annulées</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="m-0">
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <Wrench className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune tâche de maintenance</h3>
                  <p className="text-muted-foreground mb-6">
                    Aucune tâche n'a été créée. Cliquez sur "Nouvelle tâche" pour en ajouter une.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Véhicule</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Priorité</TableHead>
                        <TableHead>Assigné à</TableHead>
                        <TableHead>Date prévue</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">{task.id}</TableCell>
                          <TableCell>{task.vehicle}</TableCell>
                          <TableCell>
                            <Select 
                              defaultValue={task.type} 
                              onValueChange={(value) => handleUpdateTaskType(
                                task.id, 
                                value as MaintenanceTaskType
                              )}
                            >
                              <SelectTrigger className="w-[130px] h-7 p-0 pl-2">
                                <Badge className={typeConfig[task.type]?.className || "bg-gray-100 text-gray-800"}>
                                  {typeConfig[task.type]?.label || "Inconnu"}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="repair">Réparation</SelectItem>
                                <SelectItem value="service">Entretien</SelectItem>
                                <SelectItem value="inspection">Inspection</SelectItem>
                                <SelectItem value="other">Autre</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{task.description}</TableCell>
                          <TableCell>
                            <Select 
                              defaultValue={task.status} 
                              onValueChange={(value) => handleUpdateTaskStatus(
                                task.id, 
                                value as MaintenanceTaskStatus
                              )}
                            >
                              <SelectTrigger className="w-[120px] h-7 p-0 pl-2">
                                <Badge className={statusConfig[task.status]?.className || "bg-gray-500"}>
                                  {statusConfig[task.status]?.label || "Inconnu"}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="in-progress">En cours</SelectItem>
                                <SelectItem value="completed">Terminée</SelectItem>
                                <SelectItem value="cancelled">Annulée</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select 
                              defaultValue={task.priority} 
                              onValueChange={(value) => handleUpdateTaskPriority(
                                task.id, 
                                value as MaintenanceTaskPriority
                              )}
                            >
                              <SelectTrigger className="w-[110px] h-7 p-0 pl-2">
                                <Badge variant="outline" className={priorityConfig[task.priority]?.className || "border-gray-500 text-gray-600"}>
                                  {priorityConfig[task.priority]?.label || "Inconnu"}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Basse</SelectItem>
                                <SelectItem value="normal">Moyenne</SelectItem>
                                <SelectItem value="high">Haute</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{task.assignedTo}</TableCell>
                          <TableCell>{task.dueDate}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{task.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            {/* ... Les autres onglets de contenu seront générés dynamiquement par statut */}
            {["pending", "in-progress", "completed", "cancelled"].map((status) => (
              <TabsContent key={status} value={status} className="m-0">
                {getFilteredTasks(status).length === 0 ? (
                  <div className="text-center py-8">
                    <Wrench className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune tâche {statusConfig[status as MaintenanceTaskStatus]?.label.toLowerCase()}</h3>
                    <p className="text-muted-foreground mb-6">
                      Aucune tâche n'est actuellement dans ce statut.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Véhicule</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Priorité</TableHead>
                          <TableHead>Assigné à</TableHead>
                          <TableHead>Date prévue</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredTasks(status).map((task) => (
                          <TableRow key={task.id}>
                            <TableCell className="font-medium">{task.id}</TableCell>
                            <TableCell>{task.vehicle}</TableCell>
                            <TableCell>
                              <Select 
                                defaultValue={task.type} 
                                onValueChange={(value) => handleUpdateTaskType(
                                  task.id, 
                                  value as MaintenanceTaskType
                                )}
                              >
                                <SelectTrigger className="w-[130px] h-7 p-0 pl-2">
                                  <Badge className={typeConfig[task.type]?.className || "bg-gray-100 text-gray-800"}>
                                    {typeConfig[task.type]?.label || "Inconnu"}
                                  </Badge>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="repair">Réparation</SelectItem>
                                  <SelectItem value="service">Entretien</SelectItem>
                                  <SelectItem value="inspection">Inspection</SelectItem>
                                  <SelectItem value="other">Autre</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>{task.description}</TableCell>
                            <TableCell>
                              <Select 
                                defaultValue={task.status} 
                                onValueChange={(value) => handleUpdateTaskStatus(
                                  task.id, 
                                  value as MaintenanceTaskStatus
                                )}
                              >
                                <SelectTrigger className="w-[120px] h-7 p-0 pl-2">
                                  <Badge className={statusConfig[task.status]?.className || "bg-gray-500"}>
                                    {statusConfig[task.status]?.label || "Inconnu"}
                                  </Badge>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">En attente</SelectItem>
                                  <SelectItem value="in-progress">En cours</SelectItem>
                                  <SelectItem value="completed">Terminée</SelectItem>
                                  <SelectItem value="cancelled">Annulée</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select 
                                defaultValue={task.priority} 
                                onValueChange={(value) => handleUpdateTaskPriority(
                                  task.id, 
                                  value as MaintenanceTaskPriority
                                )}
                              >
                                <SelectTrigger className="w-[110px] h-7 p-0 pl-2">
                                  <Badge variant="outline" className={priorityConfig[task.priority]?.className || "border-gray-500 text-gray-600"}>
                                    {priorityConfig[task.priority]?.label || "Inconnu"}
                                  </Badge>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Basse</SelectItem>
                                  <SelectItem value="normal">Moyenne</SelectItem>
                                  <SelectItem value="high">Haute</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>{task.assignedTo}</TableCell>
                            <TableCell>{task.dueDate}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{task.notes}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Indicateurs de performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <BarChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Statistiques de maintenance</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Analysez les temps d'intervention, coûts et performances de l'équipe maintenance.
              </p>
              <Button onClick={handleShowStatsMessage}>Voir les statistiques</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentation technique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Fiches techniques</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Accédez aux manuels, procédures et documentation technique de tous vos véhicules.
              </p>
              <Button onClick={handleShowDocsMessage}>Consulter les documents</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Maintenance;
