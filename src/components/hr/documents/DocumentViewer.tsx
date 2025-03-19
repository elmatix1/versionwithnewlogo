
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
import { Document } from './types';

export interface DocumentViewerProps {
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (document: Document) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ 
  document, 
  open, 
  onOpenChange, 
  onDownload 
}) => {
  const getFormattedDate = (date: Date | null | undefined) => {
    if (!date) return 'N/A';
    return date instanceof Date ? date.toLocaleDateString() : date;
  };
  
  return (
    <div className="py-4">
      <div className="space-y-4">
        <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
          <FileText className="h-16 w-16 text-muted-foreground" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Type de document</h4>
            <p className="text-sm text-muted-foreground">
              {document.type}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Statut</h4>
            <div>{document.status}</div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Date de téléchargement</h4>
            <p className="text-sm text-muted-foreground">
              {getFormattedDate(document.uploadDate)}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">Date d'expiration</h4>
            <p className="text-sm text-muted-foreground">
              {getFormattedDate(document.expiryDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
