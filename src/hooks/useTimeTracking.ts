
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useFetchTimeTracking } from './timeTracking/useFetchTimeTracking';
import { useClockOperations } from './timeTracking/useClockOperations';

export const useTimeTracking = () => {
  const { user } = useAuth();
  const {
    records,
    loading,
    todayRecord,
    fetchTodayRecord,
    fetchRecords,
    refetch,
    setLoading
  } = useFetchTimeTracking();

  const { clockIn, clockOut } = useClockOperations({
    fetchTodayRecord,
    fetchRecords,
    setLoading
  });

  useEffect(() => {
    if (user && user.email) {
      fetchTodayRecord();
      fetchRecords();
    }
  }, [user]);

  return {
    records,
    loading,
    todayRecord,
    clockIn,
    clockOut,
    refetch
  };
};
