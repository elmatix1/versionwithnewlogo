
import React, { useState } from 'react';
import { AttendanceRecord, Employee } from './attendance/types';
import StatCards from './attendance/StatCards';
import AttendanceCalendar from './attendance/AttendanceCalendar';
import ReportCard from './attendance/ReportCard';
import AttendanceTable from './attendance/AttendanceTable';

const AttendanceSystem: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  
  // Sample attendance records
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: 'att-001',
      employee: 'Thomas Durand',
      employeeId: '1',
      date: new Date(),
      timeIn: '08:15',
      timeOut: '17:30',
      status: 'present',
      notes: '',
    },
    {
      id: 'att-002',
      employee: 'Sophie Lefèvre',
      employeeId: '2',
      date: new Date(),
      timeIn: '09:05',
      timeOut: '17:45',
      status: 'late',
      notes: 'Retard signalé à l\'avance',
    },
    {
      id: 'att-003',
      employee: 'Pierre Martin',
      employeeId: '3',
      date: new Date(),
      timeIn: '',
      timeOut: null,
      status: 'absent',
      notes: 'Congé maladie',
    },
    {
      id: 'att-004',
      employee: 'Marie Lambert',
      employeeId: '4',
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
      <StatCards />

      <div className="flex flex-col md:flex-row gap-6">
        <AttendanceCalendar 
          date={date}
          onSelectDate={(newDate) => newDate && setDate(newDate)}
        />
        <ReportCard />
      </div>

      <AttendanceTable 
        date={date}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
        records={filteredRecords}
        employees={employees}
      />
    </div>
  );
};

export default AttendanceSystem;
