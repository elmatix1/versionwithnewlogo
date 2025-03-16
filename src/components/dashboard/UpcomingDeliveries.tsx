
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Delivery = {
  id: string;
  customer: string;
  destination: string;
  scheduledFor: string;
  status: 'on-time' | 'at-risk' | 'delayed';
};

interface UpcomingDeliveriesProps {
  deliveries: Delivery[];
  className?: string;
}

const statusConfig = {
  'on-time': { label: 'À l\'heure', color: 'bg-green-500' },
  'at-risk': { label: 'À risque', color: 'bg-amber-500' },
  'delayed': { label: 'En retard', color: 'bg-red-500' }
};

const UpcomingDeliveries: React.FC<UpcomingDeliveriesProps> = ({ deliveries, className }) => {
  const navigate = useNavigate();

  const handleViewAllDeliveries = () => {
    navigate('/planning');
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Livraisons à venir</CardTitle>
        <Button variant="ghost" size="sm" className="h-8 gap-1" onClick={handleViewAllDeliveries}>
          <Clock className="mr-1 h-4 w-4" />
          Voir toutes
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="flex flex-col space-y-2 border-b pb-3 last:border-0">
              <div className="flex justify-between items-start">
                <span className="font-medium">{delivery.customer}</span>
                <Badge className={statusConfig[delivery.status].color}>
                  {statusConfig[delivery.status].label}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                <span>{delivery.destination}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{delivery.scheduledFor}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingDeliveries;
