
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { saveToLocalStorage, loadFromLocalStorage } from "@/utils/localStorage";
import { Eye, Download, Upload, FileText } from "lucide-react";
import { toast } from "sonner";

interface VehicleDocument {
  id: string;
  name: string;
  type: 'insurance' | 'registration' | 'inspection' | 'maintenance';
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring' | 'expired';
  file?: string;
}

interface VehicleDocumentsProps {
  vehicleId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DOCS_STORAGE_KEY = 'tms-vehicle-documents';

const defaultDocuments: VehicleDocument[] = [
  {
    id: '1',
    name: 'Assurance véhicule',
    type: 'insurance',
    issueDate: '2023-03-15',
    expiryDate: '2024-03-15',
    status: 'valid',
  },
  {
    id: '2',
    name: 'Carte grise',
    type: 'registration',
    issueDate: '2020-01-10',
    expiryDate: 'N/A',
    status: 'valid',
  },
  {
    id: '3',
    name: 'Contrôle technique',
    type: 'inspection',
    issueDate: '2023-09-01',
    expiryDate: '2024-09-01',
    status: 'valid',
  },
  {
    id: '4',
    name: 'Rapport de maintenance',
    type: 'maintenance',
    issueDate: '2023-11-05',
    expiryDate: 'N/A',
    status: 'valid',
  },
  {
    id: '5',
    name: 'Certificat de conformité',
    type: 'registration',
    issueDate: '2021-06-22',
    expiryDate: '2024-06-22',
    status: 'valid',
  },
];

const VehicleDocuments: React.FC<VehicleDocumentsProps> = ({
  vehicleId,
  open,
  onOpenChange,
}) => {
  const [selectedDocument, setSelectedDocument] = useState<VehicleDocument | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  // Get documents from localStorage or use defaults
  const documents = loadFromLocalStorage<VehicleDocument[]>(
    `${DOCS_STORAGE_KEY}-${vehicleId}`,
    defaultDocuments
  );

  const filterDocumentsByType = (type: VehicleDocument['type']) => {
    return documents.filter(doc => doc.type === type);
  };

  const handleViewDocument = (document: VehicleDocument) => {
    setSelectedDocument(document);
    setViewerOpen(true);
  };

  const handleDownloadDocument = (document: VehicleDocument) => {
    setIsDownloading(document.id);
    
    // Simulate document download with a timeout
    setTimeout(() => {
      try {
        // Create a blob and trigger download
        const content = `This is the content of ${document.name}\nIssue Date: ${document.issueDate}\nExpiry Date: ${document.expiryDate}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = `${document.name.replace(/\s+/g, '_')}.txt`;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success("Document téléchargé", {
          description: `${document.name} a été téléchargé avec succès`,
        });
      } catch (error) {
        console.error("Erreur lors du téléchargement:", error);
        toast.error("Erreur de téléchargement", {
          description: "Le document n'a pas pu être téléchargé",
        });
      } finally {
        setIsDownloading(null);
      }
    }, 800);
  };

  const statusStyles = {
    valid: "bg-green-100 text-green-800 border-green-200",
    expiring: "bg-yellow-100 text-yellow-800 border-yellow-200",
    expired: "bg-red-100 text-red-800 border-red-200",
  };

  const statusLabels = {
    valid: "Valide",
    expiring: "Expiration proche",
    expired: "Expiré",
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Documents du véhicule</DialogTitle>
            <DialogDescription>
              Consultez les documents administratifs et techniques du véhicule
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="insurance">Assurance</TabsTrigger>
              <TabsTrigger value="registration">Immatriculation</TabsTrigger>
              <TabsTrigger value="inspection">Contrôle</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <DocumentTable 
                documents={documents} 
                onView={handleViewDocument} 
                onDownload={handleDownloadDocument}
                isDownloading={isDownloading}
                statusStyles={statusStyles}
                statusLabels={statusLabels}
              />
            </TabsContent>
            
            <TabsContent value="insurance">
              <DocumentTable 
                documents={filterDocumentsByType('insurance')} 
                onView={handleViewDocument} 
                onDownload={handleDownloadDocument}
                isDownloading={isDownloading}
                statusStyles={statusStyles}
                statusLabels={statusLabels}
              />
            </TabsContent>
            
            <TabsContent value="registration">
              <DocumentTable 
                documents={filterDocumentsByType('registration')} 
                onView={handleViewDocument} 
                onDownload={handleDownloadDocument}
                isDownloading={isDownloading}
                statusStyles={statusStyles}
                statusLabels={statusLabels}
              />
            </TabsContent>
            
            <TabsContent value="inspection">
              <DocumentTable 
                documents={filterDocumentsByType('inspection')} 
                onView={handleViewDocument} 
                onDownload={handleDownloadDocument}
                isDownloading={isDownloading}
                statusStyles={statusStyles}
                statusLabels={statusLabels}
              />
            </TabsContent>
            
            <TabsContent value="maintenance">
              <DocumentTable 
                documents={filterDocumentsByType('maintenance')} 
                onView={handleViewDocument} 
                onDownload={handleDownloadDocument}
                isDownloading={isDownloading}
                statusStyles={statusStyles}
                statusLabels={statusLabels}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Document Viewer */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
            <DialogDescription>
              Émis le {selectedDocument?.issueDate} - 
              {selectedDocument?.expiryDate !== 'N/A' ? ` Expire le ${selectedDocument?.expiryDate}` : ' Sans date d\'expiration'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="border rounded-md p-4 h-96 flex items-center justify-center bg-muted/30">
            <div className="text-center space-y-4">
              <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
              <h3 className="text-lg font-medium">{selectedDocument?.name}</h3>
              <p className="text-sm text-muted-foreground">
                Ce document est actuellement affiché en mode prévisualisation
              </p>
              <Button 
                onClick={() => selectedDocument && handleDownloadDocument(selectedDocument)}
                disabled={isDownloading === selectedDocument?.id}
              >
                <Download className="mr-2 h-4 w-4" />
                {isDownloading === selectedDocument?.id 
                  ? "Téléchargement..." 
                  : "Télécharger le document complet"
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Helper component for document tables
interface DocumentTableProps {
  documents: VehicleDocument[];
  onView: (doc: VehicleDocument) => void;
  onDownload: (doc: VehicleDocument) => void;
  isDownloading: string | null;
  statusStyles: Record<string, string>;
  statusLabels: Record<string, string>;
}

const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  onView,
  onDownload,
  isDownloading,
  statusStyles,
  statusLabels
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Document</TableHead>
          <TableHead>Date d'émission</TableHead>
          <TableHead>Date d'expiration</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
              Aucun document trouvé dans cette catégorie
            </TableCell>
          </TableRow>
        ) : (
          documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-muted-foreground" />
                  {doc.name}
                </div>
              </TableCell>
              <TableCell>{doc.issueDate}</TableCell>
              <TableCell>{doc.expiryDate}</TableCell>
              <TableCell>
                <Badge variant="outline" className={statusStyles[doc.status]}>
                  {statusLabels[doc.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(doc)}
                  >
                    <Eye size={16} className="mr-1" />
                    Visualiser
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownload(doc)}
                    disabled={isDownloading === doc.id}
                  >
                    <Download size={16} className="mr-1" />
                    {isDownloading === doc.id ? 'Téléchargement...' : 'Télécharger'}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default VehicleDocuments;
