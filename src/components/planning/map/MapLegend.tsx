
import React from 'react';

interface MapLegendProps {
  routesCount: number;
}

const MapLegend: React.FC<MapLegendProps> = ({ routesCount }) => {
  return (
    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 z-[1000] border">
      <div className="text-sm font-semibold text-gray-800 mb-3">📍 Légende des Trajets</div>
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-xs text-gray-700">
          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm flex items-center justify-center">
            <span className="text-white text-[8px]">🚚</span>
          </div>
          <span className="font-medium">Point de départ</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-700">
          <div className="w-4 h-4 bg-green-500 border-2 border-white shadow-sm transform rotate-45 flex items-center justify-center">
            <span className="text-white text-[8px] transform -rotate-45">🏁</span>
          </div>
          <span className="font-medium">Point d'arrivée</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-700">
          <div className="w-3 h-3 rounded-full bg-white border-2 border-blue-500"></div>
          <span className="font-medium">Points intermédiaires</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-700">
          <div className="w-8 h-0.5 bg-blue-500 rounded" style={{borderTop: '3px dashed #3b82f6', borderBottom: '2px solid #3b82f6'}}></div>
          <span className="font-medium">Route optimisée</span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-600 font-medium">
          📊 {routesCount} trajet{routesCount > 1 ? 's' : ''} optimisé{routesCount > 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
