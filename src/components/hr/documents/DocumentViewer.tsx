
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Document } from './types';
import { getDocumentTypeName, getStatusBadge } from './utils';

interface DocumentViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
  onDownload: (document: Document) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ 
  open, 
  onOpenChange, 
  document, 
  onDownload 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Visualisation du document</DialogTitle>
          <DialogDescription>
            {document && `${document.name} - ${document.employee}`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {document && (
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                <FileText className="h-16 w-16 text-muted-foreground" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Type de document</h4>
                  <p className="text-sm text-muted-foreground">
                    {getDocumentTypeName(document.type)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Statut</h4>
                  <div>{getStatusBadge(document.status)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Date de téléchargement</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(document.uploadDate, 'dd/MM/yyyy')}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Date d'expiration</h4>
                  <p className="text-sm text-muted-foreground">
                    {document.expiryDate 
                      ? format(document.expiryDate, 'dd/MM/yyyy')
                      : 'Non applicable'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fermer</Button>
          <Button onClick={() => document && onDownload(document)}>
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
