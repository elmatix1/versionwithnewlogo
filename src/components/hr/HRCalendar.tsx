
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
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, UserCheck } from "lucide-react";

interface Event {
  id: string;
  employee: string;
  employeeId: string;
  type: string;
  date: Date;
  startTime: string;
  endTime: string;
  description: string;
}

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
  const [events, setEvents] = useState<Event[]>([
    {
      id: "evt-001",
      employee: "Thomas Durand",
      employeeId: "1",
      type: "conge",
      date: new Date(),
      startTime: "08:00",
      endTime: "18:00",
      description: "Congés payés"
    },
    {
      id: "evt-002",
      employee: "Pierre Martin",
      employeeId: "3",
      type: "formation",
      date: new Date(),
      startTime: "14:00",
      endTime: "16:00",
      description: "Formation"
    }
  ]);

  const handleAddEvent = () => {
    const employeeName = 
      eventEmployee === '1' ? 'Thomas Durand' :
      eventEmployee === '2' ? 'Sophie Lefèvre' :
      eventEmployee === '3' ? 'Pierre Martin' :
      'Marie Lambert';

    const newEvent: Event = {
      id: `evt-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      employee: employeeName,
      employeeId: eventEmployee,
      type: eventType,
      date: date || new Date(),
      startTime,
      endTime,
      description
    };

    setEvents([...events, newEvent]);
    toast.success(`Événement ajouté au calendrier pour ${employeeName}`);
    setOpen(false);
    
    // Reset form
    setEventType('absence');
    setStartTime('09:00');
    setEndTime('17:00');
    setDescription('');
    
    if (onSchedule) {
      onSchedule();
    }
  };

  const getFilteredEvents = () => {
    return events.filter(event => {
      // Filter by employee if not "all"
      if (employee !== 'all' && event.employeeId !== employee) {
        return false;
      }
      
      // Filter by date
      const eventDate = event.date;
      const selectedDate = date || new Date();
      
      return (
        eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };

  const getEventTypeName = (type: string) => {
    switch (type) {
      case 'absence': return 'Absence';
      case 'conge': return 'Congés payés';
      case 'formation': return 'Formation';
      case 'medical': return 'Rendez-vous médical';
      default: return type;
    }
  };

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'absence': return 'bg-amber-500';
      case 'conge': return 'bg-blue-500';
      case 'formation': return 'bg-green-500';
      case 'medical': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start">
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
                <Button type="submit" onClick={handleAddEvent}>Enregistrer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="flex justify-center border rounded-md p-6 bg-white h-full">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md w-full"
              disabled={(date) => date < new Date('1900-01-01')}
              footer={
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <UserCheck className="inline-block mr-1 h-4 w-4" />
                  <span>Sélectionnez une date pour voir les événements</span>
                </div>
              }
            />
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="border rounded-md p-4 h-full bg-white">
            <h3 className="text-lg font-medium mb-4">
              Évènements pour {date ? date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'aujourd\'hui'}
            </h3>
            <div className="space-y-3">
              {getFilteredEvents().length > 0 ? (
                getFilteredEvents().map((event) => (
                  <div key={event.id} className="p-3 border rounded-md flex items-center justify-between">
                    <div>
                      <span className="font-medium">{event.employee}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getEventBadgeColor(event.type)}>
                          {getEventTypeName(event.type)}
                        </Badge>
                        {event.description && (
                          <span className="text-sm text-muted-foreground">{event.description}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm">
                      {event.startTime} - {event.endTime}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Aucun événement pour cette date</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setOpen(true)}
                  >
                    Ajouter un événement
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRCalendar;
