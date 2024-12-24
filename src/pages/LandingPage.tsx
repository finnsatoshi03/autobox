import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DesktopHero,
  MobileHero,
  VideoHighlightMobile,
} from "@/components/hero";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AnimatedAboutSection from "@/components/about-section";
import AnimatedVisionSection from "@/components/vision-section";
import { useLayoutContext } from "@/layout/AppLayout";

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
  const { isDark } = useLayoutContext();
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [currentFontStyle, setCurrentFontStyle] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFontStyle((prev) => (prev + 1) % fontStyles.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = videoContainerRef.current;
    let requestId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      if (!textRef.current) return;

      currentX = lerp(currentX, targetX, 0.3); // Increased from 0.1
      currentY = lerp(currentY, targetY, 0.3); // Increased from 0.1

      textRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`;

      // Only continue animation if movement is significant
      if (
        Math.abs(targetX - currentX) > 0.1 ||
        Math.abs(targetY - currentY) > 0.1
      ) {
        requestId = requestAnimationFrame(animate);
      }
    };

    const handleMouseMove = (e: MouseEvent): void => {
      if (!container || !textRef.current) return;

      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      targetX = mouseX - centerX;
      targetY = mouseY - centerY;

      // Cancel existing animation frame before starting new one
      cancelAnimationFrame(requestId);
      requestId = requestAnimationFrame(animate);
    };

    const handleMouseLeave = (): void => {
      targetX = 0;
      targetY = 0;
      if (!requestId) {
        requestId = requestAnimationFrame(animate);
      }
    };

    container?.addEventListener("mousemove", handleMouseMove);
    container?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container?.removeEventListener("mousemove", handleMouseMove);
      container?.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(requestId);
    };
  }, []);

  useEffect(() => {
    const videoContainer = videoContainerRef.current;
    const heroSection = heroSectionRef.current;
    if (!videoContainer || !heroSection) return;

    const context = gsap.context(() => {
      // Initial setup
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
          end: "bottom+=70% top", // Extended scroll range for smoother timing
          scrub: 2, // Increased scrub value for smoother scrolling
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      revealTimeline
        // Initial fade in and positioning
        .to(videoContainer, {
          opacity: 1,
          scale: 1,
          position: "fixed",
          bottom: "-36vh",
          duration: 1, // Longer duration for smoother entrance
          ease: "power2.inOut", // Changed to inOut for smoother transition
        })
        // Expand to full screen
        .to(
          videoContainer,
          {
            bottom: 0,
            width: "100vw",
            height: "100vh",
            borderRadius: 0,
            duration: 1, // Longer duration for smoother expansion
            ease: "power3.inOut", // More natural easing
          },
          "-=0.2",
        ) // Slight overlap for continuity
        // Final slide out
        .to(
          videoContainer,
          {
            yPercent: -100,
            duration: 0.8, // Longer duration
            ease: "power3.inOut", // Smoother exit
          },
          "+=0.1",
        ); // Small pause before exit
    });

    return () => context.revert();
  }, []);

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
          className={`absolute left-0 top-0 flex h-full w-full items-center justify-center text-5xl text-white mix-blend-difference sm:text-7xl md:text-9xl ${
            fontStyles[currentFontStyle]
          } -translate-x-1/2 -translate-y-1/2 transform transition-all duration-300`}
        >
          Playground
        </div>
      </div>
      <div
        ref={videoSectionRef}
        className={`video-section relative -mx-4 min-h-screen w-screen ${isDark ? "bg-black" : "bg-white"}`}
      />

      {/* About */}
      <AnimatedAboutSection />

      {/* Vision */}
      <AnimatedVisionSection />
    </div>
  );
};

export default LandingPage;
