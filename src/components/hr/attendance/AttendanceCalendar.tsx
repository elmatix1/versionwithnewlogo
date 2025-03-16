
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';

interface AttendanceCalendarProps {
  date: Date;
  onSelectDate: (date: Date | undefined) => void;
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ date, onSelectDate }) => {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Calendrier de présence</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && onSelectDate(newDate)}
          className="rounded-md"
        />
      </CardContent>
    </Card>
  );
};

export default AttendanceCalendar;
