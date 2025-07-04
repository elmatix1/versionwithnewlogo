
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import InteractiveMap from './InteractiveMap';

interface Vehicle {
  id: string;
  name: string;
  status: 'delivering' | 'idle' | 'maintenance' | 'active' | 'inactive';
  location?: string;
}

interface MapOverviewProps {
  vehicles: Vehicle[];
  className?: string;
}

const statusColors = {
  delivering: "bg-green-500",
  active: "bg-green-500",
  idle: "bg-blue-500",
  maintenance: "bg-amber-500",
  inactive: "bg-zinc-400",
};

const statusLabels = {
  delivering: "En livraison",
  active: "En service",
  idle: "Disponible",
  maintenance: "En maintenance",
  inactive: "Hors service",
};

const MapOverview: React.FC<MapOverviewProps> = ({ vehicles = [], className }) => {
  // Normaliser les statuts des véhicules pour correspondre aux couleurs disponibles
  const normalizeStatus = (status: string) => {
    switch (status) {
      case 'active':
      case 'delivering':
        return 'active';
      case 'maintenance':
        return 'maintenance';
      case 'inactive':
      case 'idle':
        return 'idle';
      default:
        return 'idle';
    }
  };

  const normalizedVehicles = vehicles.map(vehicle => ({
    ...vehicle,
    status: normalizeStatus(vehicle.status) as keyof typeof statusColors,
    location: vehicle.location || 'Position inconnue'
  }));

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Flotte en temps réel</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-ping-slow"></span>
            <span className="text-xs">En direct</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <InteractiveMap vehicles={normalizedVehicles} />
        
        <div className="p-4 border-t">
          <h4 className="font-medium text-sm mb-2">Véhicules actifs</h4>
          <div className="space-y-2">
            {normalizedVehicles.slice(0, 3).map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className={cn("h-2 w-2 rounded-full mr-2", statusColors[vehicle.status])}></div>
                  <span>{vehicle.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">{vehicle.location}</span>
                  <Badge variant="outline" className="text-xs">
                    {statusLabels[vehicle.status]}
                  </Badge>
                </div>
              </div>
            ))}
            {normalizedVehicles.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                Aucun véhicule disponible
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapOverview;
