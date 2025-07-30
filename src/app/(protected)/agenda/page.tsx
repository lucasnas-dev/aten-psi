"use client";

import { format } from "date-fns";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useMemo, useState } from "react";

import { getConsultations } from "@/actions/get-consultations";

import {
  CalendarEvent,
  CalendarView,
  DayEventsList,
  DayView,
  EventDetailModal,
  Filters,
  ListView,
  StatusConsulta,
  TipoConsulta,
  ViewMode,
  WeekView,
} from "./_components";

export default function AgendaPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState<StatusConsulta | "all">(
    "all"
  );
  const [tipoFilter, setTipoFilter] = useState<TipoConsulta | "all">("all");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [, setIsNovaConsultaModalOpen] = useState(false);
  const [, setPreselectedDate] = useState<Date | undefined>();
  const [, setPreselectedTime] = useState<string | undefined>();
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

  // Filtrar eventos baseado nos filtros selecionados
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesStatus =
        statusFilter === "all" || event.status === statusFilter;
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

  const renderCurrentView = () => {
    switch (viewMode) {
      case "month":
        return (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
            <h3 className="mb-2 text-lg font-medium">
              Visualização em desenvolvimento
            </h3>
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
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
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
