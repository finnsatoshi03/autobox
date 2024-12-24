import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useLayoutContext } from "@/layout/AppLayout";

gsap.registerPlugin(ScrollTrigger);

const AnimatedVisionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLHeadingElement>(null);
  const { setIsDark, isDark } = useLayoutContext();

  useEffect(() => {
    const section = sectionRef.current;
    const vision = visionRef.current;
    if (!section || !vision) return;

    // Split text into characters
    const splitText = new SplitType(vision, {
      types: "chars",
      tagName: "span",
    });

    gsap.set(splitText.chars, {
      position: "relative",
      display: "block",
      textAlign: "center",
      left: "50%",
      xPercent: -50,
      y: (index) => index * 30,
      opacity: 0,
      x: "100vw",
    });

    // Create ScrollTrigger for background color
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onEnter: () => setIsDark(true),
      onLeaveBack: () => setIsDark(false),
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "center center",
          scrub: 1,
        },
      })
      .to(splitText.chars, {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
        stagger: {
          amount: 1,
          from: "start",
        },
      });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      splitText.revert();
    };
  }, [setIsDark]);

  return (
    <div
      ref={sectionRef}
      className={`-mx-4 flex min-h-screen w-screen justify-center overflow-hidden transition-colors duration-300 ease-in-out ${isDark ? "bg-black" : "bg-white"}`}
    >
      <h2
        ref={visionRef}
        className="relative py-32 text-5xl font-bold uppercase text-gray-500 sm:text-7xl md:text-8xl"
      >
        Vision
      </h2>
    </div>
  );
};

export default AnimatedVisionSection;
