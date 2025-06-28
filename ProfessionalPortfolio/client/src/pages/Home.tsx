import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { LoadingScreen } from "@/components/LoadingScreen";
import { StatsCounter } from "@/components/StatsCounter";
import { ScrollToTop } from "@/components/ScrollToTop";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isLoading && <LoadingScreen />}
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <StatsCounter />
      <Projects />
      <Contact />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
