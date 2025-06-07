
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import InteractiveMap from './InteractiveMap';
import { useVehiclePositionsForDashboard, VehicleWithPosition } from '@/hooks/useVehiclePositionsForDashboard';
import { MapPin, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const vehiclesWithPositions = useVehiclePositionsForDashboard(vehicles);

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

  const normalizedVehicles = vehiclesWithPositions.map(vehicle => ({
    ...vehicle,
    status: normalizeStatus(vehicle.status) as keyof typeof statusColors,
    location: vehicle.latitude && vehicle.longitude 
      ? `GPS: ${vehicle.latitude.toFixed(4)}, ${vehicle.longitude.toFixed(4)}`
      : vehicle.location || 'Position inconnue'
  }));

  const vehiclesWithGPS = vehiclesWithPositions.filter(v => v.latitude && v.longitude).length;

  const handleViewFullMap = () => {
    navigate('/vehicle-tracking');
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Flotte en temps réel
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-ping-slow"></span>
              <span className="text-xs">GPS actif</span>
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewFullMap}
              className="flex items-center gap-1"
            >
              <Navigation className="h-3 w-3" />
              Voir tout
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <InteractiveMap vehicles={normalizedVehicles} />
        
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm">Véhicules surveillés</h4>
            <Badge variant="secondary" className="text-xs">
              {vehiclesWithGPS}/{normalizedVehicles.length} avec GPS
            </Badge>
          </div>
          <div className="space-y-2">
            {normalizedVehicles.slice(0, 3).map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className={cn("h-2 w-2 rounded-full mr-2", statusColors[vehicle.status])}></div>
                  <span className="font-medium">{vehicle.name}</span>
                  {vehicle.latitude && vehicle.longitude && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      GPS
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs truncate max-w-[100px]">
                    {vehicle.location}
                  </span>
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
            {normalizedVehicles.length > 3 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleViewFullMap}
                className="w-full mt-2 text-xs"
              >
                Voir {normalizedVehicles.length - 3} véhicule{normalizedVehicles.length - 3 > 1 ? 's' : ''} de plus
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapOverview;
