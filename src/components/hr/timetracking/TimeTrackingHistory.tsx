
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { History } from 'lucide-react';
import { useTimeTracking } from '@/hooks/useTimeTracking';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const TimeTrackingHistory: React.FC = () => {
  const { records, loading } = useTimeTracking();

  const calculateWorkingTime = (clockIn: string | null, clockOut: string | null) => {
    if (!clockIn || !clockOut) return null;
    
    const start = new Date(clockIn);
    const end = new Date(clockOut);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours}h ${diffMinutes}min`;
  };

  const getStatusBadge = (clockIn: string | null, clockOut: string | null) => {
    if (!clockIn) {
      return <Badge variant="secondary">Non pointé</Badge>;
    }
    if (!clockOut) {
      return <Badge variant="outline">En cours</Badge>;
    }
    return <Badge variant="default">Complet</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historique des pointages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Chargement...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Historique des pointages
        </CardTitle>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun pointage enregistré pour le moment.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Arrivée</TableHead>
                  <TableHead>Départ</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="font-medium">
                        {format(new Date(record.date), 'dd/MM/yyyy', { locale: fr })}
                      </div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {format(new Date(record.date), 'EEEE', { locale: fr })}
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.clock_in_time ? (
                        <div className="font-medium">
                          {format(new Date(record.clock_in_time), 'HH:mm', { locale: fr })}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {record.clock_out_time ? (
                        <div className="font-medium">
                          {format(new Date(record.clock_out_time), 'HH:mm', { locale: fr })}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {calculateWorkingTime(record.clock_in_time, record.clock_out_time) || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(record.clock_in_time, record.clock_out_time)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimeTrackingHistory;
