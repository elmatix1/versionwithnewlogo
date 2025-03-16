
import { Badge } from '@/components/ui/badge';
import React from 'react';

export const getDocumentTypeName = (type: string): string => {
  switch (type) {
    case 'permis': return 'Permis de conduire';
    case 'carte-pro': return 'Carte professionnelle';
    case 'medical': return 'Certificat médical';
    case 'formation': return 'Attestation de formation';
    case 'contrat': return 'Contrat de travail';
    default: return type;
  }
};

export const getStatusBadge = (status: string): React.ReactNode => {
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
