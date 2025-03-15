
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  FileText, 
  Search, 
  Filter, 
  MoreVertical, 
  Plus, 
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight
} from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  origin: string;
  destination: string;
  status: 'en-attente' | 'en-cours' | 'livree' | 'annulee';
  date: string;
  createdAt: string;
  priority: 'normal' | 'urgent' | 'basse';
  amount: string;
}

const orders: Order[] = [
  {
    id: "CMD-1038",
    customer: "Société Dupont",
    origin: "Lyon, Dépôt Central",
    destination: "Paris, 15ème",
    status: "en-cours",
    date: "Aujourd'hui, 14:30",
    createdAt: "Hier, 10:15",
    priority: "urgent",
    amount: "1 250,00 €"
  },
  {
    id: "CMD-1037",
    customer: "Entreprise Martin",
    origin: "Marseille, Port",
    destination: "Lyon, Centre",
    status: "en-attente",
    date: "Aujourd'hui, 16:45",
    createdAt: "Hier, 09:30",
    priority: "normal",
    amount: "980,00 €"
  },
  {
    id: "CMD-1036",
    customer: "Distribution Rapide",
    origin: "Lille, Entrepôt Nord",
    destination: "Marseille, Port",
    status: "livree",
    date: "Hier, 15:30",
    createdAt: "22/07/2023",
    priority: "normal",
    amount: "2 340,00 €"
  },
  {
    id: "CMD-1035",
    customer: "Transports Bernard",
    origin: "Paris, Entrepôt Sud",
    destination: "Bordeaux, Zone Industrielle",
    status: "annulee",
    date: "Annulée",
    createdAt: "22/07/2023",
    priority: "basse",
    amount: "1 780,00 €"
  },
  {
    id: "CMD-1034",
    customer: "Logistique Express",
    origin: "Nantes, Dépôt Central",
    destination: "Strasbourg, Zone Est",
    status: "livree",
    date: "21/07/2023",
    createdAt: "20/07/2023",
    priority: "urgent",
    amount: "1 560,00 €"
  }
];

const statusConfig = {
  'en-attente': { 
    label: 'En attente', 
    className: 'bg-amber-500' 
  },
  'en-cours': { 
    label: 'En cours', 
    className: 'bg-blue-500' 
  },
  'livree': { 
    label: 'Livrée', 
    className: 'bg-green-500' 
  },
  'annulee': { 
    label: 'Annulée', 
    className: 'bg-zinc-500' 
  }
};

const priorityConfig = {
  'normale': { 
    label: 'Normale', 
    className: 'border-blue-500 text-blue-600' 
  },
  'urgent': { 
    label: 'Urgente', 
    className: 'border-red-500 text-red-600' 
  },
  'basse': { 
    label: 'Basse', 
    className: 'border-zinc-500 text-zinc-600' 
  }
};

const OrderManagement: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Gestion des commandes</h1>
        <p className="text-muted-foreground">Suivez et gérez les commandes de transport</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total commandes</p>
                <p className="text-2xl font-bold">152</p>
              </div>
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold">28</p>
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
                <p className="text-sm text-muted-foreground">En cours</p>
                <p className="text-2xl font-bold">45</p>
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
                <p className="text-sm text-muted-foreground">Livrées (ce mois)</p>
                <p className="text-2xl font-bold">79</p>
              </div>
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Commandes</CardTitle>
              <CardDescription>Gérez toutes les commandes de transport</CardDescription>
            </div>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Nouvelle commande</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Rechercher par ID, client ou destination..." 
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              <span>Filtres</span>
            </Button>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="in-progress">En cours</TabsTrigger>
              <TabsTrigger value="delivered">Livrées</TabsTrigger>
              <TabsTrigger value="canceled">Annulées</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Commande</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Origine</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date de livraison</TableHead>
                      <TableHead>Priorité</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{order.origin}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{order.destination}</TableCell>
                        <TableCell>
                          <Badge className={statusConfig[order.status].className}>
                            {statusConfig[order.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={priorityConfig[order.priority]?.className || ''}>
                            {priorityConfig[order.priority]?.label || order.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.amount}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                                <DropdownMenuItem>Modifier</DropdownMenuItem>
                                <DropdownMenuItem>Suivi en temps réel</DropdownMenuItem>
                                <DropdownMenuItem>Documents</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Annuler</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="m-0">
              <div className="text-center p-6">
                <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Commandes en attente</h3>
                <p className="text-muted-foreground">Liste filtrée des commandes en attente de traitement.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="in-progress" className="m-0">
              <div className="text-center p-6">
                <Truck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Commandes en cours</h3>
                <p className="text-muted-foreground">Liste filtrée des commandes en cours de livraison.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="delivered" className="m-0">
              <div className="text-center p-6">
                <CheckCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Commandes livrées</h3>
                <p className="text-muted-foreground">Liste filtrée des commandes livrées avec succès.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="canceled" className="m-0">
              <div className="text-center p-6">
                <XCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Commandes annulées</h3>
                <p className="text-muted-foreground">Liste filtrée des commandes qui ont été annulées.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagement;
