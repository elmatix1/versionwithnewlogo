import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Truck, 
  AlertTriangle,
  Check,
  Wrench,
  Clock,
  FolderOpen,
  Fuel,
  Plus
} from 'lucide-react';
import { toast } from "sonner";
import AddVehicleForm from '@/components/vehicles/AddVehicleForm';
import VehicleMaintenanceCalendar from '@/components/vehicles/VehicleMaintenanceCalendar';
import VehicleDocuments from '@/components/vehicles/VehicleDocuments';
import VehicleActionsDropdown from '@/components/vehicles/VehicleActionsDropdown';
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage';
import { useVehicles } from '@/hooks/useVehicles';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastMaintenance: string;
  fuelLevel: number;
  nextService: string;
  driver?: string;
  location?: string;
}

const statusColors = {
  active: "bg-green-500",
  maintenance: "bg-amber-500",
  inactive: "bg-zinc-400"
};

const statusLabels = {
  active: "En service",
  maintenance: "En maintenance",
  inactive: "Hors service"
};

const STORAGE_KEY = 'tms-vehicles';

const VehicleManagement: React.FC = () => {
  // Utiliser le hook useVehicles pour gérer les véhicules
  const { vehicles, loading, error, addVehicle, updateVehicle, deleteVehicle } = useVehicles();
  
  const [selectedTab, setSelectedTab] = useState("all");
  const [showMaintenanceCalendar, setShowMaintenanceCalendar] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [addVehicleDialogOpen, setAddVehicleDialogOpen] = useState(false);
  
  // Calculs dynamiques des statistiques de la flotte
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
  const inactiveVehicles = vehicles.filter(v => v.status === 'inactive').length;
  
  // Calcul des pourcentages pour les barres de progression
  const activePercent = totalVehicles > 0 ? (activeVehicles / totalVehicles) * 100 : 0;
  const maintenancePercent = totalVehicles > 0 ? (maintenanceVehicles / totalVehicles) * 100 : 0;
  const inactivePercent = totalVehicles > 0 ? (inactiveVehicles / totalVehicles) * 100 : 0;
  
  const filteredVehicles = selectedTab === "all" 
    ? vehicles 
    : vehicles.filter(vehicle => vehicle.status === selectedTab);
  
  const handleAddVehicle = (newVehicle) => {
    addVehicle(newVehicle);
  };
  
  const handleStatusChange = (vehicleId, newStatus) => {
    updateVehicle(vehicleId, { status: newStatus });
  };
  
  const handleViewCalendar = () => {
    setShowMaintenanceCalendar(true);
  };
  
  const handleViewDocuments = () => {
    setShowDocuments(true);
  };

  // Composant de table réutilisable pour éviter la répétition
  const VehicleTable = ({ vehicles }: { vehicles: Vehicle[] }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Immatriculation</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Carburant</TableHead>
            <TableHead>Dernier entretien</TableHead>
            <TableHead>Prochain entretien</TableHead>
            <TableHead>Chauffeur assigné</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell className="font-medium">{vehicle.name}</TableCell>
              <TableCell>{vehicle.type}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${statusColors[vehicle.status]}`}></div>
                  <span>{statusLabels[vehicle.status]}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={vehicle.fuelLevel} 
                    className="h-2 w-16" 
                  />
                  <span className="text-sm">{vehicle.fuelLevel}%</span>
                </div>
              </TableCell>
              <TableCell>{vehicle.lastMaintenance}</TableCell>
              <TableCell>{vehicle.nextService}</TableCell>
              <TableCell>{vehicle.driver || "—"}</TableCell>
              <TableCell>{vehicle.location || "—"}</TableCell>
              <TableCell>
                <VehicleActionsDropdown
                  vehicle={vehicle}
                  onStatusChange={handleStatusChange}
                  onUpdateVehicle={updateVehicle}
                  onDeleteVehicle={deleteVehicle}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Gestion des véhicules</h1>
        <p className="text-muted-foreground">Suivez et gérez votre flotte de transport</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">État de la flotte</h3>
              <Badge className="bg-green-500">{activeVehicles} actifs</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>En service</span>
                <span>{activeVehicles}/{totalVehicles}</span>
              </div>
              <Progress value={activePercent} className="h-2" />
              
              <div className="flex items-center justify-between text-sm">
                <span>En maintenance</span>
                <span>{maintenanceVehicles}/{totalVehicles}</span>
              </div>
              <Progress value={maintenancePercent} className="h-2" />
              
              <div className="flex items-center justify-between text-sm">
                <span>Hors service</span>
                <span>{inactiveVehicles}/{totalVehicles}</span>
              </div>
              <Progress value={inactivePercent} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Entretiens à prévoir</h3>
              <Badge variant="outline" className="border-amber-500 text-amber-600">5 véhicules</Badge>
            </div>
            <div className="space-y-3">
              {["TL-2189", "TL-5632", "TL-1764"].map((vehicle, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                    <span>{vehicle}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Dans {5 + index * 2} jours</span>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2">Voir tous</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Dernières mises à jour</h3>
              <Badge variant="outline">Aujourd'hui</Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>TL-3045 prêt pour départ</span>
                </div>
                <span className="text-sm text-muted-foreground">09:15</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wrench className="h-4 w-4 text-blue-500 mr-2" />
                  <span>TL-4023 en maintenance</span>
                </div>
                <span className="text-sm text-muted-foreground">08:30</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Fuel className="h-4 w-4 text-purple-500 mr-2" />
                  <span>TL-5632 plein effectué</span>
                </div>
                <span className="text-sm text-muted-foreground">07:45</span>
              </div>
              <Button variant="outline" className="w-full mt-2">Historique</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Flotte de véhicules</CardTitle>
              <CardDescription>Vue d'ensemble de tous les véhicules</CardDescription>
            </div>
            <Dialog open={addVehicleDialogOpen} onOpenChange={setAddVehicleDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <Plus size={16} />
                  <span>Ajouter un véhicule</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
                  <DialogDescription>
                    Complétez le formulaire pour ajouter un nouveau véhicule à votre flotte.
                  </DialogDescription>
                </DialogHeader>
                <AddVehicleForm 
                  open={addVehicleDialogOpen} 
                  onOpenChange={setAddVehicleDialogOpen} 
                  onAddVehicle={handleAddVehicle} 
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <span>Chargement des véhicules...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center p-8 text-destructive">
              <span>Erreur lors du chargement des véhicules: {error}</span>
            </div>
          ) : (
            <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">Tous ({vehicles.length})</TabsTrigger>
                <TabsTrigger value="active">En service ({activeVehicles})</TabsTrigger>
                <TabsTrigger value="maintenance">En maintenance ({maintenanceVehicles})</TabsTrigger>
                <TabsTrigger value="inactive">Hors service ({inactiveVehicles})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="m-0">
                <VehicleTable vehicles={filteredVehicles} />
              </TabsContent>
              
              <TabsContent value="active" className="m-0">
                <VehicleTable vehicles={filteredVehicles} />
              </TabsContent>
              
              <TabsContent value="maintenance" className="m-0">
                <VehicleTable vehicles={filteredVehicles} />
              </TabsContent>
              
              <TabsContent value="inactive" className="m-0">
                <VehicleTable vehicles={filteredVehicles} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Planification des entretiens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <Wrench className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Calendrier d'entretien</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Planifiez les entretiens réguliers et les réparations pour maintenir votre flotte en parfait état.
              </p>
              <Button onClick={handleViewCalendar}>Voir le calendrier</Button>
              
              <Dialog open={showMaintenanceCalendar} onOpenChange={setShowMaintenanceCalendar}>
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>Calendrier d'entretien</DialogTitle>
                    <DialogDescription>
                      Consultez et planifiez les entretiens pour votre flotte.
                    </DialogDescription>
                  </DialogHeader>
                  <VehicleMaintenanceCalendar vehicles={vehicles} />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents des véhicules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Documentation</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Accédez aux certificats d'immatriculation, assurances et autres documents administratifs de vos véhicules.
              </p>
              <Button onClick={handleViewDocuments}>Consulter les documents</Button>
              
              <Dialog open={showDocuments} onOpenChange={setShowDocuments}>
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>Documents des véhicules</DialogTitle>
                    <DialogDescription>
                      Consultez tous les documents administratifs de votre flotte.
                    </DialogDescription>
                  </DialogHeader>
                  <VehicleDocuments vehicles={vehicles} />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VehicleManagement;
