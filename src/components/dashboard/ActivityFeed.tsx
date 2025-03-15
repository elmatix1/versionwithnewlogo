
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'order' | 'vehicle' | 'employee';
  message: string;
  time: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  className?: string;
}

const typeColors = {
  order: "bg-blue-100 text-blue-700",
  vehicle: "bg-green-100 text-green-700",
  employee: "bg-purple-100 text-purple-700",
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, className }) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle>Activités récentes</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center mt-0.5",
                typeColors[activity.type]
              )}>
                {activity.type.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4">
                <p className="text-sm">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
