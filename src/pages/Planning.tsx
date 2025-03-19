
import React, { useState } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Truck, Calendar, Clock, RotateCcw, Loader2 } from "lucide-react";

// Planning component (simplified for this example)
const Planning: React.FC = () => {
  const [optimizationLoading, setOptimizationLoading] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);
  
  // Function to simulate route optimization
  const handleOptimizeRoutes = () => {
    setOptimizationLoading(true);
    setOptimizationComplete(false);
    
    // Simulate a process that takes time
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
      
      <Tabs defaultValue="daily" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="daily">Journalier</TabsTrigger>
            <TabsTrigger value="weekly">Hebdomadaire</TabsTrigger>
            <TabsTrigger value="monthly">Mensuel</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Historique
            </Button>
          </div>
        </div>
        
        <TabsContent value="daily" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Carte de livraison 1 */}
            <DeliveryCard
              driver="Mohammed Alami"
              vehicle="CAM-34521"
              startTime="08:00"
              endTime="12:30"
              stops={4}
              distance="65 km"
              status="En cours"
            />
            
            {/* Carte de livraison 2 */}
            <DeliveryCard
              driver="Fatima Zahra"
              vehicle="CAM-78932"
              startTime="09:15"
              endTime="14:45"
              stops={6}
              distance="82 km"
              status="Planifié"
            />
            
            {/* Carte de livraison 3 */}
            <DeliveryCard
              driver="Youssef Benmoussa"
              vehicle="CAM-12765"
              startTime="07:30"
              endTime="16:00"
              stops={8}
              distance="120 km"
              status="Planifié"
            />
            
            {/* Carte de livraison 4 */}
            <DeliveryCard
              driver="Amina Tazi"
              vehicle="CAM-56234"
              startTime="10:00"
              endTime="15:30"
              stops={5}
              distance="75 km"
              status="Planifié"
            />
            
            {/* Carte de livraison 5 */}
            <DeliveryCard
              driver="Karim Ouazzani"
              vehicle="CAM-90176"
              startTime="08:45"
              endTime="13:15"
              stops={3}
              distance="45 km"
              status="Planifié"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Planning Hebdomadaire</CardTitle>
              <CardDescription>
                Vue d'ensemble des livraisons programmées pour la semaine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Le calendrier hebdomadaire sera affiché ici.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Planning Mensuel</CardTitle>
              <CardDescription>
                Vue d'ensemble des livraisons programmées pour le mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Le calendrier mensuel sera affiché ici.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper component for delivery cards
interface DeliveryCardProps {
  driver: string;
  vehicle: string;
  startTime: string;
  endTime: string;
  stops: number;
  distance: string;
  status: 'Planifié' | 'En cours' | 'Terminé' | 'Retardé';
}

const DeliveryCard: React.FC<DeliveryCardProps> = ({
  driver,
  vehicle,
  startTime,
  endTime,
  stops,
  distance,
  status,
}) => {
  const statusColors = {
    'Planifié': 'bg-blue-100 text-blue-800',
    'En cours': 'bg-green-100 text-green-800',
    'Terminé': 'bg-gray-100 text-gray-800',
    'Retardé': 'bg-red-100 text-red-800',
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{driver}</CardTitle>
            <CardDescription>{vehicle}</CardDescription>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {status}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Horaires:</span>
            <span className="font-medium">{startTime} - {endTime}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Arrêts:</span>
            <span className="font-medium">{stops}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Distance:</span>
            <span className="font-medium">{distance}</span>
          </div>
          
          <div className="pt-2">
            <Button variant="outline" size="sm" className="w-full">
              <MapPin className="mr-2 h-4 w-4" />
              Voir l'itinéraire
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Planning;
