
// Types and constants for authentication system

// Roles definition
export type UserRole = 
  | 'admin' 
  | 'rh'
  | 'planificateur'
  | 'commercial'
  | 'approvisionneur'
  | 'exploitation'
  | 'maintenance';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  cin?: string;
  city?: string;
  address?: string;
}

// Storage keys
export const USERS_STORAGE_KEY = 'tms-users';
export const AUTH_USER_KEY = 'tms-auth-user';
export const AUTH_STATUS_KEY = 'tms-auth-status';

// Default users for demo login
export const DEFAULT_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Administrateur',
    email: 'admin@translogica.fr',
    role: 'admin' as UserRole,
    cin: 'AB123456',
    city: 'Casablanca',
    address: 'Boulevard Mohammed V'
  },
  {
    id: '2',
    username: 'rh',
    password: 'admin123',
    name: 'Responsable RH',
    email: 'rh@translogica.fr',
    role: 'rh' as UserRole,
    cin: 'K456789',
    city: 'Rabat',
    address: 'Rue Hassan II'
  },
  {
    id: '3',
    username: 'pl',
    password: 'admin123',
    name: 'Planificateur',
    email: 'planificateur@translogica.fr',
    role: 'planificateur' as UserRole,
    cin: 'X987654',
    city: 'Marrakech',
    address: 'Avenue des FAR'
  },
  {
    id: '4',
    username: 'cl',
    password: 'admin123',
    name: 'Commercial',
    email: 'commercial@translogica.fr',
    role: 'commercial' as UserRole,
    cin: 'J234567',
    city: 'Fès',
    address: 'Boulevard Zerktouni'
  },
  {
    id: '5',
    username: 'ap',
    password: 'admin123',
    name: 'Approvisionneur',
    email: 'approvisionneur@translogica.fr',
    role: 'approvisionneur' as UserRole,
    cin: 'BE789012',
    city: 'Tanger',
    address: 'Avenue Mohammed VI'
  },
  {
    id: '6',
    username: 'ch',
    password: 'admin123',
    name: 'Chargé d\'exploitation',
    email: 'exploitation@translogica.fr',
    role: 'exploitation' as UserRole,
    cin: 'C345678',
    city: 'Agadir',
    address: 'Boulevard Anfa'
  },
  {
    id: '7',
    username: 'chh',
    password: 'admin123',
    name: 'Chargé de maintenance',
    email: 'maintenance@translogica.fr',
    role: 'maintenance' as UserRole,
    cin: 'D901234',
    city: 'Meknès',
    address: 'Rue Ibn Batouta'
  }
];
