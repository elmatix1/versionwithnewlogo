
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Filter, 
  User, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { format } from 'date-fns';
import { AttendanceRecord, Employee } from './types';

interface AttendanceTableProps {
  date: Date;
  selectedEmployee: string;
  setSelectedEmployee: (employee: string) => void;
  records: AttendanceRecord[];
  employees: Employee[];
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ 
  date, 
  selectedEmployee, 
  setSelectedEmployee, 
  records, 
  employees 
}) => {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-500">Présent</Badge>;
      case 'absent':
        return <Badge className="bg-red-500">Absent</Badge>;
      case 'late':
        return <Badge className="bg-amber-500">En retard</Badge>;
      case 'half-day':
        return <Badge className="bg-blue-500">Demi-journée</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Registre de présence du {format(date, 'dd/MM/yyyy')}</CardTitle>
        <div className="flex gap-2">
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger className="w-[200px]">
              <div className="flex items-center gap-2">
                <Filter size={16} />
                <span>Filtrer par employé</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les employés</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.name}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Heure d'arrivée</TableHead>
                <TableHead>Heure de départ</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Aucun enregistrement pour cette date
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-muted-foreground" />
                        <span>{record.employee}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      {record.timeIn ? record.timeIn : '—'}
                    </TableCell>
                    <TableCell>
                      {record.timeOut ? record.timeOut : '—'}
                    </TableCell>
                    <TableCell>
                      <p className="truncate max-w-[200px]">
                        {record.notes || '—'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" title="Marquer présent">
                          <CheckCircle2 size={16} className="text-green-500" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Marquer absent">
                          <XCircle size={16} className="text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceTable;
