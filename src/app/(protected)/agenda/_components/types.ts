export type StatusConsulta =
  | "agendada"
  | "confirmada"
  | "em_andamento"
  | "concluida"
  | "cancelada"
  | "faltou";

export type TipoConsulta =
  | "avaliacao_inicial"
  | "atendimento"
  | "online"
  | "presencial";

export type Consulta = {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  data: string; // YYYY-MM-DD
  horario: string; // HH:MM
  duracao: number; // em minutos
  tipo: TipoConsulta;
  modalidade: "presencial" | "online";
  status: StatusConsulta;
  observacoes?: string;
  valor?: number;
  createdAt: string;
  updatedAt: string;
};

export type ViewMode = "month" | "week" | "day" | "list";

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: StatusConsulta;
  tipo: TipoConsulta;
  modalidade: "presencial" | "online";
  pacienteNome: string;
  observacoes?: string;
};

export type TimeSlot = {
  time: string;
  available: boolean;
  consulta?: Consulta;
};

export type DaySchedule = {
  date: string;
  timeSlots: TimeSlot[];
};
