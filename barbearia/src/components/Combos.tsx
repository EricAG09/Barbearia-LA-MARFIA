import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Crown, Target } from "lucide-react";

const combos = [
  {
    id: 1,
    name: "Combo Prince",
    icon: Star,
    services: ["Corte", "Barba", "Sobrancelha"],
    price: "R$39,90",
    originalPrice: "R$44,90",
    savings: "5 reais",
    description: "O combo perfeito para quem quer um visual completo e elegante.",
    image: "/degrade+barba.jpg",
  },
  {
    id: 2,
    name: "Combo Cuidado de Rei",
    icon: Crown,
    services: ["Corte", "Barba", "Hidratação"],
    price: "R$40,90",
    originalPrice: "R$45,90",
    savings: "5 reais",
    description: "Tratamento premium com hidratação especial para cabelo e barba.",
    image: "/hidratado.jpg",
  },
  {
    id: 3,
    name: "Combo Style Jacu",
    icon: Target,
    services: ["Corte", "Barba", "Pigmentação"],
    price: "R$49,90",
    originalPrice: "R$54,90",
    savings: "5 reais",
    description: "Visual moderno com pigmentação para um estilo único e marcante.",
    image: "/degrade3.jpeg",
  },
];

const Combos = () => {
  return (
    <section
      id="combos"
      className="combos section-padding bg-gradient-to-b from-barber-dark to-barber-darker"
    >
      <div className="combos container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-personalizada text-3xl md:text-4xl font-bold mb-4">
            Combos <span className="">Irresistíveis</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-barber-gold"></div>
            <Star size={20} className="text-barber-gold" />
            <div className="h-px w-12 bg-barber-gold"></div>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Junta serviços e oferece com um leve desconto. Economia garantida com qualidade premium!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combos.map((combo) => {
            const IconComponent = combo.icon;
            return (
              <Card
                key={combo.id}
                className="bg-barber-darker border-barber-gold/20 hover:border-barber-gold/50 transition-all duration-300 overflow-hidden group relative"
              >
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-barber-gold text-barber-dark font-bold">
                    Economiza {combo.savings}
                  </Badge>
                </div>
                
                <div className="h-48 overflow-hidden">
                  <img
                    src={combo.image}
                    alt={combo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl font-personalizada flex items-center gap-2">
                    <IconComponent size={20} className="text-barber-gold" />
                    <span>{combo.name}</span>
                  </CardTitle>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {combo.services.map((service, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="text-xs border-barber-gold/30 text-gray-300"
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-gray-400 mb-4">
                    {combo.description}
                  </CardDescription>
                  
                  <div className="card-price flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-2xl font-personalizada font-light text-barber-gold">
                        {combo.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {combo.originalPrice}
                      </span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button
                    className="w-full bg-transparent border border-barber-gold/50 text-barber-gold hover:bg-barber-gold hover:text-barber-dark transition-all duration-300"
                    variant="outline"
                    asChild
                  >
                    <a href="#booking">Agendar Combo</a>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Combos;