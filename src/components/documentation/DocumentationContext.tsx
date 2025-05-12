import { createContext } from "react";

interface DocumentationContextType {
  handleSectionChange: (section: string) => void;
}

export const DocumentationContext = createContext<DocumentationContextType>({
  handleSectionChange: () => {},
});
