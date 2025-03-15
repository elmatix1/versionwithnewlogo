
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Truck, AlertCircle } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  status: 'delivering' | 'idle' | 'maintenance';
  location: string;
}

interface MapOverviewProps {
  vehicles: Vehicle[];
  className?: string;
}

const statusColors = {
  delivering: "bg-green-500",
  idle: "bg-blue-500",
  maintenance: "bg-amber-500",
};

const statusLabels = {
  delivering: "En livraison",
  idle: "Disponible",
  maintenance: "En maintenance",
};

const MapOverview: React.FC<MapOverviewProps> = ({ vehicles, className }) => {
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
        <div className="relative bg-zinc-100 dark:bg-zinc-800 h-[240px]">
          {/* This is a placeholder for an actual map component */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Carte non disponible en mode démo</p>
            </div>
          </div>
          
          {/* Vehicle markers would be placed here in a real implementation */}
          {vehicles.slice(0, 3).map((vehicle, index) => (
            <div 
              key={vehicle.id} 
              className="absolute p-1 rounded-full bg-white shadow-md"
              style={{ 
                top: `${30 + index * 20}%`, 
                left: `${20 + index * 25}%`, 
                transform: 'translate(-50%, -50%)' 
              }}
            >
              <div className={cn("p-1 rounded-full", statusColors[vehicle.status])}>
                <Truck className="h-3 w-3 text-white" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t">
          <h4 className="font-medium text-sm mb-2">Véhicules actifs</h4>
          <div className="space-y-2">
            {vehicles.slice(0, 3).map((vehicle) => (
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapOverview;
