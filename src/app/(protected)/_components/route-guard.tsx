"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getSettings } from "@/actions/get-settings";
import { useSession } from "@/lib/auth-client";

export function ProtectedRouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isActive = true;

    const verifySetup = async () => {
      if (!session?.user?.id) {
        if (isActive) {
          setIsChecking(false);
        }
        return;
      }

      setIsChecking(true);

      try {
        const result = await getSettings();
        const hasSettings = Boolean(result?.data?.data?.settings);

        if (!hasSettings && !pathname.startsWith("/settings")) {
          router.replace("/settings");
          return;
        }
      } catch {
        if (!pathname.startsWith("/settings")) {
          router.replace("/settings");
          return;
        }
      } finally {
        if (isActive) {
          setIsChecking(false);
        }
      }
    };

    verifySetup();

    return () => {
      isActive = false;
    };
  }, [pathname, router, session?.user?.id]);

  if (isChecking) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2" />
          <p className="text-muted-foreground mt-2 text-sm">
            Verificando seu cadastro...
          </p>
        </div>
      </div>
    );
  }

  return children;
}
