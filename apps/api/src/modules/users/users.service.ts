import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from "argon2";

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(data: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      throw new ConflictException("Email already in use");
    }

    const passwordHash = await argon2.hash(data.password);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        providerId: data.providerId,
      },
    });

    const { passwordHash: _, ...safeUser } = user;

    return safeUser;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    const user =  await this.prisma.user.findUnique({
      where: { id },

      omit: {
        passwordHash: true
      }
    });

    return user;
  }
}