
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { MaintenanceFormValues } from '../TaskCreationForm';

interface TaskFormFieldProps {
  form: UseFormReturn<MaintenanceFormValues>;
  name: keyof MaintenanceFormValues;
  label: string;
  children: React.ReactNode;
  className?: string;
}

const TaskFormField: React.FC<TaskFormFieldProps> = ({
  form,
  name,
  label,
  children,
  className,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {React.cloneElement(children as React.ReactElement, { ...field })}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TaskFormField;
