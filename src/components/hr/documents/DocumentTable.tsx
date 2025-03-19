
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Document } from './types';
import DocumentViewer from './DocumentViewer';

interface DocumentTableProps {
  documents: Document[];
  title: string;
  onViewDocument?: (document: Document) => void;
  onDownloadDocument?: (document: Document) => void;
}

const DocumentTable: React.FC<DocumentTableProps> = ({ 
  documents, 
  title,
  onViewDocument,
  onDownloadDocument 
}) => {
  const [viewDocument, setViewDocument] = useState<Document | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const handleDownload = (document: Document) => {
    if (onDownloadDocument) {
      onDownloadDocument(document);
      return;
    }

    setIsDownloading(document.id);
    
    // Create a simulated delay to mimic download process
    setTimeout(() => {
      try {
        // Create a fake download by creating a blob and triggering a download
        const blob = new Blob([`Contenu du document ${document.name}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = document.name;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success('Document téléchargé', {
          description: `${document.name} a été téléchargé avec succès`,
        });
      } catch (error) {
        console.error('Erreur lors du téléchargement:', error);
        toast.error('Erreur de téléchargement', {
          description: 'Le document n\'a pas pu être téléchargé',
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
    expiring: "Expire bientôt",
    expired: "Expiré",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      
      <div className="border rounded-md">
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
                  Aucun document trouvé
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
                  <TableCell>{doc.issueDate || (doc.uploadDate ? doc.uploadDate.toLocaleDateString() : 'N/A')}</TableCell>
                  <TableCell>{doc.expiryDate ? doc.expiryDate.toLocaleDateString() : 'N/A'}</TableCell>
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
                        onClick={() => onViewDocument ? onViewDocument(doc) : setViewDocument(doc)}
                        className="flex items-center"
                      >
                        <Eye size={16} className="mr-1" />
                        Visualiser
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                        disabled={isDownloading === doc.id}
                        className="flex items-center"
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
      </div>

      {/* Document Viewer Dialog */}
      <Dialog open={!!viewDocument} onOpenChange={(open) => !open && setViewDocument(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewDocument?.name}</DialogTitle>
            <DialogDescription>
              Émis le {viewDocument?.issueDate || (viewDocument?.uploadDate ? viewDocument.uploadDate.toLocaleDateString() : 'N/A')} - 
              {viewDocument?.expiryDate ? ` Expire le ${viewDocument.expiryDate.toLocaleDateString()}` : ' Sans date d\'expiration'}
            </DialogDescription>
          </DialogHeader>
          {viewDocument && (
            <DocumentViewer 
              document={viewDocument}
              open={!!viewDocument}
              onOpenChange={(open) => !open && setViewDocument(null)}
              onDownload={handleDownload}
            />
          )}
          <div className="flex justify-end mt-4">
            <Button 
              onClick={() => viewDocument && handleDownload(viewDocument)}
              disabled={isDownloading === viewDocument?.id}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              {isDownloading === viewDocument?.id ? 'Téléchargement...' : 'Télécharger ce document'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentTable;
