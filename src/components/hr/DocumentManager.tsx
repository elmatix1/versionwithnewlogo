
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Upload, FileText, Download, Eye, Trash, Filter } from 'lucide-react';
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState<Document | null>(null);
  const [newDocName, setNewDocName] = useState("");
  const [newDocType, setNewDocType] = useState<'contrat' | 'permis' | 'formation' | 'médical'>('contrat');
  const [newDocEmployee, setNewDocEmployee] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  
  const filteredDocuments = documents.filter(doc => {
    // Apply search filter
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter if set
    const matchesStatus = filterStatus ? doc.status === filterStatus : true;
    
    // Apply type filter if set
    const matchesType = filterType ? doc.type === filterType : true;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  const handleUpload = () => {
    // Generate a new document ID
    const newId = `DOC-${1000 + documents.length + 1}`;
    
    // Add the new document
    const newDocument: Document = {
      id: newId,
      name: newDocName,
      type: newDocType,
      employee: newDocEmployee,
      dateAdded: new Date().toLocaleDateString(),
      status: 'valid'
    };
    
    setDocuments([...documents, newDocument]);
    setUploadDialogOpen(false);
    
    // Reset form
    setNewDocName("");
    setNewDocType('contrat');
    setNewDocEmployee("");
    
    toast.success("Document téléchargé avec succès");
  };
  
  const handleDownload = (docId: string) => {
    toast.info(`Téléchargement du document ${docId}`);
  };
  
  const handleView = (doc: Document) => {
    setCurrentDoc(doc);
    setViewDialogOpen(true);
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
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                <span>Filtrer</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filtrer les documents</h4>
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select 
                    value={filterStatus || ""} 
                    onValueChange={(val) => setFilterStatus(val || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les statuts</SelectItem>
                      <SelectItem value="valid">Valide</SelectItem>
                      <SelectItem value="expiring">Expire bientôt</SelectItem>
                      <SelectItem value="expired">Expiré</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Type de document</Label>
                  <Select 
                    value={filterType || ""} 
                    onValueChange={(val) => setFilterType(val || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les types</SelectItem>
                      <SelectItem value="contrat">Contrat</SelectItem>
                      <SelectItem value="permis">Permis</SelectItem>
                      <SelectItem value="formation">Formation</SelectItem>
                      <SelectItem value="médical">Médical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setFilterStatus(null);
                      setFilterType(null);
                    }}
                  >
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 w-full md:w-auto">
                <Upload size={16} />
                <span>Télécharger un document</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Télécharger un nouveau document</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouveau document pour un employé
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="doc-name">Nom du document</Label>
                  <Input 
                    id="doc-name" 
                    placeholder="Ex: Contrat CDI - Thomas Durand"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="doc-type">Type de document</Label>
                  <Select 
                    value={newDocType} 
                    onValueChange={(val: 'contrat' | 'permis' | 'formation' | 'médical') => setNewDocType(val)}
                  >
                    <SelectTrigger id="doc-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contrat">Contrat</SelectItem>
                      <SelectItem value="permis">Permis</SelectItem>
                      <SelectItem value="formation">Formation</SelectItem>
                      <SelectItem value="médical">Médical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="doc-employee">Employé</Label>
                  <Select 
                    value={newDocEmployee} 
                    onValueChange={setNewDocEmployee}
                  >
                    <SelectTrigger id="doc-employee">
                      <SelectValue placeholder="Sélectionnez un employé" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Thomas Durand">Thomas Durand</SelectItem>
                      <SelectItem value="Sophie Lefèvre">Sophie Lefèvre</SelectItem>
                      <SelectItem value="Pierre Martin">Pierre Martin</SelectItem>
                      <SelectItem value="Marie Lambert">Marie Lambert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="doc-file">Fichier</Label>
                  <Input id="doc-file" type="file" />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={handleUpload}
                  disabled={!newDocName || !newDocEmployee}
                >
                  Télécharger
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents des employés</CardTitle>
          <CardDescription>
            Gérez les documents importants de vos employés
          </CardDescription>
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
                    <Button variant="ghost" size="icon" onClick={() => handleView(doc)}>
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
      
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{currentDoc?.name}</DialogTitle>
            <DialogDescription>
              Document de {currentDoc?.employee} • Ajouté le {currentDoc?.dateAdded}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center h-[60vh] border rounded-md bg-muted/20">
            <div className="text-center p-8">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Prévisualisation du document</p>
              <p className="text-sm text-muted-foreground mt-1">
                Type: {currentDoc?.type}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => currentDoc && handleDownload(currentDoc.id)}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentManager;
