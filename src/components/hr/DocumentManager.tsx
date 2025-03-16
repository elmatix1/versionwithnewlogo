
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Upload, FileText, Download, Eye, Trash } from 'lucide-react';
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  type: 'contrat' | 'permis' | 'formation' | 'médical';
  employee: string;
  dateAdded: string;
  status: 'valid' | 'expiring' | 'expired';
}

const sampleDocuments: Document[] = [
  {
    id: "DOC-1001",
    name: "Contrat CDI - Thomas Durand",
    type: "contrat",
    employee: "Thomas Durand",
    dateAdded: "12/05/2022",
    status: "valid"
  },
  {
    id: "DOC-1002",
    name: "Permis C - Sophie Lefèvre",
    type: "permis",
    employee: "Sophie Lefèvre",
    dateAdded: "03/07/2023",
    status: "valid"
  },
  {
    id: "DOC-1003",
    name: "Certificat Médical - Pierre Martin",
    type: "médical",
    employee: "Pierre Martin",
    dateAdded: "21/01/2023",
    status: "expiring"
  },
  {
    id: "DOC-1004",
    name: "Attestation Formation - Marie Lambert",
    type: "formation",
    employee: "Marie Lambert",
    dateAdded: "15/09/2022",
    status: "expired"
  }
];

const DocumentManager: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleUpload = () => {
    toast.success("Le document a été téléchargé avec succès");
  };
  
  const handleDownload = (docId: string) => {
    toast.info(`Téléchargement du document ${docId}`);
  };
  
  const handleView = (docId: string) => {
    toast.info(`Affichage du document ${docId}`);
  };
  
  const handleDelete = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    toast.success("Document supprimé avec succès");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Rechercher un document..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="flex items-center gap-2 w-full md:w-auto" onClick={handleUpload}>
          <Upload size={16} />
          <span>Télécharger un document</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents des employés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun document trouvé
              </div>
            ) : (
              filteredDocuments.map(doc => (
                <div key={doc.id} className="p-3 border rounded-md flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-secondary p-2 rounded-md">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {doc.employee} • Ajouté le {doc.dateAdded}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={
                        doc.status === "valid" ? "bg-green-500" : 
                        doc.status === "expiring" ? "bg-amber-500" : 
                        "bg-red-500"
                      }
                    >
                      {doc.status === "valid" ? "Valide" : 
                      doc.status === "expiring" ? "Expire bientôt" : 
                      "Expiré"}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => handleView(doc.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(doc.id)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentManager;
