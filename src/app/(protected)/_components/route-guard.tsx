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
        const settingsData = result?.data?.data?.settings || null;
        const workingHours = result?.data?.data?.workingHours || [];

        // If no settings at all, force to profile tab
        if (!settingsData && !pathname.startsWith("/settings")) {
          router.replace("/settings?tab=profile");
          return;
        }

        // If settings exist but no working hours configured (no enabled day with timeSlots), force to working-hours
        const hasWorkingHours = Array.isArray(workingHours)
          ? workingHours.some(
              (wh: any) => wh.enabled && (wh.timeSlots || []).length > 0
            )
          : false;

        if (!hasWorkingHours && !pathname.startsWith("/settings")) {
          router.replace("/settings?tab=working-hours");
          return;
        }

        // If working hours ok but appointment defaults missing (defaultDuration falsy), force to appointments
        const hasAppointmentConfig = Boolean(settingsData?.defaultDuration);
        if (!hasAppointmentConfig && !pathname.startsWith("/settings")) {
          router.replace("/settings?tab=appointments");
          return;
        }
      } catch (err) {
        console.error("Erro ao verificar setup:", err);
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
