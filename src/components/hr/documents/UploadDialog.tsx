
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentName: string;
  setDocumentName: (name: string) => void;
  documentType: 'permis' | 'carte-pro' | 'medical' | 'formation' | 'contrat';
  setDocumentType: (type: 'permis' | 'carte-pro' | 'medical' | 'formation' | 'contrat') => void;
  employeeName: string;
  setEmployeeName: (name: string) => void;
  expiryDate: string;
  setExpiryDate: (date: string) => void;
  onUpload: () => void;
  children?: React.ReactNode;
}

const UploadDialog: React.FC<UploadDialogProps> = ({
  open,
  onOpenChange,
  documentName,
  setDocumentName,
  documentType,
  setDocumentType,
  employeeName,
  setEmployeeName,
  expiryDate,
  setExpiryDate,
  onUpload,
  children
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
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
          <Button onClick={onUpload}>Télécharger</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
