
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Calendar, 
  Clock, 
  Truck, 
  User, 
  MapPin,
  Plus,
  Filter,
  CalendarDays
} from 'lucide-react';
import { toast } from "sonner";
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage';
import MoroccanSuggestionInput from '@/components/shared/MoroccanSuggestionInput';

interface ScheduledDelivery {
  id: string;
  date: string;
  time: string;
  driver: string;
  vehicle: string;
  origin: string;
  destination: string;
  status: 'planned' | 'in-progress' | 'completed' | 'delayed';
}

const STORAGE_KEY = 'tms-scheduled-deliveries';

const defaultDeliveries: ScheduledDelivery[] = [
  {
    id: "PLN-1025",
    date: "14/08/2023",
    time: "08:00",
    driver: "Thomas Durand",
    vehicle: "TL-3045",
    origin: "Lyon, Dépôt Central",
    destination: "Paris, 15ème",
    status: "planned"
  },
  {
    id: "PLN-1026",
    date: "14/08/2023",
    time: "09:30",
    driver: "Sophie Lefèvre",
    vehicle: "TL-2189",
    origin: "Marseille, Port",
    destination: "Lyon, Zone Industrielle",
    status: "in-progress"
  },
  {
    id: "PLN-1027",
    date: "15/08/2023",
    time: "07:15",
    driver: "Pierre Martin",
    vehicle: "TL-5632",
    origin: "Paris, Entrepôt Est",
    destination: "Lille, Centre de distribution",
    status: "planned"
  },
  {
    id: "PLN-1028",
    date: "15/08/2023",
    time: "10:45",
    driver: "Thomas Durand",
    vehicle: "TL-3045",
    origin: "Paris, 15ème",
    destination: "Lyon, Dépôt Central",
    status: "planned"
  },
  {
    id: "PLN-1029",
    date: "13/08/2023",
    time: "14:30",
    driver: "Marie Lambert",
    vehicle: "TL-1764",
    origin: "Bordeaux, Entrepôt Sud",
    destination: "Toulouse, Centre Logistique",
    status: "completed"
  }
];

