
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

interface PeriodicReportsProps {
  handleDownloadReport: (reportName: string) => void;
  handleViewAllReports: () => void;
}

const PeriodicReports: React.FC<PeriodicReportsProps> = ({
  handleDownloadReport,
  handleViewAllReports
}) => {
  // Fonction qui gère le téléchargement localement pour éviter la propagation
  const onDownload = (reportName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleDownloadReport(reportName);
  };

  return (
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
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => onDownload("Rapport mensuel - Juillet 2023", e)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-blue-500" />
              <span>Rapport trimestriel - Q2 2023</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => onDownload("Rapport trimestriel - Q2 2023", e)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-blue-500" />
              <span>Rapport annuel - 2022</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={(e) => onDownload("Rapport annuel - 2022", e)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <Button className="w-full mt-2" onClick={handleViewAllReports}>Voir tous les rapports</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PeriodicReports;
