import { useEffect, useRef } from "react";
import {
  DesktopHero,
  MobileHero,
  VideoHighlightMobile,
} from "@/components/hero";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const videoContainerRef = useRef(null);
  const heroSectionRef = useRef(null);
  const videoSectionRef = useRef(null);

  useEffect(() => {
    const videoContainer = videoContainerRef.current;
    const heroSection = heroSectionRef.current;

    const context = gsap.context(() => {
      gsap.set(videoContainer, {
        position: "absolute",
        bottom: "-100vh",
        left: "50%",
        xPercent: -50,
        width: "90vw",
        height: "80vh",
        borderRadius: "2rem",
        zIndex: 50,
        opacity: 0,
        scale: 0.95,
      });

      const revealTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: "center center",
          end: "bottom+=70% top",
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      revealTimeline
        .to(videoContainer, {
          opacity: 1,
          scale: 1,
          position: "fixed",
          bottom: "-56vh",
          duration: 0.4,
          ease: "power2.out",
        })
        .to(
          videoContainer,
          {
            bottom: 0,
            width: "100vw",
            height: "100vh",
            borderRadius: 0,
            duration: 0.6,
            ease: "power4.inOut",
          },
          ">",
        )
        .to(
          videoContainer,
          {
            yPercent: -100,
            duration: 0.4,
            ease: "power2.in",
          },
          ">+=0.2",
        );
    });

    return () => context.revert();
  }, []);

  return (
    <div className="relative">
      <div
        ref={heroSectionRef}
        className="mb-4 flex h-[calc(100dvh-7rem)] w-full flex-col"
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
      <div ref={videoContainerRef} className="overflow-hidden">
        <video
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/playground-highlight.mp4" type="video/mp4" />
        </video>
      </div>
      <div
        ref={videoSectionRef}
        className="video-section relative -mx-4 min-h-screen w-screen bg-white"
      />

      <div className="relative -mx-4 h-[200vh] w-screen bg-white">
        <div className="container mx-auto p-8">
          <h2 className="text-3xl font-bold">Next Section</h2>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