const statusConfig = {
  'planned': { 
    label: 'Planifiée', 
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
  'delayed': { 
    label: 'Retardée', 
    className: 'bg-red-500' 
  }
};

const Planning: React.FC = () => {
  const [scheduledDeliveries, setScheduledDeliveries] = useState<ScheduledDelivery[]>(() => 
    loadFromLocalStorage<ScheduledDelivery[]>(STORAGE_KEY, defaultDeliveries)
  );

  const [showAddMissionDialog, setShowAddMissionDialog] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [showOptimizationDialog, setShowOptimizationDialog] = useState(false);
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);

  // Form state
  const [newMission, setNewMission] = useState({
    date: '',
    time: '',
    driver: '',
    vehicle: '',
    origin: '',
    destination: ''
  });

  // Persistance des données
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEY, scheduledDeliveries);
  }, [scheduledDeliveries]);

  const handleAddMission = () => {
    // Check form validity
    if (!newMission.date || !newMission.time || !newMission.driver || 
        !newMission.vehicle || !newMission.origin || !newMission.destination) {
      toast.error("Formulaire incomplet", {
        description: "Veuillez remplir tous les champs obligatoires."
      });
      return;
    }

    // Create new mission
    const mission: ScheduledDelivery = {
      id: `PLN-${new Date().getTime().toString().slice(-4)}`,
      date: newMission.date,
      time: newMission.time,
      driver: newMission.driver,
      vehicle: newMission.vehicle,
      origin: newMission.origin,
      destination: newMission.destination,
      status: 'planned'
    };

    setScheduledDeliveries(prev => [...prev, mission]);
    
    // Reset form and close dialog
    setNewMission({
      date: '',
      time: '',
      driver: '',
      vehicle: '',
      origin: '',
      destination: ''
    });
    
    setShowAddMissionDialog(false);
    
    toast.success("Mission ajoutée", {
      description: `La mission ${mission.id} a été ajoutée avec succès.`
    });
  };

  const handleShowMap = () => {
    setShowMapView(true);
    toast.info("Carte des livraisons", {
      description: "Visualisation des trajets et positions en temps réel."
    });
  };

  const handleShowCalendar = () => {
    setShowCalendarView(true);
    toast.info("Calendrier des livraisons", {
      description: "Vue calendaire des livraisons planifiées."
    });
  };

  const handleLaunchOptimization = () => {
    setShowOptimizationDialog(true);
    setTimeout(() => {
      toast.success("Optimisation terminée", {
        description: "Les trajets ont été optimisés avec succès."
      });
      setShowOptimizationDialog(false);
    }, 2000);
  };

  const handleTrackDeliveries = () => {
    setShowTrackingDialog(true);
    toast.info("Suivi en temps réel", {
      description: "Visualisation des statuts de livraison en temps réel."
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Planification</h1>
        <p className="text-muted-foreground">Gestion des plannings et des missions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                <p className="text-2xl font-bold">8 livraisons</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Cette semaine</p>
                <p className="text-2xl font-bold">42 livraisons</p>
              </div>
              <div className="rounded-full bg-amber-100 p-3 text-amber-600">
                <CalendarDays className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Chauffeurs actifs</p>
                <p className="text-2xl font-bold">12/15</p>
              </div>
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <User className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Calendrier des livraisons</CardTitle>
              <CardDescription>Planification des livraisons et des missions</CardDescription>
            </div>
            <Button className="flex items-center gap-2" onClick={() => setShowAddMissionDialog(true)}>
              <Plus size={16} />
              <span>Nouvelle mission</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list">
            <TabsList className="mb-6">
              <TabsTrigger value="list" className="flex items-center gap-1">
                <Calendar size={16} />
                <span>Liste</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-1" onClick={handleShowCalendar}>
                <CalendarDays size={16} />
                <span>Calendrier</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-1" onClick={handleShowMap}>
                <MapPin size={16} />
                <span>Carte</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="m-0">
              <div className="flex justify-end mb-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  <span>Filtrer</span>
                </Button>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Heure</TableHead>
                      <TableHead>Chauffeur</TableHead>
                      <TableHead>Véhicule</TableHead>
                      <TableHead>Origine</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledDeliveries.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell className="font-medium">{delivery.id}</TableCell>
                        <TableCell>{delivery.date}</TableCell>
                        <TableCell>{delivery.time}</TableCell>
                        <TableCell>{delivery.driver}</TableCell>
                        <TableCell>{delivery.vehicle}</TableCell>
                        <TableCell>{delivery.origin}</TableCell>
                        <TableCell>{delivery.destination}</TableCell>
                        <TableCell>
                          <Badge className={statusConfig[delivery.status].className}>
                            {statusConfig[delivery.status].label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="calendar" className="m-0">
              <div className="text-center p-8">
                <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Vue calendrier</h3>
                <p className="text-muted-foreground mb-6">Visualisez toutes vos livraisons dans un calendrier interactif.</p>
                <Button onClick={handleShowCalendar}>Afficher le calendrier</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="map" className="m-0">
              <div className="text-center p-8">
                <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Vue carte</h3>
                <p className="text-muted-foreground mb-6">Visualisez les trajets et positions en temps réel sur une carte interactive.</p>
                <Button onClick={handleShowMap}>Afficher la carte</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Optimisation des trajets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <Truck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Assistant d'optimisation</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Utilisez notre assistant pour optimiser vos trajets, réduire les coûts et respecter les délais.
              </p>
              <Button onClick={handleLaunchOptimization}>Lancer l'assistant</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Suivi en temps réel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Tableau de bord</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Suivez vos livraisons en temps réel, avec notifications et alertes en cas de retard.
              </p>
              <Button onClick={handleTrackDeliveries}>Accéder au suivi</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog pour ajouter une nouvelle mission */}
      <Dialog open={showAddMissionDialog} onOpenChange={setShowAddMissionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle mission</DialogTitle>
            <DialogDescription>
              Complétez le formulaire pour créer une nouvelle mission de livraison.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
                <Input
                  id="date"
                  type="date"
                  value={newMission.date}
                  onChange={(e) => setNewMission({...newMission, date: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Heure <span className="text-red-500">*</span></Label>
                <Input
                  id="time"
                  type="time"
                  value={newMission.time}
                  onChange={(e) => setNewMission({...newMission, time: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="driver">Chauffeur <span className="text-red-500">*</span></Label>
              <Select 
                value={newMission.driver} 
                onValueChange={(value) => setNewMission({...newMission, driver: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un chauffeur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Karim Alaoui">Karim Alaoui</SelectItem>
                  <SelectItem value="Mohammed Idrissi">Mohammed Idrissi</SelectItem>
                  <SelectItem value="Rachid Benani">Rachid Benani</SelectItem>
                  <SelectItem value="Nadia El Fassi">Nadia El Fassi</SelectItem>
                  <SelectItem value="Hamza El Amrani">Hamza El Amrani</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="vehicle">Véhicule <span className="text-red-500">*</span></Label>
              <Select 
                value={newMission.vehicle} 
                onValueChange={(value) => setNewMission({...newMission, vehicle: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TL-3045">TL-3045 (Camion 19T)</SelectItem>
                  <SelectItem value="TL-2189">TL-2189 (Camion 12T)</SelectItem>
                  <SelectItem value="TL-5632">TL-5632 (Camion 19T)</SelectItem>
                  <SelectItem value="TL-1764">TL-1764 (Utilitaire 3.5T)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <MoroccanSuggestionInput
              label="Origine"
              id="origin"
              value={newMission.origin}
              onChange={(value) => setNewMission({...newMission, origin: value})}
              dataType="cities"
              placeholder="Ville d'origine"
              required
            />
            
            <MoroccanSuggestionInput
              label="Destination"
              id="destination"
              value={newMission.destination}
              onChange={(value) => setNewMission({...newMission, destination: value})}
              dataType="cities"
              placeholder="Ville de destination"
              required
            />
          </div>
          
          <DialogFooter>
            <Button onClick={handleAddMission}>Ajouter la mission</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour la vue carte */}
      <Dialog open={showMapView} onOpenChange={setShowMapView}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Carte des livraisons</DialogTitle>
            <DialogDescription>
              Positions et itinéraires en temps réel
            </DialogDescription>
          </DialogHeader>
          
          <div className="rounded-md border bg-muted/20 h-[500px] flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Carte interactive</h3>
              <p className="text-muted-foreground mb-2">
                Visualisez les positions des véhicules et les itinéraires en temps réel.
              </p>
              <p className="text-xs text-muted-foreground">
                Carte chargée avec succès - 5 véhicules en circulation
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour la vue calendrier */}
      <Dialog open={showCalendarView} onOpenChange={setShowCalendarView}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Calendrier des livraisons</DialogTitle>
            <DialogDescription>
              Planification hebdomadaire des missions
            </DialogDescription>
          </DialogHeader>
          
          <div className="rounded-md border bg-muted/20 h-[500px] flex items-center justify-center">
            <div className="text-center">
              <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Calendrier interactif</h3>
              <p className="text-muted-foreground mb-2">
                Consultez et modifiez facilement votre planning de livraisons.
              </p>
              <p className="text-xs text-muted-foreground">
                Semaine du 14 au 20 août chargée - 42 missions programmées
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour l'optimisation des trajets */}
      <Dialog open={showOptimizationDialog} onOpenChange={setShowOptimizationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assistant d'optimisation</DialogTitle>
            <DialogDescription>
              Optimisation en cours...
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <div className="flex flex-col items-center justify-center gap-2">
              <Truck className="h-16 w-16 text-primary animate-pulse" />
              <p className="text-center mt-4">
                Calcul des itinéraires optimaux en cours. Veuillez patienter...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour le suivi en temps réel */}
      <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Suivi en temps réel</DialogTitle>
            <DialogDescription>
              Tableau de bord des livraisons en cours
            </DialogDescription>
          </DialogHeader>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Chauffeur</TableHead>
                  <TableHead>Mission</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>ETA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>TL-3045</TableCell>
                  <TableCell>Karim Alaoui</TableCell>
                  <TableCell>PLN-1025</TableCell>
                  <TableCell>Rabat</TableCell>
                  <TableCell>
                    <Badge className="bg-amber-500">En cours</Badge>
                  </TableCell>
                  <TableCell>14:30</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>TL-2189</TableCell>
                  <TableCell>Mohammed Idrissi</TableCell>
                  <TableCell>PLN-1026</TableCell>
                  <TableCell>Casablanca</TableCell>
                  <TableCell>
                    <Badge className="bg-amber-500">En cours</Badge>
                  </TableCell>
                  <TableCell>15:45</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>TL-5632</TableCell>
                  <TableCell>Rachid Benani</TableCell>
                  <TableCell>PLN-1027</TableCell>
                  <TableCell>Agadir</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500">À l'heure</Badge>
                  </TableCell>
                  <TableCell>16:15</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-medium">Livraisons à l'heure</h3>
                  <p className="text-2xl font-bold text-green-500">87%</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-medium">Retards moyens</h3>
                  <p className="text-2xl font-bold text-amber-500">12 min</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="font-medium">Incidents</h3>
                  <p className="text-2xl font-bold text-red-500">0</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Planning;
