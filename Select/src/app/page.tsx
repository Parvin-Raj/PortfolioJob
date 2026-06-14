"use client";

import { useState } from "react";
import { Hero } from "@/components/sections/Hero";
import { Showcase } from "@/components/sections/Showcase";
import { Marquee } from "@/components/sections/Marquee";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Timeline } from "@/components/sections/Timeline";
import { Contact } from "@/components/sections/Contact";
import { NavBar } from "@/components/ui/NavBar";
import { VoiceNavigation } from "@/components/ui/VoiceNavigation";
import { VoiceIndicator } from "@/components/ui/VoiceIndicator";

export default function HomePage() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const handleVoiceNavigation = (section: string) => {
    console.log('Navigating to section:', section);
    const sectionId = section === 'hero' ? 'hero' : section;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      console.log('Section not found:', section);
    }
  };

  const handleVoiceError = (error: string) => {
    console.error('Voice navigation error:', error);
  };

  const handleStatusChange = (listening: boolean) => {
    console.log('Voice status changed:', listening);
    setIsListening(listening);
  };

  return (
    <main className="min-h-screen w-full relative overflow-hidden">
      <div className="site-background" aria-hidden />
      <div className="site-background-grid" aria-hidden />

      <NavBar />
      <VoiceNavigation 
        onNavigate={handleVoiceNavigation} 
        onError={handleVoiceError}
        onStatusChange={handleStatusChange}
        onSupportedChange={setIsSupported}
      />
      <VoiceIndicator isListening={isListening} isSupported={isSupported} />
      <div className="noise-overlay">
        <section
          data-hs="hero"
          id="hero"
          className="section-full hero-section-bg"
        >
          <div className="hero-ambient-glow" aria-hidden />
          <div className="hero-noise" aria-hidden />
          <div className="container-responsive">
            <Hero />
          </div>
        </section>
        
        <section
          data-hs="showcase"
          id="showcase"
          className="section-full"
        >
          <div className="container-responsive">
            <Marquee />
            <Showcase />
          </div>
        </section>
        
        <section
          data-hs="skills"
          id="skills"
          className="section-full"
        >
          <div className="container-responsive">
            <Skills />
          </div>
        </section>
        
        <section
          data-hs="projects"
          id="projects"
          className="section-full"
        >
          <div className="container-responsive">
            <Projects />
          </div>
        </section>
        
        <section
          data-hs="timeline"
          id="timeline"
          className="section-full"
        >
          <div className="container-responsive">
            <Timeline />
          </div>
        </section>
        
        <section
          data-hs="contact"
          id="contact"
          className="section-full"
        >
          <div className="container-responsive">
            <Contact />
          </div>
        </section>
      </div>
    </main>
  );
}
