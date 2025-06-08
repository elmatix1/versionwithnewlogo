
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
        
        // Locations simulées pour les véhicules
        const simulatedLocations = [
          'Dépôt Central',
          'Route A7', 
          'Garage Nord',
          'Zone Industrielle',
          'Port',
          'Position inconnue'
        ];
        
        // Convertir les données pour correspondre à l'interface Vehicle
        const formattedVehicles = data.map((vehicle, index) => ({
          id: vehicle.id.toString(),
          name: vehicle.registration,
          type: vehicle.type,
          status: vehicle.status as VehicleStatus,
          fuelLevel: typeof vehicle.fuel_level === 'number' ? vehicle.fuel_level : 0,
          lastMaintenance: vehicle.last_maintenance,
          nextService: vehicle.next_maintenance || '',
          driver: vehicle.driver,
          location: vehicle.location || simulatedLocations[index % simulatedLocations.length]
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
  const addVehicle = async (vehicleData: Omit<Vehicle, 'id'> & { fuelLevel?: number, nextMaintenance?: string }) => {
    try {
      console.log('Tentative d\'ajout de véhicule:', vehicleData);
      
      // Préparer les données pour l'insertion
      const { data, error } = await supabase
        .from('vehicles')
        .insert([{
          registration: vehicleData.name,
          type: vehicleData.type,
          status: vehicleData.status,
          fuel_level: vehicleData.fuelLevel !== undefined ? vehicleData.fuelLevel : 100,
          last_maintenance: vehicleData.lastMaintenance,
          next_maintenance: vehicleData.nextService || vehicleData.nextMaintenance || '',
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
        fuelLevel: typeof data[0].fuel_level === 'number' ? data[0].fuel_level : 100,
        lastMaintenance: data[0].last_maintenance,
        nextService: data[0].next_maintenance || '',
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
  
  // Valider les données avant mise à jour
  const validateVehicleData = (updates: Partial<Vehicle>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Validation du niveau de carburant
    if (updates.fuelLevel !== undefined && (updates.fuelLevel < 0 || updates.fuelLevel > 100)) {
      errors.push('Le niveau de carburant doit être entre 0 et 100%');
    }
    
    // Validation du statut
    if (updates.status && !['active', 'maintenance', 'inactive'].includes(updates.status)) {
      errors.push('Statut invalide. Doit être : En service, En maintenance ou Hors service');
    }
    
    // Validation des dates
    if (updates.lastMaintenance && new Date(updates.lastMaintenance) > new Date()) {
      errors.push('La date du dernier entretien ne peut pas être dans le futur');
    }
    
    if (updates.nextService && new Date(updates.nextService) < new Date()) {
      errors.push('La date du prochain entretien doit être dans le futur');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  // Mettre à jour un véhicule
  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    try {
      console.log('Tentative de mise à jour du véhicule:', id, updates);
      
      // Valider les données avant la mise à jour
      const validation = validateVehicleData(updates);
      if (!validation.isValid) {
        const errorMessage = validation.errors.join(', ');
        toast.error("Données invalides", {
          description: errorMessage
        });
        throw new Error(errorMessage);
      }
      
      // Récupérer les informations actuelles du véhicule pour gérer les contraintes
      const { data: currentVehicle, error: fetchError } = await supabase
        .from('vehicles')
        .select('registration')
        .eq('id', parseInt(id))
        .single();
      
      if (fetchError) {
        console.error('Erreur lors de la récupération du véhicule actuel:', fetchError);
        throw fetchError;
      }
      
      // Si l'immatriculation change, gérer les contraintes de clé étrangère
      const registrationChanged = updates.name && updates.name !== currentVehicle.registration;
      
      if (registrationChanged) {
        // Vérifier s'il y a des positions associées à ce véhicule
        const { data: positions, error: positionsError } = await supabase
          .from('vehicle_positions')
          .select('id')
          .eq('vehicle_id', currentVehicle.registration);
        
        if (positionsError) {
          console.error('Erreur lors de la vérification des positions:', positionsError);
        }
        
        // Si des positions existent, les mettre à jour avec la nouvelle immatriculation
        if (positions && positions.length > 0) {
          const { error: updatePositionsError } = await supabase
            .from('vehicle_positions')
            .update({ vehicle_id: updates.name })
            .eq('vehicle_id', currentVehicle.registration);
          
          if (updatePositionsError) {
            console.error('Erreur lors de la mise à jour des positions:', updatePositionsError);
            toast.error("Erreur lors de la mise à jour des positions du véhicule", {
              description: "Impossible de mettre à jour les références de position"
            });
            throw updatePositionsError;
          }
        }
      }
      
      // Préparer les données pour la mise à jour
      const updateData: any = {};
      
      if (updates.name) updateData.registration = updates.name;
      if (updates.type) updateData.type = updates.type;
      if (updates.status) updateData.status = updates.status;
      if (updates.fuelLevel !== undefined) updateData.fuel_level = updates.fuelLevel;
      if (updates.lastMaintenance) updateData.last_maintenance = updates.lastMaintenance;
      if (updates.nextService) updateData.next_maintenance = updates.nextService;
      if (updates.driver !== undefined) updateData.driver = updates.driver;
      if (updates.location !== undefined) updateData.location = updates.location;
      
      const { error } = await supabase
        .from('vehicles')
        .update(updateData)
        .eq('id', parseInt(id));
      
      if (error) {
        console.error('Erreur Supabase lors de la mise à jour d\'un véhicule:', error);
        
        // Gestion d'erreurs spécifiques
        let errorMessage = "Erreur lors de la mise à jour du véhicule";
        let errorDescription = error.message;
        
        if (error.code === '23503') {
          errorMessage = "Erreur de contrainte de données";
          errorDescription = "Ce véhicule est référencé dans d'autres tables et ne peut pas être modifié";
        } else if (error.code === '23505') {
          errorMessage = "Immatriculation déjà existante";
          errorDescription = "Cette immatriculation est déjà utilisée par un autre véhicule";
        } else if (error.code === '42501') {
          errorMessage = "Permissions insuffisantes";
          errorDescription = "Vous n'avez pas les droits nécessaires pour modifier ce véhicule";
        }
        
        toast.error(errorMessage, {
          description: errorDescription
        });
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
      
      toast.success("Véhicule mis à jour avec succès", {
        description: `Les informations du véhicule ${updates.name || 'ont été mises à jour'}.`
      });
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour d\'un véhicule:', err);
      
      // Si l'erreur n'a pas déjà été gérée (pas de toast affiché)
      if (!err.code) {
        toast.error("Erreur lors de la mise à jour du véhicule", {
          description: err.message
        });
      }
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
