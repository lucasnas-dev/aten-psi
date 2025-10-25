import { Header } from "@/app/(protected)/_components/header";
import { Sidebar } from "@/app/(protected)/_components/sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <Sidebar />
      <div className="ml-44 flex flex-1 flex-col">
        <Header />
        <main className="bg-muted/30 flex-1 overflow-y-auto px-6 py-4">
          {children}
        </main>
      </div>
    </div>
  );
}
