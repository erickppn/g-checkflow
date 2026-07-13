import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { PrismaService } from '../../infra/database/prisma.service';
import { UpdateProviderDto } from './dto/update-provider.dto';

@Injectable()
export class ProvidersService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  private async findProviderOrFail(id: number) {
    const provider = await this.prisma.provider.findUnique({
      where: { id }
    });

    if (!provider) throw new NotFoundException('Provider not found');

    return provider;
  }

  async create(data: CreateProviderDto) {
    return this.prisma.provider.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.provider.findMany();
  }

  async findById(id: number) {
    return this.findProviderOrFail(id);
  }

  async update(id: number, data: UpdateProviderDto) {
    await this.findProviderOrFail(id);
    
    return this.prisma.provider.update({
      where: { id },
      data
    });
  }

  async delete(id: number) {
    await this.findProviderOrFail(id);

    return this.prisma.provider.delete({
      where: { id }
    });
  }
}
