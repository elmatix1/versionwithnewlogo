
import L from 'leaflet';
import { OptimizedRoute } from '@/types/routeOptimization';
import {
  createStartMarker,
  createEndMarker,
  createWaypointMarker,
  createStartPopupContent,
  createEndPopupContent,
  createRoutePopupContent,
  createWaypointPopupContent
} from './MapMarkers';
import { createRoutePolyline } from './mapUtils';

export const renderRouteOnMap = (
  map: L.Map,
  route: OptimizedRoute,
  color: string,
  allCoordinates: L.LatLngExpression[]
) => {
  // Coordonnées de départ et d'arrivée
  const startCoord = route.coordinates[0];
  const endCoord = route.coordinates[route.coordinates.length - 1];

  // Marqueur de départ
  const startIcon = createStartMarker(route);
  L.marker([startCoord[0], startCoord[1]], { icon: startIcon })
    .addTo(map)
    .bindPopup(createStartPopupContent(route));

  // Marqueur d'arrivée
  const endIcon = createEndMarker();
  L.marker([endCoord[0], endCoord[1]], { icon: endIcon })
    .addTo(map)
    .bindPopup(createEndPopupContent(route));

  // Tracer la route optimisée
  const routeLine = createRoutePolyline(route.coordinates, color);
  routeLine.addTo(map);

  // Ajouter des marqueurs intermédiaires
  if (route.coordinates.length > 2) {
    route.coordinates.slice(1, -1).forEach((coord, waypointIndex) => {
      const waypointIcon = createWaypointMarker(color);
      L.marker([coord[0], coord[1]], { icon: waypointIcon })
        .addTo(map)
        .bindPopup(createWaypointPopupContent(route, waypointIndex));
    });
  }

  // Popup pour la ligne de route
  routeLine.bindPopup(createRoutePopupContent(route, color));

  // Collecter les coordonnées pour ajuster la vue
  allCoordinates.push(...route.coordinates.map(coord => [coord[0], coord[1]] as L.LatLngExpression));
};
