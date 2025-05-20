
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface FeatureCardsProps {
  onShowStats: () => void;
  onShowDocs: () => void;
}

const FeatureCards: React.FC<FeatureCardsProps> = ({ onShowStats, onShowDocs }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Indicateurs de performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <BarChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Statistiques de maintenance</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Analysez les temps d'intervention, coûts et performances de l'équipe maintenance.
            </p>
            <Button onClick={onShowStats}>Voir les statistiques</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentation technique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Fiches techniques</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Accédez aux manuels, procédures et documentation technique de tous vos véhicules.
            </p>
            <Button onClick={onShowDocs}>Consulter les documents</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureCards;
