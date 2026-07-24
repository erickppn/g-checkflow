import { Module } from "@nestjs/common";
import { PrismaService } from "../../infra/database/prisma.service";
import { OperationsService } from "./operations.service";
import { ProvidersController } from "./operation.controller";

@Module({
  controllers: [ProvidersController],
  providers: [OperationsService, PrismaService],
})
export class OperationsModule {}
