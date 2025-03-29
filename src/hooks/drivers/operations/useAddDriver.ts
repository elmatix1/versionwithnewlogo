
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Driver } from '../useDrivers';
import { formatDriverData, formatDriverForInsert } from '../utils/formatDriverData';

export function useAddDriver() {
  const addDriver = async (driverData: Omit<Driver, 'id'>) => {
    try {
      console.log('Adding new driver:', driverData);
      
      const insertData = formatDriverForInsert(driverData);
      
      const { data, error } = await supabase
        .from('drivers')
        .insert([insertData])
        .select();
      
      if (error) {
        console.error('Error in Supabase insert:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after insertion');
      }
      
      const newDriver = formatDriverData(data[0]);
      
      console.log('Driver added successfully:', newDriver);
      toast.success("Driver added successfully", {
        description: `${newDriver.name} has been added to the drivers list.`
      });
      
      return newDriver;
    } catch (err: any) {
      console.error('Error adding driver:', err);
      toast.error("Error adding driver", {
        description: err.message
      });
      throw err;
    }
  };

  return { addDriver };
}
