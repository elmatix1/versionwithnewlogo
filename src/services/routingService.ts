
// Service de routage pour obtenir des trajets réalistes
export interface RoutePoint {
  lat: number;
  lng: number;
}

export interface DetailedRoute {
  coordinates: [number, number][];
  distance: number;
  duration: number;
  waypoints?: RoutePoint[];
}

class RoutingService {
  // Utiliser OSRM comme service de routage principal (gratuit)
  private async getRouteFromOSRM(start: [number, number], end: [number, number]): Promise<DetailedRoute | null> {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`OSRM API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates: [number, number][] = route.geometry.coordinates.map(
          (coord: [number, number]) => [coord[1], coord[0]] // Inverser lat/lng pour Leaflet
        );
        
        return {
          coordinates,
          distance: Math.round(route.distance / 1000), // Convertir en km
          duration: Math.round(route.duration / 60), // Convertir en minutes
        };
      }
      
      return null;
    } catch (error) {
      console.warn('Erreur OSRM:', error);
      return null;
    }
  }

  // Fallback: générer une route approximative mais réaliste
  private generateRealisticRoute(start: [number, number], end: [number, number]): DetailedRoute {
    const coordinates: [number, number][] = [start];
    
    const latDiff = end[0] - start[0];
    const lngDiff = end[1] - start[1];
    
    // Générer des points intermédiaires pour simuler une route réaliste
    const steps = Math.max(3, Math.floor(Math.abs(latDiff) + Math.abs(lngDiff)) * 10);
    
    for (let i = 1; i < steps; i++) {
      const ratio = i / steps;
      
      // Ajouter de la variation pour simuler les routes réelles
      const deviation = 0.02 * Math.sin(ratio * Math.PI * 3);
      
      let lat = start[0] + (latDiff * ratio);
      let lng = start[1] + (lngDiff * ratio);
      
      // Appliquer la déviation selon l'axe principal
      if (Math.abs(latDiff) > Math.abs(lngDiff)) {
        lng += deviation;
      } else {
        lat += deviation;
      }
      
      coordinates.push([lat, lng]);
    }
    
    coordinates.push(end);
    
    // Calculer distance approximative
    const directDistance = this.calculateHaversineDistance(start, end);
    const distance = Math.round(directDistance * 1.3); // Facteur route réelle
    const duration = Math.round(distance * 0.8 + 15); // Estimation temps de conduite
    
    return {
      coordinates,
      distance,
      duration,
    };
  }

  // Calcul distance Haversine
  private calculateHaversineDistance(coord1: [number, number], coord2: [number, number]): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Méthode principale pour obtenir une route détaillée
  async getDetailedRoute(start: [number, number], end: [number, number]): Promise<DetailedRoute> {
    console.log(`Calcul de route: [${start[0]}, ${start[1]}] → [${end[0]}, ${end[1]}]`);
    
    // Essayer d'abord OSRM
    const osrmRoute = await this.getRouteFromOSRM(start, end);
    if (osrmRoute) {
      console.log(`Route OSRM obtenue: ${osrmRoute.distance}km, ${osrmRoute.duration}min`);
      return osrmRoute;
    }
    
    // Fallback: route approximative
    console.log('Utilisation du fallback pour générer une route approximative');
    return this.generateRealisticRoute(start, end);
  }

  // Obtenir plusieurs routes en lot
  async getMultipleRoutes(routeRequests: Array<{start: [number, number], end: [number, number]}>): Promise<DetailedRoute[]> {
    const routes: DetailedRoute[] = [];
    
    // Traiter les routes par lots pour éviter de surcharger l'API
    for (const request of routeRequests) {
      const route = await this.getDetailedRoute(request.start, request.end);
      routes.push(route);
      
      // Petite pause entre les requêtes
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    return routes;
  }
}

// Export d'une instance unique
export const routingService = new RoutingService();
