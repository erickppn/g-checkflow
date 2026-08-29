import { Module } from "@nestjs/common";
import { PrismaService } from "../../infra/database/prisma.service";
import { OperationsService } from "./operations.service";
import { OperationsController } from "./operation.controller";
import { ChecksService } from "./checks/checks.service";
import { ChecksController } from "./checks/checks.controller";

@Module({
  controllers: [
    OperationsController,
    ChecksController,
  ],
  providers: [
    OperationsService,
    ChecksService,
    PrismaService,
  ],
})
export class OperationsModule { }
