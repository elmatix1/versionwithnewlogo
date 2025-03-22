
import { useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage';

export type VehicleStatus = 'active' | 'maintenance' | 'inactive';

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  status: VehicleStatus;
  fuelLevel: number;
  lastMaintenance: string;
  nextService: string;
  driver?: string;
  location?: string;
}

const STORAGE_KEY = 'tms-vehicles';

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => 
    loadFromLocalStorage<Vehicle[]>(STORAGE_KEY, [])
  );

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEY, vehicles);
  }, [vehicles]);

  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      ...vehicleData
    };
    setVehicles(prev => [...prev, newVehicle]);
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => 
      prev.map(vehicle => 
        vehicle.id === id ? { ...vehicle, ...updates } : vehicle
      )
    );
  };

  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
  };

  return {
    vehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle
  };
}
