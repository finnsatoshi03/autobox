import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Code,
  Play,
  FileText,
  Zap,
} from "lucide-react";

interface SidebarItemProps {
  title: string;
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
  children?: React.ReactNode;
}

const SidebarItem = ({
  title,
  active,
  icon,
  onClick,
  children,
}: SidebarItemProps) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = !!children;

  return (
    <div className="mb-1">
      <div
        className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm ${
          active ? "bg-lime-green/10" : "hover:bg-gray-100"
        }`}
        onClick={() => {
          onClick();
          if (hasChildren) {
            setExpanded(!expanded);
          }
        }}
      >
        <span className="text-gray-500">{icon}</span>
        <span className="flex-1">{title}</span>
        {hasChildren && (
          <span className="text-gray-400">
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
      </div>
      {hasChildren && expanded && (
        <div className="ml-6 mt-1 border-l border-gray-200 pl-3">
          {children}
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  return (
    <div className="h-full w-64 border-r border-gray-200 px-3 py-6">
      <div className="mb-6 flex items-center gap-2 px-3">
        <BookOpen size={20} className="text-lime-green" />
        <h2 className="text-lg font-bold">Documentation</h2>
      </div>

      <div className="space-y-1">
        <SidebarItem
          title="Getting Started"
          active={activeSection === "getting-started"}
          icon={<Play size={18} />}
          onClick={() => onSectionChange("getting-started")}
        />

        <SidebarItem
          title="Process Steps"
          active={activeSection.startsWith("process")}
          icon={<FileText size={18} />}
          onClick={() => onSectionChange("process-overview")}
        >
          <SidebarItem
            title="Base Image Upload"
            active={activeSection === "process-base-upload"}
            icon={<ChevronRight size={16} />}
            onClick={() => onSectionChange("process-base-upload")}
          />
          <SidebarItem
            title="Image Labeling"
            active={activeSection === "process-labeling"}
            icon={<ChevronRight size={16} />}
            onClick={() => onSectionChange("process-labeling")}
          />
          <SidebarItem
            title="Target Image Upload"
            active={activeSection === "process-target-upload"}
            icon={<ChevronRight size={16} />}
            onClick={() => onSectionChange("process-target-upload")}
          />
          <SidebarItem
            title="Analysis Results"
            active={activeSection === "process-results"}
            icon={<ChevronRight size={16} />}
            onClick={() => onSectionChange("process-results")}
          />
        </SidebarItem>

        <SidebarItem
          title="API Reference"
          active={activeSection.startsWith("api")}
          icon={<Code size={18} />}
          onClick={() => onSectionChange("api-overview")}
        >
          <SidebarItem
            title="SIFT Analysis"
            active={activeSection === "api-sift"}
            icon={<ChevronRight size={16} />}
            onClick={() => onSectionChange("api-sift")}
          />
          <SidebarItem
            title="Request Format"
            active={activeSection === "api-request"}
            icon={<ChevronRight size={16} />}
            onClick={() => onSectionChange("api-request")}
          />
          <SidebarItem
            title="Response Format"
            active={activeSection === "api-response"}
            icon={<ChevronRight size={16} />}
            onClick={() => onSectionChange("api-response")}
          />
          <SidebarItem
            title="Asynchronous Processing"
            active={activeSection === "api-polling"}
            icon={<ChevronRight size={16} />}
            onClick={() => onSectionChange("api-polling")}
          />
        </SidebarItem>

        <SidebarItem
          title="Advanced Usage"
          active={activeSection === "advanced"}
          icon={<Zap size={18} />}
          onClick={() => onSectionChange("advanced")}
        />
      </div>
    </div>
  );
};
