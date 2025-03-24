
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type OrderStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';
export type OrderPriority = 'high' | 'normal' | 'low';

export interface Order {
  id: string;
  client: string;
  origin: string;
  destination: string;
  status: OrderStatus;
  deliveryDate: string;
  priority: OrderPriority;
  amount: string;
  notes?: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les commandes depuis Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('orders')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        // Convertir les données pour correspondre à l'interface Order
        const formattedOrders = data.map(order => ({
          id: order.id.toString(),
          client: order.client,
          origin: order.origin,
          destination: order.destination,
          status: order.status as OrderStatus,
          deliveryDate: order.delivery_date,
          priority: order.priority as OrderPriority,
          amount: order.amount,
          notes: order.notes
        }));
        
        setOrders(formattedOrders);
      } catch (err: any) {
        console.error('Erreur lors de la récupération des commandes:', err);
        setError(err.message);
        toast.error("Erreur lors du chargement des commandes", {
          description: err.message
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
    
    // Configurer le canal en temps réel
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
          console.log('Changement détecté dans les commandes:', payload);
          fetchOrders();
        }
      )
      .subscribe();
    
    // Nettoyer l'abonnement
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Ajouter une commande
  const addOrder = async (orderData: Omit<Order, 'id'>) => {
    try {
      // Préparer les données pour l'insertion
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          client: orderData.client,
          origin: orderData.origin,
          destination: orderData.destination,
          status: orderData.status,
          delivery_date: orderData.deliveryDate,
          priority: orderData.priority,
          amount: orderData.amount,
          notes: orderData.notes
        }])
        .select();
      
      if (error) {
        throw error;
      }
      
      // Convertir la nouvelle commande au format Order
      const newOrder: Order = {
        id: data[0].id.toString(),
        client: data[0].client,
        origin: data[0].origin,
        destination: data[0].destination,
        status: data[0].status as OrderStatus,
        deliveryDate: data[0].delivery_date,
        priority: data[0].priority as OrderPriority,
        amount: data[0].amount,
        notes: data[0].notes
      };
      
      toast.success("Commande ajoutée avec succès", {
        description: `La commande pour ${newOrder.client} a été créée.`
      });
      
      return newOrder;
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout d\'une commande:', err);
      toast.error("Erreur lors de l'ajout de la commande", {
        description: err.message
      });
      throw err;
    }
  };
  
  // Mettre à jour une commande
  const updateOrder = async (id: string, updates: Partial<Order>) => {
    try {
      // Préparer les données pour la mise à jour
      const updateData: any = {};
      
      if (updates.client) updateData.client = updates.client;
      if (updates.origin) updateData.origin = updates.origin;
      if (updates.destination) updateData.destination = updates.destination;
      if (updates.status) updateData.status = updates.status;
      if (updates.deliveryDate) updateData.delivery_date = updates.deliveryDate;
      if (updates.priority) updateData.priority = updates.priority;
      if (updates.amount) updateData.amount = updates.amount;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      
      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', parseInt(id));
      
      if (error) {
        throw error;
      }
      
      toast.success("Commande mise à jour", {
        description: "Les informations de la commande ont été mises à jour."
      });
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour d\'une commande:', err);
      toast.error("Erreur lors de la mise à jour de la commande", {
        description: err.message
      });
      throw err;
    }
  };
  
  // Supprimer une commande
  const deleteOrder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) {
        throw error;
      }
      
      toast.success("Commande supprimée", {
        description: "La commande a été supprimée avec succès."
      });
    } catch (err: any) {
      console.error('Erreur lors de la suppression d\'une commande:', err);
      toast.error("Erreur lors de la suppression de la commande", {
        description: err.message
      });
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    addOrder,
    updateOrder,
    deleteOrder
  };
}
