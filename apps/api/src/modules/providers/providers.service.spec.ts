import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ProvidersService } from './providers.service';
import { PrismaService } from '../../infra/database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';

describe('ProvidersService', () => {
  let providersService: ProvidersService;
  let prismaMock: DeepMockProxy<PrismaService>;

  const providers = [
    {
      id: 1,
      name: 'Gustavo',
      phone: '(11) 99999-9999',
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'Leticia',
      phone: '(11) 99999-9999',
      notes: "Test",
      createdAt: new Date(),
      updatedAt: new Date()
    },
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
      prismaMock.provider.findMany.mockResolvedValue(providers);

      const result = await providersService.findAll();

      expect(result).toEqual(providers);
      expect(prismaMock.provider.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('deve retornar o prestador se ele existir', async () => {
      prismaMock.provider.findUnique.mockResolvedValue(providers[0]);

      const result = await providersService.findById(1);

      expect(result).toEqual(providers[0]);
      expect(prismaMock.provider.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    it('deve lançar NotFoundException se o provider não existir', async () => {
      prismaMock.provider.findUnique.mockResolvedValue(null);

      await expect(providersService.findById(88)).rejects.toThrow(NotFoundException);

      expect(prismaMock.provider.findUnique).toHaveBeenCalledWith({
        where: { id: 88 }
      });
    });
  });

  describe("create", () => {
    it('deve criar um novo provider com sucesso', async () => {
      const dto: CreateProviderDto = {
        name: 'Gustavo',
        phone: '(11) 99999-9999',
        notes: 'Teste',
      };

      const provider = {
        id: 1,
        name: dto.name,
        phone: dto.phone,
        notes: dto.notes ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

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
      const dto = {
        name: 'Gustavo Alterado',
        phone: '(11) 99999-9999',
      };

      const updatedProvider = { ...providers[0], name: 'Gustavo Alterado' };

      prismaMock.provider.findUnique.mockResolvedValue(providers[0]);
      prismaMock.provider.update.mockResolvedValue(updatedProvider);

      const result = await providersService.update(1, dto);

      expect(result).toEqual(updatedProvider);
      expect(prismaMock.provider.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      });
    });

    it('deve lançar NotFoundException ao tentar atualizar um provider inexistente', async () => {
      prismaMock.provider.findUnique.mockResolvedValue(null);

      await expect(providersService.update(99, { name: 'Teste' })).rejects.toThrow(NotFoundException);
      expect(prismaMock.provider.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deve deletar o provider com sucesso se ele existir', async () => {
      prismaMock.provider.findUnique.mockResolvedValue(providers[0]);
      prismaMock.provider.delete.mockResolvedValue(providers[0]);

      const result = await providersService.delete(1);

      expect(result).toEqual(providers[0]);
      expect(prismaMock.provider.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('deve lançar NotFoundException ao tentar deletar um provider inexistente', async () => {
      prismaMock.provider.findUnique.mockResolvedValue(null);

      await expect(providersService.delete(99)).rejects.toThrow(NotFoundException);
      expect(prismaMock.provider.delete).not.toHaveBeenCalled();
    });
  });
});