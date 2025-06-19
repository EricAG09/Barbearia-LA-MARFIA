import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Booking from "@/components/Booking";
import Footer from "@/components/Footer";
import VideoSection from "@/components/VideoSection";

const Index = () => {
  // Função para animar elementos quando eles entrarem no viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Função para rolagem suave quando clica nos links do menu
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href") || "");
        if (target) {
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY,
            behavior: "smooth",
          });
        }
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-barber-dark text-white">
      <Header />
      <Hero />
      <Services />
      <Gallery />
      <About />
      <Testimonials />
      <VideoSection />
      <Booking />
      <Footer />
    </div>
  );
};

export default Index;
