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
        className="video-section relative -mx-4 min-h-screen w-screen bg-white"
      />

      {/* About */}
      <div className="relative -mx-4 -mt-10 h-screen w-screen bg-white">
        <div className="p-8">
          <h2 className="text-[min(12vw,6rem)] uppercase leading-none md:text-[clamp(1.5rem,6vw,8rem)]">
            auto{" "}
            <span className="relative font-bold text-lime-green">
              b
              <img
                src="/images/star.gif"
                className="absolute -left-2 top-8 size-4 md:-left-4 md:size-10"
              />
              <span className="inline-block rotate-[22deg] tracking-[-0.2em]">
                o
              </span>
              x
              <img
                src="/images/star.gif"
                className="absolute -right-4 bottom-8 size-4 md:-right-6 md:size-10"
              />
            </span>{" "}
            annotation, <br /> simplified
          </h2>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
