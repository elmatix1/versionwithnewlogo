
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  FileText,
  Calendar,
  TrendingUp,
  Truck,
  Users,
  Download,
  BarChart4,
  LineChart,
  PieChart
} from 'lucide-react';

const Reports: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Rapports et statistiques</h1>
        <p className="text-muted-foreground">Analyse et visualisation des données commerciales</p>
      </div>

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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Visualisations avancées</CardTitle>
          <CardDescription>Accédez aux graphiques et tableaux de bord interactifs</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance">
            <TabsList className="mb-6">
              <TabsTrigger value="performance" className="flex items-center gap-1">
                <BarChart4 size={16} />
                <span>Performance</span>
              </TabsTrigger>
              <TabsTrigger value="financial" className="flex items-center gap-1">
                <LineChart size={16} />
                <span>Financier</span>
              </TabsTrigger>
              <TabsTrigger value="operational" className="flex items-center gap-1">
                <PieChart size={16} />
                <span>Opérationnel</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Évolution du chiffre d'affaires</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <BarChart4 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Graphique d'évolution du CA</p>
                      <Button variant="outline" className="mt-4">Voir en détail</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition des commandes</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Répartition par type de client</p>
                      <Button variant="outline" className="mt-4">Voir en détail</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="financial" className="m-0">
              <div className="text-center p-8">
                <LineChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Rapports financiers</h3>
                <p className="text-muted-foreground mb-6">Analysez les résultats financiers, marges et rentabilité.</p>
                <Button>Générer un rapport</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="operational" className="m-0">
              <div className="text-center p-8">
                <Truck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Rapports opérationnels</h3>
                <p className="text-muted-foreground mb-6">Analysez les performances opérationnelles, délais et qualité.</p>
                <Button>Générer un rapport</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rapports périodiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Rapport mensuel - Juillet 2023</span>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Rapport trimestriel - Q2 2023</span>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Rapport annuel - 2022</span>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <Button className="w-full mt-2">Voir tous les rapports</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rapports personnalisés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Créer un rapport</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Générez un rapport personnalisé en sélectionnant les données et la période qui vous intéressent.
              </p>
              <Button>Créer un rapport</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Calendrier des rapports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Planifier des rapports</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Planifiez la génération et l'envoi automatique de rapports à vos équipes.
              </p>
              <Button>Configurer</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
