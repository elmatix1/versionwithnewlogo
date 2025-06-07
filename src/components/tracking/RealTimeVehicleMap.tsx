
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { VehiclePosition } from '@/hooks/useVehiclePositions';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, RefreshCw } from 'lucide-react';

// Fix pour les icônes par défaut de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RealTimeVehicleMapProps {
  positions: VehiclePosition[];
  onRefresh?: () => void;
  className?: string;
}

// Créer une icône personnalisée pour les véhicules
const createVehicleIcon = (speed: number) => {
  const color = speed > 30 ? '#10b981' : speed > 0 ? '#f59e0b' : '#ef4444';
  
  return L.divIcon({
    className: 'custom-vehicle-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        animation: pulse 2s infinite;
      ">
        <div style="
          font-size: 16px;
          line-height: 1;
        ">🚛</div>
      </div>
      <style>
        @keyframes pulse {
          0% { box-shadow: 0 2px 6px rgba(0,0,0,0.3), 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 2px 6px rgba(0,0,0,0.3), 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 2px 6px rgba(0,0,0,0.3), 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      </style>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

const RealTimeVehicleMap: React.FC<RealTimeVehicleMapProps> = ({ 
  positions, 
  onRefresh,
  className 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<{ [key: string]: L.Marker }>({});

  // Initialiser la carte
  const initializeMap = () => {
    if (!mapContainer.current || map.current) return;

    // Centrer sur Casablanca par défaut
    map.current = L.map(mapContainer.current).setView([33.5731, -7.5898], 11);

    // Ajouter la couche de tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Ajouter les contrôles de zoom
    map.current.zoomControl.setPosition('topright');
  };

  // Mettre à jour les marqueurs sur la carte
  const updateMarkers = () => {
    if (!map.current) return;

    // Supprimer les anciens marqueurs
    Object.values(markers.current).forEach(marker => {
      map.current?.removeLayer(marker);
    });
    markers.current = {};

    // Ajouter les nouveaux marqueurs
    positions.forEach(position => {
      const icon = createVehicleIcon(position.speed);
      
      const marker = L.marker([position.latitude, position.longitude], { icon })
        .addTo(map.current!)
        .bindPopup(`
          <div style="padding: 12px; min-width: 280px;">
            <h4 style="margin: 0 0 8px 0; color: #1f2937; font-weight: bold; font-size: 16px;">
              🚛 Véhicule ${position.vehicle_id}
            </h4>
            <div style="display: grid; gap: 6px; font-size: 13px;">
              <div><strong>📍 Position:</strong> ${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)}</div>
              <div><strong>⚡ Vitesse:</strong> ${position.speed.toFixed(1)} km/h</div>
              <div><strong>🧭 Direction:</strong> ${position.heading}°</div>
              <div><strong>🕒 Dernière mise à jour:</strong><br/>${new Date(position.timestamp).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'Africa/Casablanca'
              })}</div>
            </div>
            <div style="margin-top: 8px; text-align: center;">
              <span style="
                background-color: ${position.speed > 30 ? '#10b981' : position.speed > 0 ? '#f59e0b' : '#ef4444'};
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: bold;
              ">
                ${position.speed > 30 ? 'EN MOUVEMENT' : position.speed > 0 ? 'RALENTI' : 'ARRÊTÉ'}
              </span>
            </div>
          </div>
        `);

      markers.current[position.vehicle_id] = marker;
    });

    // Ajuster la vue pour inclure tous les marqueurs
    if (positions.length > 0) {
      const latLngs = positions.map(p => [p.latitude, p.longitude] as [number, number]);
      const bounds = L.latLngBounds(latLngs);
      map.current.fitBounds(bounds, { padding: [20, 20] });
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
    if (map.current && positions.length > 0) {
      updateMarkers();
    }
  }, [positions]);

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Suivi GPS en Temps Réel
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Positions des véhicules mises à jour automatiquement
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
              <span className="text-xs">En direct</span>
            </Badge>
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={mapContainer} className="w-full h-[500px] relative">
          {positions.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-100/80 z-[1000]">
              <div className="text-center">
                <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucune position GPS disponible</p>
              </div>
            </div>
          )}
        </div>
        
        {positions.length > 0 && (
          <div className="p-4 border-t bg-muted/50">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                📊 {positions.length} véhicule{positions.length > 1 ? 's' : ''} surveillé{positions.length > 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>En mouvement</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span>Ralenti</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Arrêté</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeVehicleMap;
