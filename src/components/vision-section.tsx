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
      if (i === 0) continue;

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

    // Store initial positions after spread
    const charPositions = new Map();

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

    // ScrollTrigger setup with markers for debugging
    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom top",
      onEnter: () => setIsDark(true),
      onLeaveBack: () => setIsDark(false),
    });

    ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom top",
      pin: section,
      pinSpacing: false,
    });

    // First timeline - spread animation
    const spreadTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top center",
        end: "33% center",
        scrub: 1,
        markers: true,
      },
    });

    // Animate original text
    spreadTimeline.to(splitText.chars, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "power2.out",
      stagger: {
        amount: 1,
        from: "start",
      },
    });

    // Animate copies with position tracking
    copies.forEach((copy, idx) => {
      const chars = copy.querySelectorAll(".char");
      const isLeft = idx < numCopies;
      const position = isLeft
        ? -((idx + 1.4) * 140)
        : (idx - numCopies + 0.7) * 140;

      const copyIndex = isLeft ? idx + 1 : idx - numCopies + 1;
      const normalizedDistance = Math.abs(copyIndex) / numCopies;
      const ySpacingMultiplier = normalizedDistance * 100;

      spreadTimeline
        .to(
          chars,
          {
            opacity: 1,
            x: 0,
            y: (index, target) => {
              const spacing = 1 + ySpacingMultiplier;
              const totalHeight = calculateTotalHeight(chars.length, spacing);
              const yPos = index * spacing - totalHeight / 2;

              // Store the position for each character
              charPositions.set(target, {
                x: position,
                y: yPos,
                copyIndex: idx,
                charIndex: index,
              });

              return yPos;
            },
            duration: 1,
            ease: "power1.inOut",
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
            ease: "power2.inOut",
          },
          "spread",
        );
    });

    // Second timeline - gather into rows
    const gatherTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "33% center",
        end: "66% center",
        scrub: 1,
        markers: true,
      },
    });

    const allCopies = [vision, ...copies];
    const numChars = "Vision".length;
    const viewportHeight = window.innerHeight;
    const rowSpacing = viewportHeight / (numChars + 10);

    for (let charIndex = 0; charIndex < numChars; charIndex++) {
      const charRow = allCopies.map(
        (copy) => copy.querySelectorAll(".char")[charIndex],
      );

      gatherTimeline.to(
        charRow,
        {
          y: () => {
            const rowOffset =
              (charIndex + 5.5) * rowSpacing - viewportHeight / 2;
            return rowOffset;
          },
          x: (target) => {
            const pos = charPositions.get(target);
            return pos ? pos.x : 0;
          },
          duration: 1,
          ease: "power2.inOut",
        },
        "gather",
      );
    }

    // Third timeline - horizontal scroll
    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "66% center",
        end: "bottom center",
        scrub: 1,
        markers: true,
      },
    });

    for (let charIndex = 0; charIndex < numChars; charIndex++) {
      const charRow = allCopies.map(
        (copy) => copy.querySelectorAll(".char")[charIndex],
      );

      const speed = 1 + charIndex * 0.15;
      const direction = charIndex % 2 === 0 ? 1 : -1;
      const distance = window.innerWidth * 2.5; // Use viewport width for consistent movement

      scrollTimeline.to(
        charRow,
        {
          x: (i, target) => {
            const pos = charPositions.get(target);
            const baseX = pos ? pos.x : 0;
            return baseX + (direction * distance) / speed;
          },
          duration: 1,
          ease: "none",
          overwrite: "auto", // Prevent animation conflicts
        },
        "scroll",
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      splitText.revert();
      copies.forEach((copy) => copy.remove());
    };
  }, [setIsDark]);

  return (
    <div ref={containerRef} className="h-[400vh]">
      <div
        ref={sectionRef}
        className={`-mx-4 flex h-screen w-screen items-center justify-center overflow-hidden transition-colors duration-300 ease-in-out ${
          isDark ? "bg-black" : "bg-white"
        }`}
      >
        <h2
          ref={visionRef}
          className="relative text-6xl font-bold uppercase text-gray-500 sm:text-8xl md:text-9xl"
        >
          Vision
        </h2>
      </div>
    </div>
  );
};

export default AnimatedVisionSection;
