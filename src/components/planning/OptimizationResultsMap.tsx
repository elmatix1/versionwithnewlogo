
import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialiser les icônes Leaflet
    initializeLeafletIcons();

    // Créer la carte
    map.current = createMap(mapContainer.current);

    // Ajouter la couche de tuiles
    addTileLayer(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || routes.length === 0) return;

    // Effacer les anciens marqueurs et routes
    clearMapLayers(map.current);

    const colors = getRouteColors();
    const allCoordinates: L.LatLngExpression[] = [];

    // Rendre chaque route sur la carte
    routes.forEach((route, index) => {
      const color = colors[index % colors.length];
      renderRouteOnMap(map.current!, route, color, allCoordinates);
    });

    // Ajuster la vue pour inclure toutes les routes
    fitMapToRoutes(map.current, allCoordinates);

    // Ajouter l'animation de pulsation
    const cleanup = addPulseAnimation();

    return cleanup;
  }, [routes]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-[500px] rounded-lg border shadow-sm" />
      {routes.length > 0 && <MapLegend routesCount={routes.length} />}
    </div>
  );
};

export default OptimizationResultsMap;
