
import { useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage';

export type DeliveryStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

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

const STORAGE_KEY = 'tms-deliveries';

export function useDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(() => 
    loadFromLocalStorage<Delivery[]>(STORAGE_KEY, [])
  );

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEY, deliveries);
  }, [deliveries]);

  const addDelivery = (deliveryData: Omit<Delivery, 'id'>) => {
    const newDelivery: Delivery = {
      id: Date.now().toString(),
      ...deliveryData
    };
    setDeliveries(prev => [...prev, newDelivery]);
    return newDelivery;
  };

  const updateDelivery = (id: string, updates: Partial<Delivery>) => {
    setDeliveries(prev => 
      prev.map(delivery => 
        delivery.id === id ? { ...delivery, ...updates } : delivery
      )
    );
  };

  const deleteDelivery = (id: string) => {
    setDeliveries(prev => prev.filter(delivery => delivery.id !== id));
  };

  return {
    deliveries,
    addDelivery,
    updateDelivery,
    deleteDelivery
  };
}
