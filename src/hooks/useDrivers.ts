
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type DriverStatus = 'available' | 'on-duty' | 'off-duty' | 'on-leave';

export interface Driver {
  id: string;
  name: string;
  status: DriverStatus;
  experience: string;
  vehicles: string[];
  documentValidity: string;
  phone?: string;
  address?: string;
  licenseType?: string;
}

export function useDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les chauffeurs depuis Supabase
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
        
        // Convertir les données pour correspondre à l'interface Driver
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
    
    // Configurer le canal en temps réel
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
    
    // Nettoyer l'abonnement
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Ajouter un chauffeur
  const addDriver = async (driverData: Omit<Driver, 'id'>) => {
    try {
      console.log('Tentative d\'ajout de chauffeur:', driverData);
      
      // Préparer les données pour l'insertion
      const { data, error } = await supabase
        .from('drivers')
        .insert([{
          name: driverData.name,
          status: driverData.status,
          experience: driverData.experience,
          vehicles: driverData.vehicles,
          document_validity: driverData.documentValidity,
          phone: driverData.phone,
          address: driverData.address,
          license_type: driverData.licenseType
        }])
        .select();
      
      if (error) {
        console.error('Erreur Supabase lors de l\'ajout d\'un chauffeur:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('Aucune donnée retournée après l\'insertion');
      }
      
      // Convertir le nouveau chauffeur au format Driver
      const newDriver: Driver = {
        id: data[0].id.toString(),
        name: data[0].name,
        status: data[0].status as DriverStatus,
        experience: data[0].experience,
        vehicles: Array.isArray(data[0].vehicles) ? data[0].vehicles : [],
        documentValidity: data[0].document_validity,
        phone: data[0].phone,
        address: data[0].address,
        licenseType: data[0].license_type
      };
      
      console.log('Chauffeur ajouté avec succès:', newDriver);
      
      // Mettre à jour l'état local avec le nouveau chauffeur
      setDrivers(prev => [...prev, newDriver]);
      
      toast.success("Chauffeur ajouté avec succès", {
        description: `${newDriver.name} a été ajouté à la liste des chauffeurs.`
      });
      
      return newDriver;
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout d\'un chauffeur:', err);
      toast.error("Erreur lors de l'ajout du chauffeur", {
        description: err.message
      });
      throw err;
    }
  };
  
  // Mettre à jour un chauffeur
  const updateDriver = async (id: string, updates: Partial<Driver>) => {
    try {
      console.log('Tentative de mise à jour du chauffeur:', id, updates);
      
      // Préparer les données pour la mise à jour
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
      
      // Mettre à jour l'état local avec les modifications
      setDrivers(prev => 
        prev.map(driver => 
          driver.id === id 
            ? { ...driver, ...updates } 
            : driver
        )
      );
      
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
  
  // Supprimer un chauffeur
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
      
      // Mettre à jour l'état local en supprimant le chauffeur
      setDrivers(prev => prev.filter(driver => driver.id !== id));
      
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

  return {
    drivers,
    loading,
    error,
    addDriver,
    updateDriver,
    deleteDriver
  };
}
