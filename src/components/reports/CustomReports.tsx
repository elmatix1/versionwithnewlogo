
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { ReportDialog } from './ReportDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomReportsProps {
  handleCreateReport: () => void;
  reportType: string;
  setReportType: (type: string) => void;
  reportPeriod: string;
  setReportPeriod: (period: string) => void;
}

const CustomReports: React.FC<CustomReportsProps> = ({
  handleCreateReport,
  reportType,
  setReportType,
  reportPeriod,
  setReportPeriod
}) => {
  return (
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
          <ReportDialog 
            title="Créer un rapport personnalisé"
            description="Sélectionnez les critères pour votre rapport personnalisé."
            typeLabel="Catégorie"
            typeOptions={[
              { value: "commercial", label: "Commercial" },
              { value: "operationnel", label: "Opérationnel" },
              { value: "financier", label: "Financier" },
              { value: "rh", label: "Ressources humaines" }
            ]}
            periodLabel="Période"
            periodOptions={[
              { value: "jour", label: "Jour" },
              { value: "semaine", label: "Semaine" },
              { value: "mois", label: "Mois" },
              { value: "trimestre", label: "Trimestre" },
              { value: "annee", label: "Année" },
              { value: "personnalise", label: "Personnalisée" }
            ]}
            buttonText="Créer un rapport"
            onSubmit={handleCreateReport}
            reportType={reportType}
            setReportType={setReportType}
            reportPeriod={reportPeriod}
            setReportPeriod={setReportPeriod}
            customFields={
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="custom-title" className="text-right">
                  Titre
                </Label>
                <Input
                  id="custom-title"
                  className="col-span-3"
                  placeholder="Titre du rapport"
                />
              </div>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomReports;
