import { useEffect, useState } from "react";
import { Link, ExternalLink } from "lucide-react";

interface Section {
  id: string;
  title: string;
  level: "h2" | "h3"; // Track if it's a section or subsection
}

interface RecommendationLink {
  title: string;
  href: string;
  onClick?: () => void;
  isExternal?: boolean;
}

interface ContentTrackerProps {
  activeSection: string;
  recommendations?: RecommendationLink[];
}

export const ContentTracker = ({
  activeSection,
  recommendations = [],
}: ContentTrackerProps) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSubSection, setActiveSubSection] = useState<string | null>(null);

  // Find all section headers in the content
  useEffect(() => {
    // Wait a bit for the content to be rendered
    const timer = setTimeout(() => {
      const findSections = () => {
        // Get all h2 and h3 elements
        const headers = Array.from(document.querySelectorAll("h2[id], h3[id]"));

        if (headers.length === 0) {
          // If no headers with IDs are found, try again shortly
          setTimeout(findSections, 200);
          return;
        }

        const sectionsFound = headers.map((header) => ({
          id: header.id,
          title: header.textContent || "",
          level: header.tagName.toLowerCase() as "h2" | "h3",
        }));

        setSections(sectionsFound);

        // Set initial active section
        const visibleHeaders = Array.from(headers).filter((header) => {
          const rect = header.getBoundingClientRect();
          return rect.top >= 0 && rect.top <= 300;
        });

        if (visibleHeaders.length > 0) {
          setActiveSubSection(visibleHeaders[0].id);
        }
      };

      findSections();
    }, 300);

    return () => clearTimeout(timer);
  }, [activeSection]);

  // Check which section is in view on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headers = Array.from(document.querySelectorAll("h2[id], h3[id]"));

      if (headers.length === 0) return;

      // Find the header that is currently visible in the viewport
      for (const header of headers) {
        const rect = header.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= 300) {
          setActiveSubSection(header.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    onClick?: () => void,
  ) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div className="h-full w-64 overflow-y-auto border-l border-gray-200 p-6">
      {sections.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-medium text-gray-500">
            ON THIS PAGE
          </h3>
          <nav className="space-y-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`block rounded px-2 py-1 text-sm hover:bg-gray-100 ${
                  activeSubSection === section.id
                    ? "font-medium text-lime-green"
                    : "text-gray-600"
                } ${section.level === "h3" ? "ml-3" : ""}`}
              >
                {section.title}
              </a>
            ))}
          </nav>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-sm font-medium text-gray-500">
            RECOMMENDED
          </h3>
          <nav className="space-y-2">
            {recommendations.map((rec, index) => (
              <a
                key={index}
                href={rec.href}
                onClick={(e) => handleLinkClick(e, rec.onClick)}
                target={rec.isExternal ? "_blank" : undefined}
                rel={rec.isExternal ? "noopener noreferrer" : undefined}
                className="flex items-center gap-2 rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
              >
                {rec.isExternal ? (
                  <ExternalLink size={14} className="text-gray-400" />
                ) : (
                  <Link size={14} className="text-gray-400" />
                )}
                {rec.title}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};
