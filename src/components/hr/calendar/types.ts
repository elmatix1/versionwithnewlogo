
export interface Event {
  id: string;
  employee: string;
  employeeId: string;
  type: string;
  date: Date;
  startTime: string;
  endTime: string;
  description: string;
}

export interface HRCalendarProps {
  onSchedule?: () => void;
}
