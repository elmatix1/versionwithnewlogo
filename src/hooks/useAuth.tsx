import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "sonner";
import { saveToLocalStorage, loadFromLocalStorage } from '@/utils/localStorage';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

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
  cin?: string;
  city?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
  hasActionPermission: (action: string) => boolean;
  allUsers: User[];
  addUser: (user: Omit<User, 'id'> & { password: string }) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_STORAGE_KEY = 'tms-users';

// Helper function to validate and convert role
const isValidUserRole = (role: string): role is UserRole => {
  return ['admin', 'rh', 'planificateur', 'commercial', 'approvisionneur', 'exploitation', 'maintenance'].includes(role);
};

const convertToUserRole = (role: string): UserRole => {
  if (isValidUserRole(role)) {
    return role;
  }
  console.warn(`Invalid role '${role}' defaulting to 'admin'`);
  return 'admin';
};

// Liste des utilisateurs par défaut pour la compatibilité
const DEFAULT_USERS = [
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

// Cartographie des actions permises par rôle
const ACTION_PERMISSIONS: Record<string, UserRole[]> = {
  'add-user': ['admin'],
  'edit-user': ['admin'],
  'delete-user': ['admin'],
  'manage-roles': ['admin'],
  'add-vehicle': ['admin', 'exploitation'],
  'edit-vehicle': ['admin', 'exploitation', 'maintenance'],
  'add-order': ['admin', 'commercial'],
  'edit-order': ['admin', 'commercial'],
  'add-inventory': ['admin', 'approvisionneur'],
  'add-planning': ['admin', 'planificateur'],
  'edit-planning': ['admin', 'planificateur'],
  'manage-hr': ['admin', 'rh']
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialiser la session Supabase
    const initializeAuth = async () => {
      try {
        // Récupérer la session actuelle
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          setSession(currentSession);
          await loadUserProfile(currentSession.user);
        }

        // Écouter les changements d'authentification
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          setSession(session);
          
          if (session?.user) {
            await loadUserProfile(session.user);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        });

        // Charger tous les utilisateurs
        await loadAllUsers();

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Chercher le profil utilisateur dans la table users
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', supabaseUser.email)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors du chargement du profil:', error);
        return;
      }

      if (userProfile) {
        const userObj: User = {
          id: supabaseUser.id,
          username: userProfile.name.toLowerCase().replace(/\s+/g, ''),
          name: userProfile.name,
          email: userProfile.email,
          role: convertToUserRole(userProfile.role),
          cin: userProfile.cin,
          city: userProfile.city,
          address: userProfile.address
        };
        
        setUser(userObj);
        setIsAuthenticated(true);
      } else {
        // Fallback pour les utilisateurs par défaut
        const defaultUser = DEFAULT_USERS.find(u => u.email === supabaseUser.email);
        if (defaultUser) {
          const userObj: User = {
            id: supabaseUser.id,
            username: defaultUser.username,
            name: defaultUser.name,
            email: defaultUser.email,
            role: defaultUser.role,
            cin: defaultUser.cin,
            city: defaultUser.city,
            address: defaultUser.address
          };
          setUser(userObj);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil utilisateur:', error);
    }
  };

  const loadAllUsers = async () => {
    try {
      console.log('Chargement des utilisateurs depuis Supabase...');
      const { data: users, error } = await supabase
        .from('users')
        .select('*');

      if (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        const defaultUsersList = DEFAULT_USERS.map(({ password, ...user }) => user);
        setAllUsers(defaultUsersList);
        return;
      }

      if (users && users.length > 0) {
        console.log('Utilisateurs récupérés:', users);
        const formattedUsers: User[] = users.map(user => ({
          id: user.id.toString(),
          username: user.name.toLowerCase().replace(/\s+/g, ''),
          name: user.name,
          email: user.email,
          role: convertToUserRole(user.role),
          cin: user.cin,
          city: user.city,
          address: user.address
        }));
        setAllUsers(formattedUsers);
      } else {
        const defaultUsersList = DEFAULT_USERS.map(({ password, ...user }) => user);
        setAllUsers(defaultUsersList);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      const defaultUsersList = DEFAULT_USERS.map(({ password, ...user }) => user);
      setAllUsers(defaultUsersList);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      let email = username;
      
      if (!username.includes('@')) {
        const defaultUser = DEFAULT_USERS.find(u => u.username === username);
        if (defaultUser) {
          email = defaultUser.email;
        } else {
          const { data: users } = await supabase
            .from('users')
            .select('email, name')
            .ilike('name', `%${username}%`);
          
          if (users && users.length > 0) {
            email = users[0].email;
          }
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        const foundUser = DEFAULT_USERS.find(
          u => (u.username === username || u.email === username) && u.password === password
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
          
          toast.success(`Bienvenue, ${secureUser.name}`, {
            description: `Vous êtes connecté en tant que ${secureUser.role}`,
          });
          
          navigate('/dashboard', { replace: true });
          return true;
        }
        
        toast.error("Échec de la connexion", {
          description: "Nom d'utilisateur ou mot de passe incorrect",
        });
        return false;
      }

      if (data.user) {
        toast.success(`Bienvenue`, {
          description: `Connexion réussie`,
        });
        navigate('/dashboard', { replace: true });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast.error("Erreur de connexion", {
        description: "Une erreur s'est produite lors de la connexion",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setSession(null);
      toast.info("Déconnecté", {
        description: "Vous avez été déconnecté avec succès",
      });
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Vérifier si l'utilisateur a les permissions requises
  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    if (requiredRoles.length === 0) return true;
    return requiredRoles.includes(user.role);
  };

  // Vérifier si l'utilisateur a la permission pour une action spécifique
  const hasActionPermission = (action: string): boolean => {
    if (!user) return false;
    
    if (!ACTION_PERMISSIONS[action]) return false;
    
    return ACTION_PERMISSIONS[action].includes(user.role);
  };

  // Fonction corrigée pour ajouter un utilisateur directement dans la base de données
  const addUser = async (userData: Omit<User, 'id'> & { password: string }) => {
    if (!hasActionPermission('add-user')) {
      toast.error("Accès refusé", { description: "Vous n'avez pas les permissions pour ajouter un utilisateur" });
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('Ajout d\'un nouvel utilisateur:', userData);

      // Vérifier si l'email existe déjà
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        toast.error("Erreur lors de la création", { 
          description: "Cet email est déjà utilisé" 
        });
        return;
      }

      // Créer le profil utilisateur directement dans la table users
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          name: userData.name,
          role: userData.role,
          cin: userData.cin || null,
          city: userData.city || null,
          address: userData.address || null
        })
        .select()
        .single();

      if (insertError) {
        console.error('Erreur lors de l\'insertion:', insertError);
        throw insertError;
      }

      console.log('Utilisateur créé dans la base de données:', newUser);

      // Recharger la liste des utilisateurs pour afficher le nouveau
      await loadAllUsers();

      toast.success("Utilisateur créé avec succès", { 
        description: `${userData.name} a été ajouté et synchronisé avec la base de données` 
      });

    } catch (error: any) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      
      let errorMessage = "Une erreur s'est produite lors de la création";
      if (error.message?.includes('duplicate key')) {
        errorMessage = "Erreur : email déjà utilisé";
      } else if (error.message?.includes('email')) {
        errorMessage = "Erreur : format d'email invalide";
      }
      
      toast.error("Échec de la création", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    if (!hasActionPermission('edit-user')) {
      toast.error("Accès refusé", { description: "Vous n'avez pas les permissions pour modifier un utilisateur" });
      return;
    }
    
    try {
      // Mettre à jour dans Supabase
      const { error } = await supabase
        .from('users')
        .update({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          cin: userData.cin,
          city: userData.city,
          address: userData.address
        })
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        throw error;
      }

      // Mettre à jour localement
      const updatedUsers = allUsers.map(user => 
        user.id === id ? { ...user, ...userData } : user
      );
      
      setAllUsers(updatedUsers);
      
      toast.success("Utilisateur mis à jour", { description: "Les informations ont été mises à jour avec succès" });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error("Erreur lors de la mise à jour", { description: "Une erreur s'est produite" });
    }
  };

  const deleteUser = async (id: string) => {
    if (!hasActionPermission('delete-user')) {
      toast.error("Accès refusé", { description: "Vous n'avez pas les permissions pour supprimer un utilisateur" });
      return;
    }
    
    try {
      // Supprimer de Supabase
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la suppression:', error);
        throw error;
      }

      // Mettre à jour localement
      const updatedUsers = allUsers.filter(user => user.id !== id);
      setAllUsers(updatedUsers);
      
      toast.success("Utilisateur supprimé", { description: "L'utilisateur a été supprimé avec succès" });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Erreur lors de la suppression", { description: "Une erreur s'est produite" });
    }
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
      addUser,
      updateUser,
      deleteUser
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
