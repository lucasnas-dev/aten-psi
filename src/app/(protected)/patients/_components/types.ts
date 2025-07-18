export type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  address: string;
  notes?: string;
  status: "active" | "inactive";
  lastConsultation?: string;
  createdAt: string;
  updatedAt: string;
};

export type PatientFormData = {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  address: string;
  notes?: string;
  status: "active" | "inactive";
};

export type PaginationProps = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  startItem: number;
  endItem: number;
  hasNext: boolean;
  hasPrevious: boolean;
  itemsPerPage: number;
};

export type PaginationControls = {
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  changeItemsPerPage: () => void;
};

export type StatusFilter = "todos" | "ativo" | "inativo";

export type Contadores = {
  total: number;
  ativos: number;
  inativos: number;
};
