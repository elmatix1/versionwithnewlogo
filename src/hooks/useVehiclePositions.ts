
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface VehiclePosition {
  id: string;
  vehicle_id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  speed: number;
  heading: number;
  created_at: string;
}

export function useVehiclePositions() {
  const [positions, setPositions] = useState<VehiclePosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les dernières positions
  const fetchLatestPositions = async () => {
    try {
      setLoading(true);
      
      // Récupérer la dernière position de chaque véhicule
      const { data, error } = await supabase
        .from('vehicle_positions')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Garder seulement la dernière position par véhicule
      const latestPositions: VehiclePosition[] = [];
      const vehicleIds = new Set<string>();
      
      data?.forEach((position) => {
        if (!vehicleIds.has(position.vehicle_id)) {
          latestPositions.push(position);
          vehicleIds.add(position.vehicle_id);
        }
      });
      
      setPositions(latestPositions);
      console.log('Positions récupérées:', latestPositions);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des positions:', err);
      setError(err.message);
      toast.error("Erreur lors du chargement des positions GPS", {
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Simuler le mouvement des véhicules (pour les tests)
  const simulateMovement = async () => {
    try {
      const { error } = await supabase.rpc('simulate_vehicle_movement');
      if (error) {
        console.error('Erreur lors de la simulation:', error);
      }
    } catch (err) {
      console.error('Erreur lors de la simulation du mouvement:', err);
    }
  };

  useEffect(() => {
    fetchLatestPositions();
    
    // Configurer l'abonnement en temps réel
    const channel = supabase
      .channel('vehicle_positions_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'vehicle_positions'
        },
        (payload) => {
          console.log('Nouvelle position reçue:', payload.new);
          
          const newPosition = payload.new as VehiclePosition;
          
          setPositions(prev => {
            // Mettre à jour ou ajouter la nouvelle position
            const filtered = prev.filter(p => p.vehicle_id !== newPosition.vehicle_id);
            return [...filtered, newPosition];
          });
          
          toast.success("Position mise à jour", {
            description: `Véhicule ${newPosition.vehicle_id} - ${new Date(newPosition.timestamp).toLocaleTimeString()}`
          });
        }
      )
      .subscribe();
    
    // Simuler le mouvement toutes les 5 secondes (pour les tests)
    const movementInterval = setInterval(simulateMovement, 5000);
    
    // Nettoyer l'abonnement et l'intervalle
    return () => {
      supabase.removeChannel(channel);
      clearInterval(movementInterval);
    };
  }, []);

  return {
    positions,
    loading,
    error,
    refreshPositions: fetchLatestPositions,
    simulateMovement
  };
}
