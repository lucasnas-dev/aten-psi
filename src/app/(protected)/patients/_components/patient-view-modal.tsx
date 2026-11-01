"use client";

import {
  CalendarDays,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { PatientStatusBadge } from "./patient-status-badge";
import { Patient } from "./types";

interface PatientViewModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PatientViewModal({
  patient,
  isOpen,
  onClose,
}: PatientViewModalProps) {
  if (!patient) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-base font-medium text-blue-600 sm:text-lg">
              {getInitials(patient.name)}
            </div>
            <div>
              <div className="text-lg font-semibold sm:text-xl">
                {patient.name}
              </div>
              <div className="text-muted-foreground text-sm">
                Informações do paciente
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <PatientStatusBadge status={patient.status} />
            <div className="text-muted-foreground text-sm">
              Cadastrado em {formatDate(patient.createdAt)}
            </div>
          </div>

          <Separator />

          {/* Informações Pessoais */}
          <div className="space-y-4">
            <h3 className="text-base font-medium sm:text-lg">
              Informações Pessoais
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <User className="text-muted-foreground h-5 w-5" />
                <div>
                  <div className="text-sm font-medium">Idade</div>
                  <div className="text-muted-foreground text-sm">
                    {calculateAge(patient.birthDate)} anos
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="text-muted-foreground h-5 w-5" />
                <div>
                  <div className="text-sm font-medium">Data de Nascimento</div>
                  <div className="text-muted-foreground text-sm">
                    {formatDate(patient.birthDate)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="text-muted-foreground h-5 w-5" />
                <div>
                  <div className="text-sm font-medium">Gênero</div>
                  <div className="text-muted-foreground text-sm">
                    {patient.gender}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações de Contato */}
          <div className="space-y-4">
            <h3 className="text-base font-medium sm:text-lg">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="text-muted-foreground h-5 w-5" />
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-muted-foreground text-sm">
                    {patient.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-muted-foreground h-5 w-5" />
                <div>
                  <div className="text-sm font-medium">Telefone</div>
                  <div className="text-muted-foreground text-sm">
                    {patient.phone}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <div className="text-sm font-medium">Endereço</div>
                  <div className="text-muted-foreground text-sm">
                    {patient.address}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notas */}
          {patient.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="text-muted-foreground h-5 w-5" />
                  <h3 className="text-base font-medium sm:text-lg">
                    Observações
                  </h3>
                </div>
                <div className="bg-muted rounded-md p-4 text-sm">
                  {patient.notes}
                </div>
              </div>
            </>
          )}

          {/* Última Consulta */}
          {patient.lastConsultation && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-base font-medium sm:text-lg">
                  Última Consulta
                </h3>
                <div className="text-muted-foreground text-sm">
                  {formatDate(patient.lastConsultation)}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={onClose}>Editar Paciente</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
