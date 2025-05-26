
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Delivery, DeliveryStatus } from '@/hooks/useDeliveries';
import { MapPin } from 'lucide-react';

// Fix pour les icônes par défaut de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DeliveryMapProps {
  deliveries: Delivery[];
  className?: string;
}

const statusColors = {
  'planned': '#3b82f6',      // Bleu
  'in-progress': '#f59e0b',  // Ambre
  'completed': '#10b981',    // Vert
  'delayed': '#ef4444'       // Rouge
};

const statusLabels = {
  'planned': 'Planifiée',
  'in-progress': 'En cours',
  'completed': 'Terminée',
  'delayed': 'Retardée'
};

// Coordonnées des villes marocaines
const cityCoordinates: { [key: string]: [number, number] } = {
  'Casablanca': [33.5731, -7.5898],
  'Rabat': [34.0209, -6.8416],
  'Marrakech': [31.6295, -7.9811],
  'Fès': [34.0181, -5.0078],
  'Meknès': [33.8935, -5.5473],
  'Ifrane': [33.5228, -5.1106],
  'Agadir': [30.4278, -9.5981],
  'Tanger': [35.7595, -5.8340],
  'Tétouan': [35.5889, -5.3626],
  'Oujda': [34.6814, -1.9086],
  'Béni Mellal': [32.3372, -6.3498],
  'Laâyoune': [27.1253, -13.1625],
  'Kénitra': [34.2610, -6.5802],
  'Salé': [34.0531, -6.7985],
  'Témara': [33.9287, -6.9064],
  'Mohammedia': [33.6866, -7.3674],
  'El Jadida': [33.2316, -8.5007],
  'Khouribga': [32.8811, -6.9063],
  'Beni Mellal': [32.3372, -6.3498],
  'Nador': [35.1681, -2.9287],
  'Settat': [33.0014, -7.6161]
};

const getCoordinatesForCity = (cityName: string): [number, number] => {
  // Nettoyer le nom de la ville (enlever les accents et normaliser)
  const normalizedName = cityName.trim();
  
  // Chercher une correspondance exacte d'abord
  if (cityCoordinates[normalizedName]) {
    return cityCoordinates[normalizedName];
  }
  
  // Chercher une correspondance partielle (insensible à la casse)
  const matchingCity = Object.keys(cityCoordinates).find(city => 
    city.toLowerCase().includes(normalizedName.toLowerCase()) ||
    normalizedName.toLowerCase().includes(city.toLowerCase())
  );
  
  if (matchingCity) {
    return cityCoordinates[matchingCity];
  }
  
  // Coordonnées par défaut (Casablanca)
  console.warn(`Coordonnées non trouvées pour la ville: ${cityName}, utilisation de Casablanca par défaut`);
  return cityCoordinates['Casablanca'];
};

