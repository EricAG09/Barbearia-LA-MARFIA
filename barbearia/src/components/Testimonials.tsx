import React, { useEffect, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = testimonials.length;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!carouselRef.current) return;

      const nextBtn = carouselRef.current.querySelector("[data-carousel-next]");
      nextBtn?.click();

      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
    <section
      id="testimonials"
      className="testimonials section-padding bg-barber-dark"
    >
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-personalizada text-green-600 text-4xl md:text-4xl font-bold mb-4">
            O Que <span className="">Dizem</span> Sobre Nós
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-barber-gold"></div>
            <MessageSquare size={20} className="text-barber-gold" />
            <div className="h-px w-12 bg-barber-gold"></div>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Veja o que nossos clientes têm a dizer sobre a experiência Master Barber.
          </p>
        </div>

        <Carousel ref={carouselRef} className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="md:basis-1/2 lg:basis-1/3 pl-4"
              >
                <Card className="bg-barber-darker border-barber-gold/20 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-personalizada text-green-600 text-3xl font-light mb-2">
                          {testimonial.name}
                        </h3>
                        <div className="flex text-barber-gold">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 italic flex-grow">
                      "{testimonial.text}"
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="hidden md:flex justify-center mt-6 gap-4">
            <CarouselPrevious
              data-carousel-prev
              className="static transform-none bg-transparent border-barber-gold text-barber-gold hover:bg-barber-gold/10"
            />
            <CarouselNext
              data-carousel-next
              className="static transform-none bg-transparent border-barber-gold text-barber-gold hover:bg-barber-gold/10"
            />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
