
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MaintenanceTaskType, MaintenanceTaskStatus, MaintenanceTaskPriority } from '@/hooks/useMaintenanceTasks';
import SelectField from './form/SelectField';
import DatePickerField from './form/DatePickerField';
import TaskFormField from './form/TaskFormField';
import {
  availableVehicles,
  taskTypes,
  taskStatuses,
  taskPriorities,
  technicians
} from './form/TaskFormData';

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
          <SelectField 
            form={form}
            name="vehicle"
            label="Véhicule"
            placeholder="Sélectionner un véhicule"
            options={availableVehicles}
          />

          {/* Type de maintenance */}
          <SelectField 
            form={form}
            name="type"
            label="Type de maintenance"
            placeholder="Sélectionner un type"
            options={taskTypes}
          />

          {/* Description */}
          <TaskFormField
            form={form}
            name="description"
            label="Description"
            className="col-span-2"
          >
            <Input placeholder="Décrivez la tâche de maintenance" />
          </TaskFormField>

          {/* Statut */}
          <SelectField 
            form={form}
            name="status"
            label="Statut"
            placeholder="Sélectionner un statut"
            options={taskStatuses}
          />

          {/* Priorité */}
          <SelectField 
            form={form}
            name="priority"
            label="Priorité"
            placeholder="Sélectionner une priorité"
            options={taskPriorities}
          />

          {/* Assigné à */}
          <SelectField 
            form={form}
            name="assignedTo"
            label="Assigné à"
            placeholder="Sélectionner un technicien"
            options={technicians}
          />

          {/* Date prévue */}
          <DatePickerField
            form={form}
            name="dueDate"
            label="Date prévue"
          />
        </div>

        {/* Notes */}
        <TaskFormField
          form={form}
          name="notes"
          label="Notes (optionnel)"
        >
          <Textarea
            placeholder="Entrez des notes supplémentaires si nécessaire"
            className="resize-none"
          />
        </TaskFormField>

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
