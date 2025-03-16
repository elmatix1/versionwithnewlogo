
import React from 'react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  Clock, 
  UserCheck, 
  User
} from 'lucide-react';

const StatCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Présents aujourd'hui</p>
              <p className="text-2xl font-bold">15/18</p>
            </div>
            <div className="rounded-full bg-green-100 p-3 text-green-600">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Retards ce mois</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="rounded-full bg-amber-100 p-3 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Absences ce mois</p>
              <p className="text-2xl font-bold">8</p>
            </div>
            <div className="rounded-full bg-red-100 p-3 text-red-600">
              <User className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
