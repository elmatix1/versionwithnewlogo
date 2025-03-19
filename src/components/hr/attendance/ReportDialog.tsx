
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { AttendanceReport } from "./types";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateReport: (type: string, startDate: Date, endDate: Date) => AttendanceReport;
  children?: React.ReactNode;
}

const ReportDialog: React.FC<ReportDialogProps> = ({
  open,
  onOpenChange,
  onGenerateReport,
  children
}) => {
  const [reportType, setReportType] = useState("daily");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [report, setReport] = useState<AttendanceReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const generatedReport = onGenerateReport(reportType, startDate, endDate);
        setReport(generatedReport);
        toast.success("Rapport généré avec succès");
      } catch (error) {
        toast.error("Erreur lors de la génération du rapport");
      } finally {
        setIsGenerating(false);
      }
    }, 1000);
  };

  const handleDownloadReport = () => {
    if (!report) return;
    
    setIsDownloading(true);
    
    setTimeout(() => {
      try {
        // Create a blob with the report data
        const reportData = JSON.stringify(report, null, 2);
        const blob = new Blob([reportData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create an anchor element and trigger download
        const a = window.document.createElement('a');
        a.href = url;
        a.download = `rapport-pointage-${format(startDate, 'yyyy-MM-dd')}.json`;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success("Rapport téléchargé avec succès");
      } catch (error) {
        console.error("Erreur lors du téléchargement:", error);
        toast.error("Erreur lors du téléchargement du rapport");
      } finally {
        setIsDownloading(false);
      }
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Générer un rapport de pointage</DialogTitle>
          <DialogDescription>
            Sélectionnez le type de rapport et la période pour générer un rapport de pointage
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="report-type" className="text-sm font-medium">
              Type de rapport
            </label>
            <Select 
              value={reportType} 
              onValueChange={setReportType}
            >
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Sélectionner le type de rapport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Journalier</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="monthly">Mensuel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="start-date" className="text-sm font-medium">
                Date de début
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="end-date" className="text-sm font-medium">
                Date de fin
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="end-date"
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          {report && (
            <Button 
              variant="outline" 
              className="mr-auto flex items-center gap-2"
              onClick={handleDownloadReport}
              disabled={isDownloading}
            >
              <Download className="h-4 w-4" />
              {isDownloading ? "Téléchargement..." : "Télécharger le rapport"}
            </Button>
          )}
          <Button 
            onClick={handleGenerateReport} 
            disabled={isGenerating}
          >
            {isGenerating ? "Génération en cours..." : "Générer le rapport"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
