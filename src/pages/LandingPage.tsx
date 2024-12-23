import {
  DesktopHero,
  MobileHero,
  VideoHighlightMobile,
} from "@/components/hero";

export default function LandingPage() {
  return (
    <>
      <div className="flex h-[calc(100dvh-7rem)] w-full flex-col">
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
    </>
  );
}
