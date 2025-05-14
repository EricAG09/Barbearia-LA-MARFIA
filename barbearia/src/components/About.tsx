import { User, Users } from "lucide-react";

const About = () => {
  return (
    <section
      id="about"
      className="section-padding bg-barber-darker relative overflow-hidden"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Sobre <span className="text-barber-gold">Nós</span>
            </h2>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-barber-gold"></div>
              <Users size={20} className="text-barber-gold" />
              <div className="h-px w-12 bg-barber-gold"></div>
            </div>
            <p className="text-gray-300 mb-6">
              A Master Barber foi fundada em 2015 com a missão de resgatar a tradição das barbearias clássicas, 
              combinando técnicas tradicionais com tendências modernas. Nosso espaço foi cuidadosamente planejado 
              para oferecer uma experiência completa de cuidados masculinos.
            </p>
            <p className="text-gray-300 mb-6">
              Contamos com uma equipe de profissionais altamente qualificados, apaixonados por seu ofício 
              e constantemente atualizados com as últimas tendências em cortes e tratamentos.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="bg-barber-dark/50 backdrop-blur-sm border border-barber-gold/10 p-4 rounded-lg">
                <h3 className="text-barber-gold text-lg font-semibold mb-2">Ambiente Premium</h3>
                <p className="text-gray-400 text-sm">
                  Espaço sofisticado com poltronas confortáveis e música ambiente selecionada.
                </p>
              </div>
              <div className="bg-barber-dark/50 backdrop-blur-sm border border-barber-gold/10 p-4 rounded-lg">
                <h3 className="text-barber-gold text-lg font-semibold mb-2">Profissionais Experientes</h3>
                <p className="text-gray-400 text-sm">
                  Nossa equipe tem anos de experiência e formação especializada.
                </p>
              </div>
              <div className="bg-barber-dark/50 backdrop-blur-sm border border-barber-gold/10 p-4 rounded-lg">
                <h3 className="text-barber-gold text-lg font-semibold mb-2">Produtos Exclusivos</h3>
                <p className="text-gray-400 text-sm">
                  Utilizamos apenas produtos de alta qualidade para os melhores resultados.
                </p>
              </div>
              <div className="bg-barber-dark/50 backdrop-blur-sm border border-barber-gold/10 p-4 rounded-lg">
                <h3 className="text-barber-gold text-lg font-semibold mb-2">Atendimento Personalizado</h3>
                <p className="text-gray-400 text-sm">
                  Cada cliente recebe uma consulta para entender suas necessidades específicas.
                </p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-20 rounded-lg overflow-hidden border-2 border-barber-gold/20">
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070"
                alt="Nossa Barbearia"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-10 -right-10 z-10 hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1888"
                alt="Corte de Cabelo"
                className="w-48 h-48 object-cover rounded-lg border-2 border-barber-gold/20"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 z-10 hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?q=80&w=2070"
                alt="Barbeiro"
                className="w-48 h-48 object-cover rounded-lg border-2 border-barber-gold/20"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
