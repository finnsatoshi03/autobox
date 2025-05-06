import React from "react";

interface ContentLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const ContentLayout = ({
  title,
  subtitle,
  children,
}: ContentLayoutProps) => {
  return (
    <div className="max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="mb-6 text-lg text-gray-600">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
};

export const CodeBlock = ({ children }: { children: string }) => {
  return (
    <pre className="my-4 overflow-x-auto rounded-lg bg-gray-100 p-4 text-sm">
      <code>{children}</code>
    </pre>
  );
};

interface HeaderProps {
  children: React.ReactNode;
  id?: string;
}

export const SectionHeader = ({ children, id }: HeaderProps) => {
  // Generate an ID from the text content if not provided
  const headerId =
    id ||
    (typeof children === "string"
      ? children.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : undefined);

  return (
    <h2 id={headerId} className="mb-3 mt-8 text-xl font-semibold text-gray-900">
      {children}
    </h2>
  );
};

export const SubsectionHeader = ({ children, id }: HeaderProps) => {
  // Generate an ID from the text content if not provided
  const headerId =
    id ||
    (typeof children === "string"
      ? children.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : undefined);

  return (
    <h3 id={headerId} className="mb-2 mt-6 text-lg font-medium text-gray-900">
      {children}
    </h3>
  );
};

export const Paragraph = ({ children }: { children: React.ReactNode }) => {
  return <p className="mb-4 text-gray-700">{children}</p>;
};
