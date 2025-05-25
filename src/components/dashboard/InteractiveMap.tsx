
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

// Fix pour les icônes par défaut de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

const statusLabels = {
  delivering: "En livraison",
  active: "En service", 
  idle: "Disponible",
  maintenance: "En maintenance",
  inactive: "Hors service",
};

// Coordonnées simulées pour les véhicules au Maroc
const getVehicleCoordinates = (vehicleName: string, location?: string) => {
  const locations = {
    "Dépôt Central": [33.5731, -7.5898], // Casablanca
    "Route A7": [33.5928, -7.6167], // Route près de Casablanca
    "Garage Nord": [33.9716, -6.8498], // Rabat
    "Zone Industrielle": [33.5712, -7.6205], // Zone industrielle Casablanca
    "Port": [33.5992, -7.6006], // Port de Casablanca
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
  
  return [baseLat + latOffset, baseLng + lngOffset];
};

// Créer une icône personnalisée pour chaque statut
const createCustomIcon = (status: string) => {
  const color = statusColors[status] || statusColors.inactive;
  
  return L.divIcon({
    className: 'custom-vehicle-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <div style="
          font-size: 10px;
          line-height: 1;
        ">🚛</div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ vehicles = [], className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<L.Marker[]>([]);

  const initializeMap = () => {
    if (!mapContainer.current || map.current) return;

    // Initialiser la carte avec OpenStreetMap
    map.current = L.map(mapContainer.current).setView([33.5731, -7.5898], 10);

    // Ajouter la couche de tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Ajouter les contrôles de zoom
    map.current.zoomControl.setPosition('topright');
  };

  const updateMarkers = () => {
    if (!map.current) return;

    // Supprimer les anciens marqueurs
    markers.current.forEach(marker => map.current?.removeLayer(marker));
    markers.current = [];

    // Ajouter les nouveaux marqueurs
    vehicles.forEach(vehicle => {
      const coordinates = getVehicleCoordinates(vehicle.name, vehicle.location);
      const icon = createCustomIcon(vehicle.status);

      const marker = L.marker([coordinates[0], coordinates[1]], { icon })
        .addTo(map.current!)
        .bindPopup(`
          <div style="padding: 8px; min-width: 200px;">
            <h4 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">${vehicle.name}</h4>
            <p style="margin: 0; font-size: 12px; color: #666;">
              Statut: <span style="color: ${statusColors[vehicle.status]}; font-weight: bold;">
                ${statusLabels[vehicle.status] || 'Statut inconnu'}
              </span>
            </p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">
              Position: ${vehicle.location || 'Position inconnue'}
            </p>
          </div>
        `);

      markers.current.push(marker);
    });

    // Ajuster la vue pour inclure tous les marqueurs si il y en a
    if (markers.current.length > 0) {
      const group = new L.FeatureGroup(markers.current);
      map.current.fitBounds(group.getBounds().pad(0.1));
    }
  };

  useEffect(() => {
    initializeMap();
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (map.current && vehicles.length > 0) {
      updateMarkers();
    }
  }, [vehicles]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-[240px] rounded-lg z-0" />
      {vehicles.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100/80 dark:bg-zinc-800/80 rounded-lg">
          <div className="text-center">
            <MapPin className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Aucun véhicule à afficher</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
