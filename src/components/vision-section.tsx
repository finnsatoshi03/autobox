import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const AnimatedVisionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLHeadingElement>(null);

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
      y: (index) => index * 30, // characters spaces
      opacity: 0,
      x: "100vw", // Start from the right
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "center center",
          scrub: 1,
          markers: true,
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

    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      splitText.revert();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="-mx-4 flex min-h-screen w-screen justify-center overflow-hidden bg-white"
    >
      <h2
        ref={visionRef}
        className="relative pt-32 text-5xl font-bold uppercase text-gray-500 sm:text-7xl md:text-8xl"
      >
        Vision
      </h2>
    </div>
  );
};

export default AnimatedVisionSection;
