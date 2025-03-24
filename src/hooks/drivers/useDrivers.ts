
import { useDriversFetch } from './useDriversFetch';
import { useDriversOperations } from './useDriversOperations';

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

export function useDrivers() {
  const { drivers, loading, error, setDrivers } = useDriversFetch();
  const { addDriver, updateDriver, deleteDriver } = useDriversOperations();

  return {
    drivers,
    loading,
    error,
    setDrivers,
    addDriver,
    updateDriver,
    deleteDriver
  };
}
