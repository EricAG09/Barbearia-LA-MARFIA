import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { GalleryHorizontal } from "lucide-react";

const galleryImages = [
  {
    id: 1,
    src: "/americano 3.jpeg",
    alt: "Interior da barbearia",
  },
  {
    id: 2,
    src: "/desenho 3.jpeg",
    alt: "Cliente recebendo serviço de barba",
  },
  {
    id: 3,
    src: "/degrade.jpeg",
    alt: "Ferramentas de barbearia",
  },
  {
    id: 4,
    src: "/desenho.jpeg",
    alt: "Barbeiro trabalhando",
  },
  {
    id: 5,
    src: "/infantil 2.jpeg",
    alt: "Detalhes da barbearia",
  },
  {
    id: 6,
    src: "/desenho 4.jpeg",
    alt: "Cliente feliz após corte",
  },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section
      id="gallery"
      className="gallery section-padding bg-barber-dark"
    >

      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-personalizada text-4xl md:text-4xl font-bold mb-4 border-cyan-50">
            Nossa <span className="">Galeria</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-barber-gold"></div>
            <GalleryHorizontal size={20} className="text-barber-gold" />
            <div className="h-px w-12 bg-barber-gold"></div>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Conheça o ambiente da nossa barbearia e o trabalho dos nossos profissionais.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image) => (
            <Dialog key={image.id}>
              <DialogTrigger asChild>
                <div className="overflow-hidden rounded-md cursor-pointer group">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-500"
                    onClick={() => setSelectedImage(image.src)}
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="bg-black/80 border-barber-gold/20 p-1 max-w-3xl">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full max-h-[80vh] object-contain"
                />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
