import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useLayoutContext } from "@/layout/AppLayout";

gsap.registerPlugin(ScrollTrigger);

export const wordAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.7,
      ease: "easeOut",
    },
  }),
};

const paragraphAnimation = {
  hidden: { opacity: 0, y: 50 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5 + index * 0.2,
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1.0],
    },
  }),
};

const AnimatedAboutSection = () => {
  const { isDark } = useLayoutContext();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<HTMLSpanElement>(null);
  const boxRef = useRef<HTMLSpanElement>(null);
  const annotationRef = useRef<HTMLSpanElement>(null);
  const simplifiedRef = useRef<HTMLSpanElement>(null);
  const star1Ref = useRef<HTMLImageElement>(null);
  const star2Ref = useRef<HTMLImageElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top center+=150",
        end: "bottom center",
        toggleActions: "play none none none",
        onEnter: () => {
          section.classList.add("animate-content");
          setHasAnimated(true);
        },
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const paragraphs = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ac ante augue. Vestibulum dapibus, ipsum nec pellentesque consectetur, erat odio porttitor justo, ut volutpat purus tellus quis sapien. Vestibulum in nunc eu ante vulputate ornare ut non velit. Suspendisse laoreet mi vitae bibendum pulvinar. Maecenas faucibus nibh a metus varius mattis. Curabitur volutpat ac dui id congue. Donec maximus placerat scelerisque.",
    "Vivamus a dui quis mauris pretium pharetra. Nulla faucibus est id ipsum aliquet, quis aliquam elit vehicula. Quisque dignissim, arcu id maximus pellentesque, sapien urna feugiat odio, in tristique tellus purus eget orci. Pellentesque nec eros ante. Cras lacinia arcu in dui hendrerit, vel sodales neque blandit. Donec volutpat at tortor at aliquet. Aenean feugiat lectus sagittis nulla imperdiet efficitur. Nullam in neque mauris. Nam ac tellus finibus, dignissim odio ut, condimentum libero. Etiam malesuada nisl metus, ac vestibulum ligula vulputate quis. Vestibulum ac ante eu quam mollis tempor sit amet at elit. Donec sagittis iaculis sapien, vitae interdum mauris tristique ut. Integer erat quam, volutpat malesuada tortor sed, pulvinar faucibus mi. Sed molestie ante sed volutpat placerat. Fusce aliquam odio eu fermentum fermentum.",
  ];

  const shouldAnimate =
    hasAnimated || sectionRef.current?.classList.contains("animate-content");

  return (
    <div
      ref={sectionRef}
      className={`relative -mx-4 -mt-10 w-screen pb-16 transition-colors duration-300 ease-in-out ${isDark ? "bg-black text-white" : "bg-white text-black"}`}
    >
      <div className="p-8">
        <div ref={headerRef} className="overflow-hidden">
          <h2 className="text-[min(12vw,6rem)] uppercase leading-none md:text-[clamp(1.5rem,6vw,8rem)]">
            <motion.span
              ref={autoRef}
              custom={0}
              initial="hidden"
              animate={shouldAnimate ? "visible" : "hidden"}
              variants={wordAnimation}
              className="inline-block"
            >
              auto{" "}
            </motion.span>
            <motion.span
              ref={boxRef}
              custom={1}
              initial="hidden"
              animate={shouldAnimate ? "visible" : "hidden"}
              variants={wordAnimation}
              className="relative font-bold text-lime-green"
            >
              b
              <motion.img
                ref={star1Ref}
                src="/images/star.gif"
                className="absolute -left-2 top-8 size-4 md:-left-4 md:size-10"
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  shouldAnimate
                    ? {
                        opacity: 1,
                        scale: 1,
                        transition: { delay: 1.3, duration: 0.5 },
                      }
                    : { opacity: 0, scale: 0 }
                }
              />
              <span className="inline-block rotate-[22deg] tracking-[-0.2em]">
                o
              </span>
              x
              <motion.img
                ref={star2Ref}
                src="/images/star.gif"
                className="absolute -right-4 bottom-8 size-4 md:-right-6 md:size-10"
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  shouldAnimate
                    ? {
                        opacity: 1,
                        scale: 1,
                        transition: { delay: 1.3, duration: 0.5 },
                      }
                    : { opacity: 0, scale: 0 }
                }
              />
            </motion.span>{" "}
            <motion.span
              ref={annotationRef}
              custom={2}
              initial="hidden"
              animate={shouldAnimate ? "visible" : "hidden"}
              variants={wordAnimation}
              className="inline-block"
            >
              annotation,{" "}
            </motion.span>
            <br />
            <motion.span
              ref={simplifiedRef}
              custom={3}
              initial="hidden"
              animate={shouldAnimate ? "visible" : "hidden"}
              variants={wordAnimation}
              className="inline-block"
            >
              simplified
            </motion.span>
          </h2>
        </div>

        <div className="grid md:grid-cols-[0.2fr_1fr]">
          <div></div>
          <div className="mt-16 w-[90%] space-y-10 text-lg md:text-xl">
            {paragraphs.map((text, index) => (
              <motion.p
                key={index}
                custom={index}
                initial="hidden"
                animate={shouldAnimate ? "visible" : "hidden"}
                variants={paragraphAnimation}
              >
                {text}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedAboutSection;
