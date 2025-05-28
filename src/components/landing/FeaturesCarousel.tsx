
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Map, Clock, BarChart, Shield, Users } from 'lucide-react';

const features = [
  {
    icon: <Map className="h-12 w-12 text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-blue-600" />,
    title: "Suivi en temps réel",
    description: "Localisez vos véhicules et optimisez vos itinéraires en temps réel avec notre technologie GPS avancée.",
    stats: "500+ trajets optimisés"
  },
  {
    icon: <Truck className="h-12 w-12 text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-green-600" />,
    title: "Gestion de flotte complète",
    description: "Gérez l'ensemble de votre flotte depuis une interface unique et intuitive.",
    stats: "200+ véhicules gérés"
  },
  {
    icon: <Clock className="h-12 w-12 text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-orange-600" />,
    title: "Optimisation des horaires",
    description: "Planifiez et optimisez automatiquement les horaires de livraison pour maximiser l'efficacité.",
    stats: "30% de temps économisé"
  },
  {
    icon: <BarChart className="h-12 w-12 text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-purple-600" />,
    title: "Analyses avancées",
    description: "Obtenez des insights détaillés sur les performances de votre flotte avec nos rapports intelligents.",
    stats: "90% de satisfaction client"
  },
  {
    icon: <Shield className="h-12 w-12 text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-red-600" />,
    title: "Sécurité renforcée",
    description: "Protégez vos véhicules et cargaisons avec notre système de surveillance intégré.",
    stats: "99.9% de fiabilité"
  },
  {
    icon: <Users className="h-12 w-12 text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-indigo-600" />,
    title: "Gestion d'équipe",
    description: "Coordonnez efficacement vos chauffeurs et équipes logistiques depuis une plateforme centralisée.",
    stats: "100+ équipes actives"
  }
];

const FeaturesCarousel: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {features.map((feature, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <Card className="group h-full bg-gradient-to-br from-white via-blue-50/30 to-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 cursor-pointer overflow-hidden">
                <CardContent className="p-6 text-center h-full flex flex-col relative">
                  {/* Effet de brillance au survol */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 opacity-0 group-hover:opacity-100"></div>
                  
                  <div className="mb-4 flex justify-center relative z-10">
                    <div className="p-4 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      {feature.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground flex-grow mb-4 group-hover:text-gray-600 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Statistique avec compteur */}
                  <div className="mt-auto">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-blue-100 text-primary font-semibold text-sm group-hover:from-primary/20 group-hover:to-blue-200 transition-all duration-300">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      {feature.stats}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="bg-white/80 backdrop-blur-sm border-primary/30 hover:bg-primary hover:text-white transition-all duration-300" />
        <CarouselNext className="bg-white/80 backdrop-blur-sm border-primary/30 hover:bg-primary hover:text-white transition-all duration-300" />
      </Carousel>
    </div>
  );
};

export default FeaturesCarousel;
