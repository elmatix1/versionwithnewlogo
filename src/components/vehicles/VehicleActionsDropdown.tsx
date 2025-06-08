
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Play, Pause, AlertTriangle } from "lucide-react";
import { Vehicle } from "@/hooks/useVehicles";
import EditVehicleDialog from "./EditVehicleDialog";
import DeleteVehicleDialog from "./DeleteVehicleDialog";

interface VehicleActionsDropdownProps {
  vehicle: Vehicle;
  onStatusChange: (vehicleId: string, newStatus: 'active' | 'maintenance' | 'inactive') => void;
  onUpdateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  onDeleteVehicle: (id: string) => Promise<void>;
}

const VehicleActionsDropdown: React.FC<VehicleActionsDropdownProps> = ({
  vehicle,
  onStatusChange,
  onUpdateVehicle,
  onDeleteVehicle
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setEditDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            <span>Modifier</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => setDeleteDialogOpen(true)}
            className="flex items-center gap-2 text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span>Supprimer</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Changer le statut</DropdownMenuLabel>
          
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

      <EditVehicleDialog
        vehicle={vehicle}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdateVehicle={onUpdateVehicle}
      />

      <DeleteVehicleDialog
        vehicle={vehicle}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDeleteVehicle={onDeleteVehicle}
      />
    </>
  );
};

export default VehicleActionsDropdown;
