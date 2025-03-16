
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { FileText } from 'lucide-react';
import ReportDialog from './ReportDialog';
import { toast } from 'sonner';
import { format } from 'date-fns';

const ReportCard: React.FC = () => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportPeriod, setReportPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [reportStartDate, setReportStartDate] = useState<Date>(new Date());
  const [reportEndDate, setReportEndDate] = useState<Date>(new Date());

  const handleGenerateReport = () => {
    toast.success("Rapport de présence généré avec succès", {
      description: `Période: ${format(reportStartDate, 'dd/MM/yyyy')} - ${format(reportEndDate, 'dd/MM/yyyy')}`
    });
    setIsReportDialogOpen(false);
  };

  const setPeriod = (period: 'day' | 'week' | 'month') => {
    setReportPeriod(period);
    
    const now = new Date();
    setReportStartDate(now);
    
    const end = new Date(now);
    if (period === 'week') {
      end.setDate(end.getDate() + 7);
    } else if (period === 'month') {
      end.setMonth(end.getMonth() + 1);
    }
    setReportEndDate(end);
  };

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Rapports et statistiques</CardTitle>
        <ReportDialog
          open={isReportDialogOpen}
          onOpenChange={setIsReportDialogOpen}
          reportPeriod={reportPeriod}
          setPeriod={setPeriod}
          reportStartDate={reportStartDate}
          setReportStartDate={setReportStartDate}
          reportEndDate={reportEndDate}
          setReportEndDate={setReportEndDate}
          onGenerateReport={handleGenerateReport}
        >
          <Button size="sm" className="h-8">
            <FileText className="mr-2 h-4 w-4" />
            Générer un rapport
          </Button>
        </ReportDialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Taux de présence</h3>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '83%' }}></div>
                </div>
                <span className="text-sm">83%</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Taux de ponctualité</h3>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '91%' }}></div>
                </div>
                <span className="text-sm">91%</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <h3 className="text-sm font-medium mb-3">Derniers rapports</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between border rounded-md p-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Rapport de juillet 2023</span>
                </div>
                <Button variant="ghost" size="sm">Télécharger</Button>
              </div>
              <div className="flex items-center justify-between border rounded-md p-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Rapport de juin 2023</span>
                </div>
                <Button variant="ghost" size="sm">Télécharger</Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
