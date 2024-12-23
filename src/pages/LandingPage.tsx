import {
  DesktopHero,
  MobileHero,
  VideoHighlightMobile,
} from "@/components/hero";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function LandingPage() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      // Animate to revealed state
      controls.start({
        height: "100vh",
        width: "100%",
        borderRadius: 0,
        transition: {
          duration: 1,
          ease: "easeOut",
        },
      });
    } else {
      // Animate to initial state
      controls.start({
        height: "20vh",
        width: "50vw",
        borderRadius: "5rem",
        transition: {
          duration: 1,
          ease: "easeIn",
        },
      });
    }
  }, [controls, inView]);

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="mb-4 flex h-[calc(100dvh-7rem)] w-full flex-col">
        <section className="flex w-full items-end md:flex-grow">
          <div className="relative flex w-full flex-col">
            <div className="hidden md:block">
              <DesktopHero />
            </div>
            <div className="pt-56 md:hidden">
              <VideoHighlightMobile />
              <MobileHero />
            </div>
          </div>
        </section>
      </div>

      {/* Video Section */}
      <div className="relative -mx-4 mt-12 flex h-[150vh] justify-center">
        <motion.div
          ref={ref}
          animate={controls}
          initial={{
            height: "20vh",
            width: "100%",
          }}
          className="sticky left-0 top-0 overflow-hidden"
        >
          <video
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/videos/playground-highlight.mp4" type="video/mp4" />
          </video>
        </motion.div>
      </div>

      {/* Next Section */}
      <div className="h-screen">
        <div className="container mx-auto p-8">
          <h2 className="text-3xl font-bold">Next Section</h2>
        </div>
      </div>
    </div>
  );
}
