import { useLayoutContext } from "@/layout/AppLayout";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function AnimatedRealitySection() {
  const { isDark } = useLayoutContext();
  const sectionRef = useRef<HTMLElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const leftWords = [
    "Automated Annotation",
    "SIFT Algorithm",
    "Scalability",
    "Precision",
    "Efficiency",
    "User-Friendly",
    "Versatile Integration",
    "Time-Saving",
    "Data Analytics",
    "Innovation",
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
    if (!sectionRef.current || !titleRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const leftElements = gsap.utils.toArray<Element>(".left-text");
    const rightElements = gsap.utils.toArray<Element>(".right-text");

    // Set initial states
    gsap.set(leftElements, {
      scale: 0,
      opacity: 0,
      x: -100,
      transformOrigin: "left center",
    });

    gsap.set(rightElements, {
      scale: 0,
      opacity: 0,
      x: 100,
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

    // Create timeline for Reality title with enhanced scroll-back
    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1, // Smooth scrubbing effect
      },
    });

    titleTl
      .to(titleRef.current, {
        top: "180vh",
        yPercent: -50,
        duration: 10,
        ease: "none",
      })
      .to(
        titleRef.current,
        {
          duration: 5,
        },
        "<",
      );

    // Calculate total duration for staggered animations
    const leftDuration = leftWords.length * 100;

    // Enhanced left side animations with scroll-back effects
    leftElements.forEach((text, i) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: `top+=${i * 100 + 100} bottom`,
          end: `top+=${i * 100 + 300} bottom`,
          scrub: 0.5,
          toggleActions: "play reverse play reverse",
        },
      });

      tl.to(text, {
        scale: 1,
        opacity: 1,
        x: 0,
        rotation: 0,
        duration: 1,
        ease: "power2.out",
      });
    });

    // Enhanced right side animations with scroll-back effects
    rightElements.forEach((text, i) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: `top+=${leftDuration + i * 100 - 100} bottom`,
          end: `top+=${leftDuration + i * 100 + 100} bottom`,
          scrub: 0.5,
          toggleActions: "play reverse play reverse",
        },
      });

      tl.to(text, {
        scale: 1,
        opacity: 1,
        x: 0,
        rotation: 0,
        duration: 1,
        ease: "power2.out",
      });
    });

    // Add floating animation to visible elements
    const addFloatingAnimation = (elements: Element[]) => {
      elements.forEach((element) => {
        const floatTl = gsap.timeline({
          repeat: -1,
          yoyo: true,
          defaults: { duration: 1.5, ease: "power1.inOut" },
        });

        floatTl.to(element, {
          y: gsap.utils.random(-10, 10),
          x: gsap.utils.random(-5, 5),
          rotation: gsap.utils.random(-5, 5),
        });
      });
    };

    // Apply floating animation to visible elements
    const visibleElements = [...leftElements, ...rightElements].filter(
      (element) => Number(gsap.getProperty(element, "opacity")) > 0,
    );
    addFloatingAnimation(visibleElements);

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
