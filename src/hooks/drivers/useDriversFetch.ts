
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Driver } from './useDrivers';
import { formatDriverData } from './utils/formatDriverData';
import { useDriversRealtime } from './utils/useDriversRealtime';

export function useDriversFetch() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }

      if (!data) {
        setDrivers([]);
        return;
      }
      
      const formattedDrivers = data.map(driver => formatDriverData(driver));
      
      setDrivers(formattedDrivers);
      console.log('Drivers fetched successfully:', formattedDrivers);
    } catch (err: any) {
      console.error('Error fetching drivers:', err);
      setError(err.message);
      toast.error("Error loading drivers", {
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Initial fetch
  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);
  
  // Set up realtime subscriptions
  useDriversRealtime(fetchDrivers);

  return { drivers, loading, error, setDrivers, refreshDrivers: fetchDrivers };
}
