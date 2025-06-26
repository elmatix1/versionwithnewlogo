
import L from 'leaflet';

export const initializeLeafletIcons = () => {
  // Fix pour les icônes par défaut de Leaflet
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

export const createMap = (container: HTMLDivElement) => {
  return L.map(container).setView([31.7917, -7.0926], 6);
};

export const addTileLayer = (map: L.Map) => {
  return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);
};

export const clearMapLayers = (map: L.Map) => {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker || layer instanceof L.Polyline) {
      map.removeLayer(layer);
    }
  });
};

export const getRouteColors = () => {
  return ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];
};

export const createRoutePolyline = (coordinates: [number, number][], color: string) => {
  return L.polyline(
    coordinates.map(coord => [coord[0], coord[1]] as L.LatLngExpression),
    {
      color: color,
      weight: 5,
      opacity: 0.8,
      dashArray: '10, 5',
      lineCap: 'round',
      lineJoin: 'round'
    }
  );
};

export const fitMapToRoutes = (map: L.Map, allCoordinates: L.LatLngExpression[]) => {
  if (allCoordinates.length > 0) {
    const group = new L.FeatureGroup(
      [L.polyline(allCoordinates)]
    );
    map.fitBounds(group.getBounds().pad(0.1));
  }
};

export const addPulseAnimation = () => {
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
};
