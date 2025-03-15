
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarClock, ArrowUpRight } from 'lucide-react';

interface Delivery {
  id: string;
  customer: string;
  destination: string;
  scheduledFor: string;
  status: 'on-time' | 'delayed' | 'at-risk';
}

interface UpcomingDeliveriesProps {
  deliveries: Delivery[];
  className?: string;
}

const statusConfig = {
  'on-time': { 
    label: 'À l\'heure', 
    variant: 'outline' as const, 
    className: 'border-green-500 text-green-600' 
  },
  'delayed': { 
    label: 'Retardée', 
    variant: 'outline' as const, 
    className: 'border-destructive text-destructive' 
  },
  'at-risk': { 
    label: 'À risque', 
    variant: 'outline' as const, 
    className: 'border-amber-500 text-amber-600' 
  },
};

const UpcomingDeliveries: React.FC<UpcomingDeliveriesProps> = ({ deliveries, className }) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle>Livraisons à venir</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="p-4 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{delivery.customer}</h4>
                  <Badge 
                    variant={statusConfig[delivery.status].variant}
                    className={cn("ml-2", statusConfig[delivery.status].className)}
                  >
                    {statusConfig[delivery.status].label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{delivery.destination}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarClock className="mr-1 h-3 w-3" />
                  {delivery.scheduledFor}
                </div>
              </div>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full text-primary">
            Voir toutes les livraisons
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingDeliveries;
