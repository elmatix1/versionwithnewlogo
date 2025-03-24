
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
        
        const { data, error } = await supabase
          .from('drivers')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        const formattedDrivers = data.map(driver => ({
          id: driver.id.toString(),
          name: driver.name,
          status: driver.status as DriverStatus,
          experience: driver.experience,
          vehicles: Array.isArray(driver.vehicles) ? driver.vehicles : [],
          documentValidity: driver.document_validity,
          phone: driver.phone,
          address: driver.address,
          licenseType: driver.license_type
        }));
        
        setDrivers(formattedDrivers);
        console.log('Chauffeurs récupérés:', formattedDrivers);
      } catch (err: any) {
        console.error('Erreur lors de la récupération des chauffeurs:', err);
        setError(err.message);
        toast.error("Erreur lors du chargement des chauffeurs", {
          description: err.message
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDrivers();
    
    const channel = supabase
      .channel('public:drivers')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'drivers' }, 
        (payload) => {
          console.log('Changement détecté dans les chauffeurs:', payload);
          fetchDrivers();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { drivers, loading, error, setDrivers };
}
