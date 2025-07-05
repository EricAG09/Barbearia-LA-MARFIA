import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Play } from "lucide-react";

const VideoSection = () => {
  // Substitua esta URL pela URL do seu vídeo
  const videoUrl = "/video.mp4"; // Coloque o arquivo na pasta public/
  
  return (
    <section className="video section-padding bg-barber-darker">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-personalizada text-3xl md:text-4xl font-bold mb-4">
            Veja Nosso <span className="">Trabalho</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-barber-gold"></div>
            <Play size={20} className="text-barber-gold" />
            <div className="h-px w-12 bg-barber-gold"></div>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Confira alguns dos nossos melhores trabalhos em ação.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <AspectRatio ratio={9/16} className="bg-barber-dark rounded-lg overflow-hidden">
            <video
              className="w-full h-full object-cover rounded-lg"
              controls
              loop
              muted
              poster="/placeholder.svg"
            >
              <source src={videoUrl} type="video/mp4" />
              <p className="text-gray-400 text-center p-8">
                Seu navegador não suporta o elemento de vídeo.
              </p>
            </video>
          </AspectRatio>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;