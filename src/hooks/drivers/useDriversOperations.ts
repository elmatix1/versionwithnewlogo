import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Driver, DriverStatus } from './useDrivers';

export function useDriversOperations() {
  const addDriver = async (driverData: Omit<Driver, 'id'>) => {
    try {
      console.log('Adding new driver:', driverData);
      
      // Ensure vehicles is always an array
      const vehicles = Array.isArray(driverData.vehicles) ? driverData.vehicles : [];
      
      const { data, error } = await supabase
        .from('drivers')
        .insert([{
          name: driverData.name,
          status: driverData.status,
          experience: driverData.experience,
          vehicles: vehicles,
          document_validity: driverData.documentValidity,
          phone: driverData.phone || null,
          address: driverData.address || null,
          license_type: driverData.licenseType || null
        }])
        .select();
      
      if (error) {
        console.error('Error in Supabase insert:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after insertion');
      }
      
      const newDriver: Driver = {
        id: data[0].id.toString(),
        name: data[0].name,
        status: data[0].status as DriverStatus,
        experience: data[0].experience,
        vehicles: Array.isArray(data[0].vehicles) ? data[0].vehicles : [],
        documentValidity: data[0].document_validity,
        phone: data[0].phone || '',
        address: data[0].address || '',
        licenseType: data[0].license_type || ''
      };
      
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
  
  const updateDriver = async (id: string, updates: Partial<Driver>) => {
    try {
      console.log('Tentative de mise à jour du chauffeur:', id, updates);
      
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
        console.error('Erreur Supabase lors de la mise à jour d\'un chauffeur:', error);
        throw error;
      }
      
      console.log('Chauffeur mis à jour avec succès');
      
      toast.success("Chauffeur mis à jour", {
        description: "Les informations du chauffeur ont été mises à jour."
      });
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour d\'un chauffeur:', err);
      toast.error("Erreur lors de la mise à jour du chauffeur", {
        description: err.message
      });
      throw err;
    }
  };
  
  const deleteDriver = async (id: string) => {
    try {
      console.log('Tentative de suppression du chauffeur:', id);
      
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) {
        console.error('Erreur Supabase lors de la suppression d\'un chauffeur:', error);
        throw error;
      }
      
      console.log('Chauffeur supprimé avec succès');
      
      toast.success("Chauffeur supprimé", {
        description: "Le chauffeur a été supprimé avec succès."
      });
    } catch (err: any) {
      console.error('Erreur lors de la suppression d\'un chauffeur:', err);
      toast.error("Erreur lors de la suppression du chauffeur", {
        description: err.message
      });
      throw err;
    }
  };

  return { addDriver, updateDriver, deleteDriver };
}
