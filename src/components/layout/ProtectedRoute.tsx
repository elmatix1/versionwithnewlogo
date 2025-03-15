
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { toast } from "sonner";

interface ProtectedRouteProps {
  requiredRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles = [] }) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  const location = useLocation();
  
  // Afficher un écran de chargement pendant la vérification
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  // Vérifier les permissions basées sur les rôles
  if (requiredRoles.length > 0 && !hasPermission(requiredRoles)) {
    toast.error("Accès refusé", {
      description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page",
    });
    return <Navigate to="/" replace />;
  }
  
  // Afficher les routes enfants si authentifié et autorisé
  return <Outlet />;
};

export default ProtectedRoute;
