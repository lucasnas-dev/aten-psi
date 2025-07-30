import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

import { createConsultation } from "@/actions/create-consultation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";


const newConsultationSchema = z.object({
  patient_id: z.string().min(1, "Selecione um paciente"),
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
    "devolutiva"
  ]),
  modality: z.enum(["presencial", "online"]),
  notes: z.string().optional(),
  value: z.string().optional(),
});

type NewConsultationFormData = z.infer<typeof newConsultationSchema>;

interface NewConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preselectedDate?: Date;
  preselectedTime?: string;
  patient: import("@/app/(protected)/patients/_components/types").Patient;
}

export function NewConsultationModal({
  isOpen,
  onClose,
  onSuccess,
  preselectedDate,
  preselectedTime,
  patient
}: NewConsultationModalProps) {
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const { execute, status } = useAction(createConsultation, {
    onSuccess: () => {
      onSuccess?.();
      onClose();
      form.reset();
    },
    onError: (err) => {
      console.error("Erro ao criar consulta:", err);
    },
  });

  // Função para formatar valor como moeda brasileira
  const formatBRL = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) return "";
    const number = parseFloat(cleaned) / 100;
    return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const form = useForm<NewConsultationFormData>({
    resolver: zodResolver(newConsultationSchema),
    defaultValues: {
      patient_id: patient?.id ?? "",
      date: preselectedDate || new Date(),
      time: preselectedTime || "09:00",
      duration: "50",
      type: "triagem",
      modality: "presencial",
      notes: "",
      value: "",
    },
  });

  const onSubmit = async (data: NewConsultationFormData) => {
    execute({
      patient_id: data.patient_id,
      date: format(data.date, "yyyy-MM-dd"),
      time: data.time,
      duration: data.duration,
      type: data.type,
      modality: data.modality,
      notes: data.notes,
      value: data.value,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Consulta</DialogTitle>
          <DialogDescription>
            Agende uma nova consulta para um paciente
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="patient_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paciente</FormLabel>
                  <Input
                    value={patient?.name ?? ""}
                    disabled
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
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
                            onSelect={date => {
                              field.onChange(date);
                              setOpenCalendar(false);
                            }}
                            disabled={date => date < new Date()}
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
                      <Input
                        type="time"
                        {...field}
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
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração (min)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="15"
                        step="5"
                        {...field}
                      />
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
                        onChange={e => {
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                    <SelectItem value="triagem">Triagem</SelectItem>
                    <SelectItem value="avaliacao_inicial">Avaliação Inicial</SelectItem>
                    <SelectItem value="atendimento">Atendimento</SelectItem>
                    <SelectItem value="avaliacao_psicologica">Avaliação Psicológica</SelectItem>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Button 
                type="submit" 
                disabled={status === "executing"}
              >
                {status === "executing" ? "Agendando..." : "Agendar Consulta"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
