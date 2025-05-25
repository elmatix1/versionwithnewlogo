
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, Clock, Route, TrendingUp, X } from 'lucide-react';
import { OptimizationResult } from '@/hooks/useRouteOptimization';
import OptimizationResultsMap from './OptimizationResultsMap';

interface OptimizationResultsProps {
  result: OptimizationResult;
  onClose: () => void;
}

const OptimizationResults: React.FC<OptimizationResultsProps> = ({ result, onClose }) => {
  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">Résultats de l'optimisation</h3>
          <p className="text-sm text-muted-foreground">
            {result.routes.length} trajets optimisés avec succès
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Temps total économisé</p>
                <p className="text-2xl font-bold text-green-600">{result.totalTimeSaved} min</p>
              </div>
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Distance totale</p>
                <p className="text-2xl font-bold">{result.totalDistance} km</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                <Route className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Amélioration</p>
                <p className="text-2xl font-bold text-green-600">{result.optimizationPercentage}%</p>
              </div>
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Carte des trajets optimisés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Carte des trajets optimisés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OptimizationResultsMap routes={result.routes} />
        </CardContent>
      </Card>

      {/* Tableau détaillé des trajets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Détails des trajets optimisés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trajet</TableHead>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Chauffeur</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Temps original</TableHead>
                  <TableHead>Temps optimisé</TableHead>
                  <TableHead>Économie</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.routes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{route.origin} → {route.destination}</div>
                        <div className="text-sm text-muted-foreground">ID: {route.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>{route.vehicle}</TableCell>
                    <TableCell>{route.driver}</TableCell>
                    <TableCell>{route.distance} km</TableCell>
                    <TableCell>{route.originalDuration} min</TableCell>
                    <TableCell>{route.optimizedDuration} min</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500 text-white">
                        -{route.timeSaved} min
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizationResults;
