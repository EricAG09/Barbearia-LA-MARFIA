import { Facebook, Instagram, MapPin, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo.png"; 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="footer bg-barber-darker text-white">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div>
            <div className="card">
              <a href="#home" className="inline-block mb-4">
                <img
                  src={logo}
                  alt="Barber Prince Logo"
                  className="h-12 w-auto mb-2"
                />
              </a>
              <p className="text-gray-400 mb-4">
                Muito mais que uma barbearia. Uma experiência única de cuidado
                e estilo para o homem moderno.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/thebarberprinceofjacu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-barber-gold hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-barber-gold hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://wa.me/55859240-0522"
                target="_blank"
                rel="noopener noreferrer"
                className="text-barber-gold hover:text-white transition-colors"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="links">
            <h3 className="font-personalizada text-green-600 text-3xl font-light mb-2">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="font-personalizada text-gray-400 hover:text-barber-gold transition-colors">Home</a>
              </li>
              <li>
                <a href="#services" className="font-personalizada text-gray-400 hover:text-barber-gold transition-colors">Serviços</a>
              </li>
              <li>
                <a href="#gallery" className="font-personalizada text-gray-400 hover:text-barber-gold transition-colors">Galeria</a>
              </li>
              <li>
                <a href="#about" className="font-personalizada text-gray-400 hover:text-barber-gold transition-colors">Sobre</a>
              </li>
              <li>
                <a href="#booking" className="font-personalizada text-gray-400 hover:text-barber-gold transition-colors">Agendamento</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="contact">
            <h3 className="font-personalizada text-green-600 text-3xl font-light mb-2">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <MapPin size={18} className="text-barber-gold" />
                <span className="text-gray-400">
                  Av. 25 de Janeiro, Apuiarés - CE
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-barber-gold" />
                <span className="text-gray-400">+55 (11) 99999-9999</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="hours">
            <h3 className="font-personalizada text-green-600 text-3xl font-light mb-2">Horário de Funcionamento</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-400">Segunda - Sexta</span>
                <span className="hours-content font-personalizada text-green-600 ">09:00 - 20:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Sábado</span>
                <span className="font-personalizada text-green-600">09:00 - 19:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Domingo</span>
                <span className="font-personalizada text-green-600">Fechado</span>
              </li>
            </ul>

            <Button className="mt-6 bg-barber-gold text-barber-dark hover:bg-barber-gold/80 w-full" asChild>
              <a
                href="https://wa.me/5585992400522?text=Olá,%20gostaria%20de%20agendar%20um%20horário"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={16} className="mr-2" />
                Agendar via WhatsApp
              </a>
            </Button>
          </div>
        </div>

        <hr className="border-barber-gold/20 my-8" />

        <div className="text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} Barber Prince. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
