import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function AnimatedContactSection() {
  const sectionRef = useRef(null);
  const leftHandRef = useRef(null);
  const rightHandRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Create different animations for mobile and desktop
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Desktop animation
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
    });

    mm.add("(max-width: 767px)", () => {
      // Mobile animation
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
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      mm.revert();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`relative -mx-4 min-h-screen w-screen overflow-x-hidden bg-black px-4 transition-colors duration-300`}
    >
      <h2 className="pt-20 text-6xl font-bold uppercase text-white sm:text-7xl md:text-8xl">
        Engage with Us
        <br />
        <span className="font-serif font-light lowercase italic">or</span> Our
        Research
      </h2>
      <div className="relative z-20 grid text-white md:grid-cols-[0.2fr_1fr]">
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
            <h3 className="font-serif text-3xl text-blue-600 md:text-5xl">
              sampleemail@email.com
            </h3>
          </div>
        </div>
      </div>
      <img
        ref={leftHandRef}
        src="/images/hands/left.png"
        alt="Vectorized Futuristic Interpretation of Left Hand from the Creation of Adam by Michael Angelo"
        className="absolute left-12 top-1/2 w-1/2 md:w-1/3"
      />
      <img
        ref={rightHandRef}
        src="/images/hands/right.png"
        alt="Vectorized Right Hand from the Creation of Adam by Michael Angelo"
        className="absolute -right-12 top-[10%] w-1/2 md:w-1/3"
      />
    </div>
  );
}
