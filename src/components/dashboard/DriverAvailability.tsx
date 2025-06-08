
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Driver {
  id: string;
  name: string;
  avatar?: string;
  status: 'available' | 'on-duty' | 'off-duty' | 'on-leave';
  lastActivity?: string;
}

interface DriverAvailabilityProps {
  drivers: Driver[];
  className?: string;
}

const statusConfig = {
  'available': { 
    label: 'Disponible', 
    className: 'bg-green-500 text-white'
  },
  'on-duty': { 
    label: 'En service', 
    className: 'bg-blue-500 text-white'
  },
  'off-duty': { 
    label: 'Hors service', 
    className: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200'
  },
  'on-leave': { 
    label: 'En congé', 
    className: 'bg-orange-500 text-white'
  },
};

const DriverAvailability: React.FC<DriverAvailabilityProps> = ({ drivers, className }) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle>Disponibilité des chauffeurs</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {drivers.map((driver) => (
            <div key={driver.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={driver.avatar} alt={driver.name} />
                  <AvatarFallback>{driver.name.charAt(0)}{driver.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{driver.name}</h4>
                  {driver.lastActivity && (
                    <p className="text-xs text-muted-foreground">
                      {driver.status === 'on-duty' ? 'Actif' : 'Dernière activité'}: {driver.lastActivity}
                    </p>
                  )}
                </div>
              </div>
              <Badge className={statusConfig[driver.status].className}>
                {statusConfig[driver.status].label}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverAvailability;
