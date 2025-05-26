
import React, { useState } from 'react';
import { AttendanceRecord, Employee } from './attendance/types';
import StatCards from './attendance/StatCards';
import AttendanceCalendar from './attendance/AttendanceCalendar';
import ReportCard from './attendance/ReportCard';
import AttendanceTable from './attendance/AttendanceTable';
import TimeClockSystem from './TimeClockSystem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Calendar, BarChart3 } from 'lucide-react';

const AttendanceSystem: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  
  // Sample attendance records
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: 'att-001',
      employee: 'Thomas Durand',
      date: new Date(),
      timeIn: '08:15',
      timeOut: '17:30',
      status: 'present',
      notes: '',
    },
    {
      id: 'att-002',
      employee: 'Sophie Lefèvre',
      date: new Date(),
      timeIn: '09:05',
      timeOut: '17:45',
      status: 'late',
      notes: 'Retard signalé à l\'avance',
    },
    {
      id: 'att-003',
      employee: 'Pierre Martin',
      date: new Date(),
      timeIn: '',
      timeOut: null,
      status: 'absent',
      notes: 'Congé maladie',
    },
    {
      id: 'att-004',
      employee: 'Marie Lambert',
      date: new Date(),
      timeIn: '08:00',
      timeOut: '13:15',
      status: 'half-day',
      notes: 'Départ anticipé (rendez-vous médical)',
    },
  ]);

  const employees: Employee[] = [
    { id: '1', name: 'Thomas Durand' },
    { id: '2', name: 'Sophie Lefèvre' },
    { id: '3', name: 'Pierre Martin' },
    { id: '4', name: 'Marie Lambert' },
  ];

  const filteredRecords = attendanceRecords.filter(record => {
    const recordDate = record.date;
    const selectedDate = date;
    
    const isSameDate = 
      recordDate.getDate() === selectedDate.getDate() &&
      recordDate.getMonth() === selectedDate.getMonth() &&
      recordDate.getFullYear() === selectedDate.getFullYear();
    
    if (!isSameDate) return false;
    
    if (selectedEmployee !== 'all' && record.employee !== selectedEmployee) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="clock" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clock" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pointage
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Rapports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clock" className="space-y-6">
          <TimeClockSystem />
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <StatCards />

          <div className="flex flex-col md:flex-row gap-6">
            <AttendanceCalendar 
              date={date}
              onSelectDate={(newDate) => newDate && setDate(newDate)}
            />
            <div className="flex-1">
              <AttendanceTable 
                date={date}
                selectedEmployee={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
                records={filteredRecords}
                employees={employees}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <StatCards />
          <ReportCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceSystem;
