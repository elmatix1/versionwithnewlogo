
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
  const map = L.map(container, {
    preferCanvas: true, // Utiliser Canvas pour de meilleures performances
    zoomControl: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    boxZoom: true,
    keyboard: true,
    dragging: true,
    zoomAnimation: true,
    fadeAnimation: true,
    markerZoomAnimation: true
  }).setView([31.7917, -7.0926], 6);

  // Optimiser les performances de zoom
  map.on('zoomstart', () => {
    map.getContainer().style.cursor = 'wait';
  });
  
  map.on('zoomend', () => {
    map.getContainer().style.cursor = '';
  });

  return map;
};

export const addTileLayer = (map: L.Map) => {
  return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
    minZoom: 4,
    tileSize: 256,
    zoomOffset: 0,
    updateWhenIdle: true, // Améliore les performances
    keepBuffer: 2, // Réduit le buffer pour économiser la mémoire
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
  return [
    '#3b82f6', // Bleu primaire cohérent avec l'application
    '#10b981', // Vert emeraude
    '#f59e0b', // Ambre
    '#ef4444', // Rouge
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#84cc16'  // Lime
  ];
};

export const createRoutePolyline = (coordinates: [number, number][], color: string) => {
  return L.polyline(
    coordinates.map(coord => [coord[0], coord[1]] as L.LatLngExpression),
    {
      color: color,
      weight: 4,
      opacity: 0.9,
      smoothFactor: 1.5, // Améliore les performances de rendu
      lineCap: 'round',
      lineJoin: 'round',
      className: 'route-line', // Classe CSS pour styling additionnel
      // Retirer le dashArray pour de meilleures performances
    }
  );
};

export const fitMapToRoutes = (map: L.Map, allCoordinates: L.LatLngExpression[]) => {
  if (allCoordinates.length > 0) {
    try {
      const group = new L.FeatureGroup([L.polyline(allCoordinates)]);
      const bounds = group.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.1), {
          animate: true,
          duration: 1,
          maxZoom: 14 // Limiter le zoom maximum
        });
      }
    } catch (error) {
      console.warn('Erreur lors de l\'ajustement de la vue:', error);
    }
  }
};

export const addPulseAnimation = () => {
  const existingStyle = document.getElementById('route-optimization-styles');
  if (existingStyle) {
    return () => {}; // Éviter les doublons
  }

  const style = document.createElement('style');
  style.id = 'route-optimization-styles';
  style.textContent = `
    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.9; }
      50% { transform: scale(1.2); opacity: 0.6; }
      100% { transform: scale(1); opacity: 0.9; }
    }
    
    .route-line {
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
      transition: opacity 0.3s ease;
    }
    
    .route-line:hover {
      opacity: 1 !important;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
    }
    
    .leaflet-container {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }
  `;
  document.head.appendChild(style);
  
  return () => {
    const styleElement = document.getElementById('route-optimization-styles');
    if (styleElement && document.head.contains(styleElement)) {
      document.head.removeChild(styleElement);
    }
  };
};

