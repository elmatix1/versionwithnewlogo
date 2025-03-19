
import React, { useState } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Truck, Calendar, Clock, RotateCcw, Loader2, List, Filter, BarChart, Clock3 } from "lucide-react";

// Composant pour les cartes statistiques
const StatCard = ({ title, value, icon, colorClass }: { title: string, value: string, icon: React.ReactNode, colorClass: string }) => (
  <Card className="overflow-hidden">
    <CardContent className="p-0">
      <div className="flex items-center">
        <div className={`flex items-center justify-center h-16 w-16 ${colorClass}`}>
          {icon}
        </div>
        <div className="p-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Composant pour la table de livraisons
interface Delivery {
  id: string;
  date: string;
  hour: string;
  driver: string;
  vehicle: string;
  origin: string;
  destination: string;
  status: 'En cours' | 'Planifié' | 'Terminé' | 'Retardé';
}

const DeliveryRow = ({ delivery }: { delivery: Delivery }) => {
  const statusColors = {
    'Planifié': 'bg-blue-100 text-blue-800',
    'En cours': 'bg-green-100 text-green-800',
    'Terminé': 'bg-gray-100 text-gray-800',
    'Retardé': 'bg-red-100 text-red-800',
  };

  return (
    <tr className="border-b hover:bg-muted/50">
      <td className="py-2 px-4">{delivery.id}</td>
      <td className="py-2 px-4">{delivery.date}</td>
      <td className="py-2 px-4">{delivery.hour}</td>
      <td className="py-2 px-4">{delivery.driver}</td>
      <td className="py-2 px-4">{delivery.vehicle}</td>
      <td className="py-2 px-4">{delivery.origin}</td>
      <td className="py-2 px-4">{delivery.destination}</td>
      <td className="py-2 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[delivery.status]}`}>
          {delivery.status}
        </span>
      </td>
      <td className="py-2 px-4">
        <Button variant="outline" size="sm">Détails</Button>
      </td>
    </tr>
  );
}

// Composant principal Planning
const Planning: React.FC = () => {
  const [optimizationLoading, setOptimizationLoading] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);
  const [activeTab, setActiveTab] = useState("liste");
  
  // Données factices pour les livraisons
  const deliveries: Delivery[] = [
    { id: "PLN-3625", date: "14/06/2023", hour: "08:30", driver: "Thomas Durand", vehicle: "TL-5845", origin: "Lyon, Dépôt Central", destination: "Paris, 14ème", status: "En cours" },
    { id: "PLN-3626", date: "14/06/2023", hour: "09:30", driver: "Sophie Lefèvre", vehicle: "TL-2140", origin: "Marseille, Port", destination: "Lyon, Zone Industrielle", status: "Planifié" },
    { id: "PLN-3627", date: "15/06/2023", hour: "07:15", driver: "Pierre Martin", vehicle: "TL-5842", origin: "Paris, Entrepôt Est", destination: "Lille, Centre de distribution", status: "Planifié" },
    { id: "PLN-3628", date: "15/06/2023", hour: "10:45", driver: "Thomas Durand", vehicle: "TL-5845", origin: "Paris, 14ème", destination: "Lyon, Dépôt Central", status: "Planifié" },
    { id: "PLN-3629", date: "15/06/2023", hour: "14:30", driver: "Marie Lambert", vehicle: "TL-1763", origin: "Bordeaux, Entrepôt Sud", destination: "Toulouse, Centre Logistique", status: "Terminé" },
    { id: "PLN-3623", date: "2024-06-14", hour: "07:15", driver: "Mohammed Alaoui", vehicle: "TL-2140", origin: "Casablanca", destination: "Rabat", status: "En cours" },
  ];
  
  // Fonction pour simuler l'optimisation des itinéraires
  const handleOptimizeRoutes = () => {
    setOptimizationLoading(true);
    setOptimizationComplete(false);
    
    // Simule un processus qui prend du temps
    setTimeout(() => {
      setOptimizationLoading(false);
      setOptimizationComplete(true);
      toast.success("Optimisation terminée", {
        description: "Les itinéraires ont été optimisés avec succès"
      });
    }, 3000);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Planification</h2>
          <p className="text-muted-foreground">
            Gérez les plannings de livraison et optimisez les itinéraires
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Calendrier
          </Button>
          <Button 
            onClick={handleOptimizeRoutes}
            disabled={optimizationLoading}
          >
            {optimizationLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calcul des itinéraires en cours...
              </>
            ) : (
              <>
                <RotateCcw className="mr-2 h-4 w-4" />
                Optimiser les itinéraires
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard 
          title="Livraisons aujourd'hui" 
          value="8 livraisons" 
          icon={<Truck className="h-6 w-6 text-white" />}
          colorClass="bg-blue-500 text-white"
        />
        <StatCard 
          title="Livraisons cette semaine" 
          value="42 livraisons" 
          icon={<BarChart className="h-6 w-6 text-white" />}
          colorClass="bg-amber-500 text-white"
        />
        <StatCard 
          title="Taux de ponctualité" 
          value="12/15" 
          icon={<Clock3 className="h-6 w-6 text-white" />}
          colorClass="bg-green-500 text-white"
        />
      </div>
      
      {optimizationComplete && (
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <Truck className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Optimisation terminée</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Les itinéraires ont été optimisés avec succès. Les chauffeurs ont été notifiés des changements.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Calendrier des livraisons</CardTitle>
              <CardDescription>Consultez vos livraisons et leur statut</CardDescription>
            </div>
            <Button size="sm">Nouvelle livraison</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <Button variant={activeTab === "liste" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("liste")}>
                <List className="h-4 w-4 mr-2" />
                Liste
              </Button>
              <Button variant={activeTab === "calendrier" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("calendrier")}>
                <Calendar className="h-4 w-4 mr-2" />
                Calendrier
              </Button>
              <Button variant={activeTab === "carte" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("carte")}>
                <MapPin className="h-4 w-4 mr-2" />
                Carte
              </Button>
              <div className="ml-auto">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
              </div>
            </div>
          </div>
          
          {activeTab === "liste" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left font-medium">ID</th>
                    <th className="py-3 px-4 text-left font-medium">Date</th>
                    <th className="py-3 px-4 text-left font-medium">Heure</th>
                    <th className="py-3 px-4 text-left font-medium">Chauffeur</th>
                    <th className="py-3 px-4 text-left font-medium">Véhicule</th>
                    <th className="py-3 px-4 text-left font-medium">Origine</th>
                    <th className="py-3 px-4 text-left font-medium">Destination</th>
                    <th className="py-3 px-4 text-left font-medium">Statut</th>
                    <th className="py-3 px-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((delivery) => (
                    <DeliveryRow key={delivery.id} delivery={delivery} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === "calendrier" && (
            <div className="bg-muted/30 h-64 flex items-center justify-center rounded-md">
              <p className="text-muted-foreground">Affichage calendrier en cours de développement</p>
            </div>
          )}
          
          {activeTab === "carte" && (
            <div className="bg-muted/30 h-64 flex items-center justify-center rounded-md">
              <p className="text-muted-foreground">Affichage carte en cours de développement</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Optimisation des trajets */}
        <Card>
          <CardHeader>
            <CardTitle>Optimisation des trajets</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="h-20 w-20 flex items-center justify-center rounded-full bg-blue-50">
              <Truck className="h-10 w-10 text-blue-500" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-medium text-lg">Assistant d'optimisation</h3>
              <p className="text-sm text-muted-foreground">
                Utilisez notre assistant pour optimiser vos trajets, réduire les coûts et respecter les délais.
              </p>
            </div>
            <Button>Lancer l'assistant</Button>
          </CardContent>
        </Card>
        
        {/* Suivi en temps réel */}
        <Card>
          <CardHeader>
            <CardTitle>Suivi en temps réel</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="h-20 w-20 flex items-center justify-center rounded-full bg-green-50">
              <Clock className="h-10 w-10 text-green-500" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-medium text-lg">Tableau de bord</h3>
              <p className="text-sm text-muted-foreground">
                Suivez vos livraisons en temps réel, avec notifications et alertes en cas de retard.
              </p>
            </div>
            <Button>Accéder au suivi</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Planning;
