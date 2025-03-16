
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
import { toast } from "sonner";
import { UserCheck } from "lucide-react";
import { Event, HRCalendarProps } from './calendar/types';
import EventsList from './calendar/EventsList';
import EventDialog from './calendar/EventDialog';
import { getEventTypeName, getEventBadgeColor } from './calendar/utils';

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
          <EventDialog
            open={open}
            onOpenChange={setOpen}
            eventType={eventType}
            setEventType={setEventType}
            eventEmployee={eventEmployee}
            setEventEmployee={setEventEmployee}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            description={description}
            setDescription={setDescription}
            date={date}
            setDate={(newDate) => setDate(newDate)}
            onAddEvent={handleAddEvent}
          >
            <Button className="w-full">
              Planifier une absence / congé
            </Button>
          </EventDialog>
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
          <EventsList 
            events={getFilteredEvents()} 
            date={date} 
            onOpenDialog={() => setOpen(true)}
            getEventTypeName={getEventTypeName}
            getEventBadgeColor={getEventBadgeColor}
          />
        </div>
      </div>
    </div>
  );
};

export default HRCalendar;
