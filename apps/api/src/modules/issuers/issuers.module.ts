import { Module } from "@nestjs/common";
import { PrismaService } from "../../infra/database/prisma.service";
import { IssuersController } from "./issuers.controller";
import { IssuersService } from "./issuers.service";

@Module({
  controllers: [IssuersController],
  providers: [IssuersService, PrismaService],
})
export class IssuersModule {}
