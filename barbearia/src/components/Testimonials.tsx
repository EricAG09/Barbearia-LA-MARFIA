import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Paulo",
    text: "Atendimento de primeira qualidade. O ambiente é muito aconchegante e o resultado do corte superou minhas expectativas! Recomendo demais.",
    rating: 5,
    image: "/paulo.jpeg",
  },
  {
    id: 2,
    name: "Ney",
    text: "Já visitei várias barbearias, mas a Master Barber está em outro nível. A atenção aos detalhes e o cuidado com o cliente são impressionantes.",
    rating: 5,
    image: "/ney.jpeg",
  },
  {
    id: 3,
    name: "Eric Galvão",
    text: "O atendimento é excelente e o ambiente é super agradável. O barbeiro entendeu exatamente o que eu queria e o resultado foi perfeito!",
    rating: 5,
    image: "/eric.png",
  },
  {
    id: 4,
    name: "Breno Peixoto",
    text: "O combo barba e cabelo é sensacional. Muito bem feito e com produtos de primeira linha. Vale cada centavo!",
    rating: 5,
    image: "/breno.jpeg",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (
      touchStartX.current !== null &&
      touchEndX.current !== null &&
      Math.abs(touchStartX.current - touchEndX.current) > 50
    ) {
      if (touchStartX.current > touchEndX.current) {
        // Swipe esquerda
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      } else {
        // Swipe direita
        setCurrentIndex((prev) =>
          prev === 0 ? testimonials.length - 1 : prev - 1
        );
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section id="testimonials" className="bg-barber-dark py-16">
      <div className="testimonials container mx-auto px-4 text-center">
        <h2 className="font-personalizada text-green-600 text-4xl font-bold mb-4">
          O Que <span>Dizem</span> Sobre Nós
        </h2>

        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-12 bg-barber-gold"></div>
          <MessageSquare size={20} className="text-barber-gold" />
          <div className="h-px w-12 bg-barber-gold"></div>
        </div>

        <p className="text-gray-400 max-w-2xl mx-auto mb-10">
          Veja o que nossos clientes têm a dizer sobre a experiência Master Barber.
        </p>

        <div
          className="relative w-full max-w-xl mx-auto overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((t) => (
              <div key={t.id} className="min-w-full px-2">
                <Card className="bg-barber-darker border-barber-gold/20">
                  <CardContent className="p-6 flex flex-col items-start">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={t.image}
                          alt={t.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-personalizada text-green-600 text-2xl font-light mb-1">
                          {t.name}
                        </h3>
                        <div className="flex text-barber-gold">
                          {[...Array(t.rating)].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 italic">"{t.text}"</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
