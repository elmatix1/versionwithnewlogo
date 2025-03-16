
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

interface HRCalendarProps {
  onSchedule?: () => void;
}

const HRCalendar: React.FC<HRCalendarProps> = ({ onSchedule }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [employee, setEmployee] = useState('all');

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
          <Button className="w-full" onClick={onSchedule}>
            Planifier une absence / congé
          </Button>
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
