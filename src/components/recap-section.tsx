import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import { useLayoutContext } from "@/layout/AppLayout";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function AnimatedRecapSection() {
  const navigate = useNavigate();
  const { scrollX } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  const { setIsDark } = useLayoutContext();

  // Create smooth parallax effect for the text
  const textX = useTransform(scrollX, [0, 1000], [0, -300]);
  const imageX = useTransform(scrollX, [0, 1000], [0, -150]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Create ScrollTrigger for initial dark mode toggle
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top center",
        end: "top center",
        onEnter: () => setIsDark(true),
        onEnterBack: () => setIsDark(true), // Keep dark when scrolling back up
        onLeave: () => setIsDark(false), // Only turn off when scrolling down past the end point
      });
    });

    // Cleanup
    return () => {
      ctx.revert();
    };
  }, [setIsDark]);

  return (
    <div
      ref={containerRef}
      className="relative -mx-4 h-screen w-screen cursor-pointer overflow-hidden bg-black"
      onClick={() => navigate("/playground")}
    >
      {/* Background text that repeats */}
      <motion.div
        className="absolute inset-0 z-50 flex items-center whitespace-nowrap mix-blend-difference"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className="mx-4 text-[200px] font-bold text-white/5">
            PLAYGROUND
          </span>
        ))}
      </motion.div>
      {/* Main content with parallax effect */}
      <motion.div
        className="absolute z-50 flex h-full w-full flex-col items-center justify-center bg-transparent px-4 text-white mix-blend-difference"
        style={{ x: textX }}
      >
        <motion.p
          className="text-lg uppercase md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Let's get started on our
        </motion.p>
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          <motion.h2
            className="text-5xl font-bold sm:text-8xl md:text-9xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            PLAYGROUND
          </motion.h2>
          <motion.img
            src="/images/loader.gif"
            className="h-32"
            style={{ x: imageX }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
