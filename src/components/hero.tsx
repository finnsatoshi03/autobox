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

export const VideoHighlight = () => (
  <div className="hidden md:relative md:block md:h-[clamp(4rem,6vw,8rem)] md:w-[10rem]">
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
  </div>
);

export const GifHolder = () => (
  <div className="absolute -top-8 right-4 md:-top-16 md:right-8 lg:right-16">
    <div className="relative h-20 w-20 md:h-32 md:w-32 lg:h-40 lg:w-40">
      <img
        src="/images/b-mo.gif"
        alt="BMO from Adventure Time"
        className="h-full w-full rounded-2xl object-cover shadow-lg ring-2"
      />
    </div>
  </div>
);

export const HeroText = ({
  text,
  alignment = "left",
}: {
  text: string;
  alignment?: "right" | "left" | "center";
}) => (
  <h1
    className={`whitespace-nowrap text-wrap text-[min(12vw,6rem)] uppercase leading-none text-black md:text-[clamp(1.5rem,6vw,8rem)] ${
      alignment === "right" ? "text-right" : ""
    }`}
  >
    {text}
  </h1>
);

export const DesktopHero = () => (
  <div className="relative">
    <div className="relative z-20 flex w-full flex-col md:flex-row md:items-center md:gap-8">
      <HeroText text={HERO_TEXT.desktop[0]} />
      <VideoHighlight />
    </div>
    {HERO_TEXT.desktop.slice(1).map((text, index) => (
      <HeroText key={index} text={text} />
    ))}
    <GifHolder />
  </div>
);

export const MobileHero = () => (
  <>
    <HeroText text={HERO_TEXT.mobile[0]} />
    {HERO_TEXT.mobile.slice(1).map((text, index) => (
      <HeroText
        key={index}
        text={text}
        alignment={index === HERO_TEXT.mobile.length - 2 ? "right" : "left"}
      />
    ))}
  </>
);
