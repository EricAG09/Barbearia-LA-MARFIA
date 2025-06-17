import { Button } from "@/components/ui/button";
import { url } from "inspector";

const Hero = () => {
  return (
    <section
      id="home"
      className="hero relative min-h-screen flex items-center justify-center bg-barber-darker overflow-hidden"
    >
      {/* Overlay Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/bg2.JPG')",
          opacity: "0.2",
        }}
      ></div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="font-personalizada text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-green-600 animate-fade-in">
          ESTILO <span className="text-indigo-700 border-cyan-50"> & </span> <span className="text-green-600 border-cyan-50">EXCELÊNCIA</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Muito mais que uma barbearia. Uma experiência única de cuidado
          e estilo para o homem moderno.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Button
            size="lg"
            className="font-personalizada border-barber-gold text-barber-gold hover:bg-barber-gold/10"
          >
            <a href="#booking">Agendar Horário</a>
          </Button>
          <Button
            size="lg"
            className="font-personalizada border-barber-gold text-barber-gold hover:bg-barber-gold/10"
          >
            <a href="#services">Nossos Serviços</a>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
        <a href="#services" className="scroll-indicator">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Hero;
