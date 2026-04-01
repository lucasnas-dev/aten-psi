import { Header } from "@/app/(protected)/_components/header";
import { Sidebar } from "@/app/(protected)/_components/sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell bg-background flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="bg-muted/30 min-w-0 flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4">
          {children}
        </main>
      </div>
    </div>
  );
}
