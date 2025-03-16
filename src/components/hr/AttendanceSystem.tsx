
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  FileText, 
  UserCheck, 
  User, 
  CheckCircle2, 
  XCircle, 
  Filter 
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AttendanceRecord {
  id: string;
  employee: string;
  date: Date;
  timeIn: string;
  timeOut: string | null;
  status: 'present' | 'absent' | 'late' | 'half-day';
  notes: string;
}

const AttendanceSystem: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportPeriod, setReportPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [reportStartDate, setReportStartDate] = useState<Date>(new Date());
  const [reportEndDate, setReportEndDate] = useState<Date>(new Date());
  
  // Sample attendance records
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: 'att-001',
      employee: 'Thomas Durand',
      date: new Date(),
      timeIn: '08:15',
      timeOut: '17:30',
      status: 'present',
      notes: '',
    },
    {
      id: 'att-002',
      employee: 'Sophie Lefèvre',
      date: new Date(),
      timeIn: '09:05',
      timeOut: '17:45',
      status: 'late',
      notes: 'Retard signalé à l\'avance',
    },
    {
      id: 'att-003',
      employee: 'Pierre Martin',
      date: new Date(),
      timeIn: '',
      timeOut: null,
      status: 'absent',
      notes: 'Congé maladie',
    },
    {
      id: 'att-004',
      employee: 'Marie Lambert',
      date: new Date(),
      timeIn: '08:00',
      timeOut: '13:15',
      status: 'half-day',
      notes: 'Départ anticipé (rendez-vous médical)',
    },
  ]);

  const employees = [
    { id: '1', name: 'Thomas Durand' },
    { id: '2', name: 'Sophie Lefèvre' },
    { id: '3', name: 'Pierre Martin' },
    { id: '4', name: 'Marie Lambert' },
  ];

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

  const filteredRecords = attendanceRecords.filter(record => {
    const recordDate = record.date;
    const selectedDate = date;
    
    const isSameDate = 
      recordDate.getDate() === selectedDate.getDate() &&
      recordDate.getMonth() === selectedDate.getMonth() &&
      recordDate.getFullYear() === selectedDate.getFullYear();
    
    if (!isSameDate) return false;
    
    if (selectedEmployee !== 'all' && record.employee !== selectedEmployee) {
      return false;
    }
    
    return true;
  });

  const handleGenerateReport = () => {
    toast.success("Rapport de présence généré avec succès", {
      description: `Période: ${format(reportStartDate, 'dd/MM/yyyy')} - ${format(reportEndDate, 'dd/MM/yyyy')}`
    });
    setIsReportDialogOpen(false);
  };

  const setPeriod = (period: 'day' | 'week' | 'month') => {
    setReportPeriod(period);
    
    const now = new Date();
    setReportStartDate(now);
    
    const end = new Date(now);
    if (period === 'week') {
      end.setDate(end.getDate() + 7);
    } else if (period === 'month') {
      end.setMonth(end.getMonth() + 1);
    }
    setReportEndDate(end);
  };

  return (
    <div className="space-y-6">
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

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Calendrier de présence</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md"
            />
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Rapports et statistiques</CardTitle>
            <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8">
                  <FileText className="mr-2 h-4 w-4" />
                  Générer un rapport
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Générer un rapport de présence</DialogTitle>
                  <DialogDescription>
                    Sélectionnez la période et les paramètres du rapport.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reportPeriod" className="text-right">
                      Période
                    </Label>
                    <Select
                      value={reportPeriod}
                      onValueChange={(value: 'day' | 'week' | 'month') => setPeriod(value)}
                    >
                      <SelectTrigger id="reportPeriod" className="col-span-3">
                        <SelectValue placeholder="Sélectionner une période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Jour</SelectItem>
                        <SelectItem value="week">Semaine</SelectItem>
                        <SelectItem value="month">Mois</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right">
                      Date de début
                    </Label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Input 
                        id="startDate"
                        type="date"
                        value={format(reportStartDate, 'yyyy-MM-dd')}
                        onChange={(e) => setReportStartDate(new Date(e.target.value))}
                        className="flex-1"
                      />
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endDate" className="text-right">
                      Date de fin
                    </Label>
                    <div className="col-span-3 flex items-center gap-2">
                      <Input 
                        id="endDate"
                        type="date"
                        value={format(reportEndDate, 'yyyy-MM-dd')}
                        onChange={(e) => setReportEndDate(new Date(e.target.value))}
                        className="flex-1"
                      />
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="employeeReport" className="text-right">
                      Employé
                    </Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="employeeReport" className="col-span-3">
                        <SelectValue placeholder="Tous les employés" />
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
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reportFormat" className="text-right">
                      Format
                    </Label>
                    <Select defaultValue="pdf">
                      <SelectTrigger id="reportFormat" className="col-span-3">
                        <SelectValue placeholder="Sélectionner un format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button onClick={handleGenerateReport}>Générer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Taux de présence</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '83%' }}></div>
                    </div>
                    <span className="text-sm">83%</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Taux de ponctualité</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '91%' }}></div>
                    </div>
                    <span className="text-sm">91%</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-3">Derniers rapports</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border rounded-md p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>Rapport de juillet 2023</span>
                    </div>
                    <Button variant="ghost" size="sm">Télécharger</Button>
                  </div>
                  <div className="flex items-center justify-between border rounded-md p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>Rapport de juin 2023</span>
                    </div>
                    <Button variant="ghost" size="sm">Télécharger</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Aucun enregistrement pour cette date
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
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
    </div>
  );
};

export default AttendanceSystem;
