
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { HRDocument, DocumentTableProps } from './types';
import { getDocumentTypeName, getStatusBadge } from './utils';

const DocumentTable: React.FC<DocumentTableProps> = ({ 
  documents, 
  onViewDocument, 
  onDownloadDocument 
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Employé</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date d'expiration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                Aucun document trouvé
              </TableCell>
            </TableRow>
          ) : (
            documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-muted-foreground" />
                    <span>{document.name}</span>
                  </div>
                </TableCell>
                <TableCell>{getDocumentTypeName(document.type)}</TableCell>
                <TableCell>{document.employee}</TableCell>
                <TableCell>{getStatusBadge(document.status)}</TableCell>
                <TableCell>
                  {document.expiryDate 
                    ? format(document.expiryDate, 'dd/MM/yyyy')
                    : 'Non applicable'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onViewDocument(document)}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDownloadDocument(document)}
                    >
                      <Download size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentTable;
