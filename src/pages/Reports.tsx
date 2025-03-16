
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  FileText,
  Calendar,
  TrendingUp,
  Truck,
  Users,
  Download,
  BarChart4,
  LineChart,
  PieChart
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<string>("");
  const [reportPeriod, setReportPeriod] = useState<string>("");
  
  const handleViewAllReports = () => {
    toast.info("Consultation des rapports", {
      description: "Affichage de tous les rapports disponibles."
    });
  };
  
  const handleDownloadReport = (reportName: string) => {
    toast.success("Téléchargement du rapport", {
      description: `Le rapport ${reportName} a été téléchargé.`
    });
  };
  
  const handleCreateReport = () => {
    if (!reportType || !reportPeriod) {
      toast.error("Formulaire incomplet", {
        description: "Veuillez sélectionner un type et une période."
      });
      return;
    }
    
    toast.success("Rapport créé", {
      description: `Votre rapport ${reportType} pour la période ${reportPeriod} a été généré.`
    });
  };
  
  const handleConfigureSchedule = () => {
    toast.success("Configuration enregistrée", {
      description: "La planification des rapports a été configurée."
    });
  };
  
  const handleViewDetail = (chartType: string) => {
    toast.info(`Détails - ${chartType}`, {
      description: `Visualisation détaillée des données de ${chartType}.`
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Rapports et statistiques</h1>
        <p className="text-muted-foreground">Analyse et visualisation des données commerciales</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chiffre d'affaires (mois)</p>
                <p className="text-2xl font-bold">142 580 €</p>
                <p className="text-xs text-green-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> +12,5% vs mois précédent
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <BarChart className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commandes livrées</p>
                <p className="text-2xl font-bold">248</p>
                <p className="text-xs text-green-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> +8,3% vs mois précédent
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                <Truck className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nouveaux clients</p>
                <p className="text-2xl font-bold">18</p>
                <p className="text-xs text-amber-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> +2,1% vs mois précédent
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Visualisations avancées</CardTitle>
          <CardDescription>Accédez aux graphiques et tableaux de bord interactifs</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance">
            <TabsList className="mb-6">
              <TabsTrigger value="performance" className="flex items-center gap-1">
                <BarChart4 size={16} />
                <span>Performance</span>
              </TabsTrigger>
              <TabsTrigger value="financial" className="flex items-center gap-1">
                <LineChart size={16} />
                <span>Financier</span>
              </TabsTrigger>
              <TabsTrigger value="operational" className="flex items-center gap-1">
                <PieChart size={16} />
                <span>Opérationnel</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Évolution du chiffre d'affaires</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <BarChart4 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Graphique d'évolution du CA</p>
                      <Button variant="outline" className="mt-4" onClick={() => handleViewDetail("Évolution du chiffre d'affaires")}>
                        Voir en détail
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition des commandes</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Répartition par type de client</p>
                      <Button variant="outline" className="mt-4" onClick={() => handleViewDetail("Répartition des commandes")}>
                        Voir en détail
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="financial" className="m-0">
              <div className="text-center p-8">
                <LineChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Rapports financiers</h3>
                <p className="text-muted-foreground mb-6">Analysez les résultats financiers, marges et rentabilité.</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Générer un rapport</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Générer un rapport financier</DialogTitle>
                      <DialogDescription>
                        Sélectionnez les paramètres pour votre rapport financier.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="financial-type" className="text-right">
                          Type
                        </Label>
                        <Select onValueChange={value => setReportType(value)}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Sélectionner le type de rapport" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ca-mensuel">Chiffre d'affaires mensuel</SelectItem>
                            <SelectItem value="marge-brute">Marge brute</SelectItem>
                            <SelectItem value="rentabilite">Rentabilité par client</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="financial-period" className="text-right">
                          Période
                        </Label>
                        <Select onValueChange={value => setReportPeriod(value)}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Sélectionner la période" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mois-courant">Mois courant</SelectItem>
                            <SelectItem value="trimestre">Trimestre en cours</SelectItem>
                            <SelectItem value="annee">Année complète</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateReport}>Générer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>
            
            <TabsContent value="operational" className="m-0">
              <div className="text-center p-8">
                <Truck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Rapports opérationnels</h3>
                <p className="text-muted-foreground mb-6">Analysez les performances opérationnelles, délais et qualité.</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Générer un rapport</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Générer un rapport opérationnel</DialogTitle>
                      <DialogDescription>
                        Sélectionnez les paramètres pour votre rapport opérationnel.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="operational-type" className="text-right">
                          Type
                        </Label>
                        <Select onValueChange={value => setReportType(value)}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Sélectionner le type de rapport" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="delais-livraison">Délais de livraison</SelectItem>
                            <SelectItem value="perf-vehicules">Performance des véhicules</SelectItem>
                            <SelectItem value="taux-incidents">Taux d'incidents</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="operational-period" className="text-right">
                          Période
                        </Label>
                        <Select onValueChange={value => setReportPeriod(value)}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Sélectionner la période" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="semaine">Semaine courante</SelectItem>
                            <SelectItem value="mois-courant">Mois courant</SelectItem>
                            <SelectItem value="trimestre">Trimestre en cours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateReport}>Générer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rapports périodiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Rapport mensuel - Juillet 2023</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDownloadReport("Rapport mensuel - Juillet 2023")}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Rapport trimestriel - Q2 2023</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDownloadReport("Rapport trimestriel - Q2 2023")}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Rapport annuel - 2022</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDownloadReport("Rapport annuel - 2022")}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              <Button className="w-full mt-2" onClick={handleViewAllReports}>Voir tous les rapports</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rapports personnalisés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Créer un rapport</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Générez un rapport personnalisé en sélectionnant les données et la période qui vous intéressent.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Créer un rapport</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer un rapport personnalisé</DialogTitle>
                    <DialogDescription>
                      Sélectionnez les critères pour votre rapport personnalisé.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="custom-title" className="text-right">
                        Titre
                      </Label>
                      <Input
                        id="custom-title"
                        className="col-span-3"
                        placeholder="Titre du rapport"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="custom-type" className="text-right">
                        Catégorie
                      </Label>
                      <Select onValueChange={value => setReportType(value)}>
                        <SelectTrigger id="custom-type" className="col-span-3">
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="operationnel">Opérationnel</SelectItem>
                          <SelectItem value="financier">Financier</SelectItem>
                          <SelectItem value="rh">Ressources humaines</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="custom-period" className="text-right">
                        Période
                      </Label>
                      <Select onValueChange={value => setReportPeriod(value)}>
                        <SelectTrigger id="custom-period" className="col-span-3">
                          <SelectValue placeholder="Sélectionner une période" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jour">Jour</SelectItem>
                          <SelectItem value="semaine">Semaine</SelectItem>
                          <SelectItem value="mois">Mois</SelectItem>
                          <SelectItem value="trimestre">Trimestre</SelectItem>
                          <SelectItem value="annee">Année</SelectItem>
                          <SelectItem value="personnalise">Personnalisée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateReport}>Créer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Calendrier des rapports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Planifier des rapports</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Planifiez la génération et l'envoi automatique de rapports à vos équipes.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Configurer</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configuration du calendrier des rapports</DialogTitle>
                    <DialogDescription>
                      Définissez la fréquence et les destinataires des rapports automatiques.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="schedule-report" className="text-right">
                        Rapport
                      </Label>
                      <Select>
                        <SelectTrigger id="schedule-report" className="col-span-3">
                          <SelectValue placeholder="Sélectionner un rapport" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ca-mensuel">Chiffre d'affaires mensuel</SelectItem>
                          <SelectItem value="delais-livraison">Délais de livraison</SelectItem>
                          <SelectItem value="performance-rh">Performance RH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="schedule-frequency" className="text-right">
                        Fréquence
                      </Label>
                      <Select>
                        <SelectTrigger id="schedule-frequency" className="col-span-3">
                          <SelectValue placeholder="Sélectionner une fréquence" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quotidien">Quotidienne</SelectItem>
                          <SelectItem value="hebdomadaire">Hebdomadaire</SelectItem>
                          <SelectItem value="mensuel">Mensuelle</SelectItem>
                          <SelectItem value="trimestriel">Trimestrielle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="schedule-recipients" className="text-right">
                        Destinataires
                      </Label>
                      <Input
                        id="schedule-recipients"
                        className="col-span-3"
                        placeholder="Adresses email séparées par des virgules"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleConfigureSchedule}>Enregistrer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
