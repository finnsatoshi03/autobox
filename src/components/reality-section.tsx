import { useLayoutContext } from "@/layout/AppLayout";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function AnimatedRealitySection() {
  const { isDark } = useLayoutContext();
  const sectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const titleRef = useRef(null);

  const leftWords = [
    "Lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
  ];

  const rightWords = [
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "magna",
    "aliqua",
    "minim",
    "veniam",
    "quis",
  ];

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const leftElements = gsap.utils.toArray(".left-text");
    const rightElements = gsap.utils.toArray(".right-text");

    // Set initial states
    gsap.set(leftElements, {
      scale: 0,
      opacity: 0,
      transformOrigin: "left center",
    });

    gsap.set(rightElements, {
      scale: 0,
      opacity: 0,
      transformOrigin: "right center",
    });

    // Set initial state for Reality title
    gsap.set(titleRef.current, {
      top: "0%",
      left: "50%",
      yPercent: 0,
      xPercent: -50,
      opacity: 1,
    });

    // Create timeline for Reality title
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    tl.to(titleRef.current, {
      top: "180vh",
      yPercent: -50,
      duration: 10,
      ease: "none",
    });

    // Calculate total duration for left animations
    const leftDuration = leftWords.length * 100;

    // Animate left side first
    leftElements.forEach((text, i) => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: `top+=${i * 100 + 100} bottom`,
        onEnter: () => {
          gsap.to(text as Element, {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          });
        },
        onLeaveBack: () => {
          gsap.to(text as Element, {
            scale: 0,
            opacity: 0,
            duration: 0.8,
            ease: "power2.in",
          });
        },
      });
    });

    // Animate right side after left side completes
    rightElements.forEach((text, i) => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: `top+=${leftDuration + i * 100 - 100} bottom`,
        onEnter: () => {
          gsap.to(text as Element, {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          });
        },
        onLeaveBack: () => {
          gsap.to(text as Element, {
            scale: 0,
            opacity: 0,
            duration: 0.8,
            ease: "power2.in",
          });
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative -mx-4 mt-[100vh] min-h-[200vh] w-screen overflow-x-hidden transition-colors duration-300 ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div ref={textContainerRef} className="relative h-screen px-4">
        {/* Center Title */}
        <h2
          ref={titleRef}
          className="pointer-events-none absolute text-6xl font-bold uppercase text-lime-green sm:text-8xl md:text-9xl"
        >
          Reality
        </h2>

        <div className="flex flex-col gap-20">
          {/* Left Column */}
          <div className="flex flex-col pt-20">
            {leftWords.map((word, index) => (
              <div
                key={`left-${index}`}
                className="left-text text-5xl mix-blend-difference md:text-7xl"
              >
                {word}
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-end">
            {rightWords.map((word, index) => (
              <div
                key={`right-${index}`}
                className="right-text text-5xl mix-blend-difference md:text-7xl"
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
