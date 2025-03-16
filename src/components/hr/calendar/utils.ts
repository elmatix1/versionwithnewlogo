
export const getEventTypeName = (type: string) => {
  switch (type) {
    case 'absence': return 'Absence';
    case 'conge': return 'Congés payés';
    case 'formation': return 'Formation';
    case 'medical': return 'Rendez-vous médical';
    default: return type;
  }
};

export const getEventBadgeColor = (type: string) => {
  switch (type) {
    case 'absence': return 'bg-amber-500';
    case 'conge': return 'bg-blue-500';
    case 'formation': return 'bg-green-500';
    case 'medical': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};
