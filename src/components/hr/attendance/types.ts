
export interface Employee {
  id: string;
  name: string;
}

export interface AttendanceRecord {
  id: string;
  date: Date;
  employee: string;
  employeeId: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  timeIn: string | null;
  timeOut: string | null;
  notes: string | null;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  total: number;
}

export interface AttendanceReport {
  id: string;
  type: string;
  startDate: Date;
  endDate: Date;
  generatedAt: Date;
  stats: AttendanceStats;
  records: AttendanceRecord[];
  summary: {
    totalWorkDays: number;
    totalAbsences: number;
    totalLate: number;
    attendanceRate: number;
  };
}
