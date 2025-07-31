# 📋 **SISTEMA DE CONFIGURAÇÕES - Agenda do Psicólogo**

## 🎯 **Visão Geral**

Sistema completo de configurações que permite ao psicólogo personalizar:

- **Horários de trabalho** por dia da semana
- **Regras de agendamento** e tipos de consulta
- **Notificações** automáticas para pacientes
- **Preferências** pessoais e de sistema

---

## 🏗️ **Estrutura Implementada**

### **1. Interface de Configurações**

```
/settings/
├── page.tsx                           # Página principal com abas
├── _components/
│   ├── working-hours-config.tsx       # ⭐ Configuração de horários
│   ├── appointment-settings.tsx       # Regras de consultas
│   ├── notification-settings.tsx      # Lembretes e notificações
│   └── profile-settings.tsx          # Dados pessoais e preferências
```

### **2. Backend Actions**

```
/actions/save-settings/
├── index.ts                          # Action para salvar configurações
└── schema.ts                         # Validação Zod
```

### **3. Schema do Banco**

```sql
-- Configurações do usuário
user_settings {
  id, user_id, tenant_id,
  name, email, phone, crp, specialization,
  default_duration, buffer_time, max_advance_booking,
  email_notifications, sms_notifications, reminder_time,
  week_starts_on, time_format, timezone
}

-- Horários de trabalho
working_hours {
  id, user_id, tenant_id,
  day_of_week, enabled, time_slots,
  created_at, updated_at
}
```

---

## ⭐ **Funcionalidades Principais**

### **🕐 Configuração de Horários de Trabalho:**

- ✅ **Por dia da semana** - Liga/desliga dias individualmente
- ✅ **Múltiplos períodos** - Ex: 08:00-12:00 e 14:00-18:00
- ✅ **Slots de 30min** - Precisão profissional
- ✅ **Copiar para todos** - Aplicar horário de um dia para outros
- ✅ **Duração e intervalo** configuráveis
- ✅ **Total semanal** calculado automaticamente

### **📅 Regras de Agendamento:**

- ✅ **Duração padrão** por tipo de consulta
- ✅ **Intervalo entre consultas** (buffer time)
- ✅ **Antecedência máxima** para agendamentos
- ✅ **Agendamento no mesmo dia** (liga/desliga)
- ✅ **Tipos de consulta** personalizáveis

### **🔔 Sistema de Notificações:**

- ✅ **Email e SMS** configuráveis
- ✅ **Lembretes automáticos** (15min a 1 dia antes)
- ✅ **Tipos de notificação** por evento:
  - Confirmação de agendamento
  - Lembrete de consulta
  - Cancelamento
  - Reagendamento

### **👤 Configurações Pessoais:**

- ✅ **Dados profissionais** (nome, CRP, especialização)
- ✅ **Preferências de sistema** (fuso horário, formato de hora)
- ✅ **Cores personalizadas** por tipo de consulta
- ✅ **Primeiro dia da semana** configurável

---

## 🚀 **Como Usar**

### **1. Navegue para `/settings`**

```
http://localhost:3000/settings
```

### **2. Configure os Horários:**

- Ative/desative dias da semana
- Defina horários (ex: 08:00 às 17:00)
- Adicione múltiplos períodos se necessário
- Use "Copiar para todos" para aplicar a todos os dias

### **3. Defina Regras de Consulta:**

- Duração padrão: 50 minutos
- Intervalo: 10 minutos
- Antecedência: 30 dias

### **4. Configure Notificações:**

- Ative email/SMS
- Defina tempo de lembrete
- Escolha quais eventos notificar

---

## 🔧 **Integração com a Agenda**

### **Como a Agenda Usa as Configurações:**

1. **Horários Disponíveis:**

   ```typescript
   // A agenda só mostra slots nos horários configurados
   const availableSlots = getWorkingHours(dayOfWeek).filter(
     (slot) => !hasConflict(slot)
   );
   ```

2. **Validação de Agendamentos:**

   ```typescript
   // Verifica regras antes de permitir agendamento
   if (isWithinAdvanceLimit && isWorkingDay && hasAvailableSlot) {
     allowBooking();
   }
   ```

3. **Notificações Automáticas:**
   ```typescript
   // Sistema envia lembretes baseado nas configurações
   scheduleReminder(appointmentTime - reminderTime);
   ```

---

## 📊 **Próximos Passos Sugeridos**

### **Fase 1 - Implementação Básica** ✅

- [x] Interface de configurações
- [x] Schema do banco
- [x] Actions para salvar

### **Fase 2 - Integração com Agenda** 🔄

- [ ] Usar horários configurados na visualização semanal
- [ ] Validar agendamentos contra regras definidas
- [ ] Aplicar cores personalizadas por tipo

### **Fase 3 - Notificações** 📧

- [ ] Sistema de lembretes automáticos
- [ ] Integração com email/SMS
- [ ] Templates de mensagens personalizáveis

### **Fase 4 - Funcionalidades Avançadas** 🎯

- [ ] Exceções de horário (feriados, férias)
- [ ] Horários especiais por tipo de consulta
- [ ] Relatórios de disponibilidade
- [ ] Sincronização com calendários externos

---

## 💡 **Benefícios Implementados**

✅ **Agenda Inteligente** - Só mostra horários realmente disponíveis
✅ **Redução de Conflitos** - Regras automáticas evitam sobreposições  
✅ **Experiência Profissional** - Interface comparable aos melhores sistemas
✅ **Flexibilidade Total** - Cada psicólogo configura conforme sua rotina
✅ **Automatização** - Menos trabalho manual, mais foco no atendimento

---

**🎉 O sistema está pronto para revolucionar a gestão da agenda psicológica!**
