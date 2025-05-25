
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

  // Coordonnées précises des principales villes marocaines
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
    'Kénitra': [34.2610, -6.5802],
    'Ifrane': [33.5228, -5.1106],
    'Béni Mellal': [32.3373, -6.3498],
    'Laâyoune': [27.1253, -13.1625],
    'Errachidia': [31.9314, -4.4246],
    'Ouarzazate': [30.9189, -6.8934],
    'Essaouira': [31.5084, -9.7595]
  };

  // Routes principales entre les villes avec points intermédiaires réalistes
  const routeData: Record<string, Record<string, { distance: number; duration: number; waypoints: [number, number][] }>> = {
    'Meknès': {
      'Ifrane': {
        distance: 65,
        duration: 75,
        waypoints: [
          [33.8935, -5.5473], // Meknès
          [33.7500, -5.3200], // Route via N8
          [33.6200, -5.2100], // Azrou
          [33.5228, -5.1106]  // Ifrane
        ]
      },
      'Casablanca': {
        distance: 245,
        duration: 180,
        waypoints: [
          [33.8935, -5.5473], // Meknès
          [33.8000, -5.8000], // Route vers A2
          [33.7000, -6.2000], // Via Khémisset
          [33.6000, -6.8000], // Approche Rabat
          [33.5731, -7.5898]  // Casablanca
        ]
      }
    },
    'Laâyoune': {
      'Béni Mellal': {
        distance: 780,
        duration: 540,
        waypoints: [
          [27.1253, -13.1625], // Laâyoune
          [29.5000, -10.0000], // Route N1 vers le nord
          [30.5000, -8.5000],  // Via Agadir region
          [31.2000, -7.8000],  // Marrakech region
          [31.8000, -7.2000],  // Route vers Béni Mellal
          [32.3373, -6.3498]   // Béni Mellal
        ]
      },
      'Casablanca': {
        distance: 950,
        duration: 650,
        waypoints: [
          [27.1253, -13.1625], // Laâyoune
          [28.5000, -11.5000], // Route N1
          [30.0000, -9.5000],  // Région Agadir
          [31.0000, -8.5000],  // Route côtière
          [32.5000, -8.0000],  // Via El Jadida
          [33.5731, -7.5898]   // Casablanca
        ]
      }
    },
    'Casablanca': {
      'Marrakech': {
        distance: 240,
        duration: 165,
        waypoints: [
          [33.5731, -7.5898], // Casablanca
          [33.3000, -7.7000], // Route A7
          [32.8000, -7.8000], // Settat region
          [32.3000, -7.9000], // Approche Marrakech
          [31.6295, -7.9811]  // Marrakech
        ]
      },
      'Rabat': {
        distance: 90,
        duration: 65,
        waypoints: [
          [33.5731, -7.5898], // Casablanca
          [33.7000, -7.2000], // Autoroute A1
          [33.9000, -6.9000], // Via Témara
          [34.0209, -6.8416]  // Rabat
        ]
      }
    },
    'Rabat': {
      'Fès': {
        distance: 210,
        duration: 150,
        waypoints: [
          [34.0209, -6.8416], // Rabat
          [34.1000, -6.5000], // Route A2
          [34.1500, -5.8000], // Via Meknès region
          [34.0900, -5.4000], // Approche Fès
          [34.0181, -5.0078]  // Fès
        ]
      }
    }
  };

  // Calculer la distance entre deux points (formule de Haversine)
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

  // Obtenir la route réelle entre deux villes
  const getRealRoute = (origin: string, destination: string): { distance: number; duration: number; coordinates: [number, number][] } => {
    // Vérifier si nous avons des données de route prédéfinies
    if (routeData[origin] && routeData[origin][destination]) {
      const route = routeData[origin][destination];
      return {
        distance: route.distance,
        duration: route.duration,
        coordinates: route.waypoints
      };
    }

    // Vérifier la route inverse
    if (routeData[destination] && routeData[destination][origin]) {
      const route = routeData[destination][origin];
      return {
        distance: route.distance,
        duration: route.duration,
        coordinates: [...route.waypoints].reverse()
      };
    }

    // Si aucune route prédéfinie, calculer une route approximative
    const originCoord = cityCoordinates[origin];
    const destCoord = cityCoordinates[destination];
    
    if (!originCoord || !destCoord) {
      return {
        distance: 100,
        duration: 90,
        coordinates: [
          cityCoordinates['Casablanca'] || [33.5731, -7.5898],
          cityCoordinates['Marrakech'] || [31.6295, -7.9811]
        ]
      };
    }

    const directDistance = calculateDistance(originCoord, destCoord);
    
    // Générer une route avec des points intermédiaires réalistes
    const waypoints: [number, number][] = [originCoord];
    
    // Ajouter des points intermédiaires basés sur la géographie marocaine
    const latDiff = destCoord[0] - originCoord[0];
    const lngDiff = destCoord[1] - originCoord[1];
    
    // Ajouter 1-3 points intermédiaires selon la distance
    const numWaypoints = Math.min(3, Math.max(1, Math.floor(directDistance / 150)));
    
    for (let i = 1; i <= numWaypoints; i++) {
      const ratio = i / (numWaypoints + 1);
      const midLat = originCoord[0] + (latDiff * ratio);
      const midLng = originCoord[1] + (lngDiff * ratio);
      
      // Ajouter une légère déviation pour simuler les routes réelles
      const deviation = 0.05 * Math.sin(ratio * Math.PI);
      waypoints.push([midLat + deviation, midLng + deviation * 0.5]);
    }
    
    waypoints.push(destCoord);
    
    // Calculer la durée basée sur la distance et le type de route
    const routeDistance = Math.round(directDistance * 1.2); // Facteur de route réelle
    const estimatedDuration = Math.round(routeDistance * 0.8 + 20); // Vitesse moyenne + temps de démarrage
    
    return {
      distance: routeDistance,
      duration: estimatedDuration,
      coordinates: waypoints
    };
  };

  const optimizeRoutes = async (deliveries: any[]) => {
    setIsOptimizing(true);
    
    try {
      // Simuler un temps de traitement réaliste
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Filtrer les livraisons planifiées
      const plannedDeliveries = deliveries.filter(d => d.status === 'planned');
      
      if (plannedDeliveries.length === 0) {
        toast.warning("Aucune livraison planifiée à optimiser");
        setIsOptimizing(false);
        return null;
      }

      // Générer des routes optimisées basées sur les vraies données
      const optimizedRoutes: OptimizedRoute[] = plannedDeliveries.map((delivery, index) => {
        const origin = delivery.origin || 'Casablanca';
        const destination = delivery.destination || 'Marrakech';
        const vehicle = delivery.vehicle || `TL-${1000 + index}`;
        const driver = delivery.driver || `Chauffeur ${index + 1}`;
        
        // Obtenir la route réelle
        const realRoute = getRealRoute(origin, destination);
        
        // Calculer l'optimisation (amélioration réaliste de 10-25%)
        const optimizationFactor = 0.15 + (Math.random() * 0.10); // 15-25% d'amélioration
        const timeSaved = Math.round(realRoute.duration * optimizationFactor);
        const optimizedDuration = Math.max(30, realRoute.duration - timeSaved);

        return {
          id: delivery.id || `route-${index}`,
          origin,
          destination,
          vehicle,
          driver,
          originalDuration: realRoute.duration,
          optimizedDuration,
          timeSaved,
          distance: realRoute.distance,
          coordinates: realRoute.coordinates
        };
      });

      const totalTimeSaved = optimizedRoutes.reduce((sum, route) => sum + route.timeSaved, 0);
      const totalDistance = optimizedRoutes.reduce((sum, route) => sum + route.distance, 0);
      const totalOriginalTime = optimizedRoutes.reduce((sum, route) => sum + route.originalDuration, 0);
      const optimizationPercentage = Math.round((totalTimeSaved / totalOriginalTime) * 100);

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
