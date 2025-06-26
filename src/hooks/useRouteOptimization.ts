
import { useState } from 'react';
import { toast } from 'sonner';
import { OptimizedRoute, OptimizationResult } from '@/types/routeOptimization';
import { calculateOptimizationMetrics, processDeliveryRoute } from '@/utils/routeOptimizationUtils';

export function useRouteOptimization() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);

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

      console.log(`Optimisation de ${plannedDeliveries.length} livraisons planifiées`);

      // Traiter chaque livraison pour obtenir les vraies routes
      const optimizedRoutes: OptimizedRoute[] = [];
      
      for (const [index, delivery] of plannedDeliveries.entries()) {
        const route = await processDeliveryRoute(delivery, index);
        
        if (route) {
          optimizedRoutes.push(route);
        }
        
        // Délai entre les appels pour éviter de surcharger l'API
        if (index < plannedDeliveries.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      if (optimizedRoutes.length === 0) {
        toast.error("Impossible de calculer les routes optimisées");
        setIsOptimizing(false);
        return null;
      }

      const metrics = calculateOptimizationMetrics(optimizedRoutes);

      const result: OptimizationResult = {
        routes: optimizedRoutes,
        ...metrics
      };

      console.log(`Optimisation terminée: ${metrics.totalTimeSaved}min économisées sur ${metrics.totalDistance}km total`);
      
      setOptimizationResult(result);
      
      toast.success("Optimisation terminée", {
        description: `${optimizedRoutes.length} trajets optimisés avec des routes réelles`
      });
      
      return result;
    } catch (error) {
      console.error("Erreur lors de l'optimisation:", error);
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
