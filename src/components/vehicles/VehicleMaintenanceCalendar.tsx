
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarClock, PlusCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastMaintenance: string;
  fuelLevel: number;
  nextService: string;
  driver?: string;
  location?: string;
}

interface MaintenanceEvent {
  date: Date;
  vehicleName: string;
  type: 'regular' | 'repair' | 'inspection';
  description: string;
}

interface VehicleMaintenanceCalendarProps {
  vehicles: Vehicle[];
}

const VehicleMaintenanceCalendar: React.FC<VehicleMaintenanceCalendarProps> = ({ vehicles }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>('calendar');

  // Exemple d'événements de maintenance
  const maintenanceEvents: MaintenanceEvent[] = [
    {
      date: new Date(2023, 8, 22), // Le 22 septembre 2023
      vehicleName: 'TL-3045',
      type: 'regular',
      description: 'Entretien régulier des 30 000 km'
    },
    {
      date: new Date(2023, 7, 5), // Le 5 août 2023
      vehicleName: 'TL-2189',
      type: 'regular',
      description: 'Vidange et filtre à huile'
    },
    {
      date: new Date(), // Aujourd'hui
      vehicleName: 'TL-5632',
      type: 'inspection',
      description: 'Contrôle technique annuel'
    },
    {
      date: new Date(new Date().setDate(new Date().getDate() + 3)), // Dans 3 jours
      vehicleName: 'TL-1087',
      type: 'repair',
      description: 'Remplacement plaquettes de frein'
    }
  ];

  // Filtrer les événements pour la date sélectionnée
  const selectedDateEvents = maintenanceEvents.filter(
    event => format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  // Fonction pour les jours avec des événements
  const isDayWithEvent = (day: Date) => {
    return maintenanceEvents.some(
      event => format(event.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
  };
  
  const handleAddMaintenance = () => {
    toast.success("Maintenance planifiée", {
      description: `Un nouvel entretien a été planifié pour le ${format(date, 'dd MMMM yyyy', { locale: fr })}`
    });
  };
  
  const typeLabels = {
    regular: { label: 'Régulier', color: 'bg-blue-500' },
    repair: { label: 'Réparation', color: 'bg-red-500' },
    inspection: { label: 'Inspection', color: 'bg-green-500' }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  className="mx-auto"
                  modifiers={{
                    event: (date) => isDayWithEvent(date),
                  }}
                  modifiersClassNames={{
                    event: "bg-blue-100 font-bold text-blue-600 relative",
                  }}
                />
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">
                    {format(date, 'dd MMMM yyyy', { locale: fr })}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedDateEvents.length
                      ? `${selectedDateEvents.length} entretien(s) prévu(s)`
                      : 'Aucun entretien prévu'
                    }
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleAddMaintenance}
                >
                  <PlusCircle size={16} />
                  <span>Ajouter</span>
                </Button>
              </div>

              {selectedDateEvents.length > 0 ? (
                <div className="space-y-2">
                  {selectedDateEvents.map((event, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4 pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{event.vehicleName}</h4>
                              <Badge className={typeLabels[event.type].color}>
                                {typeLabels[event.type].label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </div>
                          <Button size="icon" variant="ghost">
                            <CalendarClock size={16} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun entretien prévu pour cette date</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sélectionnez une autre date ou ajoutez un nouvel entretien
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Entretiens à venir</h3>
            {maintenanceEvents
              .filter(event => event.date >= new Date())
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((event, index) => (
                <Card key={index}>
                  <CardContent className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{event.vehicleName}</h4>
                          <Badge className={typeLabels[event.type].color}>
                            {typeLabels[event.type].label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(event.date, 'dd MMMM yyyy', { locale: fr })}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">Détails</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Historique des entretiens</h3>
            {maintenanceEvents
              .filter(event => event.date < new Date())
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map((event, index) => (
                <Card key={index}>
                  <CardContent className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{event.vehicleName}</h4>
                          <Badge className={typeLabels[event.type].color}>
                            {typeLabels[event.type].label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(event.date, 'dd MMMM yyyy', { locale: fr })}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">Voir rapport</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleMaintenanceCalendar;
