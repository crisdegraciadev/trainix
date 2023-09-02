import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = false;

  return (
    <>
      <Navbar />
      <div className="m-8">{children}</div>
      <Toaster />
    </>
  );
}
