
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Map, Clock, BarChart, Shield, Users } from 'lucide-react';

const features = [
  {
    icon: <Map className="h-12 w-12 text-primary" />,
    title: "Suivi en temps réel",
    description: "Localisez vos véhicules et optimisez vos itinéraires en temps réel avec notre technologie GPS avancée."
  },
  {
    icon: <Truck className="h-12 w-12 text-primary" />,
    title: "Gestion de flotte complète",
    description: "Gérez l'ensemble de votre flotte depuis une interface unique et intuitive."
  },
  {
    icon: <Clock className="h-12 w-12 text-primary" />,
    title: "Optimisation des horaires",
    description: "Planifiez et optimisez automatiquement les horaires de livraison pour maximiser l'efficacité."
  },
  {
    icon: <BarChart className="h-12 w-12 text-primary" />,
    title: "Analyses avancées",
    description: "Obtenez des insights détaillés sur les performances de votre flotte avec nos rapports intelligents."
  },
  {
    icon: <Shield className="h-12 w-12 text-primary" />,
    title: "Sécurité renforcée",
    description: "Protégez vos véhicules et cargaisons avec notre système de surveillance intégré."
  },
  {
    icon: <Users className="h-12 w-12 text-primary" />,
    title: "Gestion d'équipe",
    description: "Coordonnez efficacement vos chauffeurs et équipes logistiques depuis une plateforme centralisée."
  }
];

const FeaturesCarousel: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto">
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
              <Card className="h-full bg-gradient-to-br from-white to-primary/5 border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center h-full flex flex-col">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 rounded-full bg-primary/10">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-muted-foreground flex-grow">{feature.description}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default FeaturesCarousel;
