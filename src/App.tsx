
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
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
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/hr" element={<HRManagement />} />
            <Route path="/vehicles" element={<VehicleManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            {/* Placeholder routes - These would be implemented as needed */}
            <Route path="/planning" element={<NotFound />} />
            <Route path="/inventory" element={<NotFound />} />
            <Route path="/maintenance" element={<NotFound />} />
            <Route path="/reports" element={<NotFound />} />
            <Route path="/settings" element={<NotFound />} />
          </Route>
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
