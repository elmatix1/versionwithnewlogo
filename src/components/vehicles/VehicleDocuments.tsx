
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Eye, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VehicleDocument {
  id: string;
  vehicleId: string;
  vehicleName: string;
  name: string;
  type: 'registration' | 'insurance' | 'maintenance' | 'inspection';
  status: 'valid' | 'expiring' | 'expired';
  date: string;
  expiryDate: string | null;
}

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

interface VehicleDocumentsProps {
  vehicles: Vehicle[];
}

const VehicleDocuments: React.FC<VehicleDocumentsProps> = ({ vehicles }) => {
  const [viewDocument, setViewDocument] = useState<VehicleDocument | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Sample documents for demonstration
  const documents: VehicleDocument[] = [
    {
      id: 'vdoc1',
      vehicleId: 'v1',
      vehicleName: 'TL-3045',
      name: 'Carte grise',
      type: 'registration',
      status: 'valid',
      date: '15/05/2022',
      expiryDate: '15/05/2025'
    },
    {
      id: 'vdoc2',
      vehicleId: 'v1',
      vehicleName: 'TL-3045',
      name: 'Assurance',
      type: 'insurance',
      status: 'expiring',
      date: '01/06/2023',
      expiryDate: '01/06/2024'
    },
    {
      id: 'vdoc3',
      vehicleId: 'v2',
      vehicleName: 'TL-2189',
      name: 'Contrôle technique',
      type: 'inspection',
      status: 'valid',
      date: '10/10/2023',
      expiryDate: '10/10/2024'
    },
    {
      id: 'vdoc4',
      vehicleId: 'v3',
      vehicleName: 'TL-4023',
      name: 'Carnet d\'entretien',
      type: 'maintenance',
      status: 'expired',
      date: '20/03/2022',
      expiryDate: '20/03/2023'
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    if (activeTab !== 'all' && doc.status !== activeTab) {
      return false;
    }
    
    if (searchQuery && !(
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.vehicleName.toLowerCase().includes(searchQuery.toLowerCase())
    )) {
      return false;
    }
    
    return true;
  });

  const handleDownloadDocument = (document: VehicleDocument) => {
    setIsDownloading(document.id);
    
    setTimeout(() => {
      try {
        // Create a fake download
        const blob = new Blob([`${document.name} for ${document.vehicleName}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = `${document.name}_${document.vehicleName}.txt`;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success('Document téléchargé', {
          description: `${document.name} a été téléchargé avec succès`,
        });
      } catch (error) {
        console.error('Error downloading document:', error);
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
    <div className="space-y-4 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="valid">Valides</TabsTrigger>
          <TabsTrigger value="expiring">Expirent bientôt</TabsTrigger>
          <TabsTrigger value="expired">Expirés</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date d'émission</TableHead>
                  <TableHead>Date d'expiration</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      Aucun document trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.vehicleName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-muted-foreground" />
                          {doc.name}
                        </div>
                      </TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{doc.date}</TableCell>
                      <TableCell>{doc.expiryDate || 'N/A'}</TableCell>
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
                            onClick={() => setViewDocument(doc)}
                          >
                            <Eye size={16} className="mr-1" />
                            Visualiser
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadDocument(doc)}
                            disabled={isDownloading === doc.id}
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
        </TabsContent>
      </Tabs>

      {/* Document Viewer Dialog */}
      <Dialog open={!!viewDocument} onOpenChange={(open) => !open && setViewDocument(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewDocument?.name}</DialogTitle>
            <DialogDescription>
              Document pour {viewDocument?.vehicleName}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                <FileText className="h-16 w-16 text-muted-foreground" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Type de document</h4>
                  <p className="text-sm text-muted-foreground">
                    {viewDocument?.type}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Statut</h4>
                  <div>
                    {viewDocument && (
                      <Badge variant="outline" className={statusStyles[viewDocument.status]}>
                        {statusLabels[viewDocument.status]}
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Date d'émission</h4>
                  <p className="text-sm text-muted-foreground">
                    {viewDocument?.date}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Date d'expiration</h4>
                  <p className="text-sm text-muted-foreground">
                    {viewDocument?.expiryDate || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button 
              onClick={() => viewDocument && handleDownloadDocument(viewDocument)}
              disabled={isDownloading === viewDocument?.id}
            >
              <Download size={16} className="mr-2" />
              {isDownloading === viewDocument?.id ? 'Téléchargement...' : 'Télécharger ce document'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleDocuments;
