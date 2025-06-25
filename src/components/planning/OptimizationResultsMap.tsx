
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

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];
    const allCoordinates: L.LatLngExpression[] = [];

    routes.forEach((route, index) => {
      const color = colors[index % colors.length];
      
      // Coordonnées de départ et d'arrivée
      const startCoord = route.coordinates[0];
      const endCoord = route.coordinates[route.coordinates.length - 1];

      // Marqueur de départ (bleu) avec icône distinctive
      const startIcon = L.divIcon({
        className: 'custom-marker-start',
        html: `
          <div style="
            background-color: #3b82f6; 
            width: 20px; 
            height: 20px; 
            border-radius: 50%; 
            border: 3px solid white; 
            box-shadow: 0 3px 8px rgba(0,0,0,0.4);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              color: white;
              font-size: 12px;
              font-weight: bold;
            ">🚚</div>
            <div style="
              position: absolute;
              top: -10px;
              left: -10px;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background-color: #3b82f620;
              animation: pulse 2s infinite;
            "></div>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      L.marker([startCoord[0], startCoord[1]], { icon: startIcon })
        .addTo(map.current!)
        .bindPopup(`
          <div style="padding: 10px; min-width: 250px;">
            <h4 style="margin: 0 0 8px 0; color: #3b82f6; font-weight: bold; font-size: 16px;">
              🚚 Départ: ${route.origin}
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
            <div style="margin: 8px 0 4px 0; padding: 6px 8px; background-color: #3b82f6; color: white; border-radius: 4px; text-align: center; font-weight: bold; font-size: 12px;">
              Distance totale: ${route.distance} km
            </div>
          </div>
        `);

      // Marqueur d'arrivée (vert) avec icône différente
      const endIcon = L.divIcon({
        className: 'custom-marker-end',
        html: `
          <div style="
            background-color: #10b981; 
            width: 20px; 
            height: 20px; 
            border-radius: 3px; 
            border: 3px solid white; 
            box-shadow: 0 3px 8px rgba(0,0,0,0.4);
            transform: rotate(45deg);
            position: relative;
          ">
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              color: white;
              font-size: 10px;
              font-weight: bold;
            ">🏁</div>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      L.marker([endCoord[0], endCoord[1]], { icon: endIcon })
        .addTo(map.current!)
        .bindPopup(`
          <div style="padding: 10px; min-width: 250px;">
            <h4 style="margin: 0 0 8px 0; color: #10b981; font-weight: bold; font-size: 16px;">
              🏁 Arrivée: ${route.destination}
            </h4>
            <div style="background-color: #f8f9fa; padding: 8px; border-radius: 6px; margin: 8px 0;">
              <div style="display: flex; justify-content: space-between; margin: 3px 0; font-size: 13px;">
                <span>Distance:</span>
                <strong style="color: #10b981;">${route.distance} km</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 3px 0; font-size: 13px;">
                <span>Temps original:</span>
                <span style="color: #f59e0b;">${route.originalDuration} min</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 3px 0; font-size: 13px;">
                <span>Temps optimisé:</span>
                <strong style="color: #10b981;">${route.optimizedDuration} min</strong>
              </div>
            </div>
            <div style="text-align: center; padding: 8px; background-color: #10b981; color: white; border-radius: 6px; font-weight: bold;">
              ⚡ Économie: ${route.timeSaved} minutes
            </div>
          </div>
        `);

      // Tracer la route optimisée avec style amélioré
      const routeLine = L.polyline(
        route.coordinates.map(coord => [coord[0], coord[1]] as L.LatLngExpression),
        {
          color: color,
          weight: 5,
          opacity: 0.8,
          dashArray: '10, 5',
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
                width: 10px; 
                height: 10px; 
                border-radius: 50%; 
                border: 2px solid ${color}; 
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              "></div>
            `,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
          });

          L.marker([coord[0], coord[1]], { icon: waypointIcon })
            .addTo(map.current!)
            .bindPopup(`
              <div style="padding: 6px; text-align: center;">
                <strong>Point intermédiaire ${waypointIndex + 1}</strong><br>
                <small>Route ${route.origin} → ${route.destination}</small>
              </div>
            `);
        });
      }

      routeLine.bindPopup(`
        <div style="padding: 12px; min-width: 280px;">
          <h4 style="margin: 0 0 10px 0; color: ${color}; font-weight: bold; font-size: 16px;">
            🛣️ Route Optimisée
          </h4>
          <div style="margin: 6px 0; font-size: 14px; text-align: center;">
            <strong>${route.origin}</strong> ➜ <strong>${route.destination}</strong>
          </div>
          <div style="background-color: #f8f9fa; padding: 10px; border-radius: 8px; margin: 10px 0;">
            <div style="display: flex; justify-content: space-between; margin: 4px 0; font-size: 14px;">
              <span>📏 Distance:</span>
              <strong>${route.distance} km</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 4px 0; font-size: 14px;">
              <span>⏱️ Temps original:</span>
              <span>${route.originalDuration} min</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 4px 0; font-size: 14px;">
              <span>🚀 Temps optimisé:</span>
              <span style="color: #10b981; font-weight: bold;">${route.optimizedDuration} min</span>
            </div>
          </div>
          <div style="text-align: center; padding: 8px; background-color: #10b981; color: white; border-radius: 6px; font-weight: bold; font-size: 14px;">
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
      map.current.fitBounds(group.getBounds().pad(0.1));
    }

    // Ajouter les styles CSS pour l'animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.3); opacity: 0.4; }
        100% { transform: scale(1); opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [routes]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-[500px] rounded-lg border shadow-sm" />
      {routes.length > 0 && (
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 z-[1000] border">
          <div className="text-sm font-semibold text-gray-800 mb-3">📍 Légende des Trajets</div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs text-gray-700">
              <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm flex items-center justify-center">
                <span className="text-white text-[8px]">🚚</span>
              </div>
              <span className="font-medium">Point de départ</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-700">
              <div className="w-4 h-4 bg-green-500 border-2 border-white shadow-sm transform rotate-45 flex items-center justify-center">
                <span className="text-white text-[8px] transform -rotate-45">🏁</span>
              </div>
              <span className="font-medium">Point d'arrivée</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-700">
              <div className="w-3 h-3 rounded-full bg-white border-2 border-blue-500"></div>
              <span className="font-medium">Points intermédiaires</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-700">
              <div className="w-8 h-0.5 bg-blue-500 rounded" style={{borderTop: '3px dashed #3b82f6', borderBottom: '2px solid #3b82f6'}}></div>
              <span className="font-medium">Route optimisée</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 font-medium">
              📊 {routes.length} trajet{routes.length > 1 ? 's' : ''} optimisé{routes.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizationResultsMap;
