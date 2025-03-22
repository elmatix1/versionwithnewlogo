
import { useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage';

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

const STORAGE_KEY = 'tms-inventory';

export function useInventory() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => 
    loadFromLocalStorage<InventoryItem[]>(STORAGE_KEY, [])
  );

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEY, inventoryItems);
  }, [inventoryItems]);

  const addItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      ...itemData
    };
    setInventoryItems(prev => [...prev, newItem]);
    return newItem;
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventoryItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setInventoryItems(prev => prev.filter(item => item.id !== id));
  };

  // Get counts by status
  const getStatusCounts = () => {
    return inventoryItems.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<InventoryStatus, number>);
  };

  return {
    inventoryItems,
    addItem,
    updateItem,
    deleteItem,
    getStatusCounts
  };
}
