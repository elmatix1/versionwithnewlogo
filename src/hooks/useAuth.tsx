import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage';
import { 
  User, 
  UserRole, 
  DEFAULT_USERS, 
  USERS_STORAGE_KEY, 
  AUTH_USER_KEY, 
  AUTH_STATUS_KEY 
} from './auth/types';
import { checkRolePermission, checkActionPermission } from './auth/permissions';
import { 
  addUser as addUserUtil, 
  updateUser as updateUserUtil, 
  deleteUser as deleteUserUtil,
  changeUserRole as changeUserRoleUtil,
  resetUserPassword as resetUserPasswordUtil
} from './auth/userManagement';

// Re-export types for convenience
export type { UserRole } from './auth/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
  hasActionPermission: (action: string) => boolean;
  allUsers: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  changeUserRole: (id: string, newRole: UserRole) => void;
  resetUserPassword: (id: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = loadFromLocalStorage<User | null>(AUTH_USER_KEY, null);
      const storedAuth = loadFromLocalStorage<boolean>(AUTH_STATUS_KEY, false);
      
      if (storedUser && storedAuth) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
      
      const storedAllUsers = loadFromLocalStorage<User[]>(
        USERS_STORAGE_KEY, 
        DEFAULT_USERS.map(({ password, ...user }) => user)
      );
      
      setAllUsers(storedAllUsers);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    if (allUsers.length > 0) {
      saveToLocalStorage(USERS_STORAGE_KEY, allUsers);
    }
  }, [allUsers]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = DEFAULT_USERS.find(
      u => u.username === username && u.password === password
    );
    
    if (foundUser) {
      const secureUser = {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        cin: foundUser.cin,
        city: foundUser.city,
        address: foundUser.address
      };
      
      setUser(secureUser);
      setIsAuthenticated(true);
      saveToLocalStorage(AUTH_USER_KEY, secureUser);
      saveToLocalStorage(AUTH_STATUS_KEY, true);
      
      toast.success(`Bienvenue, ${secureUser.name}`, {
        description: `Vous êtes connecté en tant que ${secureUser.role}`,
      });
      
      setIsLoading(false);
      return true;
    } else {
      toast.error("Échec de la connexion", {
        description: "Nom d'utilisateur ou mot de passe incorrect",
      });
      
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_STATUS_KEY);
    toast.info("Déconnecté", {
      description: "Vous avez été déconnecté avec succès",
    });
    navigate('/login');
  };

  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    return checkRolePermission(user?.role, requiredRoles);
  };

  const hasActionPermission = (action: string): boolean => {
    return checkActionPermission(user?.role, action);
  };

  const handleAddUser = (userData: Omit<User, 'id'>) => {
    const result = addUserUtil(userData, allUsers, user?.role);
    if (result) setAllUsers(result);
  };

  const handleUpdateUser = (id: string, userData: Partial<User>) => {
    const result = updateUserUtil(id, userData, allUsers, user?.role);
    if (result) setAllUsers(result);
  };

  const handleDeleteUser = (id: string) => {
    const result = deleteUserUtil(id, allUsers, user?.role);
    if (result) setAllUsers(result);
  };

  const handleChangeUserRole = (id: string, newRole: UserRole) => {
    const result = changeUserRoleUtil(id, newRole, allUsers, user?.role);
    if (result) setAllUsers(result);
  };

  const handleResetUserPassword = (id: string): boolean => {
    return resetUserPasswordUtil(id, allUsers, user?.role);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      login, 
      logout,
      hasPermission,
      hasActionPermission,
      allUsers,
      addUser: handleAddUser,
      updateUser: handleUpdateUser,
      deleteUser: handleDeleteUser,
      changeUserRole: handleChangeUserRole,
      resetUserPassword: handleResetUserPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
