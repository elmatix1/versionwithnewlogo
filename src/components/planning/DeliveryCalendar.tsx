
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Delivery } from '@/hooks/useDeliveries';
import { CalendarDays, Clock, MapPin, Truck, User } from 'lucide-react';

interface DeliveryCalendarProps {
  deliveries: Delivery[];
}

const statusConfig = {
  'planned': { 
    label: 'Planifiée', 
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
  'delayed': { 
    label: 'Retardée', 
    className: 'bg-red-500' 
  }
};

const DeliveryCalendar: React.FC<DeliveryCalendarProps> = ({ deliveries }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Fonction pour obtenir les livraisons d'une date donnée
  const getDeliveriesForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return deliveries.filter(delivery => delivery.date === dateString);
  };

  // Fonction pour déterminer si une date a des livraisons
  const hasDeliveries = (date: Date) => {
    return getDeliveriesForDate(date).length > 0;
  };

  // Obtenir les livraisons pour la date sélectionnée
  const selectedDateDeliveries = selectedDate ? getDeliveriesForDate(selectedDate) : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      {/* Calendrier */}
      <div className="flex flex-col">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Calendrier des livraisons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-full"
              modifiers={{
                hasDeliveries: (date) => hasDeliveries(date)
              }}
              modifiersStyles={{
                hasDeliveries: { 
                  backgroundColor: '#dbeafe', 
                  color: '#1e40af',
                  fontWeight: 'bold'
                }
              }}
              footer={
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-blue-100 rounded"></div>
                    <span>Jours avec livraisons</span>
                  </div>
                </div>
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Détails des livraisons pour la date sélectionnée */}
      <div className="flex flex-col">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Livraisons du {selectedDate?.toLocaleDateString('fr-FR')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateDeliveries.length === 0 ? (
              <div className="text-center py-8">
                <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Aucune livraison prévue pour cette date
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedDateDeliveries.map((delivery) => {
                  const statusCfg = statusConfig[delivery.status] || statusConfig['planned'];
                  
                  return (
                    <div key={delivery.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={statusCfg.className}>
                            {statusCfg.label}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            PLN-{delivery.id}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {delivery.time}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">Chauffeur:</span>
                          <span>{delivery.driver}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-green-500" />
                          <span className="font-medium">Véhicule:</span>
                          <span>{delivery.vehicle}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-red-500" />
                          <span className="font-medium">Trajet:</span>
                          <span>{delivery.origin} → {delivery.destination}</span>
                        </div>
                        
                        {delivery.notes && (
                          <div className="mt-2 p-2 bg-muted rounded text-xs">
                            <span className="font-medium">Notes:</span> {delivery.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryCalendar;
