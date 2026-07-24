import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { OperationsService } from "./operations.service";
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { CreateOperationDto } from "./dtos/create-operation.dto";
import { UpdateOperationDto } from "./dtos/update-operation.dto";

@ApiTags('Operations')
@Controller('operations')
export class ProvidersController {
  constructor(private readonly operationsService: OperationsService) { }

  @ApiOperation({ summary: 'Create a operation' })
  @Post()
  async create(@Body() data: CreateOperationDto) {
    return this.operationsService.create(data);
  }

  @ApiOperation({ summary: 'Update a operation' })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateOperationDto
  ) {
    return this.operationsService.update(id, data);
  }

  @Get()
  findAll() {
    return this.operationsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.operationsService.findById(id);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.operationsService.delete(id);
  }
}