import { Info } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PatientFormValues = z.infer<typeof upsertPatientSchema>;

export function PatientFields({
  control,
}: {
  control: Control<PatientFormValues>;
}) {
  const { setValue, watch } = useFormContext<PatientFormValues>();
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const useSocialName = watch("useSocialName");
  const birthDate = watch("birthDate");

  const isMinor = (() => {
    if (!birthDate) return false;

    const [year, month, day] = birthDate.split("-").map(Number);
    const birth = new Date(year, month - 1, day);

    if (
      Number.isNaN(birth.getTime()) ||
      birth.getFullYear() !== year ||
      birth.getMonth() !== month - 1 ||
      birth.getDate() !== day
    ) {
      return false;
    }

    const today = new Date();
    let age = today.getFullYear() - year;
    const hasHadBirthday =
      today.getMonth() > month - 1 ||
      (today.getMonth() === month - 1 && today.getDate() >= day);

    if (!hasHadBirthday) age -= 1;

    return age < 18;
  })();

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
    const preposicoes = [
      "de",
      "da",
      "do",
      "das",
      "dos",
      "e",
      "o",
      "a",
      "os",
      "as",
    ];

    return value
      .toLowerCase()
      .split(" ")
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
      .join(" ");
  };

  const handleCpfChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const numbers = e.target.value.replace(/\D/g, "");
    e.target.value = formatCPF(numbers);
    onChange(numbers); // Salva apenas números
  };

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const formattedName = formatName(e.target.value);
    e.target.value = formattedName;
    onChange(formattedName);
  };

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const numbers = e.target.value.replace(/\D/g, "");
    e.target.value = formatPhone(numbers);
    onChange(numbers); // Salva apenas números
  };

  const handleCepChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
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
        `https://viacep.com.br/ws/${cleanCep}/json/`
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
    <div className="space-y-4">
      {/* Seção: Informações Pessoais */}
      <div className="space-y-2">
        <h3 className="text-foreground border-b pb-1 text-sm font-semibold sm:text-base">
          Informações Pessoais
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem className="min-w-0 gap-1">
                <FormLabel>Nome Completo *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome completo"
                    className="form-input-enhanced"
                    {...field}
                    onChange={(e) => handleNameChange(e, field.onChange)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid min-w-0 grid-rows-[13px_auto] gap-1">
            <FormField
              control={control}
              name="useSocialName"
              render={({ field }) => (
                <FormItem className="flex h-5 items-center gap-0">
                  <div className="flex h-5 -translate-y-1 flex-wrap items-center gap-x-2 gap-y-1 leading-5">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value ?? false}
                        onChange={(event) =>
                          field.onChange(event.currentTarget.checked)
                        }
                        className="border-input accent-primary h-3 w-3 rounded"
                      />
                    </FormControl>
                    <FormLabel className="text-muted-foreground cursor-pointer text-sm font-normal">
                      Usar como tratamento o nome social
                    </FormLabel>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label="Informações sobre o nome social"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Se preenchido, este será o nome usado na interface,
                        agenda e comunicações com o paciente.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="socialName"
              render={({ field }) => (
                <FormItem className="min-w-0 gap-1">
                  <FormControl>
                    <Input
                      placeholder="Nome pelo qual deseja ser tratado"
                      className="form-input-enhanced"
                      disabled={!useSocialName}
                      {...field}
                      onChange={(e) => handleNameChange(e, field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="min-w-0 gap-1">
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
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem className="gap-1">
                <FormLabel>Telefone *</FormLabel>
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
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="gap-1">
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
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="cpf"
            render={({ field }) => (
              <FormItem className="gap-1">
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
              </FormItem>
            )}
          />
          {isMinor && (
            <>
              <FormField
                control={control}
                name="responsibleName"
                render={({ field }) => (
                  <FormItem className="gap-1">
                    <FormLabel>Nome do Responsável</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome completo do responsável"
                        className="form-input-enhanced"
                        {...field}
                        onChange={(e) =>
                          handleNameChange(e, field.onChange)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="responsibleCpf"
                render={({ field }) => (
                  <FormItem className="gap-1">
                    <FormLabel>CPF do Responsável</FormLabel>
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
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
      </div>

      {/* Seção: Endereço */}
      <div className="space-y-2">
        <h3 className="text-foreground border-b pb-1 text-sm font-semibold sm:text-base">
          Endereço
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <FormField
            control={control}
            name="cep"
            render={({ field }) => (
              <FormItem className="gap-1 md:col-span-1">
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
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="state"
            render={({ field }) => (
              <FormItem className="gap-1 md:col-span-1">
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
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
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
                  className={`form-input-enhanced ${isOverLimit ? "border-red-500" : ""}`}
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
