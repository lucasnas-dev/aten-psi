"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  getConsultation,
  updateConsultation,
} from "@/actions/manage-consultation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { CalendarEvent } from "./types";

const editConsultationSchema = z.object({
  date: z.date({
    required_error: "Selecione uma data",
  }),
  time: z.string().min(1, "Informe o horário"),
  duration: z.string().min(1, "Duração é obrigatória"),
  type: z.enum([
    "triagem",
    "avaliacao_inicial",
    "atendimento",
    "avaliacao_psicologica",
    "devolutiva",
  ]),
  modality: z.enum(["presencial", "online"]),
  notes: z.string().optional(),
  value: z.string().optional(),
  status: z.enum([
    "agendada",
    "confirmada",
    "em_andamento",
    "concluida",
    "cancelada",
    "faltou",
  ]),
});

type EditConsultationFormData = z.infer<typeof editConsultationSchema>;

interface EditConsultationModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditConsultationModal({
  event,
  isOpen,
  onClose,
  onSuccess,
}: EditConsultationModalProps) {
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const { execute: executeUpdate, status: updateStatus } = useAction(
    updateConsultation,
    {
      onSuccess: () => {
        onSuccess?.();
        onClose();
      },
      onError: (err) => {
        console.error("Erro ao atualizar consulta:", err);
      },
    }
  );

  const { execute: executeGet } = useAction(getConsultation, {
    onSuccess: (result) => {
      if (result.data?.success && result.data.data) {
        const consultation = result.data.data;

        // Criar data no timezone local evitando conversão UTC
        const [year, month, day] = consultation.date.split("-").map(Number);
        const consultationDate = new Date(year, month - 1, day);

        form.reset({
          date: consultationDate,
          time: consultation.time,
          duration: consultation.duration,
          type: consultation.type as
            | "triagem"
            | "avaliacao_inicial"
            | "atendimento"
            | "avaliacao_psicologica"
            | "devolutiva",
          modality: consultation.modality as "presencial" | "online",
          notes: consultation.notes || "",
          value: consultation.value || "",
          status: consultation.status as
            | "agendada"
            | "confirmada"
            | "em_andamento"
            | "concluida"
            | "cancelada"
            | "faltou",
        });
        setIsLoading(false);
      }
    },
    onError: (err) => {
      console.error("Erro ao buscar consulta:", err);
      setIsLoading(false);
    },
  });

  // Função para formatar valor como moeda brasileira
  const formatBRL = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) return "";
    const number = parseFloat(cleaned) / 100;
    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const form = useForm<EditConsultationFormData>({
    resolver: zodResolver(editConsultationSchema),
    defaultValues: {
      date: new Date(),
      time: "09:00",
      duration: "50",
      type: "triagem",
      modality: "presencial",
      notes: "",
      value: "",
      status: "agendada",
    },
  });

  // Buscar dados da consulta quando o modal abrir
  useEffect(() => {
    if (isOpen && event?.id) {
      setIsLoading(true);
      executeGet({ id: event.id });
    }
  }, [isOpen, event?.id, executeGet]);

  const onSubmit = async (data: EditConsultationFormData) => {
    if (!event?.id) return;

    // Formatar data no timezone local para evitar problemas de conversão
    const year = data.date.getFullYear();
    const month = String(data.date.getMonth() + 1).padStart(2, "0");
    const day = String(data.date.getDate()).padStart(2, "0");
    const localDate = `${year}-${month}-${day}`;

    executeUpdate({
      id: event.id,
      data: {
        date: localDate,
        time: data.time,
        duration: data.duration,
        type: data.type,
        modality: data.modality,
        notes: data.notes,
        value: data.value,
        status: data.status,
      },
    });
  };

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Consulta</DialogTitle>
          <DialogDescription>
            Edite os dados da consulta de {event.title}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground text-sm">
              Carregando dados da consulta...
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data</FormLabel>
                      <Popover
                        open={openCalendar}
                        onOpenChange={setOpenCalendar}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="pl-3 text-left font-normal"
                              type="button"
                              onClick={() => setOpenCalendar(true)}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setOpenCalendar(false);
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração (min)</FormLabel>
                      <FormControl>
                        <Input type="number" min="15" step="5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="0,00"
                          value={field.value ? formatBRL(field.value) : ""}
                          onChange={(e) => {
                            // Mantém apenas números e atualiza o valor
                            const raw = e.target.value.replace(/\D/g, "");
                            field.onChange(raw);
                          }}
                          inputMode="numeric"
                          maxLength={12}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="triagem">Triagem</SelectItem>
                          <SelectItem value="avaliacao_inicial">
                            Avaliação Inicial
                          </SelectItem>
                          <SelectItem value="atendimento">
                            Atendimento
                          </SelectItem>
                          <SelectItem value="avaliacao_psicologica">
                            Avaliação Psicológica
                          </SelectItem>
                          <SelectItem value="devolutiva">Devolutiva</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="modality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modalidade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="presencial">Presencial</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="agendada">Agendada</SelectItem>
                        <SelectItem value="confirmada">Confirmada</SelectItem>
                        <SelectItem value="em_andamento">
                          Em Andamento
                        </SelectItem>
                        <SelectItem value="concluida">Concluída</SelectItem>
                        <SelectItem value="cancelada">Cancelada</SelectItem>
                        <SelectItem value="faltou">Faltou</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Observações sobre a consulta..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateStatus === "executing"}>
                  {updateStatus === "executing"
                    ? "Salvando..."
                    : "Salvar Alterações"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
