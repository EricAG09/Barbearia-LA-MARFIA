import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";

const servicesList = [
  {
    id: 1,
    name: "Corte Tradicional",
    price: "R$40",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1888",
    description: "Corte de cabelo clássico com acabamento perfeito e lavagem.",
  },
  {
    id: 2,
    name: "Barba Completa",
    price: "R$25",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070",
    description: "Modelagem de barba com toalha quente, óleo e finalização.",
  },
  {
    id: 3,
    name: "Combo Premium",
    price: "R$60",
    image: "https://images.unsplash.com/photo-1554351771-995425eda3ce?q=80&w=1972",
    description: "Corte de cabelo + barba completa com hidratação especial.",
  },
  {
    id: 4,
    name: "Coloração",
    price: "R$80",
    image: "https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?q=80&w=1887",
    description: "Coloração profissional para cabelo ou barba com produtos premium.",
  },
];

const Services = () => {
  return (
    <section
      id="services"
      className="section-padding bg-gradient-to-b from-barber-darker to-barber-dark"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Nossos <span className="text-barber-gold">Serviços</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-barber-gold"></div>
            <Scissors size={20} className="text-barber-gold" />
            <div className="h-px w-12 bg-barber-gold"></div>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Oferecemos os melhores serviços de barbearia com profissionais
            experientes e produtos de alta qualidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesList.map((service) => (
            <Card
              key={service.id}
              className="bg-barber-dark border-barber-gold/20 hover:border-barber-gold/50 transition-all duration-300 overflow-hidden group"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-serif flex justify-between items-center">
                  <span>{service.name}</span>
                  <span className="text-barber-gold font-bold">{service.price}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  {service.description}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-transparent border border-barber-gold/50 text-barber-gold hover:bg-barber-gold hover:text-barber-dark transition-all duration-300"
                  variant="outline"
                  asChild
                >
                  <a href="#booking">Agendar</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
