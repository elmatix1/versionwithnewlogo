
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, TrendingUp, Truck, Users } from 'lucide-react';

const MetricsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chiffre d'affaires (mois)</p>
              <p className="text-2xl font-bold">142 580 €</p>
              <p className="text-xs text-green-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> +12,5% vs mois précédent
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3 text-green-600">
              <BarChart className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Commandes livrées</p>
              <p className="text-2xl font-bold">248</p>
              <p className="text-xs text-green-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> +8,3% vs mois précédent
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <Truck className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Nouveaux clients</p>
              <p className="text-2xl font-bold">18</p>
              <p className="text-xs text-amber-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> +2,1% vs mois précédent
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-3 text-purple-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;
