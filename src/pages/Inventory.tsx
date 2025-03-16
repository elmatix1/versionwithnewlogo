
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
import { Progress } from '@/components/ui/progress';
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
  Package,
  Search,
  Plus,
  Filter,
  AlertTriangle,
  ShoppingCart,
  Truck,
  ArrowUpDown,
  BarChart,
  Package2
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  threshold: number;
  location: string;
  lastUpdate: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

const inventoryItems: InventoryItem[] = [
  {
    id: "INV-5012",
    name: "Carton standard 40x30x20",
    category: "Emballage",
    quantity: 1250,
    threshold: 500,
    location: "Entrepôt A - Zone 3",
    lastUpdate: "12/08/2023",
    status: "in-stock"
  },
  {
    id: "INV-4872",
    name: "Carton renforcé 60x40x30",
    category: "Emballage",
    quantity: 480,
    threshold: 400,
    location: "Entrepôt A - Zone 3",
    lastUpdate: "10/08/2023",
    status: "low-stock"
  },
  {
    id: "INV-4210",
    name: "Scotch d'emballage transparent",
    category: "Fourniture",
    quantity: 320,
    threshold: 150,
    location: "Entrepôt B - Zone 1",
    lastUpdate: "08/08/2023",
    status: "in-stock"
  },
  {
    id: "INV-3982",
    name: "Palette Europe",
    category: "Logistique",
    quantity: 85,
    threshold: 50,
    location: "Entrepôt C - Zone 2",
    lastUpdate: "07/08/2023",
    status: "low-stock"
  },
  {
    id: "INV-3675",
    name: "Film étirable",
    category: "Emballage",
    quantity: 0,
    threshold: 100,
    location: "Entrepôt B - Zone 1",
    lastUpdate: "05/08/2023",
    status: "out-of-stock"
  }
];

const statusConfig = {
  'in-stock': {
    label: 'En stock',
    className: 'bg-green-500'
  },
  'low-stock': {
    label: 'Stock bas',
    className: 'bg-amber-500'
  },
  'out-of-stock': {
    label: 'Rupture',
    className: 'bg-red-500'
  }
};

const Inventory: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Gestion des stocks</h1>
        <p className="text-muted-foreground">Suivez et gérez votre inventaire</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total produits</p>
                <p className="text-2xl font-bold">1,853</p>
              </div>
              <div className="rounded-full bg-primary/10 p-3 text-primary">
                <Package2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stock bas</p>
                <p className="text-2xl font-bold">28</p>
              </div>
              <div className="rounded-full bg-amber-100 p-3 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commandes en attente</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                <ShoppingCart className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Livraisons attendues</p>
                <p className="text-2xl font-bold">7</p>
              </div>
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <Truck className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inventaire</CardTitle>
              <CardDescription>Gestion complète de votre stock</CardDescription>
            </div>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Ajouter un produit</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher par ID, nom ou catégorie..."
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
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="in-stock">En stock</TabsTrigger>
              <TabsTrigger value="low-stock">Stock bas</TabsTrigger>
              <TabsTrigger value="out-of-stock">Rupture</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Produit</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Emplacement</TableHead>
                      <TableHead>Dernière mise à jour</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={(item.quantity / item.threshold) * 100}
                              max={200}
                              className="h-2 w-16"
                            />
                            <span>{item.quantity}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.lastUpdate}</TableCell>
                        <TableCell>
                          <Badge className={statusConfig[item.status].className}>
                            {statusConfig[item.status].label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="in-stock" className="m-0">
              <div className="text-center p-6">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Produits en stock</h3>
                <p className="text-muted-foreground">Liste des produits ayant un niveau de stock satisfaisant.</p>
              </div>
            </TabsContent>

            <TabsContent value="low-stock" className="m-0">
              <div className="text-center p-6">
                <AlertTriangle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Produits en stock bas</h3>
                <p className="text-muted-foreground">Liste des produits dont le stock est proche du seuil critique.</p>
              </div>
            </TabsContent>

            <TabsContent value="out-of-stock" className="m-0">
              <div className="text-center p-6">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Produits en rupture</h3>
                <p className="text-muted-foreground">Liste des produits en rupture de stock à commander rapidement.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Commandes fournisseurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Gérer les commandes</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Créez et suivez vos commandes auprès des fournisseurs pour réapprovisionner votre stock.
              </p>
              <Button>Passer une commande</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analyse des stocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <BarChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Statistiques et prévisions</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Analysez la rotation des stocks et prévoyez les besoins futurs grâce à nos outils d'analyse.
              </p>
              <Button>Voir les statistiques</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Inventory;
