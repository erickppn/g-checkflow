import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { OperationsService } from "./operations.service";
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateOperationDto } from "./dtos/create-operation.dto";

@ApiTags('Operations')
@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) { }

  @ApiOperation({ summary: 'Create a operation' })
  @Post()
  async create(@Body() data: CreateOperationDto) {
    return this.operationsService.create(data);
  }

  @Get()
  findAll() {
    return this.operationsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.operationsService.findById(id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.operationsService.delete(id);
  }
}