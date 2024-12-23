import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DesktopHero,
  MobileHero,
  VideoHighlightMobile,
} from "@/components/hero";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FontStyle =
  | "font-mono"
  | "font-serif"
  | "font-sans"
  | "font-pixel"
  | "italic"
  | "font-bold";

const fontStyles: FontStyle[] = [
  "font-mono",
  "font-serif",
  "font-sans",
  "font-pixel",
  "italic",
  "font-bold",
];

const LandingPage = (): JSX.Element => {
  const navigate = useNavigate();
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [currentFontStyle, setCurrentFontStyle] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFontStyle((prev) => (prev + 1) % fontStyles.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = videoContainerRef.current;

    const handleMouseMove = (e: MouseEvent): void => {
      if (!container || !textRef.current) return;

      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const deltaX = mouseX - centerX;
      const deltaY = mouseY - centerY;

      textRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    };

    const handleMouseLeave = (): void => {
      if (!textRef.current) return;

      textRef.current.style.transform = "translate(0, 0)";
      textRef.current.style.transition = "transform 0.2s ease-out";

      // Reset transition after it completes
      setTimeout(() => {
        if (textRef.current) {
          textRef.current.style.transition = "";
        }
      }, 200);
    };

    container?.addEventListener("mousemove", handleMouseMove);
    container?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container?.removeEventListener("mousemove", handleMouseMove);
      container?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const videoContainer = videoContainerRef.current;
    const heroSection = heroSectionRef.current;
    if (!videoContainer || !heroSection) return;

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
      <div
        ref={videoContainerRef}
        className="relative cursor-pointer overflow-hidden bg-black"
        onClick={() => navigate("/playground")}
      >
        <video
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/playground-highlight.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/10 transition-colors hover:bg-black/20" />
        <div
          ref={textRef}
          className={`absolute left-0 top-0 flex h-full w-full items-center justify-center text-9xl text-white mix-blend-difference ${
            fontStyles[currentFontStyle]
          } -translate-x-1/2 -translate-y-1/2 transform transition-all duration-300`}
        >
          Playground
        </div>
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
