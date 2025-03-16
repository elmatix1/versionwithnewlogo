
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Globe,
  Mail,
  Laptop,
  Palette,
  Save
} from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Paramètres</h1>
        <p className="text-muted-foreground">Gérez vos préférences et les paramètres du système</p>
      </div>

      <Tabs defaultValue="account">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64">
            <TabsList className="flex flex-col h-auto space-y-1 bg-transparent p-0">
              <TabsTrigger 
                value="account" 
                className="justify-start px-3 py-2 h-9 font-normal"
              >
                <User className="h-4 w-4 mr-2" />
                Compte
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="justify-start px-3 py-2 h-9 font-normal"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="justify-start px-3 py-2 h-9 font-normal"
              >
                <Shield className="h-4 w-4 mr-2" />
                Sécurité
              </TabsTrigger>
              <TabsTrigger 
                value="appearance" 
                className="justify-start px-3 py-2 h-9 font-normal"
              >
                <Palette className="h-4 w-4 mr-2" />
                Apparence
              </TabsTrigger>
              <TabsTrigger 
                value="system" 
                className="justify-start px-3 py-2 h-9 font-normal"
              >
                <SettingsIcon className="h-4 w-4 mr-2" />
                Système
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1">
            <TabsContent value="account" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations de profil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john.doe@example.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Nom d'utilisateur</Label>
                      <Input id="username" placeholder="johndoe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" placeholder="+33 6 12 34 56 78" />
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Input id="bio" placeholder="Quelques mots sur vous" />
                  </div>

                  <Button className="mt-4">Enregistrer</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de notification</CardTitle>
                  <CardDescription>
                    Configurez comment et quand vous souhaitez être notifié
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Notifications par email</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Commandes</Label>
                          <p className="text-sm text-muted-foreground">Recevoir des notifications pour les nouvelles commandes</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Maintenance</Label>
                          <p className="text-sm text-muted-foreground">Recevoir des notifications pour les alertes maintenance</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Rapports</Label>
                          <p className="text-sm text-muted-foreground">Recevoir les rapports périodiques</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Notifications dans l'application</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Alertes en temps réel</Label>
                          <p className="text-sm text-muted-foreground">Recevoir des alertes en temps réel dans l'application</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Nouveaux messages</Label>
                          <p className="text-sm text-muted-foreground">Être notifié des nouveaux messages</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <Button>Enregistrer les préférences</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité</CardTitle>
                  <CardDescription>
                    Gérez vos paramètres de sécurité et la connexion à votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Mot de passe</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Mot de passe actuel</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nouveau mot de passe</Label>
                        <Input id="new-password" type="password" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                    <Button>Changer le mot de passe</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Authentification à deux facteurs</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Activer la 2FA</Label>
                        <p className="text-sm text-muted-foreground">Protégez votre compte avec une authentification à deux facteurs</p>
                      </div>
                      <Switch />
                    </div>
                    <Button variant="outline">Configurer la 2FA</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Sessions actives</h3>
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Laptop className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Chrome sur Windows</p>
                            <p className="text-xs text-muted-foreground">Paris, France · Actif maintenant</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Se déconnecter</Button>
                      </div>
                    </div>
                    <Button variant="outline">Se déconnecter de toutes les sessions</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Apparence</CardTitle>
                  <CardDescription>
                    Personnalisez l'apparence de l'application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Thème</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border rounded-md p-3 cursor-pointer hover:border-primary">
                        <div className="h-20 bg-white rounded-md mb-2 flex items-center justify-center">
                          <span className="text-sm text-black">Clair</span>
                        </div>
                        <div className="flex items-center justify-center">
                          <Switch />
                        </div>
                      </div>
                      <div className="border rounded-md p-3 cursor-pointer hover:border-primary">
                        <div className="h-20 bg-gray-900 rounded-md mb-2 flex items-center justify-center">
                          <span className="text-sm text-white">Sombre</span>
                        </div>
                        <div className="flex items-center justify-center">
                          <Switch />
                        </div>
                      </div>
                      <div className="border rounded-md p-3 cursor-pointer hover:border-primary">
                        <div className="h-20 bg-gradient-to-b from-white to-gray-900 rounded-md mb-2 flex items-center justify-center">
                          <span className="text-sm text-gray-700">Système</span>
                        </div>
                        <div className="flex items-center justify-center">
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Préférences d'affichage</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Animations</Label>
                          <p className="text-sm text-muted-foreground">Activer les animations dans l'interface</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Zoom par défaut</Label>
                          <p className="text-sm text-muted-foreground">Définir le niveau de zoom par défaut</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">-</Button>
                          <span>100%</span>
                          <Button variant="outline" size="sm">+</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button>Appliquer les changements</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="system" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres système</CardTitle>
                  <CardDescription>
                    Configurez les paramètres globaux du système
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Configuration générale</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Langue</Label>
                          <p className="text-sm text-muted-foreground">Choisir la langue de l'interface</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 mr-2" />
                          <span>Français</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Fuseau horaire</Label>
                          <p className="text-sm text-muted-foreground">Définir le fuseau horaire</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>Europe/Paris (UTC+1)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Paramètres avancés</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Exportation automatique</Label>
                          <p className="text-sm text-muted-foreground">Programmer des exportations automatiques de données</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Mode développeur</Label>
                          <p className="text-sm text-muted-foreground">Activer les fonctionnalités avancées pour les développeurs</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Journalisation détaillée</Label>
                          <p className="text-sm text-muted-foreground">Augmenter le niveau de détail des logs système</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <Button className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    <span>Enregistrer les paramètres</span>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;
