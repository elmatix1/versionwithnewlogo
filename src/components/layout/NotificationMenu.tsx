
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
};

const NotificationMenu: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nouvelle commande',
      description: 'Commande #1042 reçue de Société Martin',
      time: 'Il y a 5 minutes',
      read: false,
      type: 'info'
    },
    {
      id: '2',
      title: 'Alerte véhicule',
      description: 'Entretien requis pour TL-3045',
      time: 'Il y a 1 heure',
      read: false,
      type: 'warning'
    },
    {
      id: '3',
      title: 'Livraison terminée',
      description: 'Commande #1039 livrée avec succès',
      time: 'Il y a 3 heures',
      read: true,
      type: 'success'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    toast.success("Notification marquée comme lue");
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
    toast.success("Toutes les notifications marquées comme lues");
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-amber-100 text-amber-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'success': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] min-w-[18px] min-h-[18px] flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
              Tout marquer comme lu
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            Aucune notification
          </div>
        ) : (
          notifications.map(notification => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start py-2 px-4 focus:bg-accent cursor-pointer" onClick={() => markAsRead(notification.id)}>
              <div className="flex items-start w-full">
                <div className={`w-2 h-2 rounded-full mt-1.5 mr-2 ${notification.read ? 'bg-transparent' : 'bg-primary'}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-sm">{notification.title}</span>
                    <Badge variant="outline" className={`text-xs ${getTypeColor(notification.type)}`}>
                      {notification.type === 'info' && 'Info'}
                      {notification.type === 'warning' && 'Alerte'}
                      {notification.type === 'error' && 'Erreur'}
                      {notification.type === 'success' && 'Succès'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                  <span className="text-xs text-muted-foreground mt-2 block">{notification.time}</span>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center text-primary" asChild>
          <Button variant="ghost" className="w-full">Voir toutes les notifications</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;
