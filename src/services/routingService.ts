
interface RouteCoordinate {
  lat: number;
  lng: number;
}

interface RouteResult {
  coordinates: [number, number][];
  distance: number;
  duration: number;
}

export class RoutingService {
  private static readonly OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';
  
  /**
   * Obtient une route réaliste entre deux points en utilisant OSRM
   */
  static async getRoute(
    startLat: number, 
    startLng: number, 
    endLat: number, 
    endLng: number
  ): Promise<RouteResult> {
    try {
      // Construire l'URL OSRM
      const url = `${this.OSRM_BASE_URL}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`OSRM API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.routes || data.routes.length === 0) {
        throw new Error('No route found');
      }
      
      const route = data.routes[0];
      const coordinates = route.geometry.coordinates.map(
        (coord: number[]) => [coord[1], coord[0]] as [number, number]
      );
      
      return {
        coordinates,
        distance: Math.round(route.distance / 1000), // Convert to km
        duration: Math.round(route.duration / 60)     // Convert to minutes
      };
      
    } catch (error) {
      console.warn('OSRM routing failed, using fallback:', error);
      return this.getFallbackRoute(startLat, startLng, endLat, endLng);
    }
  }
  
  /**
   * Route de fallback avec approximation plus réaliste
   */
  private static getFallbackRoute(
    startLat: number, 
    startLng: number, 
    endLat: number, 
    endLng: number
  ): RouteResult {
    const coordinates: [number, number][] = [];
    
    // Point de départ
    coordinates.push([startLat, startLng]);
    
    // Calculer des points intermédiaires qui suivent approximativement les routes
    const latDiff = endLat - startLat;
    const lngDiff = endLng - startLng;
    const distance = this.calculateDistance(startLat, startLng, endLat, endLng);
    
    // Nombre de segments basé sur la distance
    const segments = Math.max(3, Math.min(8, Math.floor(distance / 50)));
    
    for (let i = 1; i < segments; i++) {
      const ratio = i / segments;
      let lat = startLat + (latDiff * ratio);
      let lng = startLng + (lngDiff * ratio);
      
      // Ajouter une variation pour simuler les courbes des routes
      const variation = 0.02 * Math.sin(ratio * Math.PI * 2);
      
      // Ajuster selon la géographie marocaine
      if (Math.abs(latDiff) > Math.abs(lngDiff)) {
        // Route plutôt nord-sud
        lng += variation;
      } else {
        // Route plutôt est-ouest  
        lat += variation * 0.5;
      }
      
      coordinates.push([lat, lng]);
    }
    
    // Point d'arrivée
    coordinates.push([endLat, endLng]);
    
    // Calculer durée approximative
    const estimatedDuration = Math.round(distance * 0.8 + 20);
    
    return {
      coordinates,
      distance: Math.round(distance),
      duration: estimatedDuration
    };
  }
  
  /**
   * Calcule la distance entre deux points (formule de Haversine)
   */
  private static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}
