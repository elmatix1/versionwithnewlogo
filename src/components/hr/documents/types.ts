
export interface Document {
  id: string;
  name: string;
  type: 'permis' | 'carte-pro' | 'medical' | 'formation' | 'contrat';
  status: 'valid' | 'expiring-soon' | 'expired';
  employee: string;
  uploadDate: Date;
  expiryDate: Date | null;
}

export interface DocumentTableProps {
  documents: Document[];
  onViewDocument: (document: Document) => void;
  onDownloadDocument: (document: Document) => void;
}
