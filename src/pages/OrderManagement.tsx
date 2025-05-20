
import React, { useState, useEffect } from 'react';
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
  ArrowUpRight,
  CheckSquare
} from 'lucide-react';
import AddOrderForm from '@/components/orders/AddOrderForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useOrders, OrderStatus, OrderPriority } from '@/hooks/useOrders';
import { format } from 'date-fns';

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
  'normal': { 
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

// Mapping des statuts de l'interface vers ceux de l'API Supabase
const statusMapping: Record<string, OrderStatus> = {
  'en-attente': 'pending',
  'en-cours': 'in-progress',
  'livree': 'completed',
  'annulee': 'cancelled'
};

// Mapping des priorités de l'interface vers celles de l'API Supabase
const priorityMapping: Record<string, OrderPriority> = {
  'normal': 'normal',
  'urgent': 'high',
  'basse': 'low'
};

// Mapping inverse pour convertir les valeurs Supabase vers l'interface
const reverseStatusMapping: Record<OrderStatus, string> = {
  'pending': 'en-attente',
  'in-progress': 'en-cours',
  'completed': 'livree',
  'cancelled': 'annulee'
};

const reversePriorityMapping: Record<OrderPriority, string> = {
  'normal': 'normal',
  'high': 'urgent',
  'low': 'basse'
};

// Fonction de sécurité pour s'assurer que la priorité est valide
const getValidPriority = (priority: string): 'normal' | 'urgent' | 'basse' => {
  if (priority === 'normal' || priority === 'urgent' || priority === 'basse') {
    return priority as 'normal' | 'urgent' | 'basse';
  }
  console.warn(`Priorité non reconnue: ${priority}, utilisation de 'normal' par défaut`);
  return 'normal';
};

// Fonction de sécurité pour s'assurer que le statut est valide
const getValidStatus = (status: string): 'en-attente' | 'en-cours' | 'livree' | 'annulee' => {
  if (status === 'en-attente' || status === 'en-cours' || status === 'livree' || status === 'annulee') {
    return status as 'en-attente' | 'en-cours' | 'livree' | 'annulee';
  }
  console.warn(`Statut non reconnu: ${status}, utilisation de 'en-attente' par défaut`);
  return 'en-attente';
};

const OrderManagement: React.FC = () => {
  // Utilisation du hook useOrders pour interagir avec Supabase
  const { orders: supabaseOrders, loading, error, addOrder, updateOrder, deleteOrder } = useOrders();
  
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [orderCounts, setOrderCounts] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    delivered: 0
  });
  
  // Conversion des données de Supabase au format de l'interface
  useEffect(() => {
    if (supabaseOrders) {
      const mappedOrders = supabaseOrders.map(order => {
        // Utiliser les fonctions de sécurité pour les valeurs de statut et priorité
        const mappedStatus = reverseStatusMapping[order.status] || 'en-attente';
        const mappedPriority = reversePriorityMapping[order.priority] || 'normal';
        
        return {
          id: order.id,
          customer: order.client,
          origin: order.origin,
          destination: order.destination,
          status: getValidStatus(mappedStatus),
          date: order.deliveryDate,
          createdAt: new Date().toLocaleDateString('fr-FR'), // Nous n'avons pas cette info dans l'API
          priority: getValidPriority(mappedPriority),
          amount: order.amount
        };
      });
      setLocalOrders(mappedOrders);
    }
  }, [supabaseOrders]);
  
  // Calculer les compteurs de commandes
  useEffect(() => {
    const counts = {
      total: localOrders.length,
      pending: localOrders.filter(order => order.status === 'en-attente').length,
      inProgress: localOrders.filter(order => order.status === 'en-cours').length,
      delivered: localOrders.filter(order => order.status === 'livree').length
    };
    setOrderCounts(counts);
  }, [localOrders]);
  
  // Filtrer les commandes en fonction de l'onglet et de la recherche
  const filteredOrders = localOrders.filter(order => {
    // Filtrer par statut si un onglet spécifique est sélectionné
    if (selectedTab !== "all" && order.status !== selectedTab) {
      return false;
    }
    
    // Filtrer par recherche si une requête est entrée
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.destination.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Gérer l'ajout d'une commande (converti pour Supabase)
  const handleAddOrder = async (orderData: any) => {
    try {
      // Conversion des données pour Supabase
      const supabaseOrderData = {
        client: orderData.customer,
        origin: orderData.origin,
        destination: orderData.destination,
        status: statusMapping[orderData.status],
        deliveryDate: format(orderData.deliveryDate, 'yyyy-MM-dd'),
        priority: priorityMapping[orderData.priority],
        amount: orderData.amount,
        notes: orderData.description || ""
      };
      
      // Appel à l'API Supabase via le hook
      await addOrder(supabaseOrderData);
      
      // Si nous arrivons ici, cela signifie que l'opération a réussi
      // La notification est déjà gérée dans le hook useOrders
      setIsAddOrderOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la commande:", error);
      toast.error("Erreur lors de l'ajout de la commande", {
        description: "Veuillez vérifier les informations saisies et réessayer."
      });
    }
  };
  
  // Gérer le changement de statut
  const handleStatusChange = async (orderId: string, newStatus: 'en-attente' | 'en-cours' | 'livree' | 'annulee') => {
    try {
      await updateOrder(orderId, {
        status: statusMapping[newStatus]
      });
      
      // La mise à jour de l'interface se fera automatiquement via l'effet qui surveille supabaseOrders
      toast.success(`Statut mis à jour: ${statusConfig[newStatus].label}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur lors de la mise à jour du statut", {
        description: "Veuillez réessayer ultérieurement."
      });
    }
  };
  
  // Gérer le changement de priorité
  const handlePriorityChange = async (orderId: string, newPriority: 'normal' | 'urgent' | 'basse') => {
    try {
      await updateOrder(orderId, {
        priority: priorityMapping[newPriority]
      });
      
      // La mise à jour de l'interface se fera automatiquement via l'effet qui surveille supabaseOrders
      toast.success(`Priorité mise à jour: ${priorityConfig[newPriority].label}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la priorité:", error);
      toast.error("Erreur lors de la mise à jour de la priorité", {
        description: "Veuillez réessayer ultérieurement."
      });
    }
  };

  // Afficher un message de chargement pendant le chargement des données
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg">Chargement des commandes...</p>
      </div>
    );
  }
  
  // Afficher un message d'erreur en cas d'erreur
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg text-red-500">Erreur lors du chargement des commandes</p>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  }

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
                <p className="text-2xl font-bold">{orderCounts.total}</p>
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
                <p className="text-2xl font-bold">{orderCounts.pending}</p>
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
                <p className="text-2xl font-bold">{orderCounts.inProgress}</p>
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
                <p className="text-sm text-muted-foreground">Livrées</p>
                <p className="text-2xl font-bold">{orderCounts.delivered}</p>
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
            <Button className="flex items-center gap-2" onClick={() => setIsAddOrderOpen(true)}>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              <span>Filtres</span>
            </Button>
          </div>

          <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="en-attente">En attente</TabsTrigger>
              <TabsTrigger value="en-cours">En cours</TabsTrigger>
              <TabsTrigger value="livree">Livrées</TabsTrigger>
              <TabsTrigger value="annulee">Annulées</TabsTrigger>
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
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{order.origin}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{order.destination}</TableCell>
                          <TableCell>
                            <Select 
                              defaultValue={order.status} 
                              onValueChange={(value) => handleStatusChange(order.id, value as any)}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue>
                                  <Badge className={statusConfig[order.status].className}>
                                    {statusConfig[order.status].label}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(statusConfig).map(([value, { label, className }]) => (
                                  <SelectItem key={value} value={value}>
                                    <Badge className={className}>
                                      {label}
                                    </Badge>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            <Select 
                              defaultValue={order.priority} 
                              onValueChange={(value) => handlePriorityChange(order.id, value as any)}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue>
                                  <Badge variant="outline" className={priorityConfig[order.priority].className}>
                                    {priorityConfig[order.priority].label}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(priorityConfig).map(([value, { label, className }]) => (
                                  <SelectItem key={value} value={value}>
                                    <Badge variant="outline" className={className}>
                                      {label}
                                    </Badge>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-6">
                          Aucune commande trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Onglet "En attente" */}
            <TabsContent value="en-attente" className="m-0">
              {/* Même structure de tableau que l'onglet "Toutes" */}
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
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{order.origin}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{order.destination}</TableCell>
                          <TableCell>
                            <Select 
                              defaultValue={order.status} 
                              onValueChange={(value) => handleStatusChange(order.id, value as any)}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue>
                                  <Badge className={statusConfig[order.status].className}>
                                    {statusConfig[order.status].label}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(statusConfig).map(([value, { label, className }]) => (
                                  <SelectItem key={value} value={value}>
                                    <Badge className={className}>
                                      {label}
                                    </Badge>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            <Select 
                              defaultValue={order.priority} 
                              onValueChange={(value) => handlePriorityChange(order.id, value as any)}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue>
                                  <Badge variant="outline" className={priorityConfig[order.priority].className}>
                                    {priorityConfig[order.priority].label}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(priorityConfig).map(([value, { label, className }]) => (
                                  <SelectItem key={value} value={value}>
                                    <Badge variant="outline" className={className}>
                                      {label}
                                    </Badge>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-6">
                          Aucune commande en attente trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Onglets "En cours", "Livrées" et "Annulées" avec la même structure */}
            <TabsContent value="en-cours" className="m-0">
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
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{order.origin}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{order.destination}</TableCell>
                          <TableCell>
                            <Select 
                              defaultValue={order.status} 
                              onValueChange={(value) => handleStatusChange(order.id, value as any)}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue>
                                  <Badge className={statusConfig[order.status].className}>
                                    {statusConfig[order.status].label}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(statusConfig).map(([value, { label, className }]) => (
                                  <SelectItem key={value} value={value}>
                                    <Badge className={className}>
                                      {label}
                                    </Badge>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            <Select 
                              defaultValue={order.priority} 
                              onValueChange={(value) => handlePriorityChange(order.id, value as any)}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue>
                                  <Badge variant="outline" className={priorityConfig[order.priority].className}>
                                    {priorityConfig[order.priority].label}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(priorityConfig).map(([value, { label, className }]) => (
                                  <SelectItem key={value} value={value}>
                                    <Badge variant="outline" className={className}>
                                      {label}
                                    </Badge>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-6">
                          Aucune commande en cours trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="livree" className="m-0">
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
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{order.origin}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{order.destination}</TableCell>
                          <TableCell>
                            <Select 
                              defaultValue={order.status} 
                              onValueChange={(value) => handleStatusChange(order.id, value as any)}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue>
                                  <Badge className={statusConfig[order.status].className}>
                                    {statusConfig[order.status].label}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(statusConfig).map(([value, { label, className }]) => (
                                  <SelectItem key={value} value={value}>
                                    <Badge className={className}>
                                      {label}
                                    </Badge>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            <Select 
                              defaultValue={order.priority} 
                              onValueChange={(value) => handlePriorityChange(order.id, value as any)}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue>
                                  <Badge variant="outline" className={priorityConfig[order.priority].className}>
                                    {priorityConfig[order.priority].label}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(priorityConfig).map(([value, { label, className }]) => (
                                  <SelectItem key={value} value={value}>
                                    <Badge variant="outline" className={className}>
                                      {label}
                                    </Badge>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-6">
                          Aucune commande livrée trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="annulee" className="m-0">
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
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{order.origin}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{order.destination}</TableCell>
                          <TableCell>
                            <Select 
                              defaultValue={order.status} 
                              onValueChange={(value) => handleStatusChange(order.id, value as any)}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue>
                                  <Badge className={statusConfig[order.status].className}>
                                    {statusConfig[order.status].label}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(statusConfig).map(([value, { label, className }]) => (
                                  <SelectItem key={value} value={value}>
                                    <Badge className={className}>
                                      {label}
                                    </Badge>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            <Select 
                              defaultValue={order.priority} 
                              onValueChange={(value) => handlePriorityChange(order.id, value as any)}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue>
                                  <Badge variant="outline" className={priorityConfig[order.priority].className}>
                                    {priorityConfig[order.priority].label}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(priorityConfig).map(([value, { label, className }]) => (
                                  <SelectItem key={value} value={value}>
                                    <Badge variant="outline" className={className}>
                                      {label}
                                    </Badge>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-6">
                          Aucune commande annulée trouvée
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
      
      <AddOrderForm 
        open={isAddOrderOpen} 
        onOpenChange={setIsAddOrderOpen} 
        onAddOrder={handleAddOrder}
      />
    </div>
  );
};

export default OrderManagement;
