
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Clock, BarChart } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Gestion de Transport Intelligente
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Optimisez vos opérations de transport avec notre solution complète de gestion de flotte
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link to="/login">
                Commencer maintenant
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              En savoir plus
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Truck className="h-8 w-8 text-primary" />}
              title="Gestion de Flotte"
              description="Suivez et optimisez votre flotte en temps réel"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-primary" />}
              title="Sécurité"
              description="Protection et surveillance avancées des véhicules"
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-primary" />}
              title="Planification"
              description="Optimisez vos itinéraires et horaires"
            />
            <FeatureCard
              icon={<BarChart className="h-8 w-8 text-primary" />}
              title="Analytics"
              description="Rapports détaillés et analyses performantes"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à optimiser votre flotte ?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Rejoignez les entreprises qui font confiance à notre solution pour gérer efficacement leur transport.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link to="/login">
              Démarrer gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
    <CardContent className="p-6 text-center">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default LandingPage;
