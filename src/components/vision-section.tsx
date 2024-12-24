import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useLayoutContext } from "@/layout/AppLayout";

gsap.registerPlugin(ScrollTrigger);

const AnimatedVisionSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLHeadingElement>(null);
  const { setIsDark, isDark } = useLayoutContext();

  useEffect(() => {
    const container = containerRef.current;
    const section = sectionRef.current;
    const vision = visionRef.current;
    if (!container || !section || !vision) return;

    // Split text into characters for the original
    const splitText = new SplitType(vision, {
      types: "chars",
      tagName: "span",
    });

    // Create copies of the VISION text
    const numCopies = 10; // Number of copies on each side
    const copies: HTMLElement[] = [];

    for (let i = -numCopies; i <= numCopies; i++) {
      if (i === 0) continue; // Skip center (original text)

      const copy = document.createElement("h2");
      copy.className = vision.className;
      copy.textContent = "Vision";
      copy.style.position = "absolute";
      copy.style.left = "50%";
      copy.style.transform = "translate(-50%, 0)";
      vision.parentElement?.appendChild(copy);
      copies.push(copy);

      // Split each copy independently
      new SplitType(copy, {
        types: "chars",
        tagName: "span",
      });
    }

    // Set initial states for original text
    gsap.set(splitText.chars, {
      position: "relative",
      display: "block",
      textAlign: "center",
      left: "50%",
      xPercent: -50,
      y: (index) => index,
      opacity: 0,
      x: "100vw",
    });

    // Set initial states for copies
    copies.forEach((copy) => {
      const chars = copy.querySelectorAll(".char");
      gsap.set(chars, {
        position: "relative",
        display: "block",
        textAlign: "center",
        left: "50%",
        xPercent: -50,
        y: (index) => index,
        opacity: 0,
      });
    });

    // Create ScrollTrigger for background color
    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom top",
      onEnter: () => setIsDark(true),
      onLeaveBack: () => setIsDark(false),
    });

    // Create ScrollTrigger for sticky behavior
    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom top",
      pin: section,
      pinSpacing: false,
      //   markers: true,
    });

    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top center",
        end: "center-=100 center",
        scrub: 1,
        // markers: true,
      },
    });

    // Animate original text
    mainTimeline.to(splitText.chars, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "power2.out",
      stagger: {
        amount: 1,
        from: "start",
      },
    });

    // Animate copies
    copies.forEach((copy, idx) => {
      const chars = copy.querySelectorAll(".char");
      const isLeft = idx < numCopies;
      const position = isLeft
        ? -((idx + 1.4) * 100)
        : (idx - numCopies + 0.7) * 100;

      mainTimeline
        .to(
          chars,
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: {
              amount: 0.5,
              from: "start",
            },
          },
          "spread",
        )
        .to(
          copy,
          {
            x: position,
            duration: 1,
            ease: "power2.out",
          },
          "spread+=0.5",
        );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      splitText.revert();
      copies.forEach((copy) => copy.remove());
    };
  }, [setIsDark]);

  return (
    <div ref={containerRef} className="h-[300vh]">
      <div
        ref={sectionRef}
        className={`-mx-4 flex h-screen w-screen justify-center overflow-hidden transition-colors duration-300 ease-in-out ${
          isDark ? "bg-black" : "bg-white"
        }`}
      >
        <h2
          ref={visionRef}
          className="relative pt-56 text-5xl font-bold uppercase text-gray-500 sm:text-7xl md:text-8xl"
        >
          Vision
        </h2>
      </div>
    </div>
  );
};

export default AnimatedVisionSection;
