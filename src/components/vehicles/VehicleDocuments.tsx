
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  UploadCloud, 
  AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastMaintenance: string;
  fuelLevel: number;
  nextService: string;
  driver?: string;
  location?: string;
}

interface VehicleDocument {
  id: string;
  vehicleId: string;
  name: string;
  type: 'registration' | 'insurance' | 'technical' | 'maintenance' | 'other';
  status: 'valid' | 'expiring-soon' | 'expired';
  date: string;
  expiryDate: string;
  fileType: 'pdf' | 'doc' | 'image';
}

interface VehicleDocumentsProps {
  vehicles: Vehicle[];
}

const VehicleDocuments: React.FC<VehicleDocumentsProps> = ({ vehicles }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Exemple de documents
  const documents: VehicleDocument[] = [
    {
      id: 'doc1',
      vehicleId: 'v1',
      name: 'Certificat d\'immatriculation',
      type: 'registration',
      status: 'valid',
      date: '10/05/2022',
      expiryDate: '10/05/2032',
      fileType: 'pdf'
    },
    {
      id: 'doc2',
      vehicleId: 'v1',
      name: 'Assurance',
      type: 'insurance',
      status: 'valid',
      date: '01/01/2023',
      expiryDate: '31/12/2023',
      fileType: 'pdf'
    },
    {
      id: 'doc3',
      vehicleId: 'v2',
      name: 'Certificat d\'immatriculation',
      type: 'registration',
      status: 'valid',
      date: '15/03/2021',
      expiryDate: '15/03/2031',
      fileType: 'pdf'
    },
    {
      id: 'doc4',
      vehicleId: 'v2',
      name: 'Assurance',
      type: 'insurance',
      status: 'expiring-soon',
      date: '01/07/2023',
      expiryDate: '30/06/2024',
      fileType: 'pdf'
    },
    {
      id: 'doc5',
      vehicleId: 'v3',
      name: 'Rapport de maintenance',
      type: 'maintenance',
      status: 'valid',
      date: '28/07/2023',
      expiryDate: 'N/A',
      fileType: 'doc'
    },
    {
      id: 'doc6',
      vehicleId: 'v4',
      name: 'Contrôle technique',
      type: 'technical',
      status: 'expired',
      date: '14/04/2022',
      expiryDate: '14/04/2023',
      fileType: 'pdf'
    }
  ];

  // Filtrer les documents
  const filteredDocuments = documents.filter(doc => {
    const matchesTab = activeTab === 'all' || doc.type === activeTab;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicles.find(v => v.id === doc.vehicleId)?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      false;
    
    return matchesTab && matchesSearch;
  });

  const handleDownload = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      toast.success("Document téléchargé", {
        description: `Le document ${document.name} a été téléchargé.`
      });
    }
  };
  
  const handleView = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      toast.info("Visualisation du document", {
        description: `Affichage du document ${document.name}.`
      });
    }
  };
  
  const handleUpload = () => {
    toast.success("Document téléversé", {
      description: "Le document a été téléversé avec succès."
    });
  };

  const typeLabels = {
    registration: 'Immatriculation',
    insurance: 'Assurance',
    technical: 'Contrôle technique',
    maintenance: 'Maintenance',
    other: 'Autre'
  };

  const statusColors = {
    valid: 'bg-green-500',
    'expiring-soon': 'bg-amber-500',
    expired: 'bg-red-500'
  };

  const statusLabels = {
    valid: 'Valide',
    'expiring-soon': 'Expire bientôt',
    expired: 'Expiré'
  };

  const fileIcons = {
    pdf: <FileText className="h-4 w-4 text-red-500" />,
    doc: <FileText className="h-4 w-4 text-blue-500" />,
    image: <FileText className="h-4 w-4 text-green-500" />
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un document..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="flex items-center gap-2" onClick={handleUpload}>
          <UploadCloud size={16} />
          <span>Téléverser</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="registration">Immatriculation</TabsTrigger>
          <TabsTrigger value="insurance">Assurance</TabsTrigger>
          <TabsTrigger value="technical">Contrôle technique</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
          {filteredDocuments.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Véhicule</TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Expiration</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((document) => {
                      const vehicle = vehicles.find(v => v.id === document.vehicleId);
                      
                      return (
                        <TableRow key={document.id}>
                          <TableCell>{vehicle?.name || "—"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {fileIcons[document.fileType]}
                              <span>{document.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{typeLabels[document.type]}</TableCell>
                          <TableCell>{document.date}</TableCell>
                          <TableCell>{document.expiryDate}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[document.status]}>
                              {statusLabels[document.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleView(document.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownload(document.id)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun document trouvé</p>
              <p className="text-xs text-muted-foreground mt-1">
                Essayez de modifier vos critères de recherche ou d'ajouter de nouveaux documents
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleDocuments;
