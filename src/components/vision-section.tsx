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
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const { setIsDark, isDark } = useLayoutContext();

  const getResponsiveValues = () => {
    const width = window.innerWidth;
    if (width < 640) {
      return { copies: 10, spacing: 60, xOffset: 80 };
    }
    if (width < 1024) {
      return { copies: 15, spacing: 100, xOffset: 100 };
    }
    if (width < 3840) {
      return { copies: 20, spacing: 140, xOffset: 140 };
    }
    if (width < 7680) {
      return { copies: 40, spacing: 160, xOffset: 160 };
    }
    return { copies: 60, spacing: 180, xOffset: 180 };
  };
  useEffect(() => {
    const container = containerRef.current;
    const section = sectionRef.current;
    const vision = visionRef.current;
    if (!container || !section || !vision) return;

    const { copies: numCopies, spacing, xOffset } = getResponsiveValues();

    // Split text setup
    const splitText = new SplitType(vision, {
      types: "chars",
      tagName: "span",
    });

    const copies: HTMLElement[] = [];

    // Create copies with z-index
    for (let i = -numCopies; i <= numCopies; i++) {
      if (i === 0) continue;

      const copy = document.createElement("h2");
      copy.className = vision.className;
      copy.textContent = "Vision";
      copy.style.position = "absolute";
      copy.style.left = "50%";
      copy.style.transform = "translate(-50%, -50%)";
      copy.style.top = "50%";
      copy.style.zIndex = "1";
      copy.style.width = "100%"; // Ensure consistent width
      copy.style.textAlign = "center"; // Center align text
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

    const charPositions = new Map();

    // Initial states setup
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

    // ScrollTrigger setup
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

    // First timeline
    const spreadTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top center",
        end: "33% center",
        scrub: 1,
      },
    });

    // Spread animation
    spreadTimeline
      .to(splitText.chars, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: {
          amount: 0.5,
          from: "start",
        },
      })
      .addLabel("spread", ">");

    // Animate copies with position tracking
    copies.forEach((copy, idx) => {
      const chars = copy.querySelectorAll(".char");
      const isLeft = idx < numCopies;
      const position = isLeft
        ? -((idx + 1) * xOffset)
        : (idx - numCopies + 1) * xOffset;

      const copyIndex = isLeft ? idx + 1 : idx - numCopies + 1;
      const normalizedDistance = Math.abs(copyIndex) / numCopies;
      const ySpacingMultiplier = normalizedDistance * (spacing * 0.5);

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

    // Second timeline
    const gatherTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "33% center",
        end: "43% center",
        scrub: 1,
      },
    });

    const allCopies = [vision, ...copies];
    const numChars = "Vision".length;
    const viewportHeight = window.innerHeight;
    const rowSpacing = Math.min(viewportHeight / (numChars + 10), spacing);

    // Gather animation
    for (let charIndex = 0; charIndex < numChars; charIndex++) {
      const charRow = allCopies.map(
        (copy) => copy.querySelectorAll(".char")[charIndex],
      );

      gatherTimeline.to(
        charRow,
        {
          y: () => (charIndex + 5.5) * rowSpacing - viewportHeight / 2,
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

    // Updated createImages function with z-index and opacity
    const createImages = () => {
      const imagesContainer = imagesContainerRef.current;
      if (!imagesContainer) return [];

      const imageConfigs = [
        { width: 300, height: 200, top: "15%", delay: 0 },
        { width: 400, height: 300, top: "45%", delay: 0.2 },
        { width: 250, height: 350, top: "65%", delay: 0.4 },
        { width: 350, height: 250, top: "25%", delay: 0.6 },
        { width: 450, height: 300, top: "55%", delay: 0.8 },
        { width: 280, height: 380, top: "35%", delay: 1 },
      ];

      return imageConfigs.map((config) => {
        const img = document.createElement("img");
        img.src = `https://placehold.co/${config.width}x${config.height}`;
        img.alt = `Vision ${config.delay}`;
        img.style.position = "absolute";
        img.style.top = config.top;
        img.style.right = `-${config.width}px`;
        img.style.width = `${config.width}px`;
        img.style.height = `${config.height}px`;
        img.style.transform = "translateX(100px)";
        img.style.borderRadius = "8px";
        img.style.zIndex = "10"; // Set higher z-index for images
        img.style.opacity = "0"; // Start with opacity 0
        imagesContainer.appendChild(img);
        return { element: img, delay: config.delay };
      });
    };

    const images = createImages();

    // Updated scroll timeline with continuous movement
    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "43% center",
        end: "70% center",
        scrub: 1,
        // markers: true,
      },
    });

    // Create a separate timeline for images
    const imageScrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "43% center",
        end: "70% center",
        scrub: 1,
      },
    });

    // Character animations in scroll timeline
    for (let charIndex = 0; charIndex < numChars; charIndex++) {
      const charRow = allCopies.map(
        (copy) => copy.querySelectorAll(".char")[charIndex],
      );

      const speed = 1 + charIndex * 0.15;
      const direction = charIndex % 2 === 0 ? 1 : -1;
      const distance = window.innerWidth * 2;

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
          overwrite: "auto",
        },
        "scroll",
      );
    }

    // Image animations in separate timeline
    images.forEach(({ element: img, delay }) => {
      const xDistance = window.innerWidth + parseInt(img.style.width);

      imageScrollTimeline
        .to(
          img,
          {
            opacity: 1,
            duration: 0.3,
          },
          `scroll+=${delay}`,
        )
        .to(
          img,
          {
            x: -xDistance,
            duration: 1,
            ease: "none",
          },
          `scroll+=${delay}`,
        );
    });

    const returnTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "70% center",
        end: "bottom center",
        scrub: 1,
      },
    });

    // Return animations for characters
    allCopies.forEach((copy, copyIndex) => {
      const chars = copy.querySelectorAll(".char");

      returnTimeline.to(
        chars,
        {
          x:
            copyIndex === 0
              ? 0
              : (target) => {
                  const pos = charPositions.get(target);
                  return pos ? pos.x : 0;
                },
          y: (index, _, arr) => {
            const totalHeight = calculateTotalHeight(arr.length, 1);
            return index - totalHeight / 2;
          },
          opacity: copyIndex === 0 ? 1 : 0,
          duration: 1,
          ease: "power2.inOut",
          stagger: {
            amount: 0.3,
            from: "start",
          },
        },
        "return",
      );
    });

    // Fade out images during return
    images.forEach(({ element: img }, index) => {
      returnTimeline.to(
        img,
        {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        },
        `return+=${index * 0.1}`,
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      splitText.revert();
      copies.forEach((copy) => copy.remove());
      images.forEach(({ element }) => element.remove());
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
        <div
          ref={imagesContainerRef}
          className="pointer-events-none absolute inset-0"
        ></div>
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
