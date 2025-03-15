
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import HRManagement from "./pages/HRManagement";
import VehicleManagement from "./pages/VehicleManagement";
import OrderManagement from "./pages/OrderManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Route publique */}
            <Route path="/login" element={<Login />} />
            
            {/* Routes protégées de base - accessibles à tous les utilisateurs authentifiés */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Dashboard />} />
                
                {/* Routes protégées par rôle */}
                <Route element={<ProtectedRoute requiredRoles={['admin']} />}>
                  <Route path="/users" element={<UserManagement />} />
                  <Route path="/settings" element={<NotFound />} />
                </Route>
                
                <Route element={<ProtectedRoute requiredRoles={['admin', 'rh']} />}>
                  <Route path="/hr" element={<HRManagement />} />
                </Route>
                
                <Route element={<ProtectedRoute requiredRoles={['admin', 'exploitation', 'maintenance', 'planificateur']} />}>
                  <Route path="/vehicles" element={<VehicleManagement />} />
                </Route>
                
                <Route element={<ProtectedRoute requiredRoles={['admin', 'commercial', 'approvisionneur']} />}>
                  <Route path="/orders" element={<OrderManagement />} />
                </Route>
                
                <Route element={<ProtectedRoute requiredRoles={['admin', 'planificateur', 'exploitation']} />}>
                  <Route path="/planning" element={<NotFound />} />
                </Route>
                
                <Route element={<ProtectedRoute requiredRoles={['admin', 'approvisionneur']} />}>
                  <Route path="/inventory" element={<NotFound />} />
                </Route>
                
                <Route element={<ProtectedRoute requiredRoles={['admin', 'maintenance']} />}>
                  <Route path="/maintenance" element={<NotFound />} />
                </Route>
                
                <Route element={<ProtectedRoute requiredRoles={['admin', 'commercial']} />}>
                  <Route path="/reports" element={<NotFound />} />
                </Route>
              </Route>
            </Route>
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
