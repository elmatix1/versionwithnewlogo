
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportPeriod: 'day' | 'week' | 'month';
  setPeriod: (period: 'day' | 'week' | 'month') => void;
  reportStartDate: Date;
  setReportStartDate: (date: Date) => void;
  reportEndDate: Date;
  setReportEndDate: (date: Date) => void;
  onGenerateReport: () => void;
  children: React.ReactNode;
}

const ReportDialog: React.FC<ReportDialogProps> = ({
  open,
  onOpenChange,
  reportPeriod,
  setPeriod,
  reportStartDate,
  setReportStartDate,
  reportEndDate,
  setReportEndDate,
  onGenerateReport,
  children
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Générer un rapport de présence</DialogTitle>
          <DialogDescription>
            Sélectionnez la période et les paramètres du rapport.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reportPeriod" className="text-right">
              Période
            </Label>
            <Select
              value={reportPeriod}
              onValueChange={(value: 'day' | 'week' | 'month') => setPeriod(value)}
            >
              <SelectTrigger id="reportPeriod" className="col-span-3">
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Jour</SelectItem>
                <SelectItem value="week">Semaine</SelectItem>
                <SelectItem value="month">Mois</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">
              Date de début
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input 
                id="startDate"
                type="date"
                value={format(reportStartDate, 'yyyy-MM-dd')}
                onChange={(e) => setReportStartDate(new Date(e.target.value))}
                className="flex-1"
              />
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endDate" className="text-right">
              Date de fin
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input 
                id="endDate"
                type="date"
                value={format(reportEndDate, 'yyyy-MM-dd')}
                onChange={(e) => setReportEndDate(new Date(e.target.value))}
                className="flex-1"
              />
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employeeReport" className="text-right">
              Employé
            </Label>
            <Select defaultValue="all">
              <SelectTrigger id="employeeReport" className="col-span-3">
                <SelectValue placeholder="Tous les employés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les employés</SelectItem>
                <SelectItem value="Thomas Durand">Thomas Durand</SelectItem>
                <SelectItem value="Sophie Lefèvre">Sophie Lefèvre</SelectItem>
                <SelectItem value="Pierre Martin">Pierre Martin</SelectItem>
                <SelectItem value="Marie Lambert">Marie Lambert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reportFormat" className="text-right">
              Format
            </Label>
            <Select defaultValue="pdf">
              <SelectTrigger id="reportFormat" className="col-span-3">
                <SelectValue placeholder="Sélectionner un format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onGenerateReport}>Générer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
