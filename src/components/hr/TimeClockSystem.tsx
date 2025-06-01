
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTimeTracking } from '@/hooks/useTimeTracking';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import TimeTrackingHistory from './timetracking/TimeTrackingHistory';

const TimeClockSystem: React.FC = () => {
  const { user } = useAuth();
  const { todayRecord, clockIn, clockOut, loading } = useTimeTracking();

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Connexion requise</h3>
            <p className="text-muted-foreground">
              Vous devez être connecté pour accéder au système de pointage.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentTime = format(new Date(), 'HH:mm:ss', { locale: fr });
  const currentDate = format(new Date(), 'EEEE dd MMMM yyyy', { locale: fr });

  const hasClockInToday = todayRecord?.clock_in_time;
  const hasClockOutToday = todayRecord?.clock_out_time;

  const canClockIn = !hasClockInToday && !loading;
  const canClockOut = hasClockInToday && !hasClockOutToday && !loading;

  const getStatusMessage = () => {
    if (loading) {
      return {
        message: 'Enregistrement en cours...',
        className: 'text-blue-600'
      };
    }
    
    if (hasClockInToday && hasClockOutToday) {
      return {
        message: '✓ Votre pointage est complet pour aujourd\'hui.',
        className: 'text-green-600'
      };
    }
    
    if (hasClockInToday && !hasClockOutToday) {
      return {
        message: 'Vous êtes actuellement au travail. N\'oubliez pas de pointer votre départ.',
        className: 'text-blue-600'
      };
    }
    
    return {
      message: 'Pointez votre arrivée pour commencer votre journée de travail.',
      className: 'text-muted-foreground'
    };
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="space-y-6">
      {/* Carte de pointage principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Système de pointage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Informations utilisateur et heure */}
            <div className="text-center bg-muted/30 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-1">Bonjour, {user.name || user.email}</h3>
              <div className="text-2xl font-bold text-primary mb-1">{currentTime}</div>
              <div className="text-muted-foreground capitalize">{currentDate}</div>
            </div>

            {/* État du pointage aujourd'hui */}
            {todayRecord && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium mb-3">Pointage d'aujourd'hui</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground block">Arrivée</span>
                    <span className="font-medium">
                      {todayRecord.clock_in_time 
                        ? format(new Date(todayRecord.clock_in_time), 'HH:mm:ss', { locale: fr })
                        : 'Non pointée'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground block">Départ</span>
                    <span className="font-medium">
                      {todayRecord.clock_out_time 
                        ? format(new Date(todayRecord.clock_out_time), 'HH:mm:ss', { locale: fr })
                        : 'Non pointé'
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Boutons de pointage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={clockIn}
                disabled={!canClockIn}
                size="lg"
                className="h-16 text-lg"
                variant={canClockIn ? "default" : "secondary"}
              >
                <LogIn className="mr-2 h-6 w-6" />
                {loading ? "Enregistrement..." : "Pointer l'arrivée"}
              </Button>
              
              <Button
                onClick={clockOut}
                disabled={!canClockOut}
                size="lg"
                className="h-16 text-lg"
                variant={canClockOut ? "default" : "secondary"}
              >
                <LogOut className="mr-2 h-6 w-6" />
                {loading ? "Enregistrement..." : "Pointer le départ"}
              </Button>
            </div>

            {/* Message de statut dynamique */}
            <div className={`text-sm text-center ${statusInfo.className}`}>
              <p>{statusInfo.message}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historique des pointages */}
      <TimeTrackingHistory />
    </div>
  );
};

export default TimeClockSystem;
