import "dotenv/config";

import { randomUUID } from "node:crypto";

import { Client } from "pg";

const patientSeeds = [
  {
    name: "Ana Paula Ribeiro",
    email: "ana.paula.ribeiro@example.com",
    phone: "(11) 98811-2233",
    birth_date: "1991-04-12",
    gender: "feminino",
    cpf: "123.456.789-01",
    responsible_cpf: null,
    cep: "01310-200",
    address: "Rua Augusta",
    house_number: "1200",
    city: "São Paulo",
    state: "SP",
    neighborhood: "Consolação",
    notes: "Paciente em acompanhamento semanal.",
    status: "active",
  },
  {
    name: "Bruna Costa Lima",
    email: "bruna.lima@example.com",
    phone: "(21) 97777-4455",
    birth_date: "1987-09-30",
    gender: "feminino",
    cpf: "234.567.890-12",
    responsible_cpf: null,
    cep: "22041-001",
    address: "Av. Atlântica",
    house_number: "450",
    city: "Rio de Janeiro",
    state: "RJ",
    neighborhood: "Copacabana",
    notes: "Queixas de ansiedade em contexto de trabalho.",
    status: "active",
  },
  {
    name: "Carlos Henrique Santos",
    email: "carlos.santos@example.com",
    phone: "(31) 99922-3344",
    birth_date: "1984-01-08",
    gender: "masculino",
    cpf: "345.678.901-23",
    responsible_cpf: null,
    cep: "30112-000",
    address: "Rua da Bahia",
    house_number: "88",
    city: "Belo Horizonte",
    state: "MG",
    neighborhood: "Centro",
    notes: "Histórico de acompanhamento para organização de rotina.",
    status: "active",
  },
  {
    name: "Daniela Martins Vieira",
    email: "daniela.vieira@example.com",
    phone: "(41) 98888-6655",
    birth_date: "1998-11-21",
    gender: "feminino",
    cpf: "456.789.012-34",
    responsible_cpf: null,
    cep: "80420-090",
    address: "Alameda Dr. Carlos de Carvalho",
    house_number: "310",
    city: "Curitiba",
    state: "PR",
    neighborhood: "Centro",
    notes: "Primeira consulta com foco em regulação emocional.",
    status: "active",
  },
  {
    name: "Eduardo Gomes Alves",
    email: "eduardo.alves@example.com",
    phone: "(51) 99331-7788",
    birth_date: "2002-06-14",
    gender: "masculino",
    cpf: "567.890.123-45",
    responsible_cpf: null,
    cep: "90020-004",
    address: "Rua dos Andradas",
    house_number: "950",
    city: "Porto Alegre",
    state: "RS",
    neighborhood: "Centro Histórico",
    notes: "Paciente jovem, queixa de sobrecarga acadêmica.",
    status: "active",
  },
  {
    name: "Fernanda Lopes Nunes",
    email: "fernanda.nunes@example.com",
    phone: "(62) 98111-6644",
    birth_date: "1995-02-05",
    gender: "feminino",
    cpf: "678.901.234-56",
    responsible_cpf: null,
    cep: "74015-040",
    address: "Rua 9",
    house_number: "140",
    city: "Goiânia",
    state: "GO",
    neighborhood: "Setor Central",
    notes: "Acompanhamento focado em autoestima e limites.",
    status: "active",
  },
  {
    name: "Gustavo Ferreira Rocha",
    email: "gustavo.rocha@example.com",
    phone: "(85) 98765-4321",
    birth_date: "1979-08-19",
    gender: "masculino",
    cpf: "789.012.345-67",
    responsible_cpf: null,
    cep: "60160-230",
    address: "Av. Dom Luís",
    house_number: "700",
    city: "Fortaleza",
    state: "CE",
    neighborhood: "Aldeota",
    notes: "Demanda relacionada a estresse e sono.",
    status: "active",
  },
  {
    name: "Helena Souza Carvalho",
    email: "helena.carvalho@example.com",
    phone: "(71) 98222-1199",
    birth_date: "2010-03-27",
    gender: "feminino",
    cpf: null,
    responsible_cpf: "890.123.456-78",
    cep: "40140-110",
    address: "Rua Miguel Navarro Y Caun",
    house_number: "52",
    city: "Salvador",
    state: "BA",
    neighborhood: "Barra",
    notes: "Paciente adolescente com acompanhamento familiar.",
    status: "active",
  },
];

function createClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL não foi definido.");
  }

  const sslEnabled = ["1", "true", "yes"].includes(
    String(process.env.DATABASE_SSL ?? "").toLowerCase()
  );

  return new Client({
    connectionString: databaseUrl,
    ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
  });
}

async function resolveTenantId(client) {
  const directTenantId = process.env.TARGET_TENANT_ID?.trim();
  if (directTenantId) {
    return directTenantId;
  }

  const targetUserEmail = process.env.TARGET_USER_EMAIL?.trim();
  if (targetUserEmail) {
    const result = await client.query(
      `
        select id, name, email, tenant_id
        from users
        where lower(email) = lower($1)
        limit 1
      `,
      [targetUserEmail]
    );

    if (result.rowCount === 0) {
      throw new Error(`Nenhum usuário encontrado com o e-mail ${targetUserEmail}.`);
    }

    if (!result.rows[0].tenant_id) {
      throw new Error(
        `O usuário ${result.rows[0].email} não possui tenant_id associado.`
      );
    }

    return result.rows[0].tenant_id;
  }

  const usersWithTenants = await client.query(
    `
      select id, name, email, tenant_id
      from users
      where tenant_id is not null
      order by created_at asc
    `
  );

  if (usersWithTenants.rowCount === 0) {
    throw new Error("Nenhum usuário com tenant_id encontrado.");
  }

  if (usersWithTenants.rowCount > 1) {
    const usersList = usersWithTenants.rows
      .map((user) => `${user.name} <${user.email}>`)
      .join(", ");

    throw new Error(
      `Há mais de um usuário com tenant_id. Defina TARGET_USER_EMAIL ou TARGET_TENANT_ID. Encontrados: ${usersList}`
    );
  }

  return usersWithTenants.rows[0].tenant_id;
}

async function seedPatients() {
  const client = createClient();

  try {
    await client.connect();

    const tenantId = await resolveTenantId(client);

    await client.query("begin");

    const deletedPatientsResult = await client.query(
      `delete from patients where tenant_id = $1 returning id`,
      [tenantId]
    );

    const insertedPatients = [];

    for (const seed of patientSeeds) {
      const patientId = randomUUID();

      await client.query(
        `
          insert into patients (
            id,
            name,
            email,
            phone,
            birth_date,
            gender,
            cpf,
            responsible_cpf,
            cep,
            address,
            house_number,
            city,
            state,
            neighborhood,
            notes,
            status,
            tenant_id
          ) values (
            $1, $2, $3, $4, $5, $6, $7, $8,
            $9, $10, $11, $12, $13, $14, $15, $16, $17
          )
        `,
        [
          patientId,
          seed.name,
          seed.email,
          seed.phone,
          seed.birth_date,
          seed.gender,
          seed.cpf,
          seed.responsible_cpf,
          seed.cep,
          seed.address,
          seed.house_number,
          seed.city,
          seed.state,
          seed.neighborhood,
          seed.notes,
          seed.status,
          tenantId,
        ]
      );

      insertedPatients.push({ id: patientId, name: seed.name });
    }

    await client.query("commit");

    console.log(
      `Seed concluído para o tenant ${tenantId}. Removidos ${deletedPatientsResult.rowCount} pacientes e criados ${insertedPatients.length}.`
    );
    console.table(insertedPatients);
  } catch (error) {
    await client.query("rollback").catch(() => undefined);
    throw error;
  } finally {
    await client.end();
  }
}

seedPatients().catch((error) => {
  console.error("Falha ao executar seed de pacientes:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});