
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes par défaut de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const InteractiveMapDemo: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const routePolyline = useRef<L.Polyline | null>(null);
  const movingMarker = useRef<L.Marker | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Coordonnées du trajet Casablanca → Marrakech (format tuple [lat, lng])
  const routeCoordinates: [number, number][] = [
    [33.5731, -7.5898], // Casablanca
    [33.5650, -7.5800], // Sortie Casablanca
    [33.4500, -7.4000], // Point intermédiaire 1
    [33.3000, -7.2000], // Point intermédiaire 2
    [32.2000, -6.8000], // Point intermédiaire 3
    [31.6295, -7.9811], // Marrakech
  ];

  const createTruckIcon = () => {
    return L.divIcon({
      className: 'custom-truck-marker',
      html: `
        <div style="
          background-color: #0ea5e9;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 3px 6px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
        ">
          <div style="font-size: 12px; line-height: 1;">🚛</div>
        </div>
        <style>
          @keyframes pulse {
            0% { box-shadow: 0 3px 6px rgba(0,0,0,0.4), 0 0 0 0 rgba(14, 165, 233, 0.7); }
            70% { box-shadow: 0 3px 6px rgba(0,0,0,0.4), 0 0 0 10px rgba(14, 165, 233, 0); }
            100% { box-shadow: 0 3px 6px rgba(0,0,0,0.4), 0 0 0 0 rgba(14, 165, 233, 0); }
          }
        </style>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialiser la carte
    map.current = L.map(mapContainer.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([32.5, -7.2], 7);

    // Ajouter la couche de tuiles avec un style plus moderne
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Ajouter les marqueurs de départ et d'arrivée
    const startIcon = L.divIcon({
      className: 'start-marker',
      html: '<div style="background: #10b981; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">Casablanca</div>',
      iconSize: [80, 24],
      iconAnchor: [40, 12],
    });

    const endIcon = L.divIcon({
      className: 'end-marker',
      html: '<div style="background: #ef4444; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">Marrakech</div>',
      iconSize: [80, 24],
      iconAnchor: [40, 12],
    });

    L.marker(routeCoordinates[0], { icon: startIcon }).addTo(map.current);
    L.marker(routeCoordinates[routeCoordinates.length - 1], { icon: endIcon }).addTo(map.current);

    // Créer la ligne de route
    routePolyline.current = L.polyline(routeCoordinates, {
      color: '#0ea5e9',
      weight: 4,
      opacity: 0.8,
      dashArray: '10, 10',
    }).addTo(map.current);

    // Créer le marqueur mobile
    movingMarker.current = L.marker(routeCoordinates[0], {
      icon: createTruckIcon(),
    }).addTo(map.current);

    // Animation du marqueur
    const animateMarker = () => {
      if (!movingMarker.current) return;

      const nextStep = (currentStep + 1) % routeCoordinates.length;
      const nextPosition = routeCoordinates[nextStep];

      movingMarker.current.setLatLng(nextPosition);
      setCurrentStep(nextStep);

      // Popup avec informations
      const progress = ((nextStep / (routeCoordinates.length - 1)) * 100).toFixed(0);
      movingMarker.current.bindPopup(`
        <div style="text-align: center; padding: 4px;">
          <strong>Transport en cours</strong><br/>
          Progression: ${progress}%<br/>
          <small>Livraison estimée: 2h 30min</small>
        </div>
      `).openPopup();
    };

    // Démarrer l'animation après un délai
    const interval = setInterval(animateMarker, 3000);

    return () => {
      clearInterval(interval);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [currentStep]);

  return (
    <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-2xl border border-primary/20">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h4 className="font-semibold text-sm text-gray-900 mb-1">Suivi en temps réel</h4>
        <p className="text-xs text-gray-600">Casablanca → Marrakech</p>
        <div className="flex items-center mt-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          <span className="text-xs text-green-600 font-medium">En cours de livraison</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMapDemo;
