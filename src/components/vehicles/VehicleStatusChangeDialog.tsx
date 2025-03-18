
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Play, Pause, AlertTriangle } from "lucide-react";

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

interface VehicleStatusChangeDialogProps {
  vehicle: Vehicle;
  onStatusChange: (vehicleId: string, newStatus: 'active' | 'maintenance' | 'inactive') => void;
}

const VehicleStatusChangeDialog: React.FC<VehicleStatusChangeDialogProps> = ({
  vehicle,
  onStatusChange
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Changer le statut</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onStatusChange(vehicle.id, 'active')}
          disabled={vehicle.status === 'active'}
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4 text-green-500" />
          <span>Mettre en service</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onStatusChange(vehicle.id, 'maintenance')}
          disabled={vehicle.status === 'maintenance'}
          className="flex items-center gap-2"
        >
          <Pause className="h-4 w-4 text-amber-500" />
          <span>Mettre en maintenance</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onStatusChange(vehicle.id, 'inactive')}
          disabled={vehicle.status === 'inactive'}
          className="flex items-center gap-2"
        >
          <AlertTriangle className="h-4 w-4 text-zinc-500" />
          <span>Mettre hors service</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VehicleStatusChangeDialog;
