
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OptionType {
  value: string;
  label: string;
}

interface ReportDialogProps {
  title: string;
  description: string;
  typeLabel: string;
  typeOptions: OptionType[];
  periodLabel: string;
  periodOptions: OptionType[];
  buttonText: string;
  onSubmit: () => void;
  reportType: string;
  setReportType: (type: string) => void;
  reportPeriod: string;
  setReportPeriod: (period: string) => void;
  customFields?: React.ReactNode;
}

export const ReportDialog: React.FC<ReportDialogProps> = ({
  title,
  description,
  typeLabel,
  typeOptions,
  periodLabel,
  periodOptions,
  buttonText,
  onSubmit,
  reportType,
  setReportType,
  reportPeriod,
  setReportPeriod,
  customFields,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="report-type" className="text-right">
              {typeLabel}
            </Label>
            <Select onValueChange={value => setReportType(value)}>
              <SelectTrigger id="report-type" className="col-span-3">
                <SelectValue placeholder={`Sélectionner le type de rapport`} />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="report-period" className="text-right">
              {periodLabel}
            </Label>
            <Select onValueChange={value => setReportPeriod(value)}>
              <SelectTrigger id="report-period" className="col-span-3">
                <SelectValue placeholder="Sélectionner la période" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {customFields}
        </div>
        <DialogFooter>
          <Button onClick={onSubmit}>Générer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
