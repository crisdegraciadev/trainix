import React from "react";

type TablePageLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
};

export default function DataTablePageLayout({
  title,
  subtitle,
  children,
}: TablePageLayoutProps) {
  return (
    <>
      <header className="mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <h3 className="text-sm text-muted-foreground">{subtitle}</h3>
      </header>
      <main className="mt-4">{children}</main>
    </>
  );
}