const createStatusIcon = (status: DeliveryStatus, isOrigin: boolean = true) => {
  const color = statusColors[status];
  const icon = isOrigin ? '📍' : '🎯';
  
  return L.divIcon({
    className: 'custom-delivery-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <div style="
          font-size: 12px;
          line-height: 1;
        ">${icon}</div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

const DeliveryMap: React.FC<DeliveryMapProps> = ({ deliveries, className }) => {
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
    if (!map.current || deliveries.length === 0) return;

    // Effacer les anciens marqueurs et lignes
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.current?.removeLayer(layer);
      }
    });

    const allCoordinates: L.LatLngExpression[] = [];

    deliveries.forEach((delivery) => {
      const originCoords = getCoordinatesForCity(delivery.origin);
      const destCoords = getCoordinatesForCity(delivery.destination);
      
      // Ajouter les coordonnées pour ajuster la vue
      allCoordinates.push([originCoords[0], originCoords[1]], [destCoords[0], destCoords[1]]);

      // Marqueur d'origine
      const originIcon = createStatusIcon(delivery.status, true);
      L.marker([originCoords[0], originCoords[1]], { icon: originIcon })
        .addTo(map.current!)
        .bindPopup(`
          <div style="padding: 10px; min-width: 250px;">
            <h4 style="margin: 0 0 8px 0; color: ${statusColors[delivery.status]}; font-weight: bold; font-size: 16px;">
              📍 Origine: ${delivery.origin}
            </h4>
            <div style="margin: 4px 0; font-size: 13px;">
              <strong>Mission:</strong> PLN-${delivery.id}
            </div>
            <div style="margin: 4px 0; font-size: 13px;">
              <strong>Date:</strong> ${delivery.date}
            </div>
            <div style="margin: 4px 0; font-size: 13px;">
              <strong>Heure:</strong> ${delivery.time}
            </div>
            <div style="margin: 4px 0; font-size: 13px;">
              <strong>Chauffeur:</strong> ${delivery.driver}
            </div>
            <div style="margin: 4px 0; font-size: 13px;">
              <strong>Véhicule:</strong> ${delivery.vehicle}
            </div>
            <div style="margin: 8px 0 4px 0; padding: 6px 8px; background-color: ${statusColors[delivery.status]}; color: white; border-radius: 4px; text-align: center; font-weight: bold; font-size: 12px;">
              ${statusLabels[delivery.status]}
            </div>
          </div>
        `);

      // Marqueur de destination
      const destIcon = createStatusIcon(delivery.status, false);
      L.marker([destCoords[0], destCoords[1]], { icon: destIcon })
        .addTo(map.current!)
        .bindPopup(`
          <div style="padding: 10px; min-width: 250px;">
            <h4 style="margin: 0 0 8px 0; color: ${statusColors[delivery.status]}; font-weight: bold; font-size: 16px;">
              🎯 Destination: ${delivery.destination}
            </h4>
            <div style="margin: 4px 0; font-size: 13px;">
              <strong>Mission:</strong> PLN-${delivery.id}
            </div>
            <div style="margin: 4px 0; font-size: 13px;">
              <strong>Depuis:</strong> ${delivery.origin}
            </div>
            <div style="margin: 4px 0; font-size: 13px;">
              <strong>Statut:</strong> ${statusLabels[delivery.status]}
            </div>
            ${delivery.notes ? `
              <div style="margin: 8px 0; padding: 6px; background-color: #f8f9fa; border-radius: 4px; font-size: 12px;">
                <strong>Notes:</strong> ${delivery.notes}
              </div>
            ` : ''}
          </div>
        `);

      // Ligne de trajet
      const routeLine = L.polyline(
        [[originCoords[0], originCoords[1]], [destCoords[0], destCoords[1]]],
        {
          color: statusColors[delivery.status],
          weight: 3,
          opacity: 0.7,
          dashArray: delivery.status === 'completed' ? '0' : '5, 10'
        }
      ).addTo(map.current!);

      routeLine.bindPopup(`
        <div style="padding: 8px; min-width: 200px; text-align: center;">
          <h4 style="margin: 0 0 6px 0; color: ${statusColors[delivery.status]}; font-weight: bold;">
            🛣️ Trajet PLN-${delivery.id}
          </h4>
          <p style="margin: 0; font-size: 14px;">
            <strong>${delivery.origin}</strong> ➜ <strong>${delivery.destination}</strong>
          </p>
          <div style="margin: 6px 0; padding: 4px 8px; background-color: ${statusColors[delivery.status]}; color: white; border-radius: 4px; font-size: 12px;">
            ${statusLabels[delivery.status]}
          </div>
        </div>
      `);
    });

    // Ajuster la vue pour inclure toutes les livraisons
    if (allCoordinates.length > 0) {
      const group = new L.FeatureGroup(
        deliveries.map(delivery => {
          const originCoords = getCoordinatesForCity(delivery.origin);
          const destCoords = getCoordinatesForCity(delivery.destination);
          return L.polyline([[originCoords[0], originCoords[1]], [destCoords[0], destCoords[1]]]);
        })
      );
      map.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [deliveries]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-[500px] rounded-lg border shadow-sm" />
      {deliveries.length > 0 && (
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 z-[1000] border">
          <div className="text-sm font-semibold text-gray-800 mb-3">📍 Légende des Livraisons</div>
          <div className="space-y-2">
            {Object.entries(statusColors).map(([status, color]) => {
              const count = deliveries.filter(d => d.status === status).length;
              if (count === 0) return null;
              
              return (
                <div key={status} className="flex items-center gap-3 text-xs text-gray-700">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    <span className="text-white text-[8px]">📍</span>
                  </div>
                  <span className="font-medium">{statusLabels[status as DeliveryStatus]} ({count})</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 font-medium">
              📊 {deliveries.length} livraison{deliveries.length > 1 ? 's' : ''} total{deliveries.length > 1 ? 'es' : 'e'}
            </div>
          </div>
        </div>
      )}
      {deliveries.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100/80 rounded-lg">
          <div className="text-center">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucune livraison à afficher sur la carte</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryMap;
