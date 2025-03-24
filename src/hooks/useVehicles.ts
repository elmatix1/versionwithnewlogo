
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type VehicleStatus = 'active' | 'maintenance' | 'inactive';

export interface Vehicle {
  id: string;
  name: string; // Correspond à registration dans la base de données
  type: string;
  status: VehicleStatus;
  fuelLevel: number;
  lastMaintenance: string;
  nextService: string; // Correspond à nextMaintenance dans la base de données
  driver?: string;
  location?: string; // Correspond à position dans la base de données
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les véhicules depuis Supabase
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('vehicles')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        // Convertir les données pour correspondre à l'interface Vehicle
        const formattedVehicles = data.map(vehicle => ({
          id: vehicle.id.toString(),
          name: vehicle.registration, // Supportons les deux formats
          type: vehicle.type,
          status: vehicle.status as VehicleStatus,
          fuelLevel: typeof vehicle.fuelLevel === 'number' ? vehicle.fuelLevel : 0,
          lastMaintenance: vehicle.lastMaintenance,
          nextService: vehicle.nextMaintenance || '',
          driver: vehicle.driver,
          location: vehicle.location
        }));
        
        setVehicles(formattedVehicles);
        console.log('Véhicules récupérés:', formattedVehicles);
      } catch (err: any) {
        console.error('Erreur lors de la récupération des véhicules:', err);
        setError(err.message);
        toast.error("Erreur lors du chargement des véhicules", {
          description: err.message
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicles();
    
    // Configurer le canal en temps réel
    const channel = supabase
      .channel('public:vehicles')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'vehicles' }, 
        (payload) => {
          console.log('Changement détecté dans les véhicules:', payload);
          fetchVehicles();
        }
      )
      .subscribe();
    
    // Nettoyer l'abonnement
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Ajouter un véhicule
  const addVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    try {
      console.log('Tentative d\'ajout de véhicule:', vehicleData);
      
      // Préparer les données pour l'insertion
      const { data, error } = await supabase
        .from('vehicles')
        .insert([{
          registration: vehicleData.name,
          type: vehicleData.type,
          status: vehicleData.status,
          fuelLevel: vehicleData.fuelLevel,
          lastMaintenance: vehicleData.lastMaintenance,
          nextMaintenance: vehicleData.nextService,
          driver: vehicleData.driver,
          location: vehicleData.location
        }])
        .select();
      
      if (error) {
        console.error('Erreur Supabase lors de l\'ajout d\'un véhicule:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('Aucune donnée retournée après l\'insertion');
      }
      
      // Convertir le nouveau véhicule au format Vehicle
      const newVehicle: Vehicle = {
        id: data[0].id.toString(),
        name: data[0].registration,
        type: data[0].type,
        status: data[0].status as VehicleStatus,
        fuelLevel: typeof data[0].fuelLevel === 'number' ? data[0].fuelLevel : 0,
        lastMaintenance: data[0].lastMaintenance,
        nextService: data[0].nextMaintenance || '',
        driver: data[0].driver,
        location: data[0].location
      };
      
      console.log('Véhicule ajouté avec succès:', newVehicle);
      
      // Mettre à jour l'état local avec le nouveau véhicule
      setVehicles(prev => [...prev, newVehicle]);
      
      toast.success("Véhicule ajouté avec succès", {
        description: `${newVehicle.name} a été ajouté à la flotte.`
      });
      
      return newVehicle;
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout d\'un véhicule:', err);
      toast.error("Erreur lors de l'ajout du véhicule", {
        description: err.message
      });
      throw err;
    }
  };
  
  // Mettre à jour un véhicule
  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    try {
      console.log('Tentative de mise à jour du véhicule:', id, updates);
      
      // Préparer les données pour la mise à jour
      const updateData: any = {};
      
      if (updates.name) updateData.registration = updates.name;
      if (updates.type) updateData.type = updates.type;
      if (updates.status) updateData.status = updates.status;
      if (updates.fuelLevel !== undefined) updateData.fuelLevel = updates.fuelLevel;
      if (updates.lastMaintenance) updateData.lastMaintenance = updates.lastMaintenance;
      if (updates.nextService) updateData.nextMaintenance = updates.nextService;
      if (updates.driver !== undefined) updateData.driver = updates.driver;
      if (updates.location !== undefined) updateData.location = updates.location;
      
      const { error } = await supabase
        .from('vehicles')
        .update(updateData)
        .eq('id', parseInt(id));
      
      if (error) {
        console.error('Erreur Supabase lors de la mise à jour d\'un véhicule:', error);
        throw error;
      }
      
      // Mettre à jour l'état local avec les modifications
      setVehicles(prev => 
        prev.map(vehicle => 
          vehicle.id === id 
            ? { ...vehicle, ...updates } 
            : vehicle
        )
      );
      
      console.log('Véhicule mis à jour avec succès');
      
      toast.success("Véhicule mis à jour", {
        description: "Les informations du véhicule ont été mises à jour."
      });
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour d\'un véhicule:', err);
      toast.error("Erreur lors de la mise à jour du véhicule", {
        description: err.message
      });
      throw err;
    }
  };
  
  // Supprimer un véhicule
  const deleteVehicle = async (id: string) => {
    try {
      console.log('Tentative de suppression du véhicule:', id);
      
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) {
        console.error('Erreur Supabase lors de la suppression d\'un véhicule:', error);
        throw error;
      }
      
      // Mettre à jour l'état local en supprimant le véhicule
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
      
      console.log('Véhicule supprimé avec succès');
      
      toast.success("Véhicule supprimé", {
        description: "Le véhicule a été supprimé avec succès."
      });
    } catch (err: any) {
      console.error('Erreur lors de la suppression d\'un véhicule:', err);
      toast.error("Erreur lors de la suppression du véhicule", {
        description: err.message
      });
      throw err;
    }
  };

  return {
    vehicles,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle
  };
}
