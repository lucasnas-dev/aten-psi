import { ReactNode } from "react";

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
