
import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg font-medium">Chargement des tâches de maintenance...</p>
      </div>
    </div>
  );
};

export default Loading;
