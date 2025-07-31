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
      <div className="ml-48 flex flex-1 flex-col">
        <Header />
        <main className="bg-background flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
