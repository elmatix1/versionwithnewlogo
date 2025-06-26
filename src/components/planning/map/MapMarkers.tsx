
import L from 'leaflet';
import { OptimizedRoute } from '@/types/routeOptimization';

export const createStartMarker = (route: OptimizedRoute) => {
  return L.divIcon({
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
};

export const createEndMarker = () => {
  return L.divIcon({
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
};

export const createWaypointMarker = (color: string) => {
  return L.divIcon({
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
};

export const createStartPopupContent = (route: OptimizedRoute) => `
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
`;

export const createEndPopupContent = (route: OptimizedRoute) => `
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
`;

export const createRoutePopupContent = (route: OptimizedRoute, color: string) => `
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
`;

export const createWaypointPopupContent = (route: OptimizedRoute, waypointIndex: number) => `
  <div style="padding: 6px; text-align: center;">
    <strong>Point intermédiaire ${waypointIndex + 1}</strong><br>
    <small>Route ${route.origin} → ${route.destination}</small>
  </div>
`;
