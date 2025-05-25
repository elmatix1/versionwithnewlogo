
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  status: 'delivering' | 'idle' | 'maintenance' | 'active' | 'inactive';
  location?: string;
}

interface InteractiveMapProps {
  vehicles: Vehicle[];
  className?: string;
}

const statusColors = {
  delivering: "#10b981",
  active: "#10b981", 
  idle: "#3b82f6",
  maintenance: "#f59e0b",
  inactive: "#6b7280",
};

// Coordonnées simulées pour les véhicules au Maroc
const getVehicleCoordinates = (vehicleName: string, location?: string) => {
  const locations = {
    "Dépôt Central": [-7.5898, 33.5731], // Casablanca
    "Route A7": [-7.6167, 33.5928], // Route près de Casablanca
    "Garage Nord": [-6.8498, 33.9716], // Rabat
    "Zone Industrielle": [-7.6205, 33.5712], // Zone industrielle Casablanca
    "Port": [-7.6006, 33.5992], // Port de Casablanca
  };

  if (location && locations[location]) {
    return locations[location];
  }

  // Positions par défaut basées sur l'ID du véhicule pour la cohérence
  const hash = vehicleName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Coordonnées autour du Maroc
  const baseLat = 33.5731;
  const baseLng = -7.5898;
  const latOffset = (hash % 200 - 100) / 1000; // ±0.1 degrés
  const lngOffset = ((hash * 13) % 200 - 100) / 1000; // ±0.1 degrés
  
  return [baseLng + lngOffset, baseLat + latOffset];
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ vehicles = [], className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-7.5898, 33.5731], // Casablanca, Maroc
      zoom: 10,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    setIsTokenSet(true);
  };

  const updateMarkers = () => {
    if (!map.current) return;

    // Supprimer les anciens marqueurs
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Ajouter les nouveaux marqueurs
    vehicles.forEach(vehicle => {
      const coordinates = getVehicleCoordinates(vehicle.name, vehicle.location);
      const color = statusColors[vehicle.status] || statusColors.inactive;

      // Créer l'élément du marqueur
      const el = document.createElement('div');
      el.className = 'vehicle-marker';
      el.style.cssText = `
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
        position: relative;
      `;

      // Ajouter une icône de camion
      const icon = document.createElement('div');
      icon.innerHTML = '🚛';
      icon.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 10px;
        line-height: 1;
      `;
      el.appendChild(icon);

      const marker = new mapboxgl.Marker(el)
        .setLngLat(coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 8px;">
                <h4 style="margin: 0 0 4px 0; font-weight: bold;">${vehicle.name}</h4>
                <p style="margin: 0; font-size: 12px; color: #666;">
                  Statut: <span style="color: ${color}; font-weight: bold;">
                    ${vehicle.status === 'active' ? 'En service' : 
                      vehicle.status === 'maintenance' ? 'En maintenance' : 
                      vehicle.status === 'idle' ? 'Disponible' : 
                      vehicle.status === 'delivering' ? 'En livraison' : 'Hors service'}
                  </span>
                </p>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">
                  Position: ${vehicle.location || 'Position inconnue'}
                </p>
              </div>
            `)
        )
        .addTo(map.current);

      markers.current.push(marker);
    });
  };

  useEffect(() => {
    if (isTokenSet && vehicles.length > 0) {
      updateMarkers();
    }
  }, [vehicles, isTokenSet]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      initializeMap();
      setShowTokenInput(false);
    }
  };

  if (!isTokenSet) {
    return (
      <div className={`relative bg-zinc-100 dark:bg-zinc-800 h-[240px] flex items-center justify-center ${className}`}>
        {!showTokenInput ? (
          <div className="text-center">
            <MapPin className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground mb-4">Carte interactive disponible</p>
            <Button onClick={() => setShowTokenInput(true)} size="sm">
              Configurer la carte
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4 p-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Entrez votre token Mapbox public
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Obtenez votre token sur{' '}
                <a 
                  href="https://mapbox.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  mapbox.com
                </a>
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleTokenSubmit} size="sm">
                OK
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowTokenInput(false)}
            >
              Annuler
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-[240px] rounded-lg" />
    </div>
  );
};

export default InteractiveMap;
