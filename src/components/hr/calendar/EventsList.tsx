
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from './types';

interface EventsListProps {
  events: Event[];
  date: Date | undefined;
  onOpenDialog: () => void;
  getEventTypeName: (type: string) => string;
  getEventBadgeColor: (type: string) => string;
}

const EventsList: React.FC<EventsListProps> = ({ 
  events, 
  date, 
  onOpenDialog, 
  getEventTypeName,
  getEventBadgeColor 
}) => {
  return (
    <div className="border rounded-md p-4 h-full bg-white">
      <h3 className="text-lg font-medium mb-4">
        Évènements pour {date ? date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'aujourd\'hui'}
      </h3>
      <div className="space-y-3">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="p-3 border rounded-md flex items-center justify-between">
              <div>
                <span className="font-medium">{event.employee}</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getEventBadgeColor(event.type)}>
                    {getEventTypeName(event.type)}
                  </Badge>
                  {event.description && (
                    <span className="text-sm text-muted-foreground">{event.description}</span>
                  )}
                </div>
              </div>
              <div className="text-sm">
                {event.startTime} - {event.endTime}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucun événement pour cette date</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={onOpenDialog}
            >
              Ajouter un événement
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;
