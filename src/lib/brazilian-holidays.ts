// Feriados nacionais fixos do Brasil
const FIXED_HOLIDAYS = [
  { month: 1, day: 1, name: "Ano Novo" },
  { month: 4, day: 21, name: "Tiradentes" },
  { month: 5, day: 1, name: "Dia do Trabalho" },
  { month: 9, day: 7, name: "Independência do Brasil" },
  { month: 10, day: 12, name: "Nossa Senhora Aparecida" },
  { month: 11, day: 2, name: "Finados" },
  { month: 11, day: 15, name: "Proclamação da República" },
  { month: 11, day: 20, name: "Dia da Consciência Negra" },
  { month: 12, day: 25, name: "Natal" },
];

// Função para calcular a Páscoa (algoritmo de Meeus/Jones/Butcher)
function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

// Feriados móveis baseados na Páscoa
function getMovableHolidays(year: number) {
  const easter = calculateEaster(year);

  // Carnaval: 47 dias antes da Páscoa
  const carnival = new Date(easter);
  carnival.setDate(easter.getDate() - 47);

  // Sexta-feira Santa: 2 dias antes da Páscoa
  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);

  // Corpus Christi: 60 dias depois da Páscoa
  const corpusChristi = new Date(easter);
  corpusChristi.setDate(easter.getDate() + 60);

  return [
    { date: carnival, name: "Carnaval" },
    { date: goodFriday, name: "Sexta-feira Santa" },
    { date: corpusChristi, name: "Corpus Christi" },
  ];
}

export interface Holiday {
  date: string; // formato YYYY-MM-DD
  name: string;
  isNational: boolean;
}

export function getBrazilianHolidays(month: number, year: number): Holiday[] {
  const holidays: Holiday[] = [];

  // Adicionar feriados fixos do mês
  FIXED_HOLIDAYS.forEach((holiday) => {
    if (holiday.month === month) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(holiday.day).padStart(2, "0")}`;
      holidays.push({
        date: dateStr,
        name: holiday.name,
        isNational: true,
      });
    }
  });

  // Adicionar feriados móveis do mês
  const movableHolidays = getMovableHolidays(year);
  movableHolidays.forEach((holiday) => {
    const holidayMonth = holiday.date.getMonth() + 1;
    if (holidayMonth === month) {
      const dateStr = `${year}-${String(holidayMonth).padStart(2, "0")}-${String(holiday.date.getDate()).padStart(2, "0")}`;
      holidays.push({
        date: dateStr,
        name: holiday.name,
        isNational: true,
      });
    }
  });

  return holidays;
}

export function isHoliday(date: Date): string | null {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Verificar feriados fixos
  const fixedHoliday = FIXED_HOLIDAYS.find(
    (h) => h.month === month && h.day === day
  );
  if (fixedHoliday) return fixedHoliday.name;

  // Verificar feriados móveis
  const movableHolidays = getMovableHolidays(year);
  const movableHoliday = movableHolidays.find(
    (h) => h.date.getMonth() + 1 === month && h.date.getDate() === day
  );
  if (movableHoliday) return movableHoliday.name;

  return null;
}
