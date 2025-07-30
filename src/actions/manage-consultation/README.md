# Manage Consultation Actions

Este módulo fornece operações CRUD completas para gerenciar consultas no sistema.

## Actions Disponíveis

### `createConsultation`

Cria uma nova consulta no sistema.

**Parâmetros:**

- `patient_id`: ID do paciente
- `date`: Data da consulta (YYYY-MM-DD)
- `time`: Horário da consulta (HH:MM)
- `duration`: Duração em minutos
- `type`: Tipo da consulta (triagem, avaliacao_inicial, atendimento, avaliacao_psicologica, devolutiva)
- `modality`: Modalidade (presencial, online)
- `notes`: Observações (opcional)
- `value`: Valor da consulta (opcional)
- `status`: Status da consulta (opcional, padrão: "agendada")

### `updateConsultation`

Atualiza uma consulta existente.

**Parâmetros:**

- `id`: ID da consulta a ser atualizada
- `data`: Objeto com os campos a serem atualizados (todos opcionais)

### `deleteConsultation`

Exclui uma consulta do sistema.

**Parâmetros:**

- `id`: ID da consulta a ser excluída

### `getConsultation`

Busca uma consulta específica por ID.

**Parâmetros:**

- `id`: ID da consulta a ser buscada

## Uso

```typescript
import {
  createConsultation,
  updateConsultation,
  deleteConsultation,
  getConsultation,
} from "@/actions/manage-consultation";

// Criar consulta
const result = await createConsultation({
  patient_id: "patient-id",
  date: "2025-07-30",
  time: "14:30",
  duration: "60",
  type: "atendimento",
  modality: "presencial",
});

// Atualizar consulta
const updateResult = await updateConsultation({
  id: "consultation-id",
  data: {
    status: "concluida",
    notes: "Consulta realizada com sucesso",
  },
});

// Excluir consulta
const deleteResult = await deleteConsultation({
  id: "consultation-id",
});

// Buscar consulta
const consultation = await getConsultation({
  id: "consultation-id",
});
```

## Segurança

Todas as actions verificam se o usuário tem permissão para acessar/modificar a consulta através do `tenant_id`. As consultas são filtradas automaticamente pelo tenant do usuário logado.

## Revalidação de Cache

Após operações de criar, atualizar ou excluir, as seguintes páginas são revalidadas automaticamente:

- `/agenda`
- `/patients`
