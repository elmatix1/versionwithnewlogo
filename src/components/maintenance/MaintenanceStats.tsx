
import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface StatsData {
  name: string;
  completed: number;
  pending: number;
  inProgress: number;
}

const MaintenanceStats: React.FC = () => {
  // Données d'exemple pour les graphiques
  const monthlyData: StatsData[] = [
    { name: 'Jan', completed: 12, pending: 5, inProgress: 3 },
    { name: 'Fév', completed: 19, pending: 7, inProgress: 4 },
    { name: 'Mars', completed: 15, pending: 4, inProgress: 6 },
    { name: 'Avr', completed: 21, pending: 6, inProgress: 2 },
    { name: 'Mai', completed: 18, pending: 8, inProgress: 5 },
    { name: 'Juin', completed: 24, pending: 3, inProgress: 4 },
  ];
  
  const typeData = [
    { name: 'Réparation', value: 45 },
    { name: 'Inspection', value: 32 },
    { name: 'Service', value: 18 },
    { name: 'Autre', value: 5 },
  ];
  
  const costData = [
    { name: 'Pièces', value: 14500 },
    { name: 'Main d\'œuvre', value: 8200 },
    { name: 'Externe', value: 3700 },
  ];

  const chartConfig = {
    completed: {
      label: "Terminées",
      theme: {
        light: "hsl(143, 72%, 46%)",
        dark: "hsl(143, 72%, 46%)"
      }
    },
    pending: {
      label: "En attente",
      theme: {
        light: "hsl(45, 93%, 47%)",
        dark: "hsl(50, 100%, 60%)"
      }
    },
    inProgress: {
      label: "En cours",
      theme: {
        light: "hsl(209, 100%, 60%)",
        dark: "hsl(209, 100%, 60%)"
      }
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Activité de maintenance mensuelle</CardTitle>
          <CardDescription>
            Nombre d'interventions par statut sur les 6 derniers mois
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                  <Legend />
                  <Bar dataKey="completed" name="Terminées" fill="var(--color-completed)" />
                  <Bar dataKey="pending" name="En attente" fill="var(--color-pending)" />
                  <Bar dataKey="inProgress" name="En cours" fill="var(--color-inProgress)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance des équipes</CardTitle>
            <CardDescription>Temps moyen d'intervention par type</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Réparation mécanique</span>
                  <span className="text-sm text-muted-foreground">3.2 heures</span>
                </div>
                <div className="mt-1 h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Inspection technique</span>
                  <span className="text-sm text-muted-foreground">1.5 heures</span>
                </div>
                <div className="mt-1 h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Remplacement de pièces</span>
                  <span className="text-sm text-muted-foreground">4.7 heures</span>
                </div>
                <div className="mt-1 h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Entretien préventif</span>
                  <span className="text-sm text-muted-foreground">2.8 heures</span>
                </div>
                <div className="mt-1 h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coûts de maintenance</CardTitle>
            <CardDescription>Répartition des coûts par catégorie</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded bg-blue-500 mr-2"></div>
                  <span>Pièces détachées</span>
                </div>
                <div className="font-medium">14 500 €</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded bg-green-500 mr-2"></div>
                  <span>Main d'œuvre interne</span>
                </div>
                <div className="font-medium">8 200 €</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded bg-amber-500 mr-2"></div>
                  <span>Services externes</span>
                </div>
                <div className="font-medium">3 700 €</div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="font-medium">Total</div>
                <div className="font-bold">26 400 €</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaintenanceStats;
