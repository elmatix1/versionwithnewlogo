
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart4, LineChart, PieChart, Truck } from 'lucide-react';
import { ReportDialog } from './ReportDialog';

interface VisualizationTabsProps {
  handleViewDetail: (chartType: string) => void;
  handleCreateReport: () => void;
  reportType: string;
  setReportType: (type: string) => void;
  reportPeriod: string;
  setReportPeriod: (period: string) => void;
}

const VisualizationTabs: React.FC<VisualizationTabsProps> = ({
  handleViewDetail,
  handleCreateReport,
  reportType,
  setReportType,
  reportPeriod,
  setReportPeriod
}) => {
  return (
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
                    <Button variant="outline" className="mt-4" onClick={() => handleViewDetail("Évolution du chiffre d'affaires")}>
                      Voir en détail
                    </Button>
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
                    <Button variant="outline" className="mt-4" onClick={() => handleViewDetail("Répartition des commandes")}>
                      Voir en détail
                    </Button>
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
              <ReportDialog 
                title="Générer un rapport financier"
                description="Sélectionnez les paramètres pour votre rapport financier."
                typeLabel="Type"
                typeOptions={[
                  { value: "ca-mensuel", label: "Chiffre d'affaires mensuel" },
                  { value: "marge-brute", label: "Marge brute" },
                  { value: "rentabilite", label: "Rentabilité par client" }
                ]}
                periodLabel="Période"
                periodOptions={[
                  { value: "mois-courant", label: "Mois courant" },
                  { value: "trimestre", label: "Trimestre en cours" },
                  { value: "annee", label: "Année complète" }
                ]}
                buttonText="Générer un rapport"
                onSubmit={handleCreateReport}
                reportType={reportType}
                setReportType={setReportType}
                reportPeriod={reportPeriod}
                setReportPeriod={setReportPeriod}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="operational" className="m-0">
            <div className="text-center p-8">
              <Truck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Rapports opérationnels</h3>
              <p className="text-muted-foreground mb-6">Analysez les performances opérationnelles, délais et qualité.</p>
              <ReportDialog 
                title="Générer un rapport opérationnel"
                description="Sélectionnez les paramètres pour votre rapport opérationnel."
                typeLabel="Type"
                typeOptions={[
                  { value: "delais-livraison", label: "Délais de livraison" },
                  { value: "perf-vehicules", label: "Performance des véhicules" },
                  { value: "taux-incidents", label: "Taux d'incidents" }
                ]}
                periodLabel="Période"
                periodOptions={[
                  { value: "semaine", label: "Semaine courante" },
                  { value: "mois-courant", label: "Mois courant" },
                  { value: "trimestre", label: "Trimestre en cours" }
                ]}
                buttonText="Générer un rapport"
                onSubmit={handleCreateReport}
                reportType={reportType}
                setReportType={setReportType}
                reportPeriod={reportPeriod}
                setReportPeriod={setReportPeriod}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VisualizationTabs;
