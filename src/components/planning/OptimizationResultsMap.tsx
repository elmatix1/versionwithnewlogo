
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

      // Marqueur de départ avec animation
      const startIcon = L.divIcon({
        className: 'custom-marker-start',
        html: `
          <div style="
            background-color: #3b82f6; 
            width: 24px; 
            height: 24px; 
            border-radius: 50%; 
            border: 3px solid white; 
            box-shadow: 0 4px 12px rgba(59,130,246,0.4);
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
              top: -6px;
              left: -6px;
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background-color: rgba(59,130,246,0.2);
              animation: pulse 2s infinite;
            "></div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      L.marker([startCoord[0], startCoord[1]], { icon: startIcon })
        .addTo(map.current!)
        .bindPopup(`
          <div style="padding: 12px; min-width: 280px;">
            <h4 style="margin: 0 0 10px 0; color: #3b82f6; font-weight: bold; font-size: 18px;">
              🚚 Départ: ${route.origin}
            </h4>
            <div style="background-color: #f8fafc; padding: 12px; border-radius: 8px; margin: 8px 0;">
              <div style="margin: 6px 0; font-size: 14px;">
                <strong>🚛 Véhicule:</strong> ${route.vehicle}
              </div>
              <div style="margin: 6px 0; font-size: 14px;">
                <strong>👨‍✈️ Chauffeur:</strong> ${route.driver}
              </div>
              <div style="margin: 6px 0; font-size: 14px;">
                <strong>🎯 Destination:</strong> ${route.destination}
              </div>
            </div>
            <div style="text-align: center; padding: 10px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; border-radius: 8px; font-weight: bold; font-size: 14px;">
              📏 Distance totale: ${route.distance} km
            </div>
          </div>
        `);

      // Marqueur d'arrivée avec style distinct
      const endIcon = L.divIcon({
        className: 'custom-marker-end',
        html: `
          <div style="
            background: linear-gradient(135deg, #10b981, #059669);
            width: 24px; 
            height: 24px; 
            border-radius: 6px; 
            border: 3px solid white; 
            box-shadow: 0 4px 12px rgba(16,185,129,0.4);
            transform: rotate(45deg);
            position: relative;
          ">
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              color: white;
              font-size: 12px;
              font-weight: bold;
            ">🏁</div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      L.marker([endCoord[0], endCoord[1]], { icon: endIcon })
        .addTo(map.current!)
        .bindPopup(`
          <div style="padding: 12px; min-width: 300px;">
            <h4 style="margin: 0 0 10px 0; color: #10b981; font-weight: bold; font-size: 18px;">
              🏁 Arrivée: ${route.destination}
            </h4>
            <div style="background-color: #f0fdf4; padding: 12px; border-radius: 10px; margin: 10px 0; border: 2px solid #bbf7d0;">
              <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 14px;">
                <span><strong>📏 Distance:</strong></span>
                <span style="color: #059669; font-weight: bold;">${route.distance} km</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 14px;">
                <span><strong>⏰ Temps original:</strong></span>
                <span style="color: #dc2626;">${route.originalDuration} min</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 6px 0; font-size: 14px;">
                <span><strong>🚀 Temps optimisé:</strong></span>
                <span style="color: #10b981; font-weight: bold;">${route.optimizedDuration} min</span>
              </div>
            </div>
            <div style="text-align: center; padding: 12px; background: linear-gradient(135deg, #10b981, #059669); color: white; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(16,185,129,0.3);">
              ⚡ Économie: ${route.timeSaved} minutes
            </div>
          </div>
        `);

      // Tracer la route réelle avec style amélioré
      const routeLine = L.polyline(
        route.coordinates.map(coord => [coord[0], coord[1]] as L.LatLngExpression),
        {
          color: color,
          weight: 4,
          opacity: 0.8,
          lineCap: 'round',
          lineJoin: 'round'
        }
      ).addTo(map.current!);

      // Ajouter une ombre à la route pour plus de réalisme
      const shadowLine = L.polyline(
        route.coordinates.map(coord => [coord[0], coord[1]] as L.LatLngExpression),
        {
          color: '#000000',
          weight: 6,
          opacity: 0.1,
          lineCap: 'round',
          lineJoin: 'round',
          offset: 2
        }
      ).addTo(map.current!);

      // Popup pour la route avec informations détaillées
      routeLine.bindPopup(`
        <div style="padding: 15px; min-width: 320px;">
          <h4 style="margin: 0 0 12px 0; color: ${color}; font-weight: bold; font-size: 18px;">
            🛣️ Route Optimisée Réelle
          </h4>
          <div style="margin: 8px 0; font-size: 16px; text-align: center; background: linear-gradient(135deg, ${color}20, ${color}10); padding: 8px; border-radius: 8px;">
            <strong>${route.origin}</strong> 
            <span style="color: ${color}; font-size: 20px; margin: 0 8px;">➜</span> 
            <strong>${route.destination}</strong>
          </div>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 12px; margin: 12px 0; border: 2px solid ${color}20;">
            <div style="display: flex; justify-content: space-between; margin: 8px 0; font-size: 15px;">
              <span><strong>📏 Distance réelle:</strong></span>
              <span style="font-weight: bold; color: ${color};">${route.distance} km</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0; font-size: 15px;">
              <span><strong>⏱️ Temps original:</strong></span>
              <span style="color: #dc2626;">${route.originalDuration} min</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0; font-size: 15px;">
              <span><strong>🚀 Temps optimisé:</strong></span>
              <span style="color: #10b981; font-weight: bold;">${route.optimizedDuration} min</span>
            </div>
            <div style="margin-top: 12px; padding: 8px; background-color: #ecfdf5; border-radius: 6px; text-align: center;">
              <span style="font-size: 13px; color: #065f46;">
                📊 Points de route: ${route.coordinates.length} coordonnées
              </span>
            </div>
          </div>
          <div style="text-align: center; padding: 12px; background: linear-gradient(135deg, #10b981, #059669); color: white; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 6px 20px rgba(16,185,129,0.3);">
            ⚡ Économie totale: ${route.timeSaved} minutes
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
        50% { transform: scale(1.2); opacity: 0.4; }
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
          <div className="text-sm font-semibold text-gray-800 mb-3">🗺️ Routes Réelles Optimisées</div>
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
              <div className="w-8 h-1 bg-blue-500 rounded"></div>
              <span className="font-medium">Route réelle calculée</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 font-medium">
              ✅ {routes.length} trajet{routes.length > 1 ? 's' : ''} avec routes réelles
            </div>
            <div className="text-xs text-green-600 font-medium">
              🌍 Données OpenRouteService
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizationResultsMap;
