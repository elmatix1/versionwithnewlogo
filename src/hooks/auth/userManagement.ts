
import { toast } from "sonner";
import { saveToLocalStorage } from '@/utils/localStorage';
import { User, UserRole, USERS_STORAGE_KEY } from './types';
import { checkActionPermission } from './permissions';

/**
 * Add a new user
 */
export const addUser = (
  userData: Omit<User, 'id'>, 
  allUsers: User[], 
  userRole?: UserRole
): User[] | null => {
  if (!checkActionPermission(userRole, 'add-user')) {
    toast.error("Accès refusé", { description: "Vous n'avez pas les permissions pour ajouter un utilisateur" });
    return null;
  }
  
  const newUser = {
    id: (allUsers.length + 1).toString(),
    ...userData
  };
  
  const updatedUsers = [...allUsers, newUser];
  
  // Enregistrer dans localStorage
  saveToLocalStorage(USERS_STORAGE_KEY, updatedUsers);
  
  toast.success("Utilisateur ajouté", { description: `${newUser.name} a été ajouté avec succès` });
  
  return updatedUsers;
};

/**
 * Update an existing user
 */
export const updateUser = (
  id: string, 
  userData: Partial<User>, 
  allUsers: User[], 
  userRole?: UserRole
): User[] | null => {
  if (!checkActionPermission(userRole, 'edit-user')) {
    toast.error("Accès refusé", { description: "Vous n'avez pas les permissions pour modifier un utilisateur" });
    return null;
  }
  
  const updatedUsers = allUsers.map(user => 
    user.id === id ? { ...user, ...userData } : user
  );
  
  // Enregistrer dans localStorage
  saveToLocalStorage(USERS_STORAGE_KEY, updatedUsers);
  
  toast.success("Utilisateur mis à jour", { description: "Les informations ont été mises à jour avec succès" });
  
  return updatedUsers;
};

/**
 * Delete a user
 */
export const deleteUser = (
  id: string, 
  allUsers: User[], 
  userRole?: UserRole
): User[] | null => {
  if (!checkActionPermission(userRole, 'delete-user')) {
    toast.error("Accès refusé", { description: "Vous n'avez pas les permissions pour supprimer un utilisateur" });
    return null;
  }
  
  const updatedUsers = allUsers.filter(user => user.id !== id);
  
  // Enregistrer dans localStorage
  saveToLocalStorage(USERS_STORAGE_KEY, updatedUsers);
  
  toast.success("Utilisateur supprimé", { description: "L'utilisateur a été supprimé avec succès" });
  
  return updatedUsers;
};
