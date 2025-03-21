import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import MetricsCards from '@/components/reports/MetricsCards';
import VisualizationTabs from '@/components/reports/VisualizationTabs';
import PeriodicReports from '@/components/reports/PeriodicReports';
import CustomReports from '@/components/reports/CustomReports';
import ReportSchedule from '@/components/reports/ReportSchedule';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { FileDown, FileText, BarChart, PieChart, Calendar, Eye } from 'lucide-react';
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage';

interface Report {
  id: string;
  name: string;
  type: string;
  period: string;
  date: string;
  status: string;
}

const STORAGE_KEY = 'tms-reports';

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<string>("");
  const [reportPeriod, setReportPeriod] = useState<string>("");
  const [reports, setReports] = useState<Report[]>(() => 
    loadFromLocalStorage<Report[]>(STORAGE_KEY, [
      { id: "RPT-2023-001", name: "Bilan commercial", type: "commercial", period: "mois", date: "01/05/2023", status: "Disponible" },
      { id: "RPT-2023-002", name: "Activité logistique", type: "operationnel", period: "trimestre", date: "15/04/2023", status: "Disponible" },
      { id: "RPT-2023-003", name: "État financier", type: "financier", period: "annee", date: "31/03/2023", status: "Disponible" },
      { id: "RPT-2023-004", name: "Rapport mensuel RH", type: "rh", period: "mois", date: "01/05/2023", status: "Disponible" },
    ])
  );
  const [showAllReports, setShowAllReports] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [detailChartType, setDetailChartType] = useState("");
  const [configureScheduleDialog, setConfigureScheduleDialog] = useState(false);
  
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEY, reports);
  }, [reports]);
  
  const handleViewAllReports = () => {
    setShowAllReports(true);
    toast.info("Consultation des rapports", {
      description: "Affichage de tous les rapports disponibles."
    });
  };
  
  const handleDownloadReport = (reportName: string) => {
    try {
      const content = generateReportContent(reportName);
      
      const blob = new Blob([content], { type: 'application/pdf' });
      
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportName.replace(/\s+/g, '_')}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      toast.success("Téléchargement du rapport", {
        description: `Le rapport ${reportName} a été téléchargé.`
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur de téléchargement", {
        description: "Une erreur est survenue lors du téléchargement du rapport."
      });
    }
  };

  const generateReportContent = (reportName: string): string => {
    const header = `${reportName}\n\n`;
    const date = `Date de génération: ${new Date().toLocaleDateString('fr-FR')}\n\n`;
    
    let content = "Contenu du rapport:\n\n";
    
    if (reportName.includes("mensuel")) {
      content += "Statistiques mensuelles:\n";
      content += "- Nombre de livraisons: 245\n";
      content += "- Taux de ponctualité: 92%\n";
      content += "- Satisfaction client: 4.7/5\n";
    } else if (reportName.includes("trimestriel")) {
      content += "Statistiques trimestrielles:\n";
      content += "- Nombre de livraisons: 712\n";
      content += "- Performance moyenne: 89%\n";
      content += "- Rentabilité: +12.5%\n";
    } else if (reportName.includes("annuel")) {
      content += "Statistiques annuelles:\n";
      content += "- Chiffre d'affaires: 1,245,000 €\n";
      content += "- Croissance: 15%\n";
      content += "- Nouveaux clients: 87\n";
    }
    
    return header + date + content + "\nCe rapport est généré automatiquement à des fins de démonstration.";
  };
  
  const handleCreateReport = () => {
    if (!reportType || !reportPeriod) {
      toast.error("Formulaire incomplet", {
        description: "Veuillez sélectionner un type et une période."
      });
      return;
    }
    
    const newReport: Report = {
      id: `RPT-${new Date().getFullYear()}-${String(reports.length + 1).padStart(3, '0')}`,
      name: `Rapport ${reportType} - ${reportPeriod}`,
      type: reportType,
      period: reportPeriod,
      date: new Date().toLocaleDateString('fr-FR'),
      status: "Disponible"
    };
    
    setReports(prev => [...prev, newReport]);
    
    toast.success("Rapport créé", {
      description: `Votre rapport ${reportType} pour la période ${reportPeriod} a été généré.`
    });
    
    setReportType("");
    setReportPeriod("");
  };
  
  const handleConfigureSchedule = () => {
    setConfigureScheduleDialog(false);
    toast.success("Configuration enregistrée", {
      description: "La planification des rapports a été configurée."
    });
  };
  
  const handleViewDetail = (chartType: string) => {
    setDetailChartType(chartType);
    setShowDetailDialog(true);
    toast.info(`Détails - ${chartType}`, {
      description: `Visualisation détaillée des données de ${chartType}.`
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Rapports et statistiques</h1>
        <p className="text-muted-foreground">Analyse et visualisation des données commerciales</p>
      </div>

      <MetricsCards />
      
      <VisualizationTabs 
        handleViewDetail={handleViewDetail}
        handleCreateReport={handleCreateReport}
        reportType={reportType}
        setReportType={setReportType}
        reportPeriod={reportPeriod}
        setReportPeriod={setReportPeriod}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PeriodicReports 
          handleDownloadReport={handleDownloadReport}
          handleViewAllReports={handleViewAllReports}
        />
        
        <CustomReports
          handleCreateReport={handleCreateReport}
          reportType={reportType}
          setReportType={setReportType}
          reportPeriod={reportPeriod}
          setReportPeriod={setReportPeriod}
        />
        
        <ReportSchedule
          handleConfigureSchedule={() => setConfigureScheduleDialog(true)}
        />
      </div>
      
      <Dialog open={showAllReports} onOpenChange={setShowAllReports}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Tous les rapports disponibles</DialogTitle>
            <DialogDescription>
              Consultez, téléchargez ou archivez vos rapports.
            </DialogDescription>
          </DialogHeader>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{report.period}</TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>{report.status}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleDownloadReport(report.name)}
                          title="Télécharger"
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => {
                            toast.info("Visualisation du rapport", {
                              description: `Affichage du rapport ${report.name}`
                            });
                          }}
                          title="Consulter"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Détails - {detailChartType}</DialogTitle>
            <DialogDescription>
              Analyse détaillée des données.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6">
            {detailChartType === "Évolution du chiffre d'affaires" && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Évolution du chiffre d'affaires</CardTitle>
                    <CardDescription>Analyse mensuelle sur l'année en cours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center items-center h-60 bg-muted/20 rounded-md">
                      <BarChart className="h-24 w-24 text-muted-foreground" />
                      <p className="ml-4 text-muted-foreground">
                        Graphique détaillé de l'évolution du chiffre d'affaires
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Analyse par secteur</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center items-center h-40 bg-muted/20 rounded-md">
                        <PieChart className="h-16 w-16 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Comparaison annuelle</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center items-center h-40 bg-muted/20 rounded-md">
                        <BarChart className="h-16 w-16 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Button
                  onClick={() => {
                    setShowDetailDialog(false);
                    const reportName = "Analyse chiffre d'affaires";
                    handleDownloadReport(reportName);
                  }}
                  className="w-full"
                >
                  Télécharger le rapport complet
                </Button>
              </div>
            )}
            
            {detailChartType === "Répartition des commandes" && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Répartition des commandes</CardTitle>
                    <CardDescription>Analyse par type et statut</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center items-center h-60 bg-muted/20 rounded-md">
                      <PieChart className="h-24 w-24 text-muted-foreground" />
                      <p className="ml-4 text-muted-foreground">
                        Graphique détaillé de la répartition des commandes
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Analyse par client</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center items-center h-40 bg-muted/20 rounded-md">
                        <BarChart className="h-16 w-16 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Performance mensuelle</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center items-center h-40 bg-muted/20 rounded-md">
                        <BarChart className="h-16 w-16 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Button
                  onClick={() => {
                    setShowDetailDialog(false);
                    const reportName = "Analyse des commandes";
                    handleDownloadReport(reportName);
                  }}
                  className="w-full"
                >
                  Télécharger le rapport complet
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={configureScheduleDialog} onOpenChange={setConfigureScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurer la planification</DialogTitle>
            <DialogDescription>
              Définissez la fréquence et les destinataires des rapports automatiques.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center p-4 rounded-md border bg-muted/20">
              <Calendar className="h-10 w-10 text-blue-500 mr-4" />
              <div>
                <h3 className="font-medium">Planification configurée</h3>
                <p className="text-sm text-muted-foreground">
                  Rapports commerciaux envoyés automatiquement chaque lundi à 9h.
                </p>
              </div>
            </div>
            
            <div className="flex items-center p-4 rounded-md border bg-muted/20">
              <FileText className="h-10 w-10 text-amber-500 mr-4" />
              <div>
                <h3 className="font-medium">Destinataires configurés</h3>
                <p className="text-sm text-muted-foreground">
                  Directeur commercial, Responsable logistique, Comité de direction.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleConfigureSchedule}>
              Enregistrer la configuration
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;

