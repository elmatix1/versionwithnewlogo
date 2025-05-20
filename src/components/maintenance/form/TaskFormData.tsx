
// Liste des véhicules disponibles
export const availableVehicles = [
  { value: "TL-3045", label: "TL-3045" },
  { value: "TL-2189", label: "TL-2189" },
  { value: "TL-4023", label: "TL-4023" },
  { value: "TL-5632", label: "TL-5632" },
  { value: "TL-1764", label: "TL-1764" },
  { value: "TL-8901", label: "TL-8901" },
  { value: "TL-6734", label: "TL-6734" },
];

// Liste des types de maintenance
export const taskTypes = [
  { value: "repair", label: "Réparation" },
  { value: "inspection", label: "Inspection" },
  { value: "service", label: "Entretien" },
  { value: "other", label: "Autre" }
];

// Liste des statuts
export const taskStatuses = [
  { value: "pending", label: "En attente" },
  { value: "in-progress", label: "En cours" },
  { value: "completed", label: "Terminée" },
  { value: "cancelled", label: "Annulée" }
];

// Liste des priorités
export const taskPriorities = [
  { value: "low", label: "Basse" },
  { value: "normal", label: "Moyenne" },
  { value: "high", label: "Haute" }
];

// Liste des techniciens
export const technicians = [
  { value: "Martin Dupuis", label: "Martin Dupuis" },
  { value: "Lucas Moreau", label: "Lucas Moreau" },
  { value: "Philippe Girard", label: "Philippe Girard" },
  { value: "Sophie Legrand", label: "Sophie Legrand" },
  { value: "Thomas Dubois", label: "Thomas Dubois" },
];

// Configuration UI pour les statuts
export const statusConfig = {
  'pending': { 
    label: 'En attente', 
    className: 'bg-blue-500' 
  },
  'in-progress': { 
    label: 'En cours', 
    className: 'bg-amber-500' 
  },
  'completed': { 
    label: 'Terminée', 
    className: 'bg-green-500' 
  },
  'cancelled': { 
    label: 'Annulée', 
    className: 'bg-red-500' 
  }
};

// Configuration UI pour les priorités
export const priorityConfig = {
  'low': { 
    label: 'Basse', 
    className: 'border-gray-500 text-gray-600' 
  },
  'normal': { 
    label: 'Moyenne', 
    className: 'border-blue-500 text-blue-600' 
  },
  'high': { 
    label: 'Haute', 
    className: 'border-amber-500 text-amber-600' 
  }
};

// Configuration UI pour les types
export const typeConfig = {
  'repair': { 
    label: 'Réparation', 
    className: 'bg-amber-100 text-amber-800' 
  },
  'service': { 
    label: 'Entretien', 
    className: 'bg-blue-100 text-blue-800' 
  },
  'inspection': { 
    label: 'Inspection', 
    className: 'bg-green-100 text-green-800' 
  },
  'other': { 
    label: 'Autre', 
    className: 'bg-gray-100 text-gray-800' 
  }
};
