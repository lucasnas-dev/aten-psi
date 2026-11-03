import { ReactNode } from "react";

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex w-full max-w-5xl min-w-0 flex-col">
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
