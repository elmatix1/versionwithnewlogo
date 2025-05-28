
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import AnimatedStats from '@/components/landing/AnimatedStats';
import FeaturesCarousel from '@/components/landing/FeaturesCarousel';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import InteractiveMapDemo from '@/components/landing/InteractiveMapDemo';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section avec animations */}
      <section className="relative py-20 md:py-28 flex items-center justify-center bg-gradient-to-br from-primary/10 via-blue-50 to-green-50 overflow-hidden">
        {/* Éléments d'arrière-plan animés */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center mb-8 animate-fade-in">
            <Logo size="lg" className="scale-150 hover:scale-160 transition-transform duration-300" />
          </div>
          
          <h1 className="text-4xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-600 to-green-600 bg-clip-text text-transparent py-2 md:text-6xl animate-fade-in" style={{animationDelay: '0.2s'}}>
            Gestion de Transport
            <br />
            <span className="bg-gradient-to-r from-green-600 to-primary bg-clip-text">Intelligente</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in" style={{animationDelay: '0.4s'}}>
            Révolutionnez votre logistique avec notre solution complète : suivi GPS en temps réel, 
            optimisation automatique des itinéraires et analytics avancés pour maximiser votre rentabilité.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-12 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <Button asChild size="lg" className="gap-2 shadow-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white border-0 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <Link to="/login">
                Commencer maintenant
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 border-2 border-primary/30 bg-white/80 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 transform transition-all duration-300 hover:scale-105">
              <Play className="h-4 w-4" />
              Voir la démo
            </Button>
          </div>

          {/* Carte interactive */}
          <div className="max-w-4xl mx-auto mb-8 animate-fade-in" style={{animationDelay: '0.8s'}}>
            <InteractiveMapDemo />
          </div>

          {/* Statistiques animées */}
          <div className="max-w-4xl mx-auto animate-fade-in" style={{animationDelay: '1s'}}>
            <AnimatedStats />
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités avec carrousel */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-white to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Fonctionnalités Avancées
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez toutes les fonctionnalités qui font de TransLogica la solution de référence
            </p>
          </div>
          
          <FeaturesCarousel />
        </div>
      </section>

      {/* Section Témoignages */}
      <TestimonialsSection />

      {/* Section CTA finale avec animation */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-green-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
            Prêt à révolutionner votre logistique ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
            Rejoignez plus de 500 entreprises qui optimisent déjà leur transport avec TransLogica. 
            Essai gratuit de 30 jours, sans engagement.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="gap-2 shadow-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-8 py-3 text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <Link to="/login">
                Démarrer l'essai gratuit
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="border-2 border-primary/30 bg-white/80 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 px-8 py-3 text-lg transform transition-all duration-300 hover:scale-105">
              Demander une démo
            </Button>
          </div>

          {/* Éléments visuels supplémentaires */}
          <div className="mt-12 text-center">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Aucune installation requise</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Support 24/7 en français</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Conformité RGPD</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
