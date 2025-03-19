
export interface Document {
  id: string;
  name: string;
  type: 'permis' | 'carte-pro' | 'medical' | 'formation' | 'contrat';
  status: DocumentStatus;
  employee: string;
  uploadDate: Date;
  expiryDate: Date | null;
  issueDate?: string; // Add this field to match usage in DocumentTable
}

export type DocumentStatus = 'valid' | 'expiring' | 'expired';

export interface DocumentTableProps {
  documents: Document[];
  title: string;
}
