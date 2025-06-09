import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Scissors, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const servicesList = [
  {
    id: 1,
    name: "Corte Social",
    price: "R$20",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1888",
    description: "Corte de cabelo clássico com acabamento perfeito e lavagem.",
  },
  {
    id: 2,
    name: "Social com Barba",
    price: "R$30",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070",
    description: "Modelagem de barba com toalha quente, óleo e finalização.",
  },
  {
    id: 3,
    name: "Social com Barba e Pigmentação",
    price: "R$40",
    image: "https://images.unsplash.com/photo-1554351771-995425eda3ce?q=80&w=1972",
    description: "Corte de cabelo + barba e pigmentação para realçar a cor do seu cabelo.",
  },
  {
    id: 4,
    name: "Corte Degradê",
    price: "R$30",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1888",
    description: "Corte de cabelo com degradê com acabamento perfeito e lavagem.",
  },
  {
    id: 5,
    name: "Corte degradê e sobrancelha",
    price: "R$30",
    image: "https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?q=80&w=1887",
    description: "Corte de cabelo com degradê e sobrancelha com acabamento perfeito e lavagem.",
  },
  {
    id: 6,
    name: "Corte degradê e barba",
    price: "R$35",
    image: "https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?q=80&w=1887",
    description: "Corte de cabelo com degradê e barba com acabamento perfeito e lavagem.",
  },
  {
    id: 7,
    name: "Corte degradê com Pigmentação",
    price: "R$35",
    image: "https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?q=80&w=1887",
    description: "Ideal para quem busca um visual refinado, com estilo marcante e aparência impecável todos os dias.",
  },
  {
    id: 8,
    name: "Corte Degradê com Barba e Pigmentação", 
    price: "R$45",
    image: "https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?q=80&w=1887",
    description: "Ideal para homens que buscam estilo, confiança e presença em qualquer ambiente.",
  },
  {
    id: 9,
    name: "Corte Degradê com Barba, Sobrancelha e Pigmentação",
    price: "R$50",
    image: "https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?q=80&w=1887",
    description: "O resultado é um estilo refinado, de alto padrão, ideal para qualquer ocasião do dia de trabalho ao evento mais especial.",
  },
  {
    id: 10,
    name: "Corte Infantil",
    price: "R$30",
    image: "https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?q=80&w=1887",
    description: "Com técnicas modernas e um toque de estilo, o corte deixa o visual do seu filho ainda mais bonito",
  },
  {
    id: 12,
    name: "Pezinho",
    price: "R$5",
    image: "https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?q=80&w=1887",
    description: "Pequeno no nome, gigante no impacto.",
  },
  {
    id: 13,
    name: "Sobrancelha",
    price: "R$5",
    image: "https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?q=80&w=1887",
    description: "A sobrancelha é a moldura do rosto e pode fazer toda a diferença no seu visual.",
  },
  {
    id: 14,
    name: "Barba",
    price: "R$10",
    image: "https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?q=80&w=1887",
    description: "A barba é um dos principais elementos do visual masculino e pode fazer toda a diferença na sua aparência.",
  },
  {
    id: 15,
    name: "Platinado",
    price: "R$100",
    image: "https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?q=80&w=1887",
    description: "O platinado é uma técnica de coloração que deixa os cabelos com um tom loiro muito claro, quase branco.",
  },
  {
    id: 16,
    name: "Luzes",
    price: "R$80",
    image: "https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?q=80&w=1887",
    description: "As luzes são uma técnica de coloração que deixa mechas do cabelos com um tom mais claro e iluminado.",
  },

];

const Services = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedServices = showAll ? servicesList : servicesList.slice(0, 3);
  const hasMoreServices = servicesList.length > 3;

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
          {displayedServices.map((service) => (
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
                  className=" w-full bg-transparent border border-barber-gold/50 text-barber-gold hover:bg-barber-gold hover:text-barber-dark transition-all duration-300"
                  variant="outline"
                  asChild
                >
                  <a href="#booking">Agendar</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {hasMoreServices && (
          <div className="text-center mt-8">
            <Button
              onClick={() => setShowAll(!showAll)}
              className="bg-transparent border border-barber-gold/50 text-barber-gold hover:bg-barber-gold hover:text-barber-dark transition-all duration-300 px-8 py-3"
              variant="outline"
            >
              {showAll ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Mostrar menos
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Mostrar mais
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;