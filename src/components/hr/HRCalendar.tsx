
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface HRCalendarProps {
  onSchedule?: () => void;
}

const HRCalendar: React.FC<HRCalendarProps> = ({ onSchedule }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [employee, setEmployee] = useState('all');
  const [open, setOpen] = useState(false);
  const [eventType, setEventType] = useState('absence');
  const [eventEmployee, setEventEmployee] = useState('1');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [description, setDescription] = useState('');

  const handleAddEvent = () => {
    toast.success(`Événement ajouté au calendrier pour ${
      eventEmployee === '1' ? 'Thomas Durand' :
      eventEmployee === '2' ? 'Sophie Lefèvre' :
      eventEmployee === '3' ? 'Pierre Martin' :
      'Marie Lambert'
    }`);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-1/3">
          <label htmlFor="employee-filter" className="block text-sm font-medium mb-1">Filtrer par employé</label>
          <Select value={employee} onValueChange={setEmployee}>
            <SelectTrigger id="employee-filter">
              <SelectValue placeholder="Tous les employés" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les employés</SelectItem>
              <SelectItem value="1">Thomas Durand</SelectItem>
              <SelectItem value="2">Sophie Lefèvre</SelectItem>
              <SelectItem value="3">Pierre Martin</SelectItem>
              <SelectItem value="4">Marie Lambert</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-1/3">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                Planifier une absence / congé
              </Button>
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
                  <Label htmlFor="start-time" className="text-right">
                    Début
                  </Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="end-time" className="text-right">
                    Fin
                  </Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="col-span-3"
                  />
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
                <Button type="submit" onClick={handleAddEvent}>Enregistrer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex justify-center border rounded-md p-6 bg-white">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="pointer-events-auto"
          disabled={(date) => date < new Date('1900-01-01')}
        />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Évènements pour la journée</h3>
        <div className="space-y-2">
          {employee === 'all' || employee === '1' ? (
            <div className="p-3 border rounded-md flex items-center justify-between">
              <div>
                <span className="font-medium">Thomas Durand</span>
                <p className="text-sm text-muted-foreground">Congés payés</p>
              </div>
              <div className="text-sm">08:00 - 18:00</div>
            </div>
          ) : null}
          {employee === 'all' || employee === '3' ? (
            <div className="p-3 border rounded-md flex items-center justify-between">
              <div>
                <span className="font-medium">Pierre Martin</span>
                <p className="text-sm text-muted-foreground">Formation</p>
              </div>
              <div className="text-sm">14:00 - 16:00</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default HRCalendar;
