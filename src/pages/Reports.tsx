
import React, { useState } from 'react';
import { toast } from "sonner";
import MetricsCards from '@/components/reports/MetricsCards';
import VisualizationTabs from '@/components/reports/VisualizationTabs';
import PeriodicReports from '@/components/reports/PeriodicReports';
import CustomReports from '@/components/reports/CustomReports';
import ReportSchedule from '@/components/reports/ReportSchedule';

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<string>("");
  const [reportPeriod, setReportPeriod] = useState<string>("");
  
  const handleViewAllReports = () => {
    toast.info("Consultation des rapports", {
      description: "Affichage de tous les rapports disponibles."
    });
  };
  
  const handleDownloadReport = (reportName: string) => {
    toast.success("Téléchargement du rapport", {
      description: `Le rapport ${reportName} a été téléchargé.`
    });
  };
  
  const handleCreateReport = () => {
    if (!reportType || !reportPeriod) {
      toast.error("Formulaire incomplet", {
        description: "Veuillez sélectionner un type et une période."
      });
      return;
    }
    
    toast.success("Rapport créé", {
      description: `Votre rapport ${reportType} pour la période ${reportPeriod} a été généré.`
    });
  };
  
  const handleConfigureSchedule = () => {
    toast.success("Configuration enregistrée", {
      description: "La planification des rapports a été configurée."
    });
  };
  
  const handleViewDetail = (chartType: string) => {
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
          handleConfigureSchedule={handleConfigureSchedule}
        />
      </div>
    </div>
  );
};

export default Reports;
