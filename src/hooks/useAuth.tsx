
import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

// Définition des rôles disponibles
export type UserRole = 
  | 'admin' 
  | 'rh'
  | 'planificateur'
  | 'commercial'
  | 'approvisionneur'
  | 'exploitation'
  | 'maintenance';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Liste des utilisateurs par défaut
const DEFAULT_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Administrateur',
    email: 'admin@translogica.fr',
    role: 'admin' as UserRole
  },
  {
    id: '2',
    username: 'rh',
    password: 'admin123',
    name: 'Responsable RH',
    email: 'rh@translogica.fr',
    role: 'rh' as UserRole
  },
  {
    id: '3',
    username: 'pl',
    password: 'admin123',
    name: 'Planificateur',
    email: 'planificateur@translogica.fr',
    role: 'planificateur' as UserRole
  },
  {
    id: '4',
    username: 'cl',
    password: 'admin123',
    name: 'Commercial',
    email: 'commercial@translogica.fr',
    role: 'commercial' as UserRole
  },
  {
    id: '5',
    username: 'ap',
    password: 'admin123',
    name: 'Approvisionneur',
    email: 'approvisionneur@translogica.fr',
    role: 'approvisionneur' as UserRole
  },
  {
    id: '6',
    username: 'ch',
    password: 'admin123',
    name: 'Chargé d\'exploitation',
    email: 'exploitation@translogica.fr',
    role: 'exploitation' as UserRole
  },
  {
    id: '7',
    username: 'chh',
    password: 'admin123',
    name: 'Chargé de maintenance',
    email: 'maintenance@translogica.fr',
    role: 'maintenance' as UserRole
  }
];

// Cartographie des permissions d'accès par rôle
const ROLE_ACCESS_MAP: Record<UserRole, string[]> = {
  'admin': ['/', '/users', '/hr', '/vehicles', '/planning', '/orders', '/inventory', '/maintenance', '/reports', '/settings'],
  'rh': ['/', '/hr'],
  'planificateur': ['/', '/planning', '/vehicles'],
  'commercial': ['/', '/orders', '/reports'],
  'approvisionneur': ['/', '/inventory', '/orders'],
  'exploitation': ['/', '/vehicles', '/planning'],
  'maintenance': ['/', '/vehicles', '/maintenance']
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const storedAuth = localStorage.getItem('isAuthenticated');
      
      if (storedUser && storedAuth === 'true') {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Recherche de l'utilisateur par nom d'utilisateur et mot de passe
    const foundUser = DEFAULT_USERS.find(
      u => u.username === username && u.password === password
    );
    
    if (foundUser) {
      // Créer un objet utilisateur sans le mot de passe pour le stockage
      const secureUser = {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
      };
      
      setUser(secureUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(secureUser));
      localStorage.setItem('isAuthenticated', 'true');
      
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
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    toast.info("Déconnecté", {
      description: "Vous avez été déconnecté avec succès",
    });
    navigate('/login');
  };

  // Vérifier si l'utilisateur a les permissions requises
  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    if (requiredRoles.length === 0) return true; // Aucun rôle requis
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading, 
      login, 
      logout,
      hasPermission 
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
