
import React, { useEffect, useRef, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import { OptimizedRoute } from '@/types/routeOptimization';
import MapLegend from './map/MapLegend';
import { renderRouteOnMap } from './map/RouteRenderer';
import {
  initializeLeafletIcons,
  createMap,
  addTileLayer,
  clearMapLayers,
  getRouteColors,
  fitMapToRoutes,
  addPulseAnimation
} from './map/mapUtils';

interface OptimizationResultsMapProps {
  routes: OptimizedRoute[];
  className?: string;
}

const OptimizationResultsMap: React.FC<OptimizationResultsMapProps> = ({ routes, className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const cleanupAnimation = useRef<(() => void) | null>(null);
  const isInitialized = useRef(false);

  // Fonction de nettoyage memoizée
  const cleanup = useCallback(() => {
    if (cleanupAnimation.current) {
      cleanupAnimation.current();
      cleanupAnimation.current = null;
    }
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    isInitialized.current = false;
  }, []);

  // Initialisation de la carte
  useEffect(() => {
    if (!mapContainer.current || isInitialized.current) return;

    try {
      // Initialiser les icônes Leaflet
      initializeLeafletIcons();

      // Créer la carte
      map.current = createMap(mapContainer.current);

      // Ajouter la couche de tuiles
      addTileLayer(map.current);

      // Ajouter l'animation de pulsation
      cleanupAnimation.current = addPulseAnimation();

      isInitialized.current = true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la carte:', error);
    }

    return cleanup;
  }, [cleanup]);

  // Rendu des routes avec optimisation
  useEffect(() => {
    if (!map.current || !isInitialized.current || routes.length === 0) return;

    try {
      // Effacer les anciens marqueurs et routes
      clearMapLayers(map.current);

      const colors = getRouteColors();
      const allCoordinates: L.LatLngExpression[] = [];

      // Rendre chaque route sur la carte avec throttling
      routes.forEach((route, index) => {
        setTimeout(() => {
          if (map.current) {
            const color = colors[index % colors.length];
            renderRouteOnMap(map.current, route, color, allCoordinates);
            
            // Ajuster la vue après le rendu de toutes les routes
            if (index === routes.length - 1) {
              setTimeout(() => {
                if (map.current) {
                  fitMapToRoutes(map.current, allCoordinates);
                }
              }, 100);
            }
          }
        }, index * 50); // Délai progressif pour éviter la surcharge
      });

    } catch (error) {
      console.error('Erreur lors du rendu des routes:', error);
    }
  }, [routes]);

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapContainer} 
        className="w-full h-[500px] rounded-lg border shadow-sm bg-slate-50" 
        style={{ 
          minHeight: '500px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}
      />
      {routes.length > 0 && <MapLegend routesCount={routes.length} />}
      
      {/* Indicateur de chargement */}
      {routes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Chargement de la carte...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizationResultsMap;

