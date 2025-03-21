
export interface HRDocument {
  id: string;
  name: string;
  type: 'permis' | 'carte-pro' | 'medical' | 'formation' | 'contrat';
  status: 'valid' | 'expiring-soon' | 'expired';
  employee: string;
  uploadDate: Date;
  expiryDate: Date | null;
}

export interface DocumentTableProps {
  documents: HRDocument[];
  onViewDocument: (document: HRDocument) => void;
  onDownloadDocument: (document: HRDocument) => void;
}
