
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText, Download, Eye, Search, Upload, Filter, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Document {
  id: string;
  name: string;
  type: 'permis' | 'carte-pro' | 'medical' | 'formation' | 'contrat';
  status: 'valid' | 'expiring-soon' | 'expired';
  employee: string;
  uploadDate: Date;
  expiryDate: Date | null;
}

const getDocumentTypeName = (type: string): string => {
  switch (type) {
    case 'permis': return 'Permis de conduire';
    case 'carte-pro': return 'Carte professionnelle';
    case 'medical': return 'Certificat médical';
    case 'formation': return 'Attestation de formation';
    case 'contrat': return 'Contrat de travail';
    default: return type;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'valid':
      return <Badge className="bg-green-500">Valide</Badge>;
    case 'expiring-soon':
      return <Badge className="bg-amber-500">Expire bientôt</Badge>;
    case 'expired':
      return <Badge className="bg-red-500">Expiré</Badge>;
    default:
      return <Badge>Inconnu</Badge>;
  }
};

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

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
    setSelectedFile(null);
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
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Upload size={16} />
                <span>Nouveau document</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Télécharger un document</DialogTitle>
                <DialogDescription>
                  Remplissez les informations et téléchargez le fichier du document.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="documentName" className="text-right">
                    Nom
                  </Label>
                  <Input
                    id="documentName"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="documentType" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={documentType}
                    onValueChange={(value: any) => setDocumentType(value)}
                  >
                    <SelectTrigger id="documentType" className="col-span-3">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permis">Permis de conduire</SelectItem>
                      <SelectItem value="carte-pro">Carte professionnelle</SelectItem>
                      <SelectItem value="medical">Certificat médical</SelectItem>
                      <SelectItem value="formation">Attestation de formation</SelectItem>
                      <SelectItem value="contrat">Contrat de travail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employeeName" className="text-right">
                    Employé
                  </Label>
                  <Select
                    value={employeeName}
                    onValueChange={setEmployeeName}
                  >
                    <SelectTrigger id="employeeName" className="col-span-3">
                      <SelectValue placeholder="Sélectionner un employé" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Thomas Durand">Thomas Durand</SelectItem>
                      <SelectItem value="Sophie Lefèvre">Sophie Lefèvre</SelectItem>
                      <SelectItem value="Pierre Martin">Pierre Martin</SelectItem>
                      <SelectItem value="Marie Lambert">Marie Lambert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expiryDate" className="text-right">
                    Date d'expiration
                  </Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="documentFile" className="text-right">
                    Fichier
                  </Label>
                  <Input
                    id="documentFile"
                    type="file"
                    onChange={handleFileChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleUploadDocument}>Télécharger</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Visualisation du document</DialogTitle>
            <DialogDescription>
              {selectedDocument && `${selectedDocument.name} - ${selectedDocument.employee}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedDocument && (
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Type de document</h4>
                    <p className="text-sm text-muted-foreground">
                      {getDocumentTypeName(selectedDocument.type)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Statut</h4>
                    <div>{getStatusBadge(selectedDocument.status)}</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Date de téléchargement</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(selectedDocument.uploadDate, 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Date d'expiration</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedDocument.expiryDate 
                        ? format(selectedDocument.expiryDate, 'dd/MM/yyyy')
                        : 'Non applicable'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Fermer</Button>
            <Button onClick={() => selectedDocument && handleDownloadDocument(selectedDocument)}>
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface DocumentTableProps {
  documents: Document[];
  onViewDocument: (document: Document) => void;
  onDownloadDocument: (document: Document) => void;
}

const DocumentTable: React.FC<DocumentTableProps> = ({ documents, onViewDocument, onDownloadDocument }) => {
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

export default DocumentManager;
