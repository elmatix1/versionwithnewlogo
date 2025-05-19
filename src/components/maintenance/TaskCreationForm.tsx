
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { MaintenanceTaskType, MaintenanceTaskStatus, MaintenanceTaskPriority } from '@/hooks/useMaintenanceTasks';

// Schéma de validation pour le formulaire
const formSchema = z.object({
  vehicle: z.string({
    required_error: "Veuillez sélectionner un véhicule",
  }),
  type: z.enum(["repair", "inspection", "service", "other"], {
    required_error: "Veuillez sélectionner un type",
  }),
  description: z.string({
    required_error: "Veuillez entrer une description",
  }).min(5, {
    message: "La description doit contenir au moins 5 caractères",
  }),
  status: z.enum(["pending", "in-progress", "completed", "cancelled"], {
    required_error: "Veuillez sélectionner un statut",
  }),
  priority: z.enum(["high", "normal", "low"], {
    required_error: "Veuillez sélectionner une priorité",
  }),
  assignedTo: z.string({
    required_error: "Veuillez sélectionner un technicien",
  }),
  dueDate: z.date({
    required_error: "Veuillez sélectionner une date",
  }),
  notes: z.string().optional(),
});

export type MaintenanceFormValues = z.infer<typeof formSchema>;

// Liste des véhicules disponibles
const availableVehicles = [
  { id: "TL-3045", name: "TL-3045" },
  { id: "TL-2189", name: "TL-2189" },
  { id: "TL-4023", name: "TL-4023" },
  { id: "TL-5632", name: "TL-5632" },
  { id: "TL-1764", name: "TL-1764" },
  { id: "TL-8901", name: "TL-8901" },
  { id: "TL-6734", name: "TL-6734" },
];

// Liste des techniciens
const technicians = [
  { id: "1", name: "Martin Dupuis" },
  { id: "2", name: "Lucas Moreau" },
  { id: "3", name: "Philippe Girard" },
  { id: "4", name: "Sophie Legrand" },
  { id: "5", name: "Thomas Dubois" },
];

interface TaskCreationFormProps {
  onSubmit: (data: MaintenanceFormValues) => void;
  onCancel: () => void;
}

const TaskCreationForm: React.FC<TaskCreationFormProps> = ({ onSubmit, onCancel }) => {
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicle: "",
      type: "repair",
      description: "",
      status: "pending",
      priority: "normal",
      assignedTo: "",
      dueDate: new Date(),
      notes: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Véhicule */}
          <FormField
            control={form.control}
            name="vehicle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Véhicule</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un véhicule" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type de maintenance */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de maintenance</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="repair">Réparation</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="service">Entretien</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Statut */}
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
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="in-progress">En cours</SelectItem>
                    <SelectItem value="completed">Terminée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Priorité */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priorité</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une priorité" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="normal">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Assigné à */}
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigné à</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un technicien" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {technicians.map((tech) => (
                      <SelectItem key={tech.id} value={tech.name}>
                        {tech.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date prévue */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date prévue</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      locale={fr}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optionnel)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Entrez des notes supplémentaires si nécessaire"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">Créer la tâche</Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskCreationForm;
