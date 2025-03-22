
import { useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage';

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

const STORAGE_KEY = 'tms-orders';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(() => 
    loadFromLocalStorage<Order[]>(STORAGE_KEY, [])
  );

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEY, orders);
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      ...orderData
    };
    setOrders(prev => [...prev, newOrder]);
    return newOrder;
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id ? { ...order, ...updates } : order
      )
    );
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  return {
    orders,
    addOrder,
    updateOrder,
    deleteOrder
  };
}
