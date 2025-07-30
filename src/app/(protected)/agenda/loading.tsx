export default function AgendaLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="bg-muted h-8 w-32 animate-pulse rounded-md"></div>
        <div className="bg-muted h-4 w-64 animate-pulse rounded-md"></div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="bg-muted h-10 w-36 animate-pulse rounded-md"></div>
          <div className="bg-muted h-10 w-40 animate-pulse rounded-md"></div>
          <div className="bg-muted h-10 w-44 animate-pulse rounded-md"></div>
        </div>
        <div className="bg-muted h-10 w-36 animate-pulse rounded-md"></div>
      </div>

      {/* Calendário */}
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="bg-muted h-8 w-48 animate-pulse rounded-md"></div>
          <div className="flex items-center gap-2">
            <div className="bg-muted h-9 w-9 animate-pulse rounded-md"></div>
            <div className="bg-muted h-9 w-16 animate-pulse rounded-md"></div>
            <div className="bg-muted h-9 w-9 animate-pulse rounded-md"></div>
          </div>
        </div>

        {/* Grid do calendário */}
        <div className="space-y-2">
          <div className="mb-2 grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="bg-muted h-6 animate-pulse rounded-md"
              ></div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="bg-muted h-32 animate-pulse rounded-lg"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
