
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OptimizedRoute } from '@/hooks/useRouteOptimization';

// Fix pour les icônes par défaut de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface OptimizationResultsMapProps {
  routes: OptimizedRoute[];
  className?: string;
}

const OptimizationResultsMap: React.FC<OptimizationResultsMapProps> = ({ routes, className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialiser la carte
    map.current = L.map(mapContainer.current).setView([33.5731, -7.5898], 6);

    // Ajouter la couche de tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map.current);

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
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.current?.removeLayer(layer);
      }
    });

    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
    const allCoordinates: L.LatLngExpression[] = [];

    routes.forEach((route, index) => {
      const color = colors[index % colors.length];
      
      // Ajouter les marqueurs de départ et d'arrivée
      const startCoord = route.coordinates[0];
      const endCoord = route.coordinates[route.coordinates.length - 1];

      // Marqueur de départ
      const startIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      L.marker([startCoord[0], startCoord[1]], { icon: startIcon })
        .addTo(map.current!)
        .bindPopup(`
          <div style="padding: 4px;">
            <strong>Départ: ${route.origin}</strong><br>
            Véhicule: ${route.vehicle}<br>
            Chauffeur: ${route.driver}
          </div>
        `);

      // Marqueur d'arrivée
      const endIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 0; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      L.marker([endCoord[0], endCoord[1]], { icon: endIcon })
        .addTo(map.current!)
        .bindPopup(`
          <div style="padding: 4px;">
            <strong>Arrivée: ${route.destination}</strong><br>
            Distance: ${route.distance} km<br>
            Temps économisé: ${route.timeSaved} min
          </div>
        `);

      // Tracer la route
      const routeLine = L.polyline(
        route.coordinates.map(coord => [coord[0], coord[1]] as L.LatLngExpression),
        {
          color: color,
          weight: 3,
          opacity: 0.8,
          dashArray: '5, 5'
        }
      ).addTo(map.current!);

      routeLine.bindPopup(`
        <div style="padding: 8px;">
          <strong>Trajet Optimisé</strong><br>
          ${route.origin} → ${route.destination}<br>
          Temps économisé: <span style="color: #10b981; font-weight: bold;">${route.timeSaved} minutes</span><br>
          Distance: ${route.distance} km
        </div>
      `);

      // Collecter toutes les coordonnées pour ajuster la vue
      allCoordinates.push(...route.coordinates.map(coord => [coord[0], coord[1]] as L.LatLngExpression));
    });

    // Ajuster la vue pour inclure toutes les routes
    if (allCoordinates.length > 0) {
      const group = new L.FeatureGroup(
        routes.map(route => L.polyline(route.coordinates.map(coord => [coord[0], coord[1]] as L.LatLngExpression)))
      );
      map.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [routes]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-[400px] rounded-lg border" />
    </div>
  );
};

export default OptimizationResultsMap;
