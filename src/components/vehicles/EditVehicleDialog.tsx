
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Vehicle } from "@/hooks/useVehicles";
import { toast } from "sonner";

interface EditVehicleDialogProps {
  vehicle: Vehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
}

const EditVehicleDialog: React.FC<EditVehicleDialogProps> = ({
  vehicle,
  open,
  onOpenChange,
  onUpdateVehicle
}) => {
  const [formData, setFormData] = useState({
    name: vehicle.name,
    type: vehicle.type,
    status: vehicle.status,
    fuelLevel: vehicle.fuelLevel,
    lastMaintenance: vehicle.lastMaintenance,
    nextService: vehicle.nextService,
    driver: vehicle.driver || '',
    location: vehicle.location || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onUpdateVehicle(vehicle.id, formData);
      toast.success("Véhicule mis à jour avec succès");
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error("Erreur lors de la mise à jour du véhicule");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier le véhicule {vehicle.name}</DialogTitle>
          <DialogDescription>
            Modifiez les informations du véhicule ci-dessous.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Immatriculation</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Camion 19T">Camion 19T</SelectItem>
                  <SelectItem value="Camion 26T">Camion 26T</SelectItem>
                  <SelectItem value="Fourgon">Fourgon</SelectItem>
                  <SelectItem value="Semi-remorque">Semi-remorque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">En service</SelectItem>
                  <SelectItem value="maintenance">En maintenance</SelectItem>
                  <SelectItem value="inactive">Hors service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fuelLevel">Niveau de carburant (%)</Label>
              <Input
                id="fuelLevel"
                type="number"
                min="0"
                max="100"
                value={formData.fuelLevel}
                onChange={(e) => handleInputChange('fuelLevel', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lastMaintenance">Dernier entretien</Label>
              <Input
                id="lastMaintenance"
                type="date"
                value={formData.lastMaintenance}
                onChange={(e) => handleInputChange('lastMaintenance', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nextService">Prochain entretien</Label>
              <Input
                id="nextService"
                type="date"
                value={formData.nextService}
                onChange={(e) => handleInputChange('nextService', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="driver">Chauffeur assigné</Label>
              <Input
                id="driver"
                value={formData.driver}
                onChange={(e) => handleInputChange('driver', e.target.value)}
                placeholder="Nom du chauffeur"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Position</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Position actuelle"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditVehicleDialog;
