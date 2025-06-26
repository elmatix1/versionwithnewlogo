
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { OptimizedRoute, OptimizationResult } from '@/types/routeOptimization';
import { calculateOptimizationMetrics, processDeliveryRoute } from '@/utils/routeOptimizationUtils';

export function useRouteOptimization() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [progress, setProgress] = useState(0);

  const optimizeRoutes = useCallback(async (deliveries: any[]) => {
    setIsOptimizing(true);
    setProgress(0);
    
    try {
      // Filtrer les livraisons planifiées
      const plannedDeliveries = deliveries.filter(d => d.status === 'planned');
      
      if (plannedDeliveries.length === 0) {
        toast.warning("Aucune livraison planifiée à optimiser");
        setIsOptimizing(false);
        return null;
      }

      console.log(`Optimisation de ${plannedDeliveries.length} livraisons planifiées`);

      // Toast de progression
      const progressToast = toast.loading("Calcul des routes optimisées...", {
        description: "Traitement en cours, veuillez patienter"
      });

      // Traiter les livraisons par batches pour éviter la surcharge
      const batchSize = 3;
      const optimizedRoutes: OptimizedRoute[] = [];
      
      for (let i = 0; i < plannedDeliveries.length; i += batchSize) {
        const batch = plannedDeliveries.slice(i, i + batchSize);
        
        // Traiter le batch en parallèle
        const batchPromises = batch.map(async (delivery, batchIndex) => {
          const globalIndex = i + batchIndex;
          try {
            const route = await processDeliveryRoute(delivery, globalIndex);
            setProgress(Math.round(((globalIndex + 1) / plannedDeliveries.length) * 100));
            return route;
          } catch (error) {
            console.warn(`Erreur pour la livraison ${globalIndex}:`, error);
            return null;
          }
        });
        
        const batchResults = await Promise.all(batchPromises);
        
        // Ajouter les résultats valides
        batchResults.forEach(route => {
          if (route) {
            optimizedRoutes.push(route);
          }
        });
        
        // Pause entre les batches pour éviter la surcharge
        if (i + batchSize < plannedDeliveries.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      // Fermer le toast de progression
      toast.dismiss(progressToast);

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
      setProgress(100);
      
      toast.success("Optimisation terminée", {
        description: `${optimizedRoutes.length} trajets optimisés avec succès`
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
      setProgress(0);
    }
  }, []);

  const clearOptimization = useCallback(() => {
    setOptimizationResult(null);
    setProgress(0);
  }, []);

  return {
    isOptimizing,
    optimizationResult,
    progress,
    optimizeRoutes,
    clearOptimization
  };
}

