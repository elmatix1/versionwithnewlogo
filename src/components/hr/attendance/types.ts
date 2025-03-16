
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
