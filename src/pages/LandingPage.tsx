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
      <div className="relative -mx-4 h-screen w-screen bg-black">
        <div className="absolute z-50 flex h-full w-full items-center justify-center bg-transparent px-4">
          <div className="flex items-center justify-center gap-4">
            <h2 className="text-7xl font-bold text-black sm:text-8xl md:text-9xl">
              PLAYGROUND
            </h2>
            <img src="/images/loader.gif" className="h-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
