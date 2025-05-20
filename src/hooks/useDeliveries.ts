
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type DeliveryStatus = 'planned' | 'in-progress' | 'completed' | 'delayed';

export interface Delivery {
  id: string;
  date: string;
  time: string;
  driver: string;
  vehicle: string;
  origin: string;
  destination: string;
  status: DeliveryStatus;
  notes?: string;
}

export function useDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les livraisons depuis Supabase
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('deliveries')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        // Convertir les données pour correspondre à l'interface Delivery
        const formattedDeliveries = data.map(delivery => {
          // S'assurer que le statut est toujours une valeur valide
          let status: DeliveryStatus = 'planned';
          if (delivery.status && ['planned', 'in-progress', 'completed', 'delayed'].includes(delivery.status)) {
            status = delivery.status as DeliveryStatus;
          } else {
            console.warn(`Statut non reconnu: ${delivery.status}, utilisation de 'planned' par défaut`);
          }
          
          return {
            id: delivery.id.toString(),
            date: delivery.date,
            time: delivery.time,
            driver: delivery.driver,
            vehicle: delivery.vehicle,
            origin: delivery.origin,
            destination: delivery.destination,
            status,
            notes: delivery.notes
          };
        });
        
        setDeliveries(formattedDeliveries);
        console.log('Livraisons récupérées:', formattedDeliveries);
      } catch (err: any) {
        console.error('Erreur lors de la récupération des livraisons:', err);
        setError(err.message);
        toast.error("Erreur lors du chargement des livraisons", {
          description: err.message
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDeliveries();
    
    // Configurer le canal en temps réel
    const channel = supabase
      .channel('public:deliveries')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'deliveries' }, 
        (payload) => {
          console.log('Changement détecté dans les livraisons:', payload);
          fetchDeliveries();
        }
      )
      .subscribe();
    
    // Nettoyer l'abonnement
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Ajouter une livraison
  const addDelivery = async (deliveryData: Omit<Delivery, 'id'>) => {
    try {
      console.log('Tentative d\'ajout de livraison:', deliveryData);
      
      // Préparer les données pour l'insertion
      const { data, error } = await supabase
        .from('deliveries')
        .insert([{
          date: deliveryData.date,
          time: deliveryData.time,
          driver: deliveryData.driver,
          vehicle: deliveryData.vehicle,
          origin: deliveryData.origin,
          destination: deliveryData.destination,
          status: deliveryData.status || 'planned',
          notes: deliveryData.notes
        }])
        .select();
      
      if (error) {
        console.error('Erreur Supabase lors de l\'ajout d\'une livraison:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('Aucune donnée retournée après l\'insertion');
      }
      
      // Convertir la nouvelle livraison au format Delivery
      const newDelivery: Delivery = {
        id: data[0].id.toString(),
        date: data[0].date,
        time: data[0].time,
        driver: data[0].driver,
        vehicle: data[0].vehicle,
        origin: data[0].origin,
        destination: data[0].destination,
        status: data[0].status as DeliveryStatus,
        notes: data[0].notes
      };
      
      console.log('Livraison ajoutée avec succès:', newDelivery);
      
      // Mettre à jour l'état local avec la nouvelle livraison
      setDeliveries(prev => [...prev, newDelivery]);
      
      toast.success("Mission ajoutée avec succès", {
        description: `La mission pour ${newDelivery.destination} a été créée.`
      });
      
      return newDelivery;
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout d\'une livraison:', err);
      toast.error("Erreur lors de l'ajout de la mission", {
        description: err.message
      });
      throw err;
    }
  };
  
  // Mettre à jour une livraison
  const updateDelivery = async (id: string, updates: Partial<Delivery>) => {
    try {
      console.log('Tentative de mise à jour de la livraison:', id, updates);
      
      // Préparer les données pour la mise à jour
      const updateData: any = {};
      
      if (updates.date) updateData.date = updates.date;
      if (updates.time) updateData.time = updates.time;
      if (updates.driver) updateData.driver = updates.driver;
      if (updates.vehicle) updateData.vehicle = updates.vehicle;
      if (updates.origin) updateData.origin = updates.origin;
      if (updates.destination) updateData.destination = updates.destination;
      if (updates.status) updateData.status = updates.status;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      
      const { error } = await supabase
        .from('deliveries')
        .update(updateData)
        .eq('id', parseInt(id));
      
      if (error) {
        console.error('Erreur Supabase lors de la mise à jour d\'une livraison:', error);
        throw error;
      }
      
      // Mettre à jour l'état local avec les modifications
      setDeliveries(prev => 
        prev.map(delivery => 
          delivery.id === id 
            ? { ...delivery, ...updates } 
            : delivery
        )
      );
      
      console.log('Livraison mise à jour avec succès');
      
      toast.success("Mission mise à jour", {
        description: "Les informations de la mission ont été mises à jour."
      });
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour d\'une livraison:', err);
      toast.error("Erreur lors de la mise à jour de la mission", {
        description: err.message
      });
      throw err;
    }
  };
  
  // Supprimer une livraison
  const deleteDelivery = async (id: string) => {
    try {
      console.log('Tentative de suppression de la livraison:', id);
      
      const { error } = await supabase
        .from('deliveries')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) {
        console.error('Erreur Supabase lors de la suppression d\'une livraison:', error);
        throw error;
      }
      
      // Mettre à jour l'état local en supprimant la livraison
      setDeliveries(prev => prev.filter(delivery => delivery.id !== id));
      
      console.log('Livraison supprimée avec succès');
      
      toast.success("Mission supprimée", {
        description: "La mission a été supprimée avec succès."
      });
    } catch (err: any) {
      console.error('Erreur lors de la suppression d\'une livraison:', err);
      toast.error("Erreur lors de la suppression de la mission", {
        description: err.message
      });
      throw err;
    }
  };

  return {
    deliveries,
    loading,
    error,
    addDelivery,
    updateDelivery,
    deleteDelivery
  };
}
