
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  Search, 
  Settings, 
  HelpCircle, 
  LogOut,
  UserCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  // Fonction pour obtenir la version française du rôle
  const getRoleFrench = (role: string): string => {
    const roleMapping: Record<string, string> = {
      'admin': 'Administrateur',
      'rh': 'Ressources Humaines',
      'planificateur': 'Planificateur',
      'commercial': 'Commercial',
      'approvisionneur': 'Approvisionneur',
      'exploitation': 'Exploitation',
      'maintenance': 'Maintenance'
    };
    return roleMapping[role] || role;
  };

  return (
    <header className="border-b border-border h-16">
      <div className="flex h-full items-center justify-between px-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Rechercher..." 
            className="pl-8 w-full bg-background" 
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-destructive"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 py-1 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="avatar" />
                  <AvatarFallback>{ user?.username?.charAt(0).toUpperCase() || 'U' }</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="leading-none">{user?.name || 'Utilisateur'}</span>
                  <Badge variant="outline" className="mt-1 px-1 py-0 text-xs font-normal">
                    {user?.role ? getRoleFrench(user.role) : 'Invité'}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || 'Utilisateur'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'utilisateur@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Aide</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
