import { Badge } from "@/components/ui/badge";

type PatientStatus =
  | "active"
  | "inactive"
  | "completed"
  | "suspended"
  | "archived";

const statusConfig: Record<
  PatientStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Ativo",
    className: "border-green-200 bg-green-100 text-green-700",
  },
  inactive: {
    label: "Arquivado",
    className: "border-orange-200 bg-orange-100 text-orange-700",
  },
  completed: {
    label: "Concluído",
    className: "border-blue-200 bg-blue-100 text-blue-700",
  },
  suspended: {
    label: "Suspenso",
    className: "border-yellow-200 bg-yellow-100 text-yellow-700",
  },
  archived: {
    label: "Arquivado",
    className: "border-orange-200 bg-orange-100 text-orange-700",
  },
};

export function PatientStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as PatientStatus] || statusConfig.inactive;

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
