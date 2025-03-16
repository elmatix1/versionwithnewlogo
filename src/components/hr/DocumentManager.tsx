
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Upload, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Document } from './documents/types';
import DocumentTable from './documents/DocumentTable';
import DocumentViewer from './documents/DocumentViewer';
import UploadDialog from './documents/UploadDialog';

const DocumentManager: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'doc-001',
      name: 'Permis de conduire',
      type: 'permis',
      status: 'valid',
      employee: 'Thomas Durand',
      uploadDate: new Date(2023, 3, 15),
      expiryDate: new Date(2025, 3, 15),
    },
    {
      id: 'doc-002',
      name: 'Certificat médical',
      type: 'medical',
      status: 'expiring-soon',
      employee: 'Thomas Durand',
      uploadDate: new Date(2023, 7, 10),
      expiryDate: new Date(2023, 9, 10),
    },
    {
      id: 'doc-003',
      name: 'Carte professionnelle',
      type: 'carte-pro',
      status: 'valid',
      employee: 'Sophie Lefèvre',
      uploadDate: new Date(2023, 5, 20),
      expiryDate: new Date(2026, 5, 20),
    },
    {
      id: 'doc-004',
      name: 'Attestation FIMO',
      type: 'formation',
      status: 'expired',
      employee: 'Pierre Martin',
      uploadDate: new Date(2022, 11, 5),
      expiryDate: new Date(2023, 5, 5),
    },
    {
      id: 'doc-005',
      name: 'Contrat de travail',
      type: 'contrat',
      status: 'valid',
      employee: 'Sophie Lefèvre',
      uploadDate: new Date(2022, 8, 1),
      expiryDate: null,
    },
  ]);

  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [employeeFilter, setEmployeeFilter] = useState<string>('all');
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string>('all');

  // Upload document state
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState<'permis' | 'carte-pro' | 'medical' | 'formation' | 'contrat'>('permis');
  const [employeeName, setEmployeeName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // View document state
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const filteredDocuments = documents.filter(doc => {
    // Filter by tab
    if (selectedTab !== 'all' && doc.status !== selectedTab) {
      return false;
    }

    // Filter by search query
    if (
      searchQuery &&
      !doc.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !doc.employee.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by employee
    if (employeeFilter !== 'all' && doc.employee !== employeeFilter) {
      return false;
    }

    // Filter by document type
    if (documentTypeFilter !== 'all' && doc.type !== documentTypeFilter) {
      return false;
    }

    return true;
  });

  const handleUploadDocument = () => {
    if (!documentName || !documentType || !employeeName) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const newDocument: Document = {
      id: `doc-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
      name: documentName,
      type: documentType,
      status: 'valid',
      employee: employeeName,
      uploadDate: new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    };

    setDocuments([...documents, newDocument]);
    toast.success("Document téléchargé avec succès");
    setUploadDialogOpen(false);
    
    // Reset form
    setDocumentName('');
    setDocumentType('permis');
    setEmployeeName('');
    setExpiryDate('');
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setViewDialogOpen(true);
  };

  const handleDownloadDocument = (document: Document) => {
    toast.success(`Téléchargement du document: ${document.name}`, {
      description: `Le document a été téléchargé avec succès.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher un document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <UploadDialog
            open={uploadDialogOpen}
            onOpenChange={setUploadDialogOpen}
            documentName={documentName}
            setDocumentName={setDocumentName}
            documentType={documentType}
            setDocumentType={setDocumentType}
            employeeName={employeeName}
            setEmployeeName={setEmployeeName}
            expiryDate={expiryDate}
            setExpiryDate={setExpiryDate}
            onUpload={handleUploadDocument}
          >
            <Button className="flex items-center gap-2">
              <Upload size={16} />
              <span>Nouveau document</span>
            </Button>
          </UploadDialog>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <Select
            value={employeeFilter}
            onValueChange={setEmployeeFilter}
          >
            <SelectTrigger className="w-[200px]">
              <div className="flex items-center gap-2">
                <Filter size={16} />
                <span>Employé</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les employés</SelectItem>
              <SelectItem value="Thomas Durand">Thomas Durand</SelectItem>
              <SelectItem value="Sophie Lefèvre">Sophie Lefèvre</SelectItem>
              <SelectItem value="Pierre Martin">Pierre Martin</SelectItem>
              <SelectItem value="Marie Lambert">Marie Lambert</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={documentTypeFilter}
            onValueChange={setDocumentTypeFilter}
          >
            <SelectTrigger className="w-[200px]">
              <div className="flex items-center gap-2">
                <Filter size={16} />
                <span>Type de document</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="permis">Permis de conduire</SelectItem>
              <SelectItem value="carte-pro">Carte professionnelle</SelectItem>
              <SelectItem value="medical">Certificat médical</SelectItem>
              <SelectItem value="formation">Attestation de formation</SelectItem>
              <SelectItem value="contrat">Contrat de travail</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="valid">Valides</TabsTrigger>
          <TabsTrigger value="expiring-soon">Expirent bientôt</TabsTrigger>
          <TabsTrigger value="expired">Expirés</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <DocumentTable
            documents={filteredDocuments}
            onViewDocument={handleViewDocument}
            onDownloadDocument={handleDownloadDocument}
          />
        </TabsContent>
        
        <TabsContent value="valid" className="mt-4">
          <DocumentTable
            documents={filteredDocuments}
            onViewDocument={handleViewDocument}
            onDownloadDocument={handleDownloadDocument}
          />
        </TabsContent>
        
        <TabsContent value="expiring-soon" className="mt-4">
          <DocumentTable
            documents={filteredDocuments}
            onViewDocument={handleViewDocument}
            onDownloadDocument={handleDownloadDocument}
          />
        </TabsContent>
        
        <TabsContent value="expired" className="mt-4">
          <DocumentTable
            documents={filteredDocuments}
            onViewDocument={handleViewDocument}
            onDownloadDocument={handleDownloadDocument}
          />
        </TabsContent>
      </Tabs>

      {/* Document Viewer Dialog */}
      <DocumentViewer
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        document={selectedDocument}
        onDownload={handleDownloadDocument}
      />
    </div>
  );
};

export default DocumentManager;
