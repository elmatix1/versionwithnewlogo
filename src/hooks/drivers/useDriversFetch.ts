
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Driver, DriverStatus } from './useDrivers';

export function useDriversFetch() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrivers = async () => {
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
        
        const formattedDrivers = data.map(driver => ({
          id: driver.id.toString(),
          name: driver.name,
          status: driver.status as DriverStatus,
          experience: driver.experience,
          vehicles: Array.isArray(driver.vehicles) ? driver.vehicles : [],
          documentValidity: driver.document_validity,
          phone: driver.phone || '',
          address: driver.address || '',
          licenseType: driver.license_type || ''
        }));
        
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
    };
    
    // Initial fetch
    fetchDrivers();
    
    // Enable realtime subscription with better error handling
    const channel = supabase
      .channel('drivers-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'drivers'
      }, (payload) => {
        console.log('Realtime update received:', payload);
        fetchDrivers(); // Reload drivers when changes occur
      })
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.error('Failed to subscribe to realtime updates:', status);
        }
      });
    
    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { drivers, loading, error, setDrivers };
}
