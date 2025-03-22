
import React, { useState } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import MapOverview from '@/components/dashboard/MapOverview';
import OrdersChart from '@/components/dashboard/OrdersChart';
import UpcomingDeliveries from '@/components/dashboard/UpcomingDeliveries';
import DriverAvailability from '@/components/dashboard/DriverAvailability';
import { Truck, FileText, Users, TrendingUp, CheckCircle, Circle, Plus, Trash } from 'lucide-react';
import { useTodos } from '@/hooks/useTodos';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const Dashboard: React.FC = () => {
  // Hook pour les tâches
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [newTask, setNewTask] = useState('');

  // Fonction pour ajouter une nouvelle tâche
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      addTodo(newTask.trim());
      setNewTask('');
    }
  };

  // Mock data
  const stats = [
    { 
      title: "Commandes du jour", 
      value: "42", 
      icon: <FileText size={20} />, 
      change: { value: 12, isPositive: true } 
    },
    { 
      title: "Véhicules actifs", 
      value: "18", 
      icon: <Truck size={20} />, 
      change: { value: 5, isPositive: true } 
    },
    { 
      title: "Chauffeurs disponibles", 
      value: "12", 
      icon: <Users size={20} />, 
      change: { value: 3, isPositive: false } 
    },
    { 
      title: "Taux de livraison", 
      value: "94.2%", 
      icon: <TrendingUp size={20} />, 
      change: { value: 2.1, isPositive: true } 
    }
  ];

  const activities = [
    { 
      id: "1", 
      type: "order" as const, 
      message: "Commande #1038 a été complétée avec succès", 
      time: "Il y a 23 minutes" 
    },
    { 
      id: "2", 
      type: "vehicle" as const, 
      message: "Camion TL-3045 a démarré sa tournée", 
      time: "Il y a 47 minutes" 
    },
    { 
      id: "3", 
      type: "employee" as const, 
      message: "Jacques Martin a signalé un problème sur la route D45", 
      time: "Il y a 1 heure" 
    },
    { 
      id: "4", 
      type: "order" as const, 
      message: "Nouvelle commande #1039 de Société Dupont", 
      time: "Il y a 3 heures" 
    }
  ];

  const vehicles = [
    { 
      id: "v1", 
      name: "TL-3045", 
      status: "delivering" as const, 
      location: "Route A7" 
    },
    { 
      id: "v2", 
      name: "TL-2189", 
      status: "idle" as const, 
      location: "Dépôt Central" 
    },
    { 
      id: "v3", 
      name: "TL-4023", 
      status: "maintenance" as const, 
      location: "Garage Nord" 
    }
  ];

  const ordersData = [
    { name: "Lun", completed: 15, pending: 5 },
    { name: "Mar", completed: 20, pending: 8 },
    { name: "Mer", completed: 25, pending: 12 },
    { name: "Jeu", completed: 18, pending: 7 },
    { name: "Ven", completed: 30, pending: 10 },
    { name: "Sam", completed: 22, pending: 4 },
    { name: "Dim", completed: 12, pending: 3 },
  ];

  const deliveries = [
    { 
      id: "d1", 
      customer: "Société Dupont", 
      destination: "Paris, 15ème", 
      scheduledFor: "Aujourd'hui, 14:30", 
      status: "on-time" as const 
    },
    { 
      id: "d2", 
      customer: "Entreprise Martin", 
      destination: "Lyon, Centre", 
      scheduledFor: "Aujourd'hui, 16:45", 
      status: "at-risk" as const 
    },
    { 
      id: "d3", 
      customer: "Distribution Rapide", 
      destination: "Marseille, Port", 
      scheduledFor: "Demain, 09:15", 
      status: "delayed" as const 
    }
  ];

  const drivers = [
    { 
      id: "dr1", 
      name: "Thomas Durand", 
      status: "on-duty" as const, 
      lastActivity: "il y a 5 min" 
    },
    { 
      id: "dr2", 
      name: "Sophie Lefèvre", 
      status: "available" as const, 
      lastActivity: "il y a 20 min" 
    },
    { 
      id: "dr3", 
      name: "Pierre Martin", 
      status: "off-duty" as const, 
      lastActivity: "hier, 18:30" 
    },
    { 
      id: "dr4", 
      name: "Julie Dubois", 
      status: "on-duty" as const, 
      lastActivity: "il y a 15 min" 
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble des opérations du système de transport</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <OrdersChart data={ordersData} className="lg:col-span-2" />
        <ActivityFeed activities={activities} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <MapOverview vehicles={vehicles} className="lg:col-span-1" />
        <UpcomingDeliveries deliveries={deliveries} className="lg:col-span-1" />
        <DriverAvailability drivers={drivers} className="lg:col-span-1" />
      </div>

      {/* Section des tâches */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Tâches à faire</span>
            <span className="text-sm font-normal text-muted-foreground">
              {todos.filter(t => t.completed).length}/{todos.length} terminées
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
            <Input
              placeholder="Ajouter une nouvelle tâche..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </form>

          <div className="space-y-2">
            {todos.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Aucune tâche pour le moment</p>
            ) : (
              todos.map((todo) => (
                <div key={todo.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      checked={todo.completed} 
                      onCheckedChange={() => toggleTodo(todo.id)}
                      id={`task-${todo.id}`}
                    />
                    <label 
                      htmlFor={`task-${todo.id}`}
                      className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {todo.task}
                    </label>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteTodo(todo.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
