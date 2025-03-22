
import { useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage';

export type UserRole = 'admin' | 'rh' | 'planificateur' | 'commercial' | 'approvisionneur' | 'exploitation' | 'maintenance';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cin?: string;
  city?: string;
  address?: string;
}

const STORAGE_KEY = 'tms-users';

export function useUsers() {
  const [users, setUsers] = useState<User[]>(() => 
    loadFromLocalStorage<User[]>(STORAGE_KEY, [])
  );

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEY, users);
  }, [users]);

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      id: Date.now().toString(),
      ...userData
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === id ? { ...user, ...updates } : user
      )
    );
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  return {
    users,
    addUser,
    updateUser,
    deleteUser
  };
}
