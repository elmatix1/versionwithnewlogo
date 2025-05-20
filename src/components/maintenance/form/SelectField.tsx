
import React from 'react';
import {
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
import { UseFormReturn } from "react-hook-form";
import { MaintenanceFormValues } from '../TaskCreationForm';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  form: UseFormReturn<MaintenanceFormValues>;
  name: keyof MaintenanceFormValues;
  label: string;
  placeholder: string;
  options: Option[];
  className?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  form,
  name,
  label,
  placeholder,
  options,
  className,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectField;
