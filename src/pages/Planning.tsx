
import React from 'react';
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
  Calendar, 
  Clock, 
  Truck, 
  User, 
  MapPin,
  Plus,
  Filter,
  CalendarDays
} from 'lucide-react';

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

const scheduledDeliveries: ScheduledDelivery[] = [
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
            <Button className="flex items-center gap-2">
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
              <TabsTrigger value="calendar" className="flex items-center gap-1">
                <CalendarDays size={16} />
                <span>Calendrier</span>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-1">
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
                <Button>Afficher le calendrier</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="map" className="m-0">
              <div className="text-center p-8">
                <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Vue carte</h3>
                <p className="text-muted-foreground mb-6">Visualisez les trajets et positions en temps réel sur une carte interactive.</p>
                <Button>Afficher la carte</Button>
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
              <Button>Lancer l'assistant</Button>
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
              <Button>Accéder au suivi</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Planning;
