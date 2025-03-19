
export interface AttendanceRecord {
  id: string;
  employee: string;
  date: Date;
  timeIn: string;
  timeOut: string | null;
  status: 'present' | 'absent' | 'late' | 'half-day';
  notes: string;
}

export interface Employee {
  id: string;
  name: string;
}

export interface AttendanceReport {
  id: string;
  name: string;
  period: string;
  startDate: Date;
  endDate: Date;
  generatedOn: Date;
  records: AttendanceRecord[];
  summary: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    averageTimeIn: string;
    averageTimeOut: string;
  };
}
