
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Search, MoreVertical, Plus, Filter, UserPlus } from 'lucide-react';
import { useAuth, UserRole } from '@/hooks/useAuth';
import AddUserForm from '@/components/users/AddUserForm';
import { toast } from "sonner";

type UserStatus = 'active' | 'inactive';

interface ExtendedUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
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
  const [userToEdit, setUserToEdit] = useState<ExtendedUser | null>(null);
  const [userRoleToChange, setUserRoleToChange] = useState<{userId: string, currentRole: UserRole} | null>(null);
  const [userToResetPassword, setUserToResetPassword] = useState<string | null>(null);
  
  // Convertir les utilisateurs du contexte auth en utilisateurs étendus pour l'affichage
  const extendedUsers: ExtendedUser[] = allUsers.map(user => ({
    ...user,
    status: 'active' as UserStatus
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

  // Gestionnaire pour modifier un utilisateur
  const handleEditUser = () => {
    if (userToEdit) {
      updateUser(userToEdit.id, {
        name: userToEdit.name,
        email: userToEdit.email
      });
      setUserToEdit(null);
      toast.success("Utilisateur modifié avec succès");
    }
  };

  // Gestionnaire pour changer le rôle d'un utilisateur
  const handleChangeRole = (newRole: UserRole) => {
    if (userRoleToChange) {
      updateUser(userRoleToChange.userId, {
        role: newRole
      });
      setUserRoleToChange(null);
      toast.success("Rôle de l'utilisateur modifié avec succès");
    }
  };

  // Gestionnaire pour réinitialiser le mot de passe
  const handleResetPassword = () => {
    if (userToResetPassword) {
      // Dans une application réelle, cela enverrait un email ou générerait un nouveau mot de passe
      toast.success("Un lien de réinitialisation de mot de passe a été envoyé à l'utilisateur");
      setUserToResetPassword(null);
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
                            <DropdownMenuItem onClick={() => setUserToEdit(user)}>
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setUserRoleToChange({userId: user.id, currentRole: user.role})}>
                              Changer le rôle
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setUserToResetPassword(user.id)}>
                              Réinitialiser le mot de passe
                            </DropdownMenuItem>
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
                    <TableCell colSpan={hasActionPermission('edit-user') ? 5 : 4} className="text-center py-8 text-muted-foreground">
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
      
      {/* Boîte de dialogue de modification d'utilisateur */}
      <Dialog open={!!userToEdit} onOpenChange={(open) => !open && setUserToEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur ci-dessous.
            </DialogDescription>
          </DialogHeader>
          {userToEdit && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nom</label>
                <Input
                  id="name"
                  value={userToEdit.name}
                  onChange={(e) => setUserToEdit({...userToEdit, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={userToEdit.email}
                  onChange={(e) => setUserToEdit({...userToEdit, email: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToEdit(null)}>Annuler</Button>
            <Button onClick={handleEditUser}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue de changement de rôle */}
      <Dialog open={!!userRoleToChange} onOpenChange={(open) => !open && setUserRoleToChange(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changer le rôle</DialogTitle>
            <DialogDescription>
              Choisissez un nouveau rôle pour cet utilisateur.
            </DialogDescription>
          </DialogHeader>
          {userRoleToChange && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">Rôle</label>
                <Select 
                  defaultValue={userRoleToChange.currentRole}
                  onValueChange={(value) => handleChangeRole(value as UserRole)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="rh">Ressources Humaines</SelectItem>
                    <SelectItem value="planificateur">Planificateur</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="approvisionneur">Approvisionneur</SelectItem>
                    <SelectItem value="exploitation">Chargé d'exploitation</SelectItem>
                    <SelectItem value="maintenance">Chargé de maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserRoleToChange(null)}>Annuler</Button>
            <Button onClick={() => setUserRoleToChange(null)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue de réinitialisation de mot de passe */}
      <AlertDialog
        open={!!userToResetPassword}
        onOpenChange={(open) => !open && setUserToResetPassword(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Réinitialiser le mot de passe</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir réinitialiser le mot de passe de cet utilisateur ? Un lien de réinitialisation sera envoyé à son adresse email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPassword}>Réinitialiser</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
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
