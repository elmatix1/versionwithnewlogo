
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Driver } from '../useDrivers';

export function useUpdateDriver() {
  const updateDriver = async (id: string, updates: Partial<Driver>) => {
    try {
      console.log('Attempting to update driver:', id, updates);
      
      const updateData: any = {};
      
      if (updates.name) updateData.name = updates.name;
      if (updates.status) updateData.status = updates.status;
      if (updates.experience) updateData.experience = updates.experience;
      if (updates.vehicles) updateData.vehicles = updates.vehicles;
      if (updates.documentValidity) updateData.document_validity = updates.documentValidity;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.address !== undefined) updateData.address = updates.address;
      if (updates.licenseType !== undefined) updateData.license_type = updates.licenseType;
      
      const { error } = await supabase
        .from('drivers')
        .update(updateData)
        .eq('id', parseInt(id));
      
      if (error) {
        console.error('Supabase error while updating driver:', error);
        throw error;
      }
      
      console.log('Driver updated successfully');
      
      toast.success("Driver updated", {
        description: "Driver information has been updated."
      });
    } catch (err: any) {
      console.error('Error updating driver:', err);
      toast.error("Error updating driver", {
        description: err.message
      });
      throw err;
    }
  };

  return { updateDriver };
}
