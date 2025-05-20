
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  message: string;
}

const Error: React.FC<ErrorProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md p-6 bg-red-50 rounded-lg border border-red-200">
        <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-red-700 mb-2">Erreur de chargement</h3>
        <p className="text-red-600 mb-4">{message}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    </div>
  );
};

export default Error;
