
import { useState } from 'react';
import { toast } from 'sonner';

export interface OptimizedRoute {
  id: string;
  origin: string;
  destination: string;
  vehicle: string;
  driver: string;
  originalDuration: number;
  optimizedDuration: number;
  timeSaved: number;
  distance: number;
  coordinates: [number, number][];
}

export interface OptimizationResult {
  routes: OptimizedRoute[];
  totalTimeSaved: number;
  totalDistance: number;
  optimizationPercentage: number;
}

export function useRouteOptimization() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);

  // Coordonnées des principales villes marocaines
  const cityCoordinates: Record<string, [number, number]> = {
    'Casablanca': [33.5731, -7.5898],
    'Rabat': [34.0209, -6.8416],
    'Marrakech': [31.6295, -7.9811],
    'Fès': [34.0181, -5.0078],
    'Tanger': [35.7595, -5.8340],
    'Agadir': [30.4278, -9.5981],
    'Meknès': [33.8935, -5.5473],
    'Oujda': [34.6814, -1.9086],
    'Tétouan': [35.5889, -5.3626],
    'Kénitra': [34.2610, -6.5802]
  };

  // Calculer la distance entre deux points (formule de Haversine simplifiée)
  const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Générer des coordonnées pour un trajet optimisé
  const generateOptimizedRoute = (origin: string, destination: string): [number, number][] => {
    const originCoord = cityCoordinates[origin] || [33.5731, -7.5898];
    const destCoord = cityCoordinates[destination] || [31.6295, -7.9811];
    
    // Créer quelques points intermédiaires pour simuler un trajet optimisé
    const waypoints: [number, number][] = [originCoord];
    
    // Ajouter un point intermédiaire pour simuler l'optimisation
    const midLat = (originCoord[0] + destCoord[0]) / 2 + (Math.random() - 0.5) * 0.1;
    const midLng = (originCoord[1] + destCoord[1]) / 2 + (Math.random() - 0.5) * 0.1;
    waypoints.push([midLat, midLng]);
    
    waypoints.push(destCoord);
    return waypoints;
  };

  const optimizeRoutes = async (deliveries: any[]) => {
    setIsOptimizing(true);
    
    try {
      // Simuler un temps de traitement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Filtrer les livraisons planifiées
      const plannedDeliveries = deliveries.filter(d => d.status === 'planned');
      
      if (plannedDeliveries.length === 0) {
        toast.warning("Aucune livraison planifiée à optimiser");
        setIsOptimizing(false);
        return null;
      }

      // Générer des routes optimisées
      const optimizedRoutes: OptimizedRoute[] = plannedDeliveries.map((delivery, index) => {
        const origin = delivery.origin || 'Casablanca';
        const destination = delivery.destination || 'Marrakech';
        const vehicle = delivery.vehicle || `TL-${1000 + index}`;
        const driver = delivery.driver || `Chauffeur ${index + 1}`;
        
        const coordinates = generateOptimizedRoute(origin, destination);
        const distance = calculateDistance(
          cityCoordinates[origin] || [33.5731, -7.5898],
          cityCoordinates[destination] || [31.6295, -7.9811]
        );
        
        const originalDuration = Math.round(distance * 1.2 + Math.random() * 30); // Temps original
        const timeSaved = Math.round(15 + Math.random() * 45); // Temps économisé
        const optimizedDuration = Math.max(30, originalDuration - timeSaved);

        return {
          id: delivery.id || `route-${index}`,
          origin,
          destination,
          vehicle,
          driver,
          originalDuration,
          optimizedDuration,
          timeSaved,
          distance: Math.round(distance),
          coordinates
        };
      });

      const totalTimeSaved = optimizedRoutes.reduce((sum, route) => sum + route.timeSaved, 0);
      const totalDistance = optimizedRoutes.reduce((sum, route) => sum + route.distance, 0);
      const optimizationPercentage = Math.round((totalTimeSaved / optimizedRoutes.reduce((sum, route) => sum + route.originalDuration, 0)) * 100);

      const result: OptimizationResult = {
        routes: optimizedRoutes,
        totalTimeSaved,
        totalDistance,
        optimizationPercentage
      };

      setOptimizationResult(result);
      
      toast.success("Optimisation terminée", {
        description: `${optimizedRoutes.length} trajets optimisés, ${totalTimeSaved} minutes économisées au total`
      });
      
      return result;
    } catch (error) {
      toast.error("Erreur lors de l'optimisation", {
        description: "Une erreur est survenue pendant le calcul des trajets optimisés"
      });
      return null;
    } finally {
      setIsOptimizing(false);
    }
  };

  const clearOptimization = () => {
    setOptimizationResult(null);
  };

  return {
    isOptimizing,
    optimizationResult,
    optimizeRoutes,
    clearOptimization
  };
}
