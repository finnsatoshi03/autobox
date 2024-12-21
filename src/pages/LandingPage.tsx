import { DesktopHero, MobileHero } from "@/components/hero";

export default function LandingPage() {
  return (
    <div className="flex h-[calc(100vh-5rem)] w-full flex-col">
      <section className="flex w-full flex-grow items-end">
        <div className="relative flex w-full flex-col">
          <div className="hidden md:block">
            <DesktopHero />
          </div>
          <div className="md:hidden">
            <MobileHero />
          </div>
        </div>
      </section>
    </div>
  );
}
