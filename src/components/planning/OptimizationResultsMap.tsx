
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

    // Initialiser la carte centrée sur le Maroc
    map.current = L.map(mapContainer.current).setView([31.7917, -7.0926], 6);

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

    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];
    const allCoordinates: L.LatLngExpression[] = [];

    routes.forEach((route, index) => {
      const color = colors[index % colors.length];
      
      // Coordonnées de départ et d'arrivée
      const startCoord = route.coordinates[0];
      const endCoord = route.coordinates[route.coordinates.length - 1];

      // Marqueur de départ avec icône personnalisée
      const startIcon = L.divIcon({
        className: 'custom-marker-start',
        html: `
          <div style="
            background-color: ${color}; 
            width: 16px; 
            height: 16px; 
            border-radius: 50%; 
            border: 3px solid white; 
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            position: relative;
          ">
            <div style="
              position: absolute;
              top: -8px;
              left: -8px;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background-color: ${color}20;
              animation: pulse 2s infinite;
            "></div>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      L.marker([startCoord[0], startCoord[1]], { icon: startIcon })
        .addTo(map.current!)
        .bindPopup(`
          <div style="padding: 8px; min-width: 220px;">
            <h4 style="margin: 0 0 8px 0; color: ${color}; font-weight: bold; font-size: 16px;">
              🚚 ${route.origin}
            </h4>
            <div style="margin: 4px 0; font-size: 13px;">
              <strong>Véhicule:</strong> ${route.vehicle}
            </div>
            <div style="margin: 4px 0; font-size: 13px;">
              <strong>Chauffeur:</strong> ${route.driver}
            </div>
            <div style="margin: 4px 0; font-size: 13px;">
              <strong>Destination:</strong> ${route.destination}
            </div>
          </div>
        `);

      // Marqueur d'arrivée avec icône différente
      const endIcon = L.divIcon({
        className: 'custom-marker-end',
        html: `
          <div style="
            background-color: ${color}; 
            width: 16px; 
            height: 16px; 
            border-radius: 2px; 
            border: 3px solid white; 
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            transform: rotate(45deg);
          "></div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      L.marker([endCoord[0], endCoord[1]], { icon: endIcon })
        .addTo(map.current!)
        .bindPopup(`
          <div style="padding: 8px; min-width: 220px;">
            <h4 style="margin: 0 0 8px 0; color: ${color}; font-weight: bold; font-size: 16px;">
              🏁 ${route.destination}
            </h4>
            <div style="margin: 4px 0; font-size: 13px; color: #10b981;">
              <strong>Distance:</strong> ${route.distance} km
            </div>
            <div style="margin: 4px 0; font-size: 13px; color: #f59e0b;">
              <strong>Temps original:</strong> ${route.originalDuration} min
            </div>
            <div style="margin: 4px 0; font-size: 13px; color: #10b981;">
              <strong>Temps optimisé:</strong> ${route.optimizedDuration} min
            </div>
            <div style="margin: 8px 0 4px 0; padding: 4px 8px; background-color: #10b981; color: white; border-radius: 4px; text-align: center; font-weight: bold;">
              Économie: ${route.timeSaved} minutes
            </div>
          </div>
        `);

      // Tracer la route optimisée avec style amélioré
      const routeLine = L.polyline(
        route.coordinates.map(coord => [coord[0], coord[1]] as L.LatLngExpression),
        {
          color: color,
          weight: 4,
          opacity: 0.8,
          dashArray: '8, 4',
          lineCap: 'round',
          lineJoin: 'round'
        }
      ).addTo(map.current!);

      // Ajouter des marqueurs intermédiaires pour les points clés
      if (route.coordinates.length > 2) {
        route.coordinates.slice(1, -1).forEach((coord, waypointIndex) => {
          const waypointIcon = L.divIcon({
            className: 'waypoint-marker',
            html: `
              <div style="
                background-color: white; 
                width: 8px; 
                height: 8px; 
                border-radius: 50%; 
                border: 2px solid ${color}; 
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
              "></div>
            `,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          });

          L.marker([coord[0], coord[1]], { icon: waypointIcon })
            .addTo(map.current!);
        });
      }

      routeLine.bindPopup(`
        <div style="padding: 10px; min-width: 250px;">
          <h4 style="margin: 0 0 8px 0; color: ${color}; font-weight: bold;">
            📍 Trajet Optimisé
          </h4>
          <div style="margin: 6px 0; font-size: 14px;">
            <strong>${route.origin}</strong> → <strong>${route.destination}</strong>
          </div>
          <div style="background-color: #f8f9fa; padding: 8px; border-radius: 6px; margin: 8px 0;">
            <div style="display: flex; justify-content: space-between; margin: 2px 0;">
              <span>Distance:</span>
              <strong>${route.distance} km</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 2px 0;">
              <span>Temps original:</span>
              <span>${route.originalDuration} min</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 2px 0;">
              <span>Temps optimisé:</span>
              <span style="color: #10b981; font-weight: bold;">${route.optimizedDuration} min</span>
            </div>
          </div>
          <div style="text-align: center; padding: 6px; background-color: #10b981; color: white; border-radius: 4px; font-weight: bold;">
            ⚡ Économie: ${route.timeSaved} minutes
          </div>
        </div>
      `);

      // Collecter toutes les coordonnées pour ajuster la vue
      allCoordinates.push(...route.coordinates.map(coord => [coord[0], coord[1]] as L.LatLngExpression));
    });

    // Ajuster la vue pour inclure toutes les routes avec padding
    if (allCoordinates.length > 0) {
      const group = new L.FeatureGroup(
        routes.map(route => L.polyline(route.coordinates.map(coord => [coord[0], coord[1]] as L.LatLngExpression)))
      );
      map.current.fitBounds(group.getBounds().pad(0.15));
    }

    // Ajouter les styles CSS pour l'animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.2); opacity: 0.4; }
        100% { transform: scale(1); opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [routes]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-[450px] rounded-lg border shadow-sm" />
      {routes.length > 0 && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3 z-[1000]">
          <div className="text-xs font-medium text-gray-700 mb-2">Légende:</div>
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
            <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
            <span>Départ</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
            <div className="w-3 h-3 bg-blue-500 border-2 border-white transform rotate-45"></div>
            <span>Arrivée</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <div className="w-6 h-0.5 bg-blue-500" style={{borderTop: '2px dashed'}}></div>
            <span>Route optimisée</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizationResultsMap;
