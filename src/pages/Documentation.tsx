import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/documentation/Sidebar";
import { ContentTracker } from "@/components/documentation/ContentTracker";
import { DocumentationContext } from "@/components/documentation/DocumentationContext";

// Content components
import { GettingStarted } from "@/components/documentation/content/GettingStarted";
import { ProcessOverview } from "@/components/documentation/content/ProcessOverview";
import { BaseImageUpload } from "@/components/documentation/content/BaseImageUpload";
import { ImageLabeling } from "@/components/documentation/content/ImageLabeling";
import { TargetImageUpload } from "@/components/documentation/content/TargetImageUpload";
import { AnalysisResults } from "@/components/documentation/content/AnalysisResults";
import { ApiOverview } from "@/components/documentation/content/ApiOverview";
import { ApiSift } from "@/components/documentation/content/ApiSift";
import { ApiRequest } from "@/components/documentation/content/ApiRequest";
import { ApiResponse } from "@/components/documentation/content/ApiResponse";
import { ApiPolling } from "@/components/documentation/content/ApiPolling";
import { AdvancedUsage } from "@/components/documentation/content/AdvancedUsage";

// Define interfaces for recommendation objects
interface Recommendation {
  title: string;
  href: string;
  onClick?: () => void;
  isExternal?: boolean;
}

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  // Memoize the setActiveSection function for recommendations
  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
  }, []);

  // Update recommendations based on active section
  useEffect(() => {
    // Define recommended links based on the current section
    const getRecommendations = () => {
      switch (activeSection) {
        case "getting-started":
          return [
            {
              title: "Process Overview",
              href: "#",
              onClick: () => handleSectionChange("process-overview"),
            },
            {
              title: "API Documentation",
              href: "#",
              onClick: () => handleSectionChange("api-overview"),
            },
            // {
            //   title: "GitHub Repository",
            //   href: "https://github.com/example/repo",
            //   isExternal: true,
            // },
          ];
        case "process-overview":
          return [
            {
              title: "Base Image Upload",
              href: "#",
              onClick: () => handleSectionChange("process-base-upload"),
            },
            {
              title: "SIFT Algorithm",
              href: "#",
              onClick: () => handleSectionChange("api-sift"),
            },
          ];
        case "api-overview":
          return [
            {
              title: "API Request Format",
              href: "#",
              onClick: () => handleSectionChange("api-request"),
            },
            {
              title: "Asynchronous Processing",
              href: "#",
              onClick: () => handleSectionChange("api-polling"),
            },
            {
              title: "API Response Format",
              href: "#",
              onClick: () => handleSectionChange("api-response"),
            },
            {
              title: "Advanced Usage",
              href: "#",
              onClick: () => handleSectionChange("advanced"),
            },
          ];
        case "api-request":
          return [
            {
              title: "API Overview",
              href: "#",
              onClick: () => handleSectionChange("api-overview"),
            },
            {
              title: "Asynchronous Processing",
              href: "#",
              onClick: () => handleSectionChange("api-polling"),
            },
            {
              title: "API Response Format",
              href: "#",
              onClick: () => handleSectionChange("api-response"),
            },
          ];
        case "api-response":
          return [
            {
              title: "API Overview",
              href: "#",
              onClick: () => handleSectionChange("api-overview"),
            },
            {
              title: "Asynchronous Processing",
              href: "#",
              onClick: () => handleSectionChange("api-polling"),
            },
            {
              title: "API Request Format",
              href: "#",
              onClick: () => handleSectionChange("api-request"),
            },
          ];
        case "api-polling":
          return [
            {
              title: "API Overview",
              href: "#",
              onClick: () => handleSectionChange("api-overview"),
            },
            {
              title: "API Request Format",
              href: "#",
              onClick: () => handleSectionChange("api-request"),
            },
            {
              title: "API Response Format",
              href: "#",
              onClick: () => handleSectionChange("api-response"),
            },
          ];
        case "advanced":
          return [
            {
              title: "Getting Started",
              href: "#",
              onClick: () => handleSectionChange("getting-started"),
            },
            {
              title: "API Documentation",
              href: "#",
              onClick: () => handleSectionChange("api-overview"),
            },
          ];
        default:
          return [
            {
              title: "Getting Started",
              href: "#",
              onClick: () => handleSectionChange("getting-started"),
            },
            {
              title: "API Documentation",
              href: "#",
              onClick: () => handleSectionChange("api-overview"),
            },
          ];
      }
    };

    setRecommendations(getRecommendations());
  }, [activeSection, handleSectionChange]);

  const renderContent = () => {
    switch (activeSection) {
      case "getting-started":
        return <GettingStarted />;
      case "process-overview":
        return <ProcessOverview />;
      case "process-base-upload":
        return <BaseImageUpload />;
      case "process-labeling":
        return <ImageLabeling />;
      case "process-target-upload":
        return <TargetImageUpload />;
      case "process-results":
        return <AnalysisResults />;
      case "api-overview":
        return <ApiOverview />;
      case "api-sift":
        return <ApiSift />;
      case "api-request":
        return <ApiRequest />;
      case "api-response":
        return <ApiResponse />;
      case "api-polling":
        return <ApiPolling />;
      case "advanced":
        return <AdvancedUsage />;
      default:
        return <GettingStarted />;
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-white text-black">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <DocumentationContext.Provider value={{ handleSectionChange }}>
        <div className="flex-1 overflow-y-auto p-8">{renderContent()}</div>
      </DocumentationContext.Provider>
      <ContentTracker
        activeSection={activeSection}
        recommendations={recommendations}
      />
    </div>
  );
}
