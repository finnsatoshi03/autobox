import { useRef } from "react";

import {
  DesktopHero,
  MobileHero,
  VideoHighlightMobile,
} from "@/components/hero";
import AnimatedAboutSection from "@/components/about-section";
import AnimatedVisionSection from "@/components/vision-section";
import AnimatedRealitySection from "@/components/reality-section";
import { PlaygroundSection } from "@/components/playground-section";
import AnimatedContactSection from "@/components/contact-section";
import AnimatedRecapSection from "@/components/recap-section";

const LandingPage = (): JSX.Element => {
  const heroSectionRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div
        ref={heroSectionRef}
        className="mb-4 flex h-[calc(100vh-7rem)] w-full flex-col"
      >
        <section className="flex w-full items-end md:flex-grow">
          <div className="relative flex w-full flex-col">
            <div className="hidden md:block">
              <DesktopHero />
            </div>
            <div className="pt-56 md:hidden">
              <VideoHighlightMobile />
              <MobileHero />
            </div>
          </div>
        </section>
      </div>

      {/* Playground */}
      <PlaygroundSection heroRef={heroSectionRef} />

      {/* About */}
      <AnimatedAboutSection />

      {/* Vision */}
      <AnimatedVisionSection />

      {/* Reality */}
      <AnimatedRealitySection />

      {/* Contact */}
      <AnimatedContactSection />

      {/* Recap section */}
      <AnimatedRecapSection />
    </div>
  );
};

export default LandingPage;
