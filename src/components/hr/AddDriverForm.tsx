
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import MoroccanSuggestionInput from '@/components/shared/MoroccanSuggestionInput';
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage';
import { useDrivers, DriverStatus } from '@/hooks/drivers/useDrivers';

// Définition du schéma de validation
const driverFormSchema = z.object({
  fullName: z.string().min(3, { message: "Le nom complet doit comporter au moins 3 caractères" }),
  licenseNumber: z.string().min(2, { message: "Le numéro de permis est requis" }),
  experience: z.string(),
  status: z.enum(['active', 'off-duty', 'sick-leave', 'vacation']),
  phone: z.string().min(10, { message: "Un numéro de téléphone valide est requis" }),
  email: z.string().email({ message: "Adresse email invalide" }),
  address: z.string().min(5, { message: "L'adresse est requise" }),
  cin: z.string()
    .regex(/^[A-Z]{1,2}[0-9]{6}$/, { 
      message: "Format CIN invalide. Format attendu: deux lettres suivies de 6 chiffres (ex: AB123456)"
    })
    .optional()
    .or(z.literal('')),
  city: z.string().optional()
});

type DriverFormValues = z.infer<typeof driverFormSchema>;

interface AddDriverFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddDriver: (driver: DriverFormValues) => void;
}

const mapStatusToDriverStatus = (status: string): DriverStatus => {
  switch(status) {
    case 'active': return 'available';
    case 'off-duty': return 'off-duty';
    case 'sick-leave': return 'on-leave';
    case 'vacation': return 'on-leave';
    default: return 'available';
  }
};

const statusOptions = {
  'active': 'Actif',
  'off-duty': 'Hors service',
  'sick-leave': 'Arrêt maladie',
  'vacation': 'Congés'
};

const experienceOptions = [
  '< 1 an', '1 an', '2 ans', '3 ans', '4 ans', '5 ans', 
  '6 ans', '7 ans', '8 ans', '9 ans', '10+ ans'
];

// Storage key for persisting drivers
const DRIVERS_STORAGE_KEY = 'tms-drivers';

const AddDriverForm: React.FC<AddDriverFormProps> = ({ open, onOpenChange, onAddDriver }) => {
  const { addDriver } = useDrivers();

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: {
      fullName: "",
      licenseNumber: "",
      experience: "3 ans",
      status: "active",
      phone: "",
      email: "",
      address: "",
      cin: "",
      city: ""
    },
  });

  async function onSubmit(values: DriverFormValues) {
    try {
      // Format les données pour Supabase
      const driverData = {
        name: values.fullName,
        status: mapStatusToDriverStatus(values.status),
        experience: values.experience,
        vehicles: [], // Tableau vide par défaut
        documentValidity: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Par défaut 1 an
        phone: values.phone,
        address: values.address,
        licenseType: values.licenseNumber
      };

      // Envoyer à Supabase
      await addDriver(driverData);
      
      // Sauvegarder localement aussi
      const drivers = loadFromLocalStorage<DriverFormValues[]>(DRIVERS_STORAGE_KEY, []);
      const newDrivers = [...drivers, { ...values, id: Date.now().toString() }];
      saveToLocalStorage(DRIVERS_STORAGE_KEY, newDrivers);
      
      // Informer l'interface parent
      onAddDriver(values);
      form.reset();
      onOpenChange(false);

    } catch (error: any) {
      console.error("Erreur lors de l'ajout du chauffeur:", error);
      toast.error("Erreur lors de l'ajout du chauffeur", {
        description: error.message || "Une erreur est survenue"
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau chauffeur</DialogTitle>
          <DialogDescription>
            Créez un nouveau compte chauffeur avec les informations et permis appropriés.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <MoroccanSuggestionInput
                        id="fullName"
                        label=""
                        value={field.value}
                        onChange={field.onChange}
                        dataType="names"
                        placeholder="Ex: Mohamed Amine, Fatima Zahra"
                        required
                        className="mt-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carte Nationale d'Identité (CIN)</FormLabel>
                    <FormControl>
                      <MoroccanSuggestionInput
                        id="cin"
                        label=""
                        value={field.value}
                        onChange={field.onChange}
                        dataType="cin"
                        placeholder="Ex: AB123456"
                        className="mt-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de permis</FormLabel>
                    <FormControl>
                      <Input placeholder="12AB34567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <MoroccanSuggestionInput
                        id="phone"
                        label=""
                        value={field.value}
                        onChange={field.onChange}
                        dataType="phoneNumbers"
                        placeholder="Ex: +212 6 12 34 56 78"
                        className="mt-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expérience</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {experienceOptions.map((exp) => (
                          <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(statusOptions).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
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
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <MoroccanSuggestionInput
                        id="city"
                        label=""
                        value={field.value}
                        onChange={field.onChange}
                        dataType="cities"
                        placeholder="Ex: Casablanca, Rabat"
                        className="mt-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="exemple@translogica.fr" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <MoroccanSuggestionInput
                      id="address"
                      label=""
                      value={field.value}
                      onChange={field.onChange}
                      dataType="streets"
                      placeholder="Ex: Boulevard Mohammed V, Rue Hassan II"
                      className="mt-0"
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
              <Button type="submit">Ajouter le chauffeur</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDriverForm;
