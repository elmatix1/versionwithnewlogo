
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Wrench, CheckCircle, AlertTriangle } from 'lucide-react';

interface StatCardsProps {
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  cancelledCount: number;
}

const StatCards: React.FC<StatCardsProps> = ({
  pendingCount,
  inProgressCount,
  completedCount,
  cancelledCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tâches planifiées</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En cours</p>
              <p className="text-2xl font-bold">{inProgressCount}</p>
            </div>
            <div className="rounded-full bg-amber-100 p-3 text-amber-600">
              <Wrench className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Terminées</p>
              <p className="text-2xl font-bold">{completedCount}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3 text-green-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Annulées</p>
              <p className="text-2xl font-bold">{cancelledCount}</p>
            </div>
            <div className="rounded-full bg-red-100 p-3 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
