import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../infra/database/prisma.service";
import { CreateIssuerDto } from "./dto/create-issuer.dto";

import { normalizeIssuerName } from "@g-checkflow/shared/normalize-ussuer-name";
import { UpdateIssuerDto } from "./dto/update-issuer.dto";
import { Prisma } from "../../generated/prisma/client";

@Injectable()
export class IssuersService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  private async findIssuerOrFail(id: string) {
    const issuer = await this.prisma.issuer.findUnique({
      where: { id }
    });

    if (!issuer) throw new NotFoundException('Issuer not found');

    return issuer;
  }

  async create(data: CreateIssuerDto) {
    const normalizedName = normalizeIssuerName(data.name);

    try {
      return await this.prisma.issuer.create({
        data: {
          ...data,
          normalizedName,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Issuer already exists');
      }

      throw error;
    }
  }

  async findAll(search?: string) {
    return this.prisma.issuer.findMany({
      where: {
        normalizedName: {
          contains: normalizeIssuerName(search || "")
        }
      },

      orderBy: {
        name: "asc",
      },

      take: 5,
    });
  }

  async findById(id: string) {
    return this.findIssuerOrFail(id);
  }

  async update(id: string, data: UpdateIssuerDto) {
    await this.findIssuerOrFail(id);

    try {
      return await this.prisma.issuer.update({
        where: { id },

        data: {
          ...data,
          normalizedName: normalizeIssuerName(data.name)
        }
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Issuer already exists');
      }

      throw error;
    }
  }

  async delete(id: string) {
    await this.findIssuerOrFail(id);

    return this.prisma.issuer.delete({
      where: { id }
    });
  }
}