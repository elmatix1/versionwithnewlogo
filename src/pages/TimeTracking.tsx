
import React from 'react';
import TimeClockSystem from '@/components/hr/TimeClockSystem';

const TimeTracking: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Système de Pointage</h1>
        <p className="text-muted-foreground">Enregistrez vos heures d'arrivée et de départ</p>
      </div>
      
      <TimeClockSystem />
    </div>
  );
};

export default TimeTracking;
