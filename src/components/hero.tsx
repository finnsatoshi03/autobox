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

export const VideoHighlightDesktop = () => (
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

export const VideoHighlightMobile = () => (
  <div className="absolute top-[5%] -mx-4 h-56 w-screen md:hidden">
    <div className="relative h-full w-full overflow-hidden">
      <h1 className="absolute -bottom-[min(6vw,8rem)] ml-4 whitespace-nowrap text-wrap text-[min(12vw,6rem)] uppercase leading-none text-white md:text-[clamp(1.5rem,6vw,8rem)]">
        transforming
      </h1>
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
  </div>
);

export const GifHolder = () => (
  <div className="relative h-[min(12vw,7rem)] md:h-[clamp(3.5rem,7vw,9rem)]">
    <img
      src="/images/b-mo.gif"
      alt="BMO from Adventure Time"
      className="h-full w-full object-cover"
    />
  </div>
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
  const lastWord = isLast ? text.split(" ").pop() : null;
  const textWithoutLastWord = isLast
    ? text.split(" ").slice(0, -1).join(" ")
    : text;

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
              <span>{textWithoutLastWord}</span>
              <span className="relative pr-[12%]">
                {lastWord}
                <div className="absolute -right-[1%] top-[0.5%]">
                  <GifHolder />
                </div>
              </span>
            </div>
          </div>
          <div className="hidden md:block">
            {text}
            <div className="absolute -right-[clamp(3.5rem,7vw,9rem)] top-[0.5%]">
              <GifHolder />
            </div>
          </div>
        </>
      ) : (
        text
      )}
    </h1>
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
