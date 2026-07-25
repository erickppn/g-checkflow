import { PrismaPg } from "@prisma/adapter-pg";
import { CheckStatus, Operation, Prisma, PrismaClient, Provider } from "../src/generated/prisma/client";

import { fakerPT_BR as faker } from '@faker-js/faker';
import { calculateCheck } from "@g-checkflow/shared/calculate-check";

// PROVIDERS CONFIGS
const PROVIDERS_COUNT = 3;

const notes = [
  'Cliente antigo.',
  'Prioridade alta.',
  'Negociações frequentes.',
  'Pagamento sempre em dia.',
  'Parceiro comercial.',
  null,
  null,
];

const interestRates = [3, 3.5, 4, 4.5, 5];

// OPERATIONS CONFIGS
const MIN_OPERATIONS = 2;
const MAX_OPERATIONS = 5;

// CHECKS CONFIGS
const MIN_CHECKS = 2;
const MAX_CHECKS = 8;

const issuers = [
  'João da Silva',
  'Maria Oliveira',
  'Carlos Pereira',
  'Fernanda Souza',
  'José Santos',
  'Ana Lima',
];

const banks = [
  '001',
  '033',
  '104',
  '237',
  '341',
];

const returnReasons = [
  'Fundos insuficientes',
  'Cheque sustado',
  'Conta encerrada',
  'Assinatura divergente',
];

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
});

async function main() {
  console.log('🌱 Seeding...');

  console.log('🧹 Cleaning database...');

  await prisma.check.deleteMany();
  await prisma.operation.deleteMany();
  await prisma.provider.deleteMany();

  console.log('👤 Creating providers...');

  const providers: Provider[] = [];

  for (let i = 0; i < PROVIDERS_COUNT; i++) {
    const provider = await prisma.provider.create({
      data: {
        name: faker.person.fullName(),

        phone: faker.phone.number({ style: 'national' }),

        notes: faker.helpers.arrayElement(notes),

        defaultInterestRate: new Prisma.Decimal(faker.helpers.arrayElement(interestRates)),

        defaultCompensationDays: faker.number.int({ min: 1, max: 3 }),
      },
    });

    providers.push(provider);
  }

  const operations: Operation[] = [];

  for (const provider of providers) {
    const operationsCount = faker.number.int({
      min: MIN_OPERATIONS,
      max: MAX_OPERATIONS,
    });

    console.log(
      `📦 ${provider.name} -> ${operationsCount} operações`,
    );

    for (let i = 0; i < operationsCount; i++) {
      const operation = await prisma.operation.create({
        data: {
          providerId: provider.id,
          closedAt: faker.helpers.arrayElement([null, new Date()]),
        },
      });

      operations.push(operation);
      console.log(`   📄 Operação ${operation.id} criada para ${provider.name}`);
    }
  }

  for (const operation of operations) {
    const checksCount = faker.number.int({
      min: MIN_CHECKS,
      max: MAX_CHECKS,
    });

    for (let i = 0; i < checksCount; i++) {
      const issueDate = faker.date.recent({
        days: 45,
      });

      const dueDate = faker.date.soon({
        days: 60,
        refDate: issueDate,
      });

      const amount = faker.number.float({
        min: 200,
        max: 5000,
        fractionDigits: 2,
      });

      const additionalDays = faker.number.int({
        min: 0,
        max: 2,
      });

      const interestRate = faker.helpers.arrayElement([3, 3.5, 4, 4.5, 5]);

      const calculated = calculateCheck({
        amount,
        issueDate,
        dueDate,
        additionalDays,
        interestRate
      });

      let status: CheckStatus = CheckStatus.PENDING;

      const random = faker.number.int({
        min: 1,
        max: 100,
      });

      if (random <= 5) {
        status = CheckStatus.RETURNED;
      } else if (random <= 20) {
        status = CheckStatus.COMPENSATED;
      }

      console.log(`💰 Cheque ${i + 1}/${checksCount} criado para a operação ${operation.id}`);

      await prisma.check.create({
        data: {
          issuerName: faker.helpers.arrayElement(issuers),

          bankCode: faker.helpers.arrayElement(banks),

          checkNumber: faker.string.numeric(6),

          amount,

          interestRate,

          issueDate,

          dueDate,

          additionalDays,

          days: calculated.days,

          totalDays: calculated.totalDays,

          interest: calculated.interest,

          netAmount: calculated.netAmount,

          status,

          returnReason:
            status === CheckStatus.RETURNED
              ? faker.helpers.arrayElement(returnReasons)
              : null,

          operationId: operation.id,
        },
      });
    }
  }

  console.log('✅ Seed completed');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })