
import { Home, Users, Truck, Package, Calendar, BarChart3, Settings, UserCheck, Wrench } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import VehicleManagement from "./pages/VehicleManagement";
import UserManagement from "./pages/UserManagement";
import OrderManagement from "./pages/OrderManagement";
import Planning from "./pages/Planning";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import HRManagement from "./pages/HRManagement";
import Maintenance from "./pages/Maintenance";
import Inventory from "./pages/Inventory";
import TimeTracking from "./pages/TimeTracking";
import Index from "./pages/Index";

export const navItems = [
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: Home,
    page: <Dashboard />,
  },
  {
    title: "Véhicules",
    to: "/vehicles",
    icon: Truck,
    page: <VehicleManagement />,
  },
  {
    title: "Utilisateurs",
    to: "/users",
    icon: Users,
    page: <UserManagement />,
  },
  {
    title: "Commandes",
    to: "/orders",
    icon: Package,
    page: <OrderManagement />,
  },
  {
    title: "Planification",
    to: "/planning",
    icon: Calendar,
    page: <Planning />,
  },
  {
    title: "Rapports",
    to: "/reports",
    icon: BarChart3,
    page: <Reports />,
  },
  {
    title: "RH",
    to: "/hr",
    icon: UserCheck,
    page: <HRManagement />,
  },
  {
    title: "Maintenance",
    to: "/maintenance",
    icon: Wrench,
    page: <Maintenance />,
  },
  {
    title: "Inventaire",
    to: "/inventory",
    icon: Package,
    page: <Inventory />,
  },
  {
    title: "Temps",
    to: "/time-tracking",
    icon: UserCheck,
    page: <TimeTracking />,
  },
  {
    title: "Paramètres",
    to: "/settings",
    icon: Settings,
    page: <SettingsPage />,
  },
  {
    title: "Accueil",
    to: "/",
    icon: Home,
    page: <Index />,
  },
];
