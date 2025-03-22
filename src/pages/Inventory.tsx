
import React, { useState, useMemo } from 'react';
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
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Package,
  AlertTriangle,
  Plus,
  Filter,
  TrendingUp,
  BarChart,
  FileText,
  ShoppingBag,
  MoreHorizontal,
  CalendarIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { NewItemDialog } from '@/components/inventory/NewItemDialog';
import { ConsumptionChart } from '@/components/inventory/ConsumptionChart';
import { NewOrderDialog } from '@/components/inventory/NewOrderDialog';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastRestock: string;
  location: string;
}

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
  // État initial de l'inventaire
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: "INV-1001",
      name: "Huile moteur 5W30",
      category: "Lubrifiant",
      quantity: 45,
      status: "in-stock",
      lastRestock: "12/07/2023",
      location: "Étagère A3"
    },
    {
      id: "INV-1002",
      name: "Filtre à air",
      category: "Filtres",
      quantity: 22,
      status: "in-stock",
      lastRestock: "05/08/2023",
      location: "Étagère B2"
    },
    {
      id: "INV-1003",
      name: "Plaquettes de frein",
      category: "Freinage",
      quantity: 8,
      status: "low-stock",
      lastRestock: "01/09/2023",
      location: "Étagère C1"
    },
    {
      id: "INV-1004",
      name: "Liquide de refroidissement",
      category: "Liquides",
      quantity: 0,
      status: "out-of-stock",
      lastRestock: "22/06/2023",
      location: "Étagère A4"
    },
    {
      id: "INV-1005",
      name: "Balais d'essuie-glace",
      category: "Accessoires",
      quantity: 15,
      status: "in-stock",
      lastRestock: "17/08/2023",
      location: "Étagère D2"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isNewItemDialogOpen, setIsNewItemDialogOpen] = useState(false);
  const [isChartDialogOpen, setIsChartDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  
  // Compter les articles par statut
  const statusCounts = useMemo(() => {
    return inventoryItems.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [inventoryItems]);
  
  // Filtrer les articles en fonction du terme de recherche et du statut sélectionné
  const filteredItems = useMemo(() => {
    let filtered = inventoryItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (activeTab !== "all") {
      filtered = filtered.filter(item => item.status === activeTab);
    }
    
    return filtered;
  }, [inventoryItems, searchTerm, activeTab]);

  // Ajouter un nouvel article à l'inventaire
  const handleAddItem = (item: any) => {
    const newItem: InventoryItem = {
      id: item.id,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      status: item.status,
      lastRestock: item.lastRestock.toLocaleDateString("fr-FR"),
      location: item.location
    };
    
    setInventoryItems(prev => [...prev, newItem]);
  };

  // Supprimer un article de l'inventaire
  const handleDeleteItem = (id: string) => {
    setInventoryItems(prev => prev.filter(item => item.id !== id));
    toast.success("Article supprimé avec succès");
  };

  // Modifier le statut d'un article
  const handleUpdateStatus = (id: string, newStatus: 'in-stock' | 'low-stock' | 'out-of-stock') => {
    setInventoryItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
    toast.success("Statut mis à jour avec succès");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Gestion de l'inventaire</h1>
        <p className="text-muted-foreground">Suivi et gestion des stocks de pièces et consommables</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Articles en stock</p>
                <p className="text-2xl font-bold">{statusCounts['in-stock'] || 0}</p>
                <p className="text-xs text-green-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> +15 cette semaine
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3 text-green-600">
                <Package className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stock bas</p>
                <p className="text-2xl font-bold">{statusCounts['low-stock'] || 0}</p>
                <p className="text-xs text-amber-500 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" /> Nécessite attention
                </p>
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
                <p className="text-sm text-muted-foreground">Rupture de stock</p>
                <p className="text-2xl font-bold">{statusCounts['out-of-stock'] || 0}</p>
                <p className="text-xs text-red-500 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" /> Commander rapidement
                </p>
              </div>
              <div className="rounded-full bg-red-100 p-3 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inventaire des pièces</CardTitle>
              <CardDescription>Gestion des stocks et approvisionnement</CardDescription>
            </div>
            <Button 
              className="flex items-center gap-2"
              onClick={() => setIsNewItemDialogOpen(true)}
            >
              <Plus size={16} />
              <span>Nouvel article</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Rechercher..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              <span>Filtres</span>
            </Button>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="in-stock">En stock</TabsTrigger>
              <TabsTrigger value="low-stock">Stock bas</TabsTrigger>
              <TabsTrigger value="out-of-stock">Rupture</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Référence</TableHead>
                      <TableHead>Article</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Dernier réappro</TableHead>
                      <TableHead>Emplacement</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          <Badge className={statusConfig[item.status].className}>
                            {statusConfig[item.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.lastRestock}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Ouvrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleUpdateStatus(item.id, 'in-stock')}>
                                Marquer comme En stock
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(item.id, 'low-stock')}>
                                Marquer comme Stock bas
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(item.id, 'out-of-stock')}>
                                Marquer comme Rupture
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteItem(item.id)}
                                className="text-red-600"
                              >
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          Aucun article trouvé
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendances de consommation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <BarChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Analyse des consommations</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Analysez les tendances de consommation pour anticiper vos besoins en approvisionnement.
              </p>
              <Button onClick={() => setIsChartDialogOpen(true)}>Voir les statistiques</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commandes d'approvisionnement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Gérer les commandes</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Créez et suivez vos commandes d'approvisionnement auprès des fournisseurs.
              </p>
              <Button onClick={() => setIsOrderDialogOpen(true)}>Nouvelle commande</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <NewItemDialog 
        open={isNewItemDialogOpen} 
        onOpenChange={setIsNewItemDialogOpen}
        onAddItem={handleAddItem}
      />
      
      <ConsumptionChart
        open={isChartDialogOpen}
        onOpenChange={setIsChartDialogOpen}
      />
      
      <NewOrderDialog
        open={isOrderDialogOpen}
        onOpenChange={setIsOrderDialogOpen}
      />
    </div>
  );
};

export default Inventory;
