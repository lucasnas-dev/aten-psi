# 📊 **MIGRAÇÃO DRIZZLE - CONFIGURAÇÕES IMPLEMENTADA**

## ✅ **Comandos Executados:**

```bash
# 1. Gerar migração
npm run db:generate

# 2. Aplicar alterações ao banco
npm run db:push
```

---

## 🗄️ **Novas Tabelas Criadas:**

### **1. `user_settings` - Configurações do Usuário**

```sql
CREATE TABLE user_settings (
  id VARCHAR(255) PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tenant_id VARCHAR(255) NOT NULL REFERENCES tenants(id),

  -- Dados profissionais
  name TEXT,
  email TEXT,
  phone TEXT,
  crp TEXT,
  specialization TEXT,

  -- Configurações de consulta
  default_duration INTEGER DEFAULT 50,
  buffer_time INTEGER DEFAULT 10,
  max_advance_booking INTEGER DEFAULT 30,
  allow_same_day_booking BOOLEAN DEFAULT false,

  -- Notificações
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  reminder_time INTEGER DEFAULT 60,

  -- Sistema
  week_starts_on VARCHAR(1) DEFAULT '1',
  time_format VARCHAR(2) DEFAULT '24',
  timezone TEXT DEFAULT 'America/Sao_Paulo',

  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

### **2. `working_hours` - Horários de Trabalho**

```sql
CREATE TABLE working_hours (
  id VARCHAR(255) PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tenant_id VARCHAR(255) NOT NULL REFERENCES tenants(id),

  day_of_week INTEGER NOT NULL, -- 0=domingo, 1=segunda...
  enabled BOOLEAN DEFAULT true,
  time_slots JSON DEFAULT '[]', -- [{start:"08:00", end:"12:00"}]

  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

---

## 🔗 **Relações Configuradas:**

### **Users → Settings (1:1)**

```typescript
users.userSettings = one(userSettings);
userSettings.user = one(users);
```

### **Users → Working Hours (1:N)**

```typescript
users.workingHours = many(workingHours);
workingHours.user = one(users);
```

### **Tenants → Settings/Hours (1:N)**

```typescript
tenants.userSettings = many(userSettings);
tenants.workingHours = many(workingHours);
```

---

## 🎯 **Como Usar as Novas Tabelas:**

### **1. Salvar Configurações:**

```typescript
// Inserir/atualizar configurações do usuário
await db.insert(userSettings).values({
  userId: user.id,
  tenantId: user.tenantId,
  defaultDuration: 50,
  bufferTime: 10,
  emailNotifications: true,
  // ... outras configurações
});
```

### **2. Salvar Horários de Trabalho:**

```typescript
// Definir horários para segunda-feira
await db.insert(workingHours).values({
  userId: user.id,
  tenantId: user.tenantId,
  dayOfWeek: 1, // Segunda-feira
  enabled: true,
  timeSlots: [
    { start: "08:00", end: "12:00" },
    { start: "14:00", end: "18:00" },
  ],
});
```

### **3. Consultar Dados:**

```typescript
// Buscar configurações do usuário
const settings = await db.query.userSettings.findFirst({
  where: eq(userSettings.userId, user.id),
  with: {
    user: true,
    tenant: true,
  },
});

// Buscar horários de trabalho
const hours = await db.query.workingHours.findMany({
  where: eq(workingHours.userId, user.id),
  orderBy: [workingHours.dayOfWeek],
});
```

---

## 🚀 **Próximos Passos:**

1. **Testar a página de configurações** - `/settings`
2. **Verificar salvamento** dos formulários
3. **Integrar com agenda** usando os horários configurados
4. **Implementar validações** baseadas nas regras definidas

---

**✅ O banco de dados está pronto para o sistema de configurações!**

As tabelas foram criadas com sucesso usando Drizzle ORM e estão prontas para armazenar todas as configurações personalizadas do psicólogo.
