import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ProvidersService } from './providers.service';
import { PrismaService } from '../../infra/database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma, Provider } from '../../generated/prisma/client';
import { makeCreateProviderDto, makeProvider, makeUpdateProviderDto } from '../../../test/factories/provider.factory';

describe('ProvidersService', () => {
  let providersService: ProvidersService;
  let prismaMock: DeepMockProxy<PrismaService>;

  const providers: Provider[] = [
    makeProvider({
      name: "Gustavo",
      defaultCompensationDays: 2,
    }),
    makeProvider({
      name: "Leticia",
      notes: "Test",
      defaultInterestRate: new Prisma.Decimal(2),
    }),
  ];

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvidersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    providersService = module.get<ProvidersService>(ProvidersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar todos os prestadores', async () => {
      const providersWithCount = providers.map((provider) => ({
        ...provider,
        _count: {
          operations: 0,
        },
      }));

      prismaMock.provider.findMany.mockResolvedValue(providersWithCount);

      const result = await providersService.findAll();

      expect(result).toEqual(
        providers.map((provider) => ({
          ...provider,
          operationsCount: 0,
        }))
      );
      
      expect(prismaMock.provider.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('deve retornar o prestador se ele existir', async () => {
      prismaMock.provider.findUnique.mockResolvedValue(providers[0]);

      const result = await providersService.findById(providers[0].id);

      expect(result).toEqual(providers[0]);
      expect(prismaMock.provider.findUnique).toHaveBeenCalledWith({
        where: { id: providers[0].id }
      });
    });

    it('deve lançar NotFoundException se o provider não existir', async () => {
      prismaMock.provider.findUnique.mockResolvedValue(null);

      await expect(providersService.findById("7b9a8c1234ef456789abcdef01234567")).rejects.toThrow(NotFoundException);

      expect(prismaMock.provider.findUnique).toHaveBeenCalledWith({
        where: { id: "7b9a8c1234ef456789abcdef01234567" }
      });
    });
  });

  describe("create", () => {
    it('deve criar um novo provider com sucesso', async () => {
      const dto = makeCreateProviderDto({
        name: "Gustavo",
        notes: "Teste",
      });

      const provider = makeProvider({
        name: dto.name,
        notes: "Teste",
      });

      prismaMock.provider.create.mockResolvedValue(provider);

      const result = await providersService.create(dto);

      expect(result).toEqual(provider);
      expect(prismaMock.provider.create).toHaveBeenCalledWith({
        data: dto
      });
    })
  });

  describe('update', () => {
    it('deve atualizar o provider com sucesso se ele existir', async () => {
      const originalProvider = makeProvider({
        name: "Gustavo",
      });

      const dto = makeUpdateProviderDto({
        name: "Gustavo Alterado",
        defaultInterestRate: 6
      });

      const updatedProvider = { 
        ...originalProvider, 
        ...dto,
        defaultInterestRate: dto.defaultInterestRate ? new Prisma.Decimal(dto.defaultInterestRate) : originalProvider.defaultInterestRate,
      };

      prismaMock.provider.findUnique.mockResolvedValue(originalProvider);
      prismaMock.provider.update.mockResolvedValue(updatedProvider);

      const result = await providersService.update(providers[0].id, dto);

      expect(result).toEqual(updatedProvider);
      expect(prismaMock.provider.update).toHaveBeenCalledWith({
        where: { id: providers[0].id },
        data: dto,
      });
    });

    it('deve lançar NotFoundException ao tentar atualizar um provider inexistente', async () => {
      const dto = makeUpdateProviderDto({
        name: "Teste",
      });

      prismaMock.provider.findUnique.mockResolvedValue(null);

      await expect(providersService.update("7b9a8c1234ef456789abcdef01234567", dto)).rejects.toThrow(NotFoundException);
      expect(prismaMock.provider.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deve deletar o provider com sucesso se ele existir', async () => {
      prismaMock.provider.findUnique.mockResolvedValue(providers[0]);
      prismaMock.provider.delete.mockResolvedValue(providers[0]);

      const result = await providersService.delete(providers[0].id);

      expect(result).toEqual(providers[0]);
      expect(prismaMock.provider.delete).toHaveBeenCalledWith({ where: { id: providers[0].id } });
    });

    it('deve lançar NotFoundException ao tentar deletar um provider inexistente', async () => {
      prismaMock.provider.findUnique.mockResolvedValue(null);

      await expect(providersService.delete("7b9a8c1234ef456789abcdef01234567")).rejects.toThrow(NotFoundException);
      expect(prismaMock.provider.delete).not.toHaveBeenCalled();
    });
  });
});