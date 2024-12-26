import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useLayoutContext } from "@/layout/AppLayout";

gsap.registerPlugin(ScrollTrigger);

type FontStyle =
  | "font-mono"
  | "font-serif"
  | "font-sans"
  | "font-pixel"
  | "italic"
  | "font-bold";

interface PlaygroundSectionProps {
  heroRef: React.RefObject<HTMLElement>;
  className?: string;
}

export const PlaygroundSection: FC<PlaygroundSectionProps> = ({
  heroRef,
  className = "",
}) => {
  const navigate = useNavigate();
  const { isDark } = useLayoutContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const [currentFontStyle, setCurrentFontStyle] = useState<number>(0);

  const fontStyles: FontStyle[] = [
    "font-mono",
    "font-serif",
    "font-sans",
    "font-pixel",
    "italic",
    "font-bold",
  ];

  // Font style animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFontStyle((prev) => (prev + 1) % fontStyles.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const container = containerRef.current;
    let requestId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updateTransform = (x: number, y: number) => {
      if (!textRef.current) return;
      textRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    };

    const animate = () => {
      if (!textRef.current) return;

      currentX = lerp(currentX, targetX, 0.3);
      currentY = lerp(currentY, targetY, 0.3);

      updateTransform(currentX, currentY);

      if (
        Math.abs(targetX - currentX) > 0.1 ||
        Math.abs(targetY - currentY) > 0.1
      ) {
        requestId = requestAnimationFrame(animate);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!container || !textRef.current) return;

      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      targetX = (e.clientX - rect.left - centerX) * 0.5;
      targetY = (e.clientY - rect.top - centerY) * 0.5;

      cancelAnimationFrame(requestId);
      requestId = requestAnimationFrame(animate);
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!requestId) {
        requestId = requestAnimationFrame(animate);
      }
    };

    // Set initial centered position
    updateTransform(0, 0);

    container?.addEventListener("mousemove", handleMouseMove);
    container?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container?.removeEventListener("mousemove", handleMouseMove);
      container?.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(requestId);
    };
  }, []);

  // Scroll animation
  useEffect(() => {
    const videoContainer = containerRef.current;
    const heroSection = heroRef.current;
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
          scrub: 2,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      revealTimeline
        .to(videoContainer, {
          opacity: 1,
          scale: 1,
          position: "fixed",
          bottom: "-36vh",
          duration: 1,
          ease: "power2.inOut",
        })
        .to(
          videoContainer,
          {
            bottom: 0,
            width: "100vw",
            height: "100vh",
            borderRadius: 0,
            duration: 1,
            ease: "power3.inOut",
          },
          "-=0.2",
        )
        .to(
          videoContainer,
          {
            yPercent: -100,
            duration: 0.8,
            ease: "power3.inOut",
          },
          "+=0.1",
        );
    });

    return () => context.revert();
  }, [heroRef]);

  return (
    <>
      <div
        ref={containerRef}
        className={`relative cursor-pointer overflow-hidden bg-black ${className}`}
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
          className={`absolute left-1/2 top-1/2 flex items-center justify-center text-5xl text-white mix-blend-difference sm:text-7xl md:text-9xl ${
            fontStyles[currentFontStyle]
          } transition-all duration-300`}
        >
          Playground
        </div>
      </div>
      <div
        ref={videoSectionRef}
        className={`video-section relative -mx-4 min-h-screen w-screen ${isDark ? "bg-black" : "bg-white"}`}
      />
    </>
  );
};
