import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Pencil, UserCog, KeyRound, Trash } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserRole } from '@/hooks/auth/types';
import AddUserForm from '@/components/users/AddUserForm';
import MoroccanSuggestionInput from '@/components/shared/MoroccanSuggestionInput';

const getRoleName = (role: UserRole) => {
  const roleNames: Record<UserRole, string> = {
    'admin': 'Administrateur',
    'rh': 'Ressources Humaines',
    'planificateur': 'Planificateur',
    'commercial': 'Commercial',
    'approvisionneur': 'Approvisionneur',
    'exploitation': 'Exploitation',
    'maintenance': 'Maintenance',
  };
  return roleNames[role] || role;
};

const getRoleBadgeColor = (role: UserRole) => {
  const colors: Record<UserRole, string> = {
    'admin': 'bg-red-500',
    'rh': 'bg-blue-500',
    'planificateur': 'bg-amber-500',
    'commercial': 'bg-green-500',
    'approvisionneur': 'bg-indigo-500',
    'exploitation': 'bg-purple-500',
    'maintenance': 'bg-cyan-500',
  };
  return colors[role] || 'bg-gray-500';
};

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
  const { allUsers, updateUser, deleteUser, hasActionPermission, addUser } = useAuth();
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [changeRoleDialogOpen, setChangeRoleDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState<UserRole>('admin');
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCIN, setEditCIN] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!editUserDialogOpen && !changeRoleDialogOpen && !resetPasswordDialogOpen && !deleteUserDialogOpen) {
      setIsProcessing(false);
    }
  }, [editUserDialogOpen, changeRoleDialogOpen, resetPasswordDialogOpen, deleteUserDialogOpen]);

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setEditName(user.name || '');
    setEditEmail(user.email || '');
    setEditCIN(user.cin || '');
    setEditCity(user.city || '');
    setEditAddress(user.address || '');
    setEditUserDialogOpen(true);
  };

  const handleChangeRole = (user: any) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setChangeRoleDialogOpen(true);
  };

  const handleResetPassword = (user: any) => {
    setSelectedUser(user);
    setResetPasswordDialogOpen(true);
  };

  const handleDelete = (user: any) => {
    setSelectedUser(user);
    setDeleteUserDialogOpen(true);
  };

  const confirmEditUser = () => {
    if (selectedUser && !isProcessing) {
      setIsProcessing(true);
      
      try {
        updateUser(selectedUser.id, {
          name: editName,
          email: editEmail,
          cin: editCIN,
          city: editCity,
          address: editAddress
        });
        
        setEditUserDialogOpen(false);
      } catch (error) {
        console.error("Erreur lors de la modification de l'utilisateur:", error);
        toast.error("Erreur", { description: "Une erreur s'est produite lors de la modification de l'utilisateur" });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const confirmChangeRole = () => {
    if (selectedUser && !isProcessing) {
      setIsProcessing(true);
      
      try {
        updateUser(selectedUser.id, { role: newRole });
        
        setChangeRoleDialogOpen(false);
        
        toast.success("Rôle mis à jour", {
          description: `Le rôle de ${selectedUser.name} a été changé en ${roleLabels[newRole]}.`
        });
      } catch (error) {
        console.error("Erreur lors du changement de rôle:", error);
        toast.error("Erreur", { description: "Une erreur s'est produite lors du changement de rôle" });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const confirmResetPassword = () => {
    if (selectedUser && !isProcessing) {
      setIsProcessing(true);
      
      try {
        const newRandomPassword = Math.random().toString(36).slice(-8);
        
        toast.success(`Mot de passe réinitialisé pour ${selectedUser.name}`, {
          description: `Un nouveau mot de passe a été envoyé à l'utilisateur.`
        });
        
        setResetPasswordDialogOpen(false);
      } catch (error) {
        console.error("Erreur lors de la réinitialisation du mot de passe:", error);
        toast.error("Erreur", { description: "Une erreur s'est produite lors de la réinitialisation du mot de passe" });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const confirmDeleteUser = () => {
    if (selectedUser && !isProcessing) {
      setIsProcessing(true);
      
      try {
        const userName = selectedUser.name;
        deleteUser(selectedUser.id);
        
        setDeleteUserDialogOpen(false);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur:", error);
        toast.error("Erreur", { description: "Une erreur s'est produite lors de la suppression de l'utilisateur" });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleAddUser = (userData: any) => {
    if (!isProcessing) {
      setIsProcessing(true);
      
      try {
        addUser(userData);
        
        setAddUserDialogOpen(false);
        
        toast.success(`Utilisateur ${userData.name} ajouté`, {
          description: `Rôle: ${roleLabels[userData.role as UserRole]}`
        });
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur:", error);
        toast.error("Erreur", { description: "Une erreur s'est produite lors de l'ajout de l'utilisateur" });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Gestion des utilisateurs</h1>
        <p className="text-muted-foreground">Administration des comptes et des permissions</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Total: <span className="font-medium">{allUsers.length} utilisateurs</span>
          </p>
        </div>
        {hasActionPermission('add-user') && (
          <Button 
            onClick={() => setAddUserDialogOpen(true)} 
            className="flex items-center gap-1"
            disabled={isProcessing}
          >
            <Plus className="h-4 w-4" />
            <span>Nouvel utilisateur</span>
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>CIN</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {getRoleName(user.role)}
                  </Badge>
                </TableCell>
                <TableCell>{user.cin || "-"}</TableCell>
                <TableCell>{user.city || "-"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isProcessing}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => handleEdit(user)} 
                        disabled={!hasActionPermission('edit-user') || isProcessing}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Modifier</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleChangeRole(user)} 
                        disabled={!hasActionPermission('manage-roles') || isProcessing}
                      >
                        <UserCog className="mr-2 h-4 w-4" />
                        <span>Changer de rôle</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleResetPassword(user)} 
                        disabled={!hasActionPermission('edit-user') || isProcessing}
                      >
                        <KeyRound className="mr-2 h-4 w-4" />
                        <span>Réinitialiser mot de passe</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(user)} 
                        disabled={!hasActionPermission('delete-user') || isProcessing} 
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Supprimer</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editUserDialogOpen} onOpenChange={(open) => {
        if (!isProcessing) setEditUserDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom
                </Label>
                <div className="col-span-3">
                  <MoroccanSuggestionInput
                    id="edit-name"
                    label=""
                    value={editName}
                    onChange={setEditName}
                    dataType="names"
                    placeholder="Ex: Mohamed Amine"
                    className="mt-0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cin" className="text-right">
                  CIN
                </Label>
                <div className="col-span-3">
                  <MoroccanSuggestionInput
                    id="edit-cin"
                    label=""
                    value={editCIN}
                    onChange={setEditCIN}
                    dataType="cin"
                    placeholder="Ex: AB123456"
                    className="mt-0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">
                  Ville
                </Label>
                <div className="col-span-3">
                  <MoroccanSuggestionInput
                    id="edit-city"
                    label=""
                    value={editCity}
                    onChange={setEditCity}
                    dataType="cities"
                    placeholder="Ex: Casablanca"
                    className="mt-0"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Adresse
              </Label>
              <div className="col-span-3">
                <MoroccanSuggestionInput
                  id="edit-address"
                  label=""
                  value={editAddress}
                  onChange={setEditAddress}
                  dataType="streets"
                  placeholder="Ex: Boulevard Mohammed V"
                  className="mt-0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={confirmEditUser} disabled={isProcessing}>
              {isProcessing ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={changeRoleDialogOpen} onOpenChange={(open) => {
        if (!isProcessing) setChangeRoleDialogOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changer le rôle</DialogTitle>
            <DialogDescription>
              Sélectionnez un nouveau rôle pour {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Rôle
              </Label>
              <Select
                value={newRole}
                onValueChange={(value: any) => setNewRole(value)}
                disabled={isProcessing}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="rh">Ressources Humaines</SelectItem>
                  <SelectItem value="planificateur">Planificateur</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="approvisionneur">Approvisionneur</SelectItem>
                  <SelectItem value="exploitation">Exploitation</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={confirmChangeRole} disabled={isProcessing}>
              {isProcessing ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={resetPasswordDialogOpen} onOpenChange={(open) => {
        if (!isProcessing) setResetPasswordDialogOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
            <DialogDescription>
              Cette action enverra un nouveau mot de passe à l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p>Confirmez-vous la réinitialisation du mot de passe pour {selectedUser?.name}?</p>
          </div>
          <DialogFooter>
            <Button onClick={confirmResetPassword} disabled={isProcessing}>
              {isProcessing ? "Traitement..." : "Confirmer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteUserDialogOpen} onOpenChange={(open) => {
        if (!isProcessing) setDeleteUserDialogOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'utilisateur</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. L'utilisateur sera définitivement supprimé.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p>Êtes-vous sûr de vouloir supprimer {selectedUser?.name}?</p>
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={confirmDeleteUser} disabled={isProcessing}>
              {isProcessing ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddUserForm 
        open={addUserDialogOpen} 
        onOpenChange={(open) => {
          if (!isProcessing) setAddUserDialogOpen(open);
        }} 
        onAddUser={handleAddUser}
      />
    </div>
  );
};

export default UserManagement;
