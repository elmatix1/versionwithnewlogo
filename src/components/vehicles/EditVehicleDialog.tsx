
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Réinitialiser les erreurs de validation quand l'utilisateur modifie les données
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    // Validation côté client
    if (!formData.name.trim()) {
      errors.push('L\'immatriculation est obligatoire');
    }
    
    if (formData.fuelLevel < 0 || formData.fuelLevel > 100) {
      errors.push('Le niveau de carburant doit être entre 0 et 100%');
    }
    
    if (formData.lastMaintenance && new Date(formData.lastMaintenance) > new Date()) {
      errors.push('La date du dernier entretien ne peut pas être dans le futur');
    }
    
    if (formData.nextService && new Date(formData.nextService) < new Date()) {
      errors.push('La date du prochain entretien doit être dans le futur');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation côté client
    if (!validateForm()) {
      toast.error("Données invalides", {
        description: "Veuillez corriger les erreurs dans le formulaire"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onUpdateVehicle(vehicle.id, formData);
      onOpenChange(false);
      setValidationErrors([]);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      // L'erreur est déjà gérée dans le hook useVehicles avec des toasts spécifiques
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
        
        {validationErrors.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 mb-4">
            <ul className="text-destructive text-sm space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Immatriculation</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className={validationErrors.some(e => e.includes('immatriculation')) ? 'border-destructive' : ''}
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
                className={validationErrors.some(e => e.includes('carburant')) ? 'border-destructive' : ''}
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
                className={validationErrors.some(e => e.includes('dernier entretien')) ? 'border-destructive' : ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nextService">Prochain entretien</Label>
              <Input
                id="nextService"
                type="date"
                value={formData.nextService}
                onChange={(e) => handleInputChange('nextService', e.target.value)}
                className={validationErrors.some(e => e.includes('prochain entretien')) ? 'border-destructive' : ''}
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
