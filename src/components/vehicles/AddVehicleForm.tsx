
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Définition du schéma de validation
const vehicleFormSchema = z.object({
  name: z.string().min(2, { message: "L'immatriculation doit comporter au moins 2 caractères" }),
  type: z.string().min(2, { message: "Le type de véhicule est requis" }),
  status: z.enum(['active', 'maintenance', 'inactive']),
  fuelType: z.string(),
  capacity: z.string(),
  year: z.string().regex(/^\d{4}$/, { message: "L'année doit être au format YYYY" }),
  lastMaintenance: z.string(),
  notes: z.string().optional()
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface AddVehicleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddVehicle: (vehicle: VehicleFormValues) => void;
}

const vehicleTypes = [
  'Camion 12T', 'Camion 19T', 'Camion 24T', 'Utilitaire 3.5T', 
  'Fourgon', 'Tracteur routier', 'Semi-remorque', 'Porte-conteneur'
];

const fuelTypes = ['Diesel', 'Essence', 'GPL', 'GNV', 'Électrique', 'Hybride'];

const statusConfig = {
  'active': 'En service',
  'maintenance': 'En maintenance',
  'inactive': 'Hors service'
};

const AddVehicleForm: React.FC<AddVehicleFormProps> = ({ open, onOpenChange, onAddVehicle }) => {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      name: "TL-",
      type: "Camion 19T",
      status: "active",
      fuelType: "Diesel",
      capacity: "",
      year: "2022",
      lastMaintenance: new Date().toISOString().split('T')[0],
      notes: ""
    },
  });

  function onSubmit(values: VehicleFormValues) {
    onAddVehicle(values);
    form.reset();
    onOpenChange(false);
    toast.success("Véhicule ajouté", {
      description: `${values.name} (${values.type}) a été ajouté avec succès`
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
          <DialogDescription>
            Enregistrez un nouveau véhicule dans votre flotte
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Immatriculation</FormLabel>
                    <FormControl>
                      <Input placeholder="TL-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de véhicule</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicleTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(statusConfig).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de carburant</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fuelTypes.map((fuel) => (
                          <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacité</FormLabel>
                    <FormControl>
                      <Input placeholder="10000 kg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Année</FormLabel>
                    <FormControl>
                      <Input placeholder="2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastMaintenance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dernier entretien</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Informations complémentaires sur le véhicule" 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">Ajouter le véhicule</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleForm;
