
import { Driver, DriverStatus } from '../useDrivers';

/**
 * Formats raw driver data from Supabase to match the Driver interface
 */
export function formatDriverData(driver: any): Driver {
  return {
    id: driver.id.toString(),
    name: driver.name,
    status: driver.status as DriverStatus,
    experience: driver.experience,
    vehicles: Array.isArray(driver.vehicles) ? driver.vehicles : [],
    documentValidity: driver.document_validity,
    phone: driver.phone || '',
    address: driver.address || '',
    licenseType: driver.license_type || ''
  };
}

/**
 * Formats driver data for insertion into Supabase
 */
export function formatDriverForInsert(driverData: Omit<Driver, 'id'>) {
  return {
    name: driverData.name,
    status: driverData.status,
    experience: driverData.experience,
    vehicles: Array.isArray(driverData.vehicles) ? driverData.vehicles : [],
    document_validity: driverData.documentValidity,
    phone: driverData.phone || null,
    address: driverData.address || null,
    license_type: driverData.licenseType || null
  };
}
