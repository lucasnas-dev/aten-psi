"use client";

import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { useAction } from "next-safe-action/hooks";

import {
  Filters,
  CalendarView,
  WeekView,
  DayView,
  ListView,
  EventDetailModal,
  DayEventsList,
  ViewMode,
  StatusConsulta,
  TipoConsulta,
  CalendarEvent,
} from "./_components";

import { getConsultations } from "@/actions/get-consultations";

export default function AgendaPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState<StatusConsulta | "all">("all");
  const [tipoFilter, setTipoFilter] = useState<TipoConsulta | "all">("all");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isNovaConsultaModalOpen, setIsNovaConsultaModalOpen] = useState(false);
  const [preselectedDate, setPreselectedDate] = useState<Date | undefined>();
  const [preselectedTime, setPreselectedTime] = useState<string | undefined>();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { execute: loadConsultations } = useAction(getConsultations, {
    onSuccess: (result) => {
      setEvents(result.data as CalendarEvent[]);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Erro ao carregar consultas:", error);
      setIsLoading(false);
    },
  });

  // Carregar consultas do banco de dados
  useEffect(() => {
    loadConsultations({});
  }, [loadConsultations]);

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "avaliacao_inicial":
        return "Avaliação";
      case "psicoterapia":
        return "Psicoterapia";
      case "retorno":
        return "Retorno";
      default:
        return "Consulta";
    }
  };

  // Filtrar eventos baseado nos filtros selecionados
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesStatus = statusFilter === "all" || event.status === statusFilter;
      const matchesTipo = tipoFilter === "all" || event.tipo === tipoFilter;
      return matchesStatus && matchesTipo;
    });
  }, [events, statusFilter, tipoFilter]);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleEventEdit = (event: CalendarEvent) => {
    // Apenas frontend: simula edição
    alert(`Editar evento: ${event.title}`);
    setIsEventModalOpen(false);
  };

  const handleEventDelete = (event: CalendarEvent) => {
    if (confirm("Tem certeza que deseja excluir esta consulta?")) {
      // Apenas frontend: remove do array local
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
      setIsEventModalOpen(false);
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    // Não muda o modo de visualização, apenas seleciona o dia
  };

  const handleTimeSlotClick = (date: Date) => {
    setPreselectedDate(date);
    setPreselectedTime(format(date, "HH:mm"));
    setIsNovaConsultaModalOpen(true);
  };

  const handleNovaConsulta = () => {
    setPreselectedDate(undefined);
    setPreselectedTime(undefined);
    setIsNovaConsultaModalOpen(true);
  };

  const handleNovaConsultaSuccess = () => {
    // Recarregar consultas após criar uma nova
    loadConsultations({});
  };

  const renderCurrentView = () => {
    switch (viewMode) {
      case "month":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendário menor */}
            <div className="lg:col-span-1">
              <CalendarView
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                events={filteredEvents}
                onEventClick={handleEventClick}
                onDayClick={handleDayClick}
                compact={true}
                selectedDate={selectedDate}
              />
            </div>
            
            {/* Lista do dia selecionado */}
            <div className="lg:col-span-2">
              <DayEventsList
                selectedDate={selectedDate}
                events={filteredEvents}
                onEventClick={handleEventClick}
                onTimeSlotClick={handleTimeSlotClick}
              />
            </div>
          </div>
        );
      case "week":
        return (
          <WeekView
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            events={filteredEvents}
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick}
          />
        );
      case "day":
        return (
          <DayView
            selectedDate={selectedDate}
            events={filteredEvents}
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick}
          />
        );
      case "list":
        return (
          <ListView
            events={filteredEvents}
            onEventClick={handleEventClick}
            onEditEvent={handleEventEdit}
            onDeleteEvent={handleEventDelete}
          />
        );
      default:
        return (
          <div className="bg-card rounded-lg border p-12 text-center shadow-sm">
            <h3 className="text-lg font-medium mb-2">Visualização em desenvolvimento</h3>
            <p className="text-muted-foreground">
              A visualização "{viewMode}" será implementada em breve.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Filtros */}
      <Filters
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        tipoFilter={tipoFilter}
        onTipoFilterChange={setTipoFilter}
      />

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-card rounded-lg border p-12 text-center shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando consultas...</p>
        </div>
      ) : (
        /* Visualização Principal */
        renderCurrentView()
      )}

      {/* Modal de Detalhes do Evento */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onEdit={handleEventEdit}
        onDelete={handleEventDelete}
      />
      {/* Modal de Nova Consulta removido */}
    </div>
  );
}
