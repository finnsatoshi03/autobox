import { useState } from "react";
import { Sidebar } from "@/components/documentation/Sidebar";

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
import { AdvancedUsage } from "@/components/documentation/content/AdvancedUsage";

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("getting-started");

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
      <div className="flex-1 overflow-y-auto p-8">{renderContent()}</div>
    </div>
  );
}
