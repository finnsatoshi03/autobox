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

  const getNumCopies = () => {
    const width = window.innerWidth;
    if (width < 640) return 10; // mobile
    if (width < 1024) return 15; // tablet
    if (width < 3840) return 20; // desktop
    if (width < 7680) return 40; // 4K
    return 60; // 8K
  };

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
    const numCopies = getNumCopies();
    const copies: HTMLElement[] = [];

    for (let i = -numCopies; i <= numCopies; i++) {
      if (i === 0) continue; // Skip center (original text)

      const copy = document.createElement("h2");
      copy.className = vision.className;
      copy.textContent = "Vision";
      copy.style.position = "absolute";
      copy.style.left = "50%";
      copy.style.transform = "translate(-50%, -50%)";
      copy.style.top = "50%";
      vision.parentElement?.appendChild(copy);
      copies.push(copy);

      new SplitType(copy, {
        types: "chars",
        tagName: "span",
      });
    }

    const calculateTotalHeight = (numChars: number, spacing: number) => {
      return numChars * spacing;
    };

    // Set initial states for original text
    const originalChars = splitText.chars;
    if (originalChars) {
      gsap.set(originalChars, {
        position: "relative",
        display: "block",
        textAlign: "center",
        left: "50%",
        xPercent: -50,
        y: (index, _, arr) => {
          const totalHeight = calculateTotalHeight(arr.length, 1);
          return index - totalHeight / 2;
        },
        opacity: 0,
        x: "100vw",
      });
    }

    // Set initial states for copies
    copies.forEach((copy) => {
      const chars = copy.querySelectorAll(".char");
      gsap.set(chars, {
        position: "relative",
        display: "block",
        textAlign: "center",
        left: "50%",
        xPercent: -50,
        y: (index, _, arr) => {
          const totalHeight = calculateTotalHeight(arr.length, 1);
          return index - totalHeight / 2;
        },
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
    });

    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top center",
        end: "center center", // Adjusted for smoother scroll range
        scrub: 2, // Increased scrub value for smoother scrolling
      },
    });

    // Animate original text
    mainTimeline.to(splitText.chars, {
      opacity: 1,
      x: 0,
      duration: 2, // Increased duration
      ease: "power2.out",
      stagger: {
        amount: 1.5, // Increased stagger amount
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

      const copyIndex = isLeft ? idx + 1 : idx - numCopies + 1;
      const normalizedDistance = Math.abs(copyIndex) / numCopies;
      const ySpacingMultiplier = normalizedDistance * 60;

      mainTimeline
        .to(
          chars,
          {
            opacity: 1,
            x: 0,
            y: (index, _, arr) => {
              const spacing = 1 + ySpacingMultiplier;
              const totalHeight = calculateTotalHeight(arr.length, spacing);
              return index * spacing - totalHeight / 2;
            },
            duration: 1.5, // Increased duration
            ease: "power1.inOut", // Changed to smoother easing
            stagger: {
              amount: 0.8, // Increased stagger amount
              from: "start",
            },
          },
          "spread",
        )
        .to(
          copy,
          {
            x: position,
            duration: 2, // Increased duration
            ease: "power2.inOut", // Changed to smoother easing
          },
          "spread+=0.2", // Reduced delay between char spacing and position
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
        className={`-mx-4 flex h-screen w-screen items-center justify-center overflow-hidden transition-colors duration-300 ease-in-out ${
          isDark ? "bg-black" : "bg-white"
        }`}
      >
        <h2
          ref={visionRef}
          className="relative text-5xl font-bold uppercase text-gray-500 sm:text-7xl md:text-8xl"
        >
          Vision
        </h2>
      </div>
    </div>
  );
};

export default AnimatedVisionSection;
