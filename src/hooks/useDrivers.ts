
import { useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage';

export type DriverStatus = 'available' | 'on-duty' | 'off-duty' | 'on-leave';

export interface Driver {
  id: string;
  name: string;
  status: DriverStatus;
  experience: string;
  vehicles: string[];
  documentValidity: string;
  phone?: string;
  address?: string;
  licenseType?: string;
}

const STORAGE_KEY = 'tms-drivers';

export function useDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>(() => 
    loadFromLocalStorage<Driver[]>(STORAGE_KEY, [])
  );

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEY, drivers);
  }, [drivers]);

  const addDriver = (driverData: Omit<Driver, 'id'>) => {
    const newDriver: Driver = {
      id: Date.now().toString(),
      ...driverData
    };
    setDrivers(prev => [...prev, newDriver]);
    return newDriver;
  };

  const updateDriver = (id: string, updates: Partial<Driver>) => {
    setDrivers(prev => 
      prev.map(driver => 
        driver.id === id ? { ...driver, ...updates } : driver
      )
    );
  };

  const deleteDriver = (id: string) => {
    setDrivers(prev => prev.filter(driver => driver.id !== id));
  };

  return {
    drivers,
    addDriver,
    updateDriver,
    deleteDriver
  };
}
