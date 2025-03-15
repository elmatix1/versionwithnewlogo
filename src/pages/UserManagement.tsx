
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Search, MoreVertical, Plus, Filter, UserPlus } from 'lucide-react';
import { useAuth, UserRole } from '@/hooks/useAuth';
import AddUserForm from '@/components/users/AddUserForm';

type UserStatus = 'active' | 'inactive';

interface ExtendedUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
}

const roleLabels: Record<UserRole, string> = {
  'admin': 'Administrateur',
  'rh': 'Ressources Humaines',
  'planificateur': 'Planificateur',
  'commercial': 'Commercial',
  'approvisionneur': 'Approvisionneur',
  'exploitation': 'Chargé d\'exploitation', 
  'maintenance': 'Chargé de maintenance'
};

const UserManagement: React.FC = () => {
  const { allUsers, addUser, updateUser, deleteUser, hasActionPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  // Convertir les utilisateurs du contexte auth en utilisateurs étendus pour l'affichage
  const extendedUsers: ExtendedUser[] = allUsers.map(user => ({
    ...user,
    status: 'active' as UserStatus,
    lastActive: "Il y a quelques minutes" // Donnée simulée
  }));
  
  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = extendedUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    roleLabels[user.role].toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Gestionnaire pour ajouter un nouvel utilisateur
  const handleAddUser = (userData: any) => {
    addUser({
      username: userData.username,
      name: userData.name,
      email: userData.email,
      role: userData.role as UserRole
    });
  };
  
  // Gestionnaire pour changer le statut d'un utilisateur
  const handleToggleStatus = (userId: string, currentStatus: UserStatus) => {
    updateUser(userId, {
      // Cette propriété serait normalement gérée par le backend
    });
  };
  
  // Gestionnaire pour supprimer un utilisateur
  const handleDeleteUser = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      setUserToDelete(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Gestion des utilisateurs</h1>
        <p className="text-muted-foreground">Gérez les comptes utilisateurs et les permissions</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Utilisateurs</CardTitle>
              <CardDescription>Gérez les utilisateurs et leurs rôles</CardDescription>
            </div>
            {hasActionPermission('add-user') && (
              <Button 
                className="flex items-center gap-2"
                onClick={() => setOpenAddUserDialog(true)}
              >
                <UserPlus size={16} />
                <span>Ajouter</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Rechercher..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              <span>Filtres</span>
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière activité</TableHead>
                  {hasActionPermission('edit-user') && (
                    <TableHead className="w-[50px]"></TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{roleLabels[user.role]}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={user.status === "active" ? "border-green-500 text-green-600" : "border-zinc-500 text-zinc-600"}>
                        {user.status === "active" ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
                    {hasActionPermission('edit-user') && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                            <DropdownMenuItem>Changer le rôle</DropdownMenuItem>
                            <DropdownMenuItem>Réinitialiser le mot de passe</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => setUserToDelete(user.id)}
                            >
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={hasActionPermission('edit-user') ? 6 : 5} className="text-center py-8 text-muted-foreground">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Formulaire d'ajout d'utilisateur */}
      <AddUserForm 
        open={openAddUserDialog}
        onOpenChange={setOpenAddUserDialog}
        onAddUser={handleAddUser}
      />
      
      {/* Boîte de dialogue de confirmation de suppression */}
      <AlertDialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement cet utilisateur du système.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
