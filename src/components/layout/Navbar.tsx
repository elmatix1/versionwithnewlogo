
import { useState, useEffect } from 'react';
import { Menu, BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import UserMenu from './UserMenu';
import NotificationMenu from './NotificationMenu';

interface NavbarProps {
  setSidebarOpen: (value: boolean) => void;
}

const Navbar = ({ setSidebarOpen }: NavbarProps) => {
  const location = useLocation();
  const isMobile = useMobile();
  const { user } = useAuth();
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    // Get page title based on path
    const path = location.pathname;
    if (path === "/") {
      setPageTitle("Tableau de bord");
    } else if (path.includes("users")) {
      setPageTitle("Gestion des utilisateurs");
    } else if (path.includes("hr")) {
      setPageTitle("Ressources humaines");
    } else if (path.includes("vehicles")) {
      setPageTitle("Gestion des véhicules");
    } else if (path.includes("orders")) {
      setPageTitle("Gestion des commandes");
    } else if (path.includes("planning")) {
      setPageTitle("Planification");
    } else if (path.includes("inventory")) {
      setPageTitle("Inventaire");
    } else if (path.includes("maintenance")) {
      setPageTitle("Maintenance");
    } else if (path.includes("reports")) {
      setPageTitle("Rapports");
    } else if (path.includes("settings")) {
      setPageTitle("Paramètres");
    }
  }, [location]);

  return (
    <header className={cn(
      "sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4",
      "transition-all duration-300"
    )}>
      <div className="flex items-center gap-2">
        {user && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Basculer le menu latéral"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-medium">{pageTitle}</h1>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <NotificationMenu />
          <UserMenu />
        </div>
      )}
    </header>
  );
};

export default Navbar;
