
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarIcon, Clock } from "lucide-react";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventType: string;
  setEventType: (value: string) => void;
  eventEmployee: string;
  setEventEmployee: (value: string) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  date: Date | undefined;
  setDate: (date: Date) => void;
  onAddEvent: () => void;
  children?: React.ReactNode;
}

const EventDialog: React.FC<EventDialogProps> = ({
  open,
  onOpenChange,
  eventType,
  setEventType,
  eventEmployee,
  setEventEmployee,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  description,
  setDescription,
  date,
  setDate,
  onAddEvent,
  children
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Planifier un évènement</DialogTitle>
          <DialogDescription>
            Enregistrez une absence, un congé ou une formation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee" className="text-right">
              Employé
            </Label>
            <Select value={eventEmployee} onValueChange={setEventEmployee}>
              <SelectTrigger id="employee" className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Thomas Durand</SelectItem>
                <SelectItem value="2">Sophie Lefèvre</SelectItem>
                <SelectItem value="3">Pierre Martin</SelectItem>
                <SelectItem value="4">Marie Lambert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger id="type" className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="absence">Absence</SelectItem>
                <SelectItem value="conge">Congé payé</SelectItem>
                <SelectItem value="formation">Formation</SelectItem>
                <SelectItem value="medical">Rendez-vous médical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="event-date" className="text-right">
              Date
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="event-date"
                type="date"
                value={date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(new Date(e.target.value))}
                className="flex-1"
              />
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start-time" className="text-right">
              Début
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="flex-1"
              />
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end-time" className="text-right">
              Fin
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="flex-1"
              />
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onAddEvent}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
