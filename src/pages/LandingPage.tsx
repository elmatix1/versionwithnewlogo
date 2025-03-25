import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Clock, BarChart, Map } from 'lucide-react';
const LandingPage = () => {
  return <div className="min-h-screen bg-background">
      {/* Hero Section - Ajusté pour éviter la coupure du texte */}
      <section className="relative py-20 md:py-28 flex items-center justify-center bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent py-[9px] md:text-5xl">
            Gestion de Transport Intelligente
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Optimisez vos opérations de transport avec notre solution complète de gestion de flotte
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Button asChild size="lg" className="gap-2 shadow-lg bg-primary/90 hover:bg-primary">
              <Link to="/login">
                Commencer maintenant
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10">
              En savoir plus
            </Button>
          </div>
          
          {/* Image centrale ajoutée */}
          <div className="max-w-5xl mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
            <div className="bg-primary/5 rounded-xl overflow-hidden shadow-xl border border-primary/10">
              <Map className="h-64 md:h-80 w-full text-primary/20 opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-card/80 backdrop-blur-sm p-4 md:p-6 rounded-lg shadow-lg border border-primary/20 max-w-md">
                  <h3 className="text-xl md:text-2xl font-semibold mb-2">Plateforme Tout-en-Un</h3>
                  <p className="text-muted-foreground">Suivi en temps réel, optimisation des itinéraires et gestion complète de votre flotte</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Espacement réduit et design amélioré */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <FeatureCard icon={<Truck className="h-8 w-8 text-primary" />} title="Gestion de Flotte" description="Suivez et optimisez votre flotte en temps réel" />
            <FeatureCard icon={<Shield className="h-8 w-8 text-primary" />} title="Sécurité" description="Protection et surveillance avancées des véhicules" />
            <FeatureCard icon={<Clock className="h-8 w-8 text-primary" />} title="Planification" description="Optimisez vos itinéraires et horaires" />
            <FeatureCard icon={<BarChart className="h-8 w-8 text-primary" />} title="Analytics" description="Rapports détaillés et analyses performantes" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Prêt à optimiser votre flotte ?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Rejoignez les entreprises qui font confiance à notre solution pour gérer efficacement leur transport.
          </p>
          <Button asChild size="lg" className="gap-2 shadow-md bg-primary/90 hover:bg-primary">
            <Link to="/login">
              Démarrer gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>;
};
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
const FeatureCard = ({
  icon,
  title,
  description
}: FeatureCardProps) => <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:shadow-md transition-all duration-300 hover:border-primary/30">
    <CardContent className="p-6 text-center">
      <div className="mb-4 flex justify-center">
        <div className="p-3 rounded-full bg-primary/10">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>;
export default LandingPage;