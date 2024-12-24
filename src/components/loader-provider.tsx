import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingProviderProps {
  children: React.ReactNode;
  isLoading: boolean;
}

interface PageTransitionProps {
  children: React.ReactNode;
}

const LoadingProvider = ({
  children,
  isLoading: externalLoading,
}: LoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure minimum 2 seconds loading time
    const minLoadingTime = setTimeout(() => {
      if (!externalLoading) {
        setIsLoading(false);
      }
    }, 2000);

    // Update loading state when external loading changes
    if (externalLoading) {
      setIsLoading(true);
    }

    return () => clearTimeout(minLoadingTime);
  }, [externalLoading]);

  return (
    <div className="relative bg-black">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" />
        ) : (
          <PageTransition key="page">{children}</PageTransition>
        )}
      </AnimatePresence>
    </div>
  );
};

const LoadingScreen = (): JSX.Element => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      exit={{
        y: "-100%",
        transition: {
          duration: 0.8,
          ease: [0.645, 0.045, 0.355, 1],
        },
      }}
    >
      <img
        src="/images/loader.gif"
        alt="Loading..."
        className="size-[60vw] md:size-[50vh]"
      />
    </motion.div>
  );
};

const PageTransition = ({ children }: PageTransitionProps): JSX.Element => {
  return (
    <motion.div
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
      // transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
};

export type { LoadingProviderProps, PageTransitionProps };
export default LoadingProvider;
