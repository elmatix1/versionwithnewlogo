
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Vehicle } from "@/hooks/useVehicles";
import { toast } from "sonner";

interface DeleteVehicleDialogProps {
  vehicle: Vehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteVehicle: (id: string) => Promise<void>;
}

const DeleteVehicleDialog: React.FC<DeleteVehicleDialogProps> = ({
  vehicle,
  open,
  onOpenChange,
  onDeleteVehicle
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const validateDeletion = (): { canDelete: boolean; reason?: string } => {
    // Vérifier si le véhicule est en service actif
    if (vehicle.status === 'active') {
      return {
        canDelete: false,
        reason: 'Impossible de supprimer : véhicule en service'
      };
    }
    
    // Vérifier si le véhicule a un chauffeur assigné
    if (vehicle.driver && vehicle.driver.trim() !== '') {
      return {
        canDelete: false,
        reason: 'Impossible de supprimer : véhicule assigné à un chauffeur'
      };
    }

    return { canDelete: true };
  };

  const handleDelete = async () => {
    const validation = validateDeletion();
    
    if (!validation.canDelete) {
      toast.error(validation.reason || "Suppression impossible");
      return;
    }

    setIsDeleting(true);
    
    try {
      await onDeleteVehicle(vehicle.id);
      toast.success(`Véhicule ${vehicle.name} supprimé avec succès`);
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Erreur lors de la suppression du véhicule");
    } finally {
      setIsDeleting(false);
    }
  };

  const validation = validateDeletion();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer le véhicule</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Êtes-vous sûr de vouloir supprimer le véhicule <strong>{vehicle.name}</strong> ?
            </p>
            {!validation.canDelete && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 mt-3">
                <p className="text-destructive text-sm font-medium">
                  {validation.reason}
                </p>
                <p className="text-destructive text-xs mt-1">
                  Changez le statut du véhicule ou retirez le chauffeur assigné avant de le supprimer.
                </p>
              </div>
            )}
            {validation.canDelete && (
              <p className="text-sm text-muted-foreground">
                Cette action est irréversible et supprimera définitivement le véhicule de la base de données.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!validation.canDelete || isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteVehicleDialog;
