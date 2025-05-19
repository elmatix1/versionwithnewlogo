
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  CalendarClock, 
  FileCheck, 
  FileWarning, 
  FileClock,
  Clock,
  UserCheck,
  Users,
  FileEdit,
  UserX,
  PlusCircle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import AddDriverForm from '@/components/hr/AddDriverForm';
import HRCalendar from '@/components/hr/HRCalendar';
import DocumentManager from '@/components/hr/DocumentManager';
import AttendanceSystem from '@/components/hr/AttendanceSystem';
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDrivers, Driver, DriverStatus } from '@/hooks/drivers/useDrivers';

const getStatusLabel = (status: DriverStatus) => {
  switch (status) {
    case 'available': return 'Actif';
    case 'on-duty': return 'En service';
    case 'off-duty': return 'Hors service';
    case 'on-leave': return 'En congés';
    default: return status;
  }
};

const getVariantForStatus = (status: DriverStatus) => {
  switch (status) {
    case 'available': return 'default';
    case 'on-duty': return 'default';
    case 'off-duty': return 'secondary';
    case 'on-leave': return 'outline';
    default: return 'secondary';
  }
};

const HRManagement: React.FC = () => {
  const { drivers, loading, error, addDriver, updateDriver, deleteDriver } = useDrivers();
  
  const [openAddDriver, setOpenAddDriver] = useState(false);
  const [selectedTab, setSelectedTab] = useState("drivers");
  const [isEditDriverOpen, setIsEditDriverOpen] = useState(false);
  const [isStatusChangeOpen, setIsStatusChangeOpen] = useState(false);
  const [isDeleteDriverOpen, setIsDeleteDriverOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [editName, setEditName] = useState("");
  const [editExperience, setEditExperience] = useState("");
  const [editStatus, setEditStatus] = useState<DriverStatus>("available");
  
  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des chauffeurs", {
        description: error
      });
    }
  }, [error]);
  
  const handleAddDriver = (driverData: any) => {
    toast.success(`${driverData.fullName} a été ajouté avec succès`);
  };
  
  const handleScheduleRequest = () => {
    toast.success("Demande de congés envoyée avec succès");
  };

  const handleEditDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setEditName(driver.name);
    setEditExperience(driver.experience);
    setIsEditDriverOpen(true);
  };

  const handleChangeStatus = (driver: Driver) => {
    setSelectedDriver(driver);
    setEditStatus(driver.status);
    setIsStatusChangeOpen(true);
  };

  const handleDeleteDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDeleteDriverOpen(true);
  };

  const saveEditedDriver = async () => {
    if (selectedDriver) {
      try {
        await updateDriver(selectedDriver.id, { 
          name: editName, 
          experience: editExperience 
        });
        toast.success(`Informations de ${editName} mises à jour`);
      } catch (err: any) {
        toast.error("Erreur lors de la mise à jour", {
          description: err.message
        });
      } finally {
        setIsEditDriverOpen(false);
      }
    }
  };

  const saveStatusChange = async () => {
    if (selectedDriver) {
      try {
        await updateDriver(selectedDriver.id, { status: editStatus });
        toast.success(`Statut de ${selectedDriver.name} modifié avec succès`);
      } catch (err: any) {
        toast.error("Erreur lors de la modification du statut", {
          description: err.message
        });
      } finally {
        setIsStatusChangeOpen(false);
      }
    }
  };

  const confirmDeleteDriver = async () => {
    if (selectedDriver) {
      try {
        await deleteDriver(selectedDriver.id);
        toast.success(`${selectedDriver.name} a été supprimé`);
      } catch (err: any) {
        toast.error("Erreur lors de la suppression", {
          description: err.message
        });
      } finally {
        setIsDeleteDriverOpen(false);
      }
    }
  };

  const getDocumentProgress = (driver: Driver) => {
    // Simulation de la progression des documents (à remplacer par une logique réelle)
    return Math.floor(Math.random() * 100) + 1;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Ressources Humaines</h1>
        <p className="text-muted-foreground">Gestion des chauffeurs et des employés</p>
      </div>

      <Tabs defaultValue="drivers" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="drivers" className="flex items-center gap-1">
            <Users size={16} />
            <span>Chauffeurs</span>
          </TabsTrigger>
          <TabsTrigger value="availability" className="flex items-center gap-1">
            <CalendarClock size={16} />
            <span>Disponibilités</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-1">
            <FileCheck size={16} />
            <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-1">
            <Clock size={16} />
            <span>Pointage</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drivers">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Chauffeurs</CardTitle>
                <Button className="flex items-center gap-1" onClick={() => setOpenAddDriver(true)}>
                  <PlusCircle size={16} />
                  <span>Ajouter un chauffeur</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Expérience</TableHead>
                        <TableHead>Véhicules assignés</TableHead>
                        <TableHead>Documents valides</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {drivers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                            Aucun chauffeur enregistré. Ajoutez-en un pour commencer.
                          </TableCell>
                        </TableRow>
                      ) : (
                        drivers.map((driver) => (
                          <TableRow key={driver.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>{driver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{driver.name}</div>
                                  <div className="text-xs text-muted-foreground">{driver.experience} d'expérience</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={getVariantForStatus(driver.status)}>
                                {getStatusLabel(driver.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span>{driver.experience}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {driver.vehicles && driver.vehicles.length > 0 ? driver.vehicles.map((vehicle, idx) => (
                                  <Badge key={idx} variant="outline">{vehicle}</Badge>
                                )) : (
                                  <span className="text-muted-foreground text-sm">Aucun</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={getDocumentProgress(driver)} className="h-2 w-20" />
                                <span className="text-sm">{getDocumentProgress(driver)}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditDriver(driver)}>
                                  <FileEdit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleChangeStatus(driver)}>
                                  {driver.status === "available" ? (
                                    <XCircle className="h-4 w-4 text-amber-500" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  )}
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteDriver(driver)}>
                                  <UserX className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Disponibilité des chauffeurs</CardTitle>
            </CardHeader>
            <CardContent>
              <HRCalendar onSchedule={handleScheduleRequest} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm">Documents valides</span>
                    <span className="text-2xl font-bold">124</span>
                  </div>
                  <div className="rounded-full bg-green-100 p-3 text-green-600">
                    <FileCheck className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm">Documents à renouveler</span>
                    <span className="text-2xl font-bold">18</span>
                  </div>
                  <div className="rounded-full bg-amber-100 p-3 text-amber-600">
                    <FileWarning className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm">Documents expirés</span>
                    <span className="text-2xl font-bold">5</span>
                  </div>
                  <div className="rounded-full bg-destructive/10 p-3 text-destructive">
                    <FileClock className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Gestion des documents</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Pointage et présence</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceSystem />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AddDriverForm 
        open={openAddDriver} 
        onOpenChange={setOpenAddDriver} 
        onAddDriver={handleAddDriver}
      />

      <Dialog open={isEditDriverOpen} onOpenChange={setIsEditDriverOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le chauffeur</DialogTitle>
            <DialogDescription>
              Modifiez les informations du chauffeur.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="driverName" className="text-right">
                Nom complet
              </Label>
              <Input
                id="driverName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="driverExperience" className="text-right">
                Expérience
              </Label>
              <Input
                id="driverExperience"
                value={editExperience}
                onChange={(e) => setEditExperience(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveEditedDriver}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isStatusChangeOpen} onOpenChange={setIsStatusChangeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changer le statut</DialogTitle>
            <DialogDescription>
              Modifiez le statut de disponibilité du chauffeur.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="driverStatus" className="text-right">
                Statut
              </Label>
              <Select
                value={editStatus}
                onValueChange={(value: DriverStatus) => setEditStatus(value as DriverStatus)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Actif</SelectItem>
                  <SelectItem value="on-duty">En service</SelectItem>
                  <SelectItem value="off-duty">Hors service</SelectItem>
                  <SelectItem value="on-leave">En congés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveStatusChange}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDriverOpen} onOpenChange={setIsDeleteDriverOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le chauffeur</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Confirmez-vous la suppression?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>Êtes-vous sûr de vouloir supprimer {selectedDriver?.name}?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDriverOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDeleteDriver}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HRManagement;
