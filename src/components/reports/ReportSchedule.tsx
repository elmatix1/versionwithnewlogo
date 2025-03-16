
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { ReportDialog } from './ReportDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReportScheduleProps {
  handleConfigureSchedule: () => void;
}

const ReportSchedule: React.FC<ReportScheduleProps> = ({
  handleConfigureSchedule
}) => {
  return (
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
          <ReportDialog 
            title="Configuration du calendrier des rapports"
            description="Définissez la fréquence et les destinataires des rapports automatiques."
            typeLabel="Rapport"
            typeOptions={[
              { value: "ca-mensuel", label: "Chiffre d'affaires mensuel" },
              { value: "delais-livraison", label: "Délais de livraison" },
              { value: "performance-rh", label: "Performance RH" }
            ]}
            periodLabel="Fréquence"
            periodOptions={[
              { value: "quotidien", label: "Quotidienne" },
              { value: "hebdomadaire", label: "Hebdomadaire" },
              { value: "mensuel", label: "Mensuelle" },
              { value: "trimestriel", label: "Trimestrielle" }
            ]}
            buttonText="Configurer"
            onSubmit={handleConfigureSchedule}
            reportType=""
            setReportType={() => {}}
            reportPeriod=""
            setReportPeriod={() => {}}
            customFields={
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="schedule-recipients" className="text-right">
                  Destinataires
                </Label>
                <Input
                  id="schedule-recipients"
                  className="col-span-3"
                  placeholder="Adresses email séparées par des virgules"
                />
              </div>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportSchedule;
