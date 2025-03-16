
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  ClockIcon, 
  XCircle,
  Calendar as CalendarIcon
} from 'lucide-react';
import { toast } from "sonner";

interface AttendanceRecord {
  id: string;
  employee: string;
  date: string;
  timeIn: string;
  timeOut: string;
  status: 'present' | 'late' | 'absent' | 'vacation';
  hours: string;
}

const sampleAttendance: AttendanceRecord[] = [
  {
    id: "ATT-1001",
    employee: "Thomas Durand",
    date: "14/08/2023",
    timeIn: "08:05",
    timeOut: "17:55",
    status: "present",
    hours: "9h50"
  },
  {
    id: "ATT-1002",
    employee: "Sophie Lefèvre",
    date: "14/08/2023",
    timeIn: "08:35",
    timeOut: "18:10",
    status: "late",
    hours: "9h35"
  },
  {
    id: "ATT-1003",
    employee: "Pierre Martin",
    date: "14/08/2023",
    timeIn: "08:00",
    timeOut: "17:30",
    status: "present",
    hours: "9h30"
  },
  {
    id: "ATT-1004",
    employee: "Marie Lambert",
    date: "14/08/2023",
    timeIn: "-",
    timeOut: "-",
    status: "vacation",
    hours: "-"
  }
];

const AttendanceSystem: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(sampleAttendance);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handlePunchIn = () => {
    toast.success("Pointage d'entrée enregistré");
  };

  const handlePunchOut = () => {
    toast.success("Pointage de sortie enregistré");
  };

  const handleGenerateReport = () => {
    toast.info("Génération du rapport d'assiduité");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Présents aujourd'hui</p>
                <p className="text-2xl font-bold">14/15</p>
              </div>
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Retards ce mois</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="rounded-full bg-amber-100 p-3 text-amber-600">
                <ClockIcon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Absences ce mois</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="rounded-full bg-red-100 p-3 text-red-600">
                <XCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Registre de présence - {date ? date.toLocaleDateString('fr-FR') : 'Aujourd\'hui'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Arrivée</TableHead>
                      <TableHead>Départ</TableHead>
                      <TableHead>Heures</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.employee}</TableCell>
                        <TableCell>{record.timeIn}</TableCell>
                        <TableCell>{record.timeOut}</TableCell>
                        <TableCell>{record.hours}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              record.status === "present" ? "bg-green-500" : 
                              record.status === "late" ? "bg-amber-500" : 
                              record.status === "absent" ? "bg-red-500" :
                              "bg-blue-500"
                            }
                          >
                            {record.status === "present" ? "Présent" : 
                            record.status === "late" ? "En retard" : 
                            record.status === "absent" ? "Absent" :
                            "Congé"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={record.timeIn !== "-"} onClick={handlePunchIn}>
                              Arrivée
                            </Button>
                            <Button variant="outline" size="sm" disabled={record.timeOut !== "-" || record.timeIn === "-"} onClick={handlePunchOut}>
                              Départ
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={handleGenerateReport}>Générer un rapport</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="pointer-events-auto"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSystem;
