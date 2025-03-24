
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type InventoryStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface InventoryItem {
  id: string;
  reference: string;
  name: string;
  category: string;
  quantity: number;
  status: InventoryStatus;
  lastRestock: string;
  location: string;
}

export function useInventory() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les articles d'inventaire depuis Supabase
  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('inventory')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        // Convertir les données pour correspondre à l'interface InventoryItem
        const formattedItems = data.map(item => ({
          id: item.id.toString(),
          reference: item.reference,
          name: item.name,
          category: item.category,
          quantity: typeof item.quantity === 'number' ? item.quantity : 0,
          status: item.status as InventoryStatus,
          lastRestock: item.lastRestock,
          location: item.location
        }));
        
        setInventoryItems(formattedItems);
        console.log('Articles d\'inventaire récupérés:', formattedItems);
      } catch (err: any) {
        console.error('Erreur lors de la récupération des articles d\'inventaire:', err);
        setError(err.message);
        toast.error("Erreur lors du chargement de l'inventaire", {
          description: err.message
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchInventoryItems();
    
    // Configurer le canal en temps réel
    const channel = supabase
      .channel('public:inventory')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'inventory' }, 
        (payload) => {
          console.log('Changement détecté dans l\'inventaire:', payload);
          fetchInventoryItems();
        }
      )
      .subscribe();
    
    // Nettoyer l'abonnement
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Ajouter un article d'inventaire
  const addItem = async (itemData: Omit<InventoryItem, 'id'>) => {
    try {
      console.log('Tentative d\'ajout d\'article d\'inventaire:', itemData);
      
      // Préparer les données pour l'insertion
      const { data, error } = await supabase
        .from('inventory')
        .insert([{
          reference: itemData.reference,
          name: itemData.name,
          category: itemData.category,
          quantity: itemData.quantity,
          status: itemData.status,
          lastRestock: itemData.lastRestock,
          location: itemData.location
        }])
        .select();
      
      if (error) {
        console.error('Erreur Supabase lors de l\'ajout d\'un article d\'inventaire:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('Aucune donnée retournée après l\'insertion');
      }
      
      // Convertir le nouvel article au format InventoryItem
      const newItem: InventoryItem = {
        id: data[0].id.toString(),
        reference: data[0].reference,
        name: data[0].name,
        category: data[0].category,
        quantity: typeof data[0].quantity === 'number' ? data[0].quantity : 0,
        status: data[0].status as InventoryStatus,
        lastRestock: data[0].lastRestock,
        location: data[0].location
      };
      
      console.log('Article ajouté avec succès:', newItem);
      
      // Mettre à jour l'état local avec le nouvel article
      setInventoryItems(prev => [...prev, newItem]);
      
      toast.success("Article ajouté avec succès", {
        description: `${newItem.name} a été ajouté à l'inventaire.`
      });
      
      return newItem;
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout d\'un article d\'inventaire:', err);
      toast.error("Erreur lors de l'ajout de l'article", {
        description: err.message
      });
      throw err;
    }
  };
  
  // Mettre à jour un article d'inventaire
  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      console.log('Tentative de mise à jour de l\'article d\'inventaire:', id, updates);
      
      // Préparer les données pour la mise à jour
      const updateData: any = {};
      
      if (updates.reference) updateData.reference = updates.reference;
      if (updates.name) updateData.name = updates.name;
      if (updates.category) updateData.category = updates.category;
      if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
      if (updates.status) updateData.status = updates.status;
      if (updates.lastRestock) updateData.lastRestock = updates.lastRestock;
      if (updates.location) updateData.location = updates.location;
      
      const { error } = await supabase
        .from('inventory')
        .update(updateData)
        .eq('id', parseInt(id));
      
      if (error) {
        console.error('Erreur Supabase lors de la mise à jour d\'un article d\'inventaire:', error);
        throw error;
      }
      
      // Mettre à jour l'état local avec les modifications
      setInventoryItems(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, ...updates } 
            : item
        )
      );
      
      console.log('Article mis à jour avec succès');
      
      toast.success("Article mis à jour", {
        description: "Les informations de l'article ont été mises à jour."
      });
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour d\'un article d\'inventaire:', err);
      toast.error("Erreur lors de la mise à jour de l'article", {
        description: err.message
      });
      throw err;
    }
  };
  
  // Supprimer un article d'inventaire
  const deleteItem = async (id: string) => {
    try {
      console.log('Tentative de suppression de l\'article d\'inventaire:', id);
      
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', parseInt(id));
      
      if (error) {
        console.error('Erreur Supabase lors de la suppression d\'un article d\'inventaire:', error);
        throw error;
      }
      
      // Mettre à jour l'état local en supprimant l'article
      setInventoryItems(prev => prev.filter(item => item.id !== id));
      
      console.log('Article supprimé avec succès');
      
      toast.success("Article supprimé", {
        description: "L'article a été supprimé avec succès."
      });
    } catch (err: any) {
      console.error('Erreur lors de la suppression d\'un article d\'inventaire:', err);
      toast.error("Erreur lors de la suppression de l'article", {
        description: err.message
      });
      throw err;
    }
  };

  // Obtenir les statistiques par statut
  const getStatusCounts = () => {
    return inventoryItems.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<InventoryStatus, number>);
  };

  return {
    inventoryItems,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    getStatusCounts
  };
}
