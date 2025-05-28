
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import FeaturesCarousel from '@/components/landing/FeaturesCarousel';
import TestimonialsSection from '@/components/landing/TestimonialsSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section avec animations */}
      <section className="relative py-20 md:py-28 flex items-center justify-center bg-gradient-to-br from-primary/10 via-blue-50 to-green-50 overflow-hidden">
        {/* Éléments d'arrière-plan animés */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-blue-300/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
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
            <Button asChild size="lg" className="gap-2 shadow-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white border-0 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover-lift">
              <Link to="/login">
                Commencer maintenant
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2 border-2 border-primary/30 bg-white/80 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 transform transition-all duration-300 hover:scale-105 hover-lift">
              <Play className="h-4 w-4" />
              Voir la démo
            </Button>
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités avec carrousel amélioré */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-white via-blue-50/30 to-primary/5 relative overflow-hidden">
        {/* Éléments décoratifs d'arrière-plan */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-primary/5 to-blue-200/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-br from-green-200/10 to-primary/5 rounded-full blur-2xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-blue-100 text-primary font-semibold text-sm mb-4 animate-fade-in">
              <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></div>
              Fonctionnalités Avancées
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-primary to-blue-600 bg-clip-text text-transparent animate-fade-in" style={{animationDelay: '0.2s'}}>
              Une Solution Complète
              <br />
              <span className="text-2xl md:text-4xl">pour Votre Logistique</span>
            </h2>
            
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-fade-in" style={{animationDelay: '0.4s'}}>
              Découvrez toutes les fonctionnalités qui font de TransLogica la solution de référence pour l'optimisation de votre flotte
            </p>
          </div>
          
          <div className="animate-fade-in" style={{animationDelay: '0.6s'}}>
            <FeaturesCarousel />
          </div>

          {/* Section statistiques supplémentaires */}
          <div className="mt-16 text-center animate-fade-in" style={{animationDelay: '0.8s'}}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
                <div className="text-sm text-muted-foreground">Entreprises partenaires</div>
              </div>
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
                <div className="text-sm text-muted-foreground">Support technique</div>
              </div>
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">99.9%</div>
                <div className="text-sm text-muted-foreground">Temps de disponibilité</div>
              </div>
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">30%</div>
                <div className="text-sm text-muted-foreground">Réduction des coûts</div>
              </div>
            </div>
          </div>
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
            <Button asChild size="lg" className="gap-2 shadow-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-8 py-3 text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover-lift">
              <Link to="/login">
                Démarrer l'essai gratuit
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="border-2 border-primary/30 bg-white/80 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 px-8 py-3 text-lg transform transition-all duration-300 hover:scale-105 hover-lift">
              Demander une démo
            </Button>
          </div>

          {/* Éléments visuels supplémentaires */}
          <div className="mt-12 text-center">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 group">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="group-hover:text-green-600 transition-colors duration-300">Aucune installation requise</span>
              </div>
              <div className="flex items-center gap-2 group">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <span className="group-hover:text-blue-600 transition-colors duration-300">Support 24/7 en français</span>
              </div>
              <div className="flex items-center gap-2 group">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <span className="group-hover:text-primary transition-colors duration-300">Conformité RGPD</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
