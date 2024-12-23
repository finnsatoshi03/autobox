import { motion } from "framer-motion";

const HERO_TEXT = {
  desktop: [
    "transforming image",
    "annotation for the future",
    "of machine learning",
  ],
  mobile: [
    "transforming image",
    "annotation",
    "for the future of machine learning",
  ],
};

const ANIMATION_SEQUENCE = [
  "transforming",
  "image",
  "video",
  "annotation",
  "for",
  "the",
  "future",
  "of",
  "machine",
  "learning",
  "gif",
];

const getAnimationIndex = (word: string): number => {
  const lowercaseWord = word.toLowerCase();
  return ANIMATION_SEQUENCE.indexOf(lowercaseWord);
};

const wordAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.3,
      duration: 0.7,
      ease: "easeOut",
    },
  }),
};

// Animation for complete lines (mobile)
const lineAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.3,
      duration: 0.7,
      ease: "easeOut",
    },
  }),
};

export const VideoHighlightDesktop = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{
      duration: 0.8,
      delay: 0.6, // Appears third in sequence
    }}
    className="hidden md:relative md:block md:h-[clamp(4rem,6vw,8rem)] md:w-[10rem]"
  >
    <video
      className="h-full w-full object-cover md:rounded-xl"
      autoPlay
      loop
      muted
      playsInline
    >
      <source src="/videos/hero-highlight.mp4" type="video/mp4" />
      <span className="sr-only">Animated highlight video</span>
    </video>
  </motion.div>
);

export const VideoHighlightMobile = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, delay: 1.0 }}
    className="absolute top-[5%] -mx-4 h-56 w-screen md:hidden"
  >
    <div className="relative h-full w-full overflow-hidden">
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={lineAnimation}
        custom={0}
        className="absolute -bottom-[min(6vw,8rem)] ml-4 whitespace-nowrap text-wrap text-[min(12vw,6rem)] uppercase leading-none text-white md:text-[clamp(1.5rem,6vw,8rem)]"
      >
        transforming
      </motion.h1>
      <video
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/hero-highlight.mp4" type="video/mp4" />
        <span className="sr-only">Animated highlight video</span>
      </video>
    </div>
  </motion.div>
);

export const GifHolder = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      duration: 0.8,
      delay: 3.0, // Appears last in sequence
      ease: "easeOut",
    }}
    className="relative h-[min(12vw,7rem)] md:h-[clamp(3.5rem,7vw,9rem)]"
  >
    <img
      src="/images/b-mo.gif"
      alt="BMO from Adventure Time"
      className="h-full w-full object-cover"
    />
  </motion.div>
);

export const AnimatedWord = ({ word }: { word: string }) => (
  <motion.span
    initial="hidden"
    animate="visible"
    variants={wordAnimation}
    custom={getAnimationIndex(word)}
    className="mr-[0.25em] inline-block"
  >
    {word}
  </motion.span>
);

export const HeroText = ({
  text,
  alignment = "left",
  isLast = false,
}: {
  text: string;
  alignment?: "right" | "left" | "center";
  isLast?: boolean;
}) => {
  const words = text.split(" ");
  const lastWord = isLast ? words[words.length - 1] : null;
  const textWithoutLastWord = isLast ? words.slice(0, -1).join(" ") : null;

  return (
    <h1
      className={`w-fit whitespace-nowrap text-wrap text-[min(12vw,6rem)] uppercase leading-none text-black md:text-[clamp(1.5rem,6vw,8rem)] ${
        alignment === "right" ? "text-right" : ""
      } ${isLast ? "relative" : ""}`}
    >
      {isLast ? (
        <>
          <div className="md:hidden">
            <div className="flex flex-col gap-2">
              <motion.span
                initial="hidden"
                animate="visible"
                variants={wordAnimation}
                custom={getAnimationIndex(words[0])} // Use first word for timing
              >
                {textWithoutLastWord}
              </motion.span>
              <motion.span
                initial="hidden"
                animate="visible"
                variants={wordAnimation}
                custom={getAnimationIndex(lastWord || "")}
                className="relative pr-[12%]"
              >
                {lastWord}
                <div className="absolute -right-[1%] top-[0.5%]">
                  <GifHolder />
                </div>
              </motion.span>
            </div>
          </div>
          <div className="hidden md:block">
            {words.map((word, idx) => (
              <motion.span
                key={idx}
                initial="hidden"
                animate="visible"
                variants={wordAnimation}
                custom={getAnimationIndex(word)}
                className="mr-[0.25em] inline-block"
              >
                {word}
              </motion.span>
            ))}
            <div className="absolute -right-[clamp(3.5rem,7vw,9rem)] top-[0.5%]">
              <GifHolder />
            </div>
          </div>
        </>
      ) : (
        <div>
          {words.map((word, idx) => (
            <motion.span
              key={idx}
              initial="hidden"
              animate="visible"
              variants={wordAnimation}
              custom={getAnimationIndex(word)}
              className="mr-[0.25em] inline-block"
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}
    </h1>
  );
};

export const MobileHero = () => {
  const lastIndex = HERO_TEXT.mobile.length - 1;
  return (
    <>
      <HeroText text={HERO_TEXT.mobile[0]} />
      {HERO_TEXT.mobile.slice(1).map((text, index) => (
        <HeroText
          key={index}
          text={text}
          alignment={index === HERO_TEXT.mobile.length - 2 ? "right" : "left"}
          isLast={index === lastIndex - 1}
        />
      ))}
    </>
  );
};

export const DesktopHero = () => {
  const lastIndex = HERO_TEXT.desktop.length - 1;
  return (
    <>
      <div className="relative z-20 flex w-full flex-col md:flex-row md:items-center md:gap-8">
        <HeroText text={HERO_TEXT.desktop[0]} />
        <VideoHighlightDesktop />
      </div>
      <div className="relative">
        {HERO_TEXT.desktop.slice(1).map((text, index) => (
          <HeroText key={index} text={text} isLast={index === lastIndex - 1} />
        ))}
      </div>
    </>
  );
};
