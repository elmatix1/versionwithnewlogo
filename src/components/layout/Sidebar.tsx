
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  CalendarClock, 
  FileText, 
  ShoppingBag, 
  Wrench, 
  BarChart4,
  Settings
} from 'lucide-react';
import Logo from './Logo';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  requiredRoles?: UserRole[];
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, requiredRoles = [] }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const { hasPermission } = useAuth();
  
  // Ne pas rendre l'élément si l'utilisateur n'a pas les permissions nécessaires
  if (requiredRoles.length > 0 && !hasPermission(requiredRoles)) {
    return null;
  }

  return (
    <Link 
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive 
          ? "bg-sidebar-primary text-sidebar-primary-foreground" 
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      {icon}
      {label}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-full bg-sidebar border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <Logo size="lg" variant="sidebar" />
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
        <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Tableau de bord" />
        <NavItem to="/users" icon={<Users size={18} />} label="Utilisateurs" requiredRoles={['admin']} />
        <NavItem to="/hr" icon={<Users size={18} />} label="Ressources Humaines" requiredRoles={['admin', 'rh']} />
        <NavItem to="/vehicles" icon={<Truck size={18} />} label="Véhicules" requiredRoles={['admin', 'exploitation', 'maintenance', 'planificateur']} />
        <NavItem to="/planning" icon={<CalendarClock size={18} />} label="Planification" requiredRoles={['admin', 'planificateur', 'exploitation']} />
        <NavItem to="/orders" icon={<FileText size={18} />} label="Commandes" requiredRoles={['admin', 'commercial', 'approvisionneur']} />
        <NavItem to="/inventory" icon={<ShoppingBag size={18} />} label="Inventaire" requiredRoles={['admin', 'approvisionneur']} />
        <NavItem to="/maintenance" icon={<Wrench size={18} />} label="Maintenance" requiredRoles={['admin', 'maintenance']} />
        <NavItem to="/reports" icon={<BarChart4 size={18} />} label="Rapports" requiredRoles={['admin', 'commercial']} />
      </nav>
      
      <div className="p-4 border-t border-border">
        <NavItem to="/settings" icon={<Settings size={18} />} label="Paramètres" requiredRoles={['admin']} />
      </div>
    </div>
  );
};

export default Sidebar;
