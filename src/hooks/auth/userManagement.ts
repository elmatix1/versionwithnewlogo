
import { toast } from "sonner";
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage';
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
  try {
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
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un utilisateur:", error);
    toast.error("Erreur", { description: "Une erreur s'est produite lors de l'ajout de l'utilisateur" });
    return null;
  }
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
  try {
    if (!checkActionPermission(userRole, 'edit-user')) {
      toast.error("Accès refusé", { description: "Vous n'avez pas les permissions pour modifier un utilisateur" });
      return null;
    }
    
    // Vérifier si l'utilisateur existe
    const userExists = allUsers.some(user => user.id === id);
    if (!userExists) {
      toast.error("Utilisateur introuvable", { description: "L'utilisateur que vous tentez de modifier n'existe pas" });
      return null;
    }
    
    const updatedUsers = allUsers.map(user => 
      user.id === id ? { ...user, ...userData } : user
    );
    
    // Enregistrer dans localStorage immédiatement
    saveToLocalStorage(USERS_STORAGE_KEY, updatedUsers);
    
    toast.success("Utilisateur mis à jour", { description: "Les informations ont été mises à jour avec succès" });
    
    return updatedUsers;
  } catch (error) {
    console.error("Erreur lors de la mise à jour d'un utilisateur:", error);
    toast.error("Erreur", { description: "Une erreur s'est produite lors de la mise à jour de l'utilisateur" });
    return allUsers; // Retourne la liste originale en cas d'erreur
  }
};

/**
 * Delete a user
 */
export const deleteUser = (
  id: string, 
  allUsers: User[], 
  userRole?: UserRole
): User[] | null => {
  try {
    if (!checkActionPermission(userRole, 'delete-user')) {
      toast.error("Accès refusé", { description: "Vous n'avez pas les permissions pour supprimer un utilisateur" });
      return null;
    }
    
    // Vérifier si l'utilisateur existe
    const userExists = allUsers.some(user => user.id === id);
    if (!userExists) {
      toast.error("Utilisateur introuvable", { description: "L'utilisateur que vous tentez de supprimer n'existe pas" });
      return null;
    }
    
    const updatedUsers = allUsers.filter(user => user.id !== id);
    
    // Enregistrer dans localStorage immédiatement
    saveToLocalStorage(USERS_STORAGE_KEY, updatedUsers);
    
    toast.success("Utilisateur supprimé", { description: "L'utilisateur a été supprimé avec succès" });
    
    return updatedUsers;
  } catch (error) {
    console.error("Erreur lors de la suppression d'un utilisateur:", error);
    toast.error("Erreur", { description: "Une erreur s'est produite lors de la suppression de l'utilisateur" });
    return allUsers; // Retourne la liste originale en cas d'erreur
  }
};

/**
 * Change user role
 */
export const changeUserRole = (
  id: string,
  newRole: UserRole,
  allUsers: User[],
  userRole?: UserRole
): User[] | null => {
  try {
    if (!checkActionPermission(userRole, 'manage-roles')) {
      toast.error("Accès refusé", { description: "Vous n'avez pas les permissions pour gérer les rôles" });
      return null;
    }
    
    // Utiliser updateUser pour maintenir la cohérence
    return updateUser(id, { role: newRole }, allUsers, userRole);
  } catch (error) {
    console.error("Erreur lors du changement de rôle:", error);
    toast.error("Erreur", { description: "Une erreur s'est produite lors du changement de rôle" });
    return allUsers;
  }
};

/**
 * Reset user password (simulation)
 */
export const resetUserPassword = (
  id: string,
  allUsers: User[],
  userRole?: UserRole
): boolean => {
  try {
    if (!checkActionPermission(userRole, 'edit-user')) {
      toast.error("Accès refusé", { description: "Vous n'avez pas les permissions pour réinitialiser les mots de passe" });
      return false;
    }
    
    // Vérifier si l'utilisateur existe
    const userExists = allUsers.some(user => user.id === id);
    if (!userExists) {
      toast.error("Utilisateur introuvable", { description: "L'utilisateur n'existe pas" });
      return false;
    }
    
    // Dans un système réel, nous enverrions un email avec un lien de réinitialisation
    // Pour cette simulation, nous considérons l'opération réussie
    toast.success("Mot de passe réinitialisé", { 
      description: "Un nouveau mot de passe temporaire a été envoyé à l'utilisateur" 
    });
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    toast.error("Erreur", { description: "Une erreur s'est produite lors de la réinitialisation du mot de passe" });
    return false;
  }
};
