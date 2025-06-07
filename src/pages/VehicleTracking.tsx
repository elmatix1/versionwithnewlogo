
import React from 'react';
import { useVehiclePositions } from '@/hooks/useVehiclePositions';
import RealTimeVehicleMap from '@/components/tracking/RealTimeVehicleMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Activity, Clock, Navigation } from 'lucide-react';
import { toast } from 'sonner';

const VehicleTracking: React.FC = () => {
  const { positions, loading, error, refreshPositions, simulateMovement } = useVehiclePositions();

  const handleSimulateMovement = async () => {
    await simulateMovement();
    toast.info("Simulation de mouvement", {
      description: "Nouvelles positions générées pour les véhicules actifs"
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Suivi GPS des Véhicules</h1>
          <p className="text-muted-foreground">Localisation en temps réel de votre flotte</p>
        </div>
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des positions GPS...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Suivi GPS des Véhicules</h1>
          <p className="text-muted-foreground">Localisation en temps réel de votre flotte</p>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-500 mb-2">⚠️ Erreur de connexion</div>
              <p className="text-red-700 mb-4">{error}</p>
              <Button onClick={refreshPositions} variant="outline">
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Statistiques en temps réel
  const activeVehicles = positions.filter(p => p.speed > 0).length;
  const stoppedVehicles = positions.filter(p => p.speed === 0).length;
  const averageSpeed = positions.length > 0 
    ? (positions.reduce((sum, p) => sum + p.speed, 0) / positions.length).toFixed(1)
    : '0';

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Suivi GPS des Véhicules</h1>
        <p className="text-muted-foreground">Localisation en temps réel de votre flotte</p>
      </div>

      {/* Statistiques en temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Véhicules surveillés</p>
                <p className="text-2xl font-bold">{positions.length}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">En mouvement</p>
                <p className="text-2xl font-bold text-green-600">{activeVehicles}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <Activity className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Arrêtés</p>
                <p className="text-2xl font-bold text-red-600">{stoppedVehicles}</p>
              </div>
              <div className="rounded-full bg-red-100 p-3 text-red-600">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Vitesse moyenne</p>
                <p className="text-2xl font-bold">{averageSpeed} km/h</p>
              </div>
              <div className="rounded-full bg-amber-100 p-3 text-amber-600">
                <Navigation className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carte principale */}
      <div className="mb-6">
        <RealTimeVehicleMap 
          positions={positions}
          onRefresh={refreshPositions}
        />
      </div>

      {/* Liste des véhicules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liste des Véhicules</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSimulateMovement}>
                Simuler Mouvement
              </Button>
              <Button variant="outline" size="sm" onClick={refreshPositions}>
                Actualiser
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {positions.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun véhicule avec position GPS disponible</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {positions.map((position) => (
                <div key={position.vehicle_id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">🚛</div>
                    <div>
                      <h4 className="font-semibold">{position.vehicle_id}</h4>
                      <p className="text-sm text-muted-foreground">
                        {position.latitude.toFixed(6)}, {position.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{position.speed.toFixed(1)} km/h</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(position.timestamp).toLocaleTimeString('fr-FR')}
                      </p>
                    </div>
                    <Badge 
                      variant={position.speed > 30 ? "default" : position.speed > 0 ? "secondary" : "destructive"}
                    >
                      {position.speed > 30 ? 'En mouvement' : position.speed > 0 ? 'Ralenti' : 'Arrêté'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleTracking;
