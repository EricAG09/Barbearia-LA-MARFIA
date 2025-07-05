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
    price: "R$24,90",
    image: "/social.JPEG",
    description: "Corte de cabelo clássico com acabamento perfeito.",
  },
  {
    id: 2,
    name: "Corte Degradê",
    price: "R$24,90",
    image: "/degrade.jpeg",
    description: "Corte de cabelo com degradê com acabamento perfeito.",
  },
  {
    id: 4,
    name: "Corte Infantil",
    price: "R$30",
    image: "/infantil2.JPG",
    description: "Com técnicas modernas e um toque de estilo, o corte deixa o visual do seu filho ainda mais bonito",
  },
  {
    id: 5,
    name: "Sobrancelha",
    price: "R$5",
    image: "/sobrancelha.jpg",
    description: "A sobrancelha é a moldura do rosto e pode fazer toda a diferença no seu visual.",
  },
  {
    id: 6,
    name: "Barba",
    price: "R$14",
    image: "/barba.jpeg",
    description: "A barba é um dos principais elementos do visual masculino e pode fazer toda a diferença na sua aparência.",
  },
];

const Services = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedServices = showAll ? servicesList : servicesList.slice(0, 4);
  const hasMoreServices = servicesList.length > 3;

  return (
    <section
      id="services"
      className="services bg-gradient-to-b from-barber-darker to-barber-dark"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-personalizada text-4xl md:text-4xl font-bold mb-4 border-cyan-50">
            Nossos <span className="">Serviços</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-barber-gold"></div>
            <Scissors size={20} className="text-barber-gold" />
            <div className="h-px w-12 bg-barber-gold"></div>
          </div>
          <p className="text-white max-w-2xl mx-auto">
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
                <CardTitle className="card-title text-xl font-personalizada flex justify-between items-center">
                  <span>{service.name}</span>
                  <span className="text-barber-gold font-personalizada">{service.price}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  {service.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="card-footer">
                <Button
                  className=" w-full bg-transparent border font-personalizada border-barber-gold/50 text-barber-gold hover:bg-barber-gold hover:text-barber-dark transition-all duration-300"
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
              className="border border-barber-gold/50 animate-bounce  bg-barber-gold text-barber-dark transition-all duration-800 px-8 py-3"
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