
export interface TimeTrackingRecord {
  id: string;
  user_email: string | null;
  date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  created_at: string | null;
  updated_at: string | null;
}
