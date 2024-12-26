import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function AnimatedContactSection() {
  const sectionRef = useRef(null);
  const leftHandRef = useRef(null);
  const rightHandRef = useRef(null);
  const pixelGridRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    // Create pixel grid with center-out fill order
    const createPixelGrid = () => {
      const gridContainer = pixelGridRef.current;
      gridContainer.innerHTML = ""; // Clear existing pixels

      const pixelSize = window.innerWidth <= 768 ? 20 : 40;
      const cols = Math.ceil(window.innerWidth / pixelSize);
      const rows = Math.ceil(window.innerHeight / pixelSize);
      const centerX = Math.floor(cols / 2);
      const centerY = Math.floor(rows / 2);

      // Create array of all positions with their distance from center
      const positions = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const distanceFromCenter = Math.sqrt(
            Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2),
          );
          positions.push({ x, y, distanceFromCenter });
        }
      }

      // Sort positions by distance from center for initial pixels
      const centerPixelCount = Math.floor(positions.length * 0.1); // First 10% from center
      const remainingPositions = positions.slice(centerPixelCount);

      // Shuffle remaining positions for random fill
      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      // Combine sorted center pixels with shuffled remaining pixels
      const sortedPositions = [
        ...positions
          .slice(0, centerPixelCount)
          .sort((a, b) => a.distanceFromCenter - b.distanceFromCenter),
        ...shuffleArray(remainingPositions),
      ];

      // Create pixel elements
      sortedPositions.forEach((pos, index) => {
        const pixel = document.createElement("div");
        pixel.className =
          "absolute bg-white transform scale-0 transition-transform duration-300";
        pixel.style.width = `${pixelSize}px`;
        pixel.style.height = `${pixelSize}px`;
        pixel.style.left = `${pos.x * pixelSize}px`;
        pixel.style.top = `${pos.y * pixelSize}px`;
        pixel.dataset.index = index; // Store index for animation order
        gridContainer.appendChild(pixel);
      });

      return gridContainer.children;
    };

    mm.add("(min-width: 768px)", () => {
      // Main timeline for hands movement
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "center center",
          scrub: true,
        },
      });

      // Hands animation
      tl.to(
        leftHandRef.current,
        {
          top: "70%",
          xPercent: 80,
          yPercent: -50,
          ease: "none",
        },
        0,
      );

      tl.to(
        rightHandRef.current,
        {
          top: "50%",
          xPercent: -20,
          yPercent: -50,
          ease: "none",
        },
        0,
      );

      // Pixel fill effect
      const pixels = createPixelGrid();

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center",
          end: "bottom top",
          scrub: true,
          onEnter: () => {
            pixelGridRef.current.style.display = "block";
          },
          onLeaveBack: () => {
            pixelGridRef.current.style.display = "none";
          },
          onUpdate: (self) => {
            const progress = self.progress;
            const pixelsToShow = Math.floor(pixels.length * progress);

            Array.from(pixels).forEach((pixel) => {
              const index = parseInt(pixel.dataset.index);
              if (index <= pixelsToShow) {
                pixel.style.transform = "scale(1)";
                pixel.style.opacity = "1";
              } else {
                pixel.style.transform = "scale(0)";
                pixel.style.opacity = "0";
              }
            });
          },
        },
      });
    });

    mm.add("(max-width: 767px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "center center",
          scrub: true,
        },
      });

      tl.to(
        leftHandRef.current,
        {
          top: "75%",
          xPercent: 0,
          yPercent: -50,
          ease: "none",
        },
        0,
      );

      tl.to(
        rightHandRef.current,
        {
          top: "65%",
          xPercent: 0,
          yPercent: -55,
          ease: "none",
        },
        0,
      );

      // Create pixel grid for mobile
      createPixelGrid();
    });

    // Handle window resize
    const handleResize = () => {
      createPixelGrid();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      mm.revert();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative -mx-4 min-h-screen w-screen overflow-x-hidden bg-black px-4 transition-colors duration-300"
    >
      <img
        ref={leftHandRef}
        src="/images/hands/pixel-left.png"
        alt="Vectorized Futuristic Interpretation of Left Hand from the Creation of Adam by Michael Angelo"
        className="absolute left-12 top-1/2 w-1/2 md:w-1/3"
      />
      <img
        ref={rightHandRef}
        src="/images/hands/pixel-right.png"
        alt="Vectorized Right Hand from the Creation of Adam by Michael Angelo"
        className="absolute -right-12 top-[10%] w-1/2 md:w-1/3"
      />
      {/* Pixel grid container */}
      <div
        ref={pixelGridRef}
        className="fixed left-0 top-0 z-20 hidden h-screen w-screen"
        style={{
          position: "fixed",
          pointerEvents: "none",
        }}
      />
      <h2 className="pt-20 text-6xl font-bold uppercase text-white sm:text-7xl md:text-8xl">
        Engage with Us
        <br />
        <span className="font-serif font-light lowercase italic">or</span> Our
        Research
      </h2>
      <div className="grid text-white md:grid-cols-[0.2fr_1fr]">
        <div></div>
        <div className="mt-16 w-[80%]">
          <p className="text-xl">
            We are always looking for new collaborations and partnerships.
            <br />
            <br />
            If you are interested in our work or would like to learn more about
            our research, please reach out to us.
          </p>
          <div className="mt-16 space-y-2 text-xl">
            <p className="text-xl uppercase italic">Email</p>
            <h3 className="font-serif text-3xl mix-blend-difference md:text-5xl">
              sampleemail@email.com
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
