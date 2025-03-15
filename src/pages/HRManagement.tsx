
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  CalendarClock, 
  FileCheck, 
  FileWarning, 
  FileClock,
  Clock,
  UserCheck,
  Users,
  FileEdit,
  UserX,
  PlusCircle
} from 'lucide-react';

const HRManagement: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Ressources Humaines</h1>
        <p className="text-muted-foreground">Gestion des chauffeurs et des employés</p>
      </div>

      <Tabs defaultValue="drivers">
        <TabsList className="mb-6">
          <TabsTrigger value="drivers" className="flex items-center gap-1">
            <Users size={16} />
            <span>Chauffeurs</span>
          </TabsTrigger>
          <TabsTrigger value="availability" className="flex items-center gap-1">
            <CalendarClock size={16} />
            <span>Disponibilités</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-1">
            <FileCheck size={16} />
            <span>Documents</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-1">
            <Clock size={16} />
            <span>Pointage</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drivers">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Chauffeurs</CardTitle>
                <Button className="flex items-center gap-1">
                  <PlusCircle size={16} />
                  <span>Ajouter un chauffeur</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Expérience</TableHead>
                      <TableHead>Véhicules assignés</TableHead>
                      <TableHead>Documents valides</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { 
                        id: 1, 
                        name: "Thomas Durand", 
                        status: "active", 
                        experience: "5 ans", 
                        vehicles: ["TL-3045", "TL-1203"],
                        documents: 90
                      },
                      { 
                        id: 2, 
                        name: "Sophie Lefèvre", 
                        status: "active", 
                        experience: "3 ans", 
                        vehicles: ["TL-2189"],
                        documents: 100
                      },
                      { 
                        id: 3, 
                        name: "Pierre Martin", 
                        status: "off-duty", 
                        experience: "7 ans", 
                        vehicles: ["TL-1203", "TL-4023"],
                        documents: 75
                      }
                    ].map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{driver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{driver.name}</div>
                              <div className="text-xs text-muted-foreground">{driver.experience} d'expérience</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={driver.status === "active" ? "default" : "secondary"}>
                            {driver.status === "active" ? "Actif" : "Hors service"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span>{driver.experience}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {driver.vehicles.map((vehicle, idx) => (
                              <Badge key={idx} variant="outline">{vehicle}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={driver.documents} className="h-2 w-20" />
                            <span className="text-sm">{driver.documents}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <UserCheck className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FileEdit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <UserX className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Disponibilité des chauffeurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <CalendarClock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Calendrier de disponibilité</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Planifiez et gérez les disponibilités des chauffeurs pour une meilleure organisation des trajets.
                </p>
                <Button>Afficher le calendrier</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm">Documents valides</span>
                    <span className="text-2xl font-bold">124</span>
                  </div>
                  <div className="rounded-full bg-green-100 p-3 text-green-600">
                    <FileCheck className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm">Documents à renouveler</span>
                    <span className="text-2xl font-bold">18</span>
                  </div>
                  <div className="rounded-full bg-amber-100 p-3 text-amber-600">
                    <FileWarning className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm">Documents expirés</span>
                    <span className="text-2xl font-bold">5</span>
                  </div>
                  <div className="rounded-full bg-destructive/10 p-3 text-destructive">
                    <FileClock className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Gestion des documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <FileCheck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Section des documents</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Gérez les permis, assurances et autres documents administratifs des chauffeurs.
                </p>
                <Button>Gérer les documents</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Pointage et présence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Système de pointage</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Suivez les présences, retards et absences de tous les employés.
                </p>
                <Button>Accéder au système de pointage</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRManagement;
