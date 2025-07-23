import { useState } from "react";
import { Control, useFormContext } from "react-hook-form";
import { z } from "zod";

import { upsertPatientSchema } from "@/actions/upsert-patient/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PatientFormValues = z.infer<typeof upsertPatientSchema>;

export function PatientFields({
  control,
}: {
  control: Control<PatientFormValues>;
}) {
  const { setValue } = useFormContext<PatientFormValues>();
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // Funções de formatação
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (numbers.length === 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return numbers;
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{5})(\d{3})/, "$1-$2");
  };

  const formatName = (value: string) => {
    // Lista de preposições e artigos que devem ficar em minúsculas
    const preposicoes = ['de', 'da', 'do', 'das', 'dos', 'e', 'o', 'a', 'os', 'as'];
    
    return value
      .toLowerCase()
      .split(' ')
      .map((palavra, index) => {
        // Primeira palavra sempre maiúscula
        if (index === 0) {
          return palavra.charAt(0).toUpperCase() + palavra.slice(1);
        }
        // Preposições ficam em minúsculas, exceto se forem a primeira palavra
        if (preposicoes.includes(palavra)) {
          return palavra;
        }
        // Outras palavras com primeira letra maiúscula
        return palavra.charAt(0).toUpperCase() + palavra.slice(1);
      })
      .join(' ');
  };

  const handleCpfChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    const numbers = e.target.value.replace(/\D/g, "");
    e.target.value = formatCPF(numbers);
    onChange(numbers); // Salva apenas números
  };

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    const formattedName = formatName(e.target.value);
    e.target.value = formattedName;
    onChange(formattedName);
  };

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    const numbers = e.target.value.replace(/\D/g, "");
    e.target.value = formatPhone(numbers);
    onChange(numbers); // Salva apenas números
  };

  const handleCepChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    const numbers = e.target.value.replace(/\D/g, "");
    e.target.value = formatCEP(numbers);
    onChange(numbers); // Salva apenas números
  };

  const handleCepBlur = async (cep: string) => {
    if (!cep || cep.length < 8) return;

    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    setIsLoadingCep(true);
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`,
      );
      const data = await response.json();

      if (!data.erro) {
        setValue("address", data.logradouro || "");
        setValue("city", data.localidade || "");
        setValue("state", data.uf || "");
        setValue("neighborhood", data.bairro || "");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setIsLoadingCep(false);
    }
  };

  return (
    <div className="space-y-1">
      {/* Seção: Informações Pessoais */}
      <div className="space-y-1">
        <h3 className="text-foreground border-b pb-1 text-base font-semibold">
          Informações Pessoais
        </h3>
        <div className="grid grid-cols-1 gap-x-4 gap-y-0 md:grid-cols-2 lg:grid-cols-3">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="min-h-[75px]">
                <FormLabel>Nome completo *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome do paciente"
                    className="form-input-enhanced"
                    {...field}
                    onChange={(e) => handleNameChange(e, field.onChange)}
                  />
                </FormControl>
                <FormMessage />
                <div className="h-4"></div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="min-h-[85px]">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email@exemplo.com"
                    type="email"
                    className="form-input-enhanced"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <div className="h-4"></div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem className="min-h-[85px]">
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(92) 99999-9999"
                    className="form-input-enhanced"
                    value={formatPhone(field.value || "")}
                    onChange={(e) => handlePhoneChange(e, field.onChange)}
                    maxLength={15}
                  />
                </FormControl>
                <FormMessage />
                <div className="h-4"></div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="min-h-[85px]">
                <FormLabel>Data de nascimento *</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="form-input-enhanced"
                    {...field}
                    max={new Date().toISOString().split("T")[0]}
                    min="1900-01-01"
                  />
                </FormControl>
                <FormMessage />
                <div className="h-4"></div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="cpf"
            render={({ field }) => (
              <FormItem className="min-h-[85px]">
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input
                    placeholder="000.000.000-00"
                    className="form-input-enhanced"
                    value={formatCPF(field.value || "")}
                    onChange={(e) => handleCpfChange(e, field.onChange)}
                    maxLength={14}
                  />
                </FormControl>
                <FormMessage />
                <div className="h-4"></div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="responsibleCpf"
            render={({ field }) => (
              <FormItem className="min-h-[85px]">
                <FormLabel>CPF do Responsável</FormLabel>
                <FormControl>
                  <Input
                    placeholder="000.000.000-00 (se menor de idade)"
                    className="form-input-enhanced"
                    value={formatCPF(field.value || "")}
                    onChange={(e) => handleCpfChange(e, field.onChange)}
                    maxLength={14}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-muted-foreground text-xs">
                  Preencher apenas se o paciente for menor de idade
                </p>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="gender"
            render={({ field }) => (
              <FormItem className="min-h-[85px]">
                <FormLabel>Gênero</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="form-select-enhanced">
                      <SelectValue placeholder="Selecione um gênero" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                    <SelectItem value="not_informed">
                      Prefiro não informar
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
                {/* Espaçador para manter altura uniforme */}
                <div className="h-4"></div>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Seção: Endereço */}
      <div className="space-y-1">
        <h3 className="text-foreground border-b pb-1 text-base font-semibold">
          Endereço
        </h3>
        <div className="grid grid-cols-1 gap-x-4 gap-y-0 md:grid-cols-4">
          <FormField
            control={control}
            name="cep"
            render={({ field }) => (
              <FormItem className="min-h-[75px]">
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input
                    placeholder="00000-000"
                    className="form-input-enhanced"
                    value={formatCEP(field.value || "")}
                    onChange={(e) => handleCepChange(e, field.onChange)}
                    onBlur={(e) => {
                      const numbers = e.target.value.replace(/\D/g, "");
                      handleCepBlur(numbers);
                    }}
                    disabled={isLoadingCep}
                    maxLength={9}
                  />
                </FormControl>
                <FormMessage />
                {isLoadingCep ? (
                  <p className="flex items-center gap-1 text-sm text-blue-600">
                    <span className="animate-spin">⟳</span>
                    Buscando endereço...
                  </p>
                ) : (
                  <p className="text-muted-foreground text-xs">
                    📍 Endereço preenchido automaticamente
                  </p>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="state"
            render={({ field }) => (
              <FormItem className="min-h-[85px]">
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input
                    placeholder="UF"
                    maxLength={2}
                    className="form-input-enhanced"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <div className="h-4"></div>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-0 md:grid-cols-4 lg:grid-cols-4">
          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Rua, avenida..."
                    className="form-input-enhanced"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="houseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123"
                    className="form-input-enhanced"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome do bairro"
                    className="form-input-enhanced"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome da cidade"
                    className="form-input-enhanced"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={control}
        name="notes"
        render={({ field }) => {
          const wordCount = field.value
            ? field.value
                .trim()
                .split(/\s+/)
                .filter((word) => word.length > 0).length
            : 0;
          const isOverLimit = wordCount > 10;

          return (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Input
                  placeholder="Informações adicionais (máx. 10 palavras)"
                  className={`form-input-enhanced mt-1 ${isOverLimit ? "border-red-500" : ""}`}
                  {...field}
                />
              </FormControl>
              <div
                className={`text-sm ${isOverLimit ? "text-red-500" : "text-muted-foreground"}`}
              >
                {wordCount}/10 palavras
              </div>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
}
