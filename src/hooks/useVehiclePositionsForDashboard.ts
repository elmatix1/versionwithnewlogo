
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Vehicle } from '@/hooks/useVehicles';

export interface VehicleWithPosition extends Vehicle {
  latitude?: number;
  longitude?: number;
  lastUpdate?: string;
  gpsSpeed?: number;
}

export function useVehiclePositionsForDashboard(vehicles: Vehicle[]) {
  const [vehiclesWithPositions, setVehiclesWithPositions] = useState<VehicleWithPosition[]>([]);

  useEffect(() => {
    const fetchPositions = async () => {
      if (vehicles.length === 0) {
        setVehiclesWithPositions([]);
        return;
      }

      try {
        // Récupérer les dernières positions pour tous les véhicules
        const { data: positions, error } = await supabase
          .from('vehicle_positions')
          .select('*')
          .order('timestamp', { ascending: false });

        if (error) {
          console.error('Erreur lors de la récupération des positions:', error);
          setVehiclesWithPositions(vehicles);
          return;
        }

        // Créer un map des dernières positions par véhicule
        const latestPositions = new Map();
        positions?.forEach(position => {
          if (!latestPositions.has(position.vehicle_id)) {
            latestPositions.set(position.vehicle_id, position);
          }
        });

        // Combiner les données des véhicules avec leurs positions GPS
        const enrichedVehicles = vehicles.map(vehicle => {
          const position = latestPositions.get(vehicle.name);
          
          if (position) {
            return {
              ...vehicle,
              latitude: position.latitude,
              longitude: position.longitude,
              lastUpdate: position.timestamp,
              gpsSpeed: position.speed,
              location: `GPS: ${position.latitude.toFixed(4)}, ${position.longitude.toFixed(4)}`
            };
          }
          
          return vehicle;
        });

        setVehiclesWithPositions(enrichedVehicles);
      } catch (error) {
        console.error('Erreur lors de la récupération des positions GPS:', error);
        setVehiclesWithPositions(vehicles);
      }
    };

    fetchPositions();

    // S'abonner aux mises à jour en temps réel
    const channel = supabase
      .channel('dashboard_positions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'vehicle_positions'
        },
        () => {
          // Rafraîchir les positions quand il y a une nouvelle position
          fetchPositions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [vehicles]);

  return vehiclesWithPositions;
}
