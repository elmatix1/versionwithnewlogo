
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    name: "Ahmed Benali",
    role: "Responsable Logistique",
    company: "Transport Maghreb",
    image: "/placeholder.svg",
    quote: "TransLogica a révolutionné notre gestion de flotte! Nous avons réduit nos coûts de 25% et amélioré notre efficacité de livraison.",
    initials: "AB"
  },
  {
    name: "Fatima El Mansouri",
    role: "Directrice Opérations",
    company: "Express Casablanca",
    image: "/placeholder.svg",
    quote: "L'interface intuitive et les analyses en temps réel nous permettent de prendre des décisions éclairées instantanément.",
    initials: "FE"
  },
  {
    name: "Omar Tazi",
    role: "Gérant",
    company: "Logistique Atlas",
    image: "/placeholder.svg",
    quote: "Le suivi GPS en temps réel et la planification automatique ont transformé notre façon de travailler. Excellent service client!",
    initials: "OT"
  },
  {
    name: "Khadija Alami",
    role: "Chef de Flotte",
    company: "Transport Anfa",
    image: "/placeholder.svg",
    quote: "Grâce à TransLogica, nous optimisons nos itinéraires et réduisons significativement notre consommation de carburant.",
    initials: "KA"
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Ce que disent nos clients
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment TransLogica transforme la gestion de transport pour des entreprises comme la vôtre
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2">
                  <Card className="h-full bg-white/80 backdrop-blur-sm border-primary/20 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage src={testimonial.image} alt={testimonial.name} />
                          <AvatarFallback className="bg-primary text-white">
                            {testimonial.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          <p className="text-sm text-primary font-medium">{testimonial.company}</p>
                        </div>
                      </div>
                      <blockquote className="text-gray-700 italic">
                        "{testimonial.quote}"
                      </blockquote>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
