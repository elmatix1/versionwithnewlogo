
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { TimeTrackingRecord } from './types';

export const useFetchTimeTracking = () => {
  const [records, setRecords] = useState<TimeTrackingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [todayRecord, setTodayRecord] = useState<TimeTrackingRecord | null>(null);
  const { user } = useAuth();

  const fetchTodayRecord = async () => {
    if (!user || !user.email) {
      console.log('No user or email available for fetching today record');
      return;
    }

    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      console.log('Fetching today record for user email:', user.email, 'date:', today);
      
      const { data, error } = await supabase
        .from('time_tracking')
        .select('*')
        .eq('user_email', user.email)
        .eq('date', today)
        .maybeSingle();

      if (error) {
        console.error('Error fetching today record:', error);
        return;
      }

      console.log('Today record fetched:', data);
      setTodayRecord(data);
    } catch (error) {
      console.error('Error in fetchTodayRecord:', error);
    }
  };

  const fetchRecords = async () => {
    if (!user || !user.email) {
      console.log('No user or email available for fetching records');
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching records for user email:', user.email);

      const { data, error } = await supabase
        .from('time_tracking')
        .select('*')
        .eq('user_email', user.email)
        .order('date', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error fetching records:', error);
        toast.error('Erreur lors du chargement des pointages');
        return;
      }

      console.log('Records fetched:', data);
      setRecords(data || []);
    } catch (error) {
      console.error('Error in fetchRecords:', error);
      toast.error('Erreur lors du chargement des pointages');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    if (user && user.email) {
      fetchTodayRecord();
      fetchRecords();
    }
  };

  return {
    records,
    loading,
    todayRecord,
    fetchTodayRecord,
    fetchRecords,
    refetch,
    setTodayRecord,
    setRecords,
    setLoading
  };
};
