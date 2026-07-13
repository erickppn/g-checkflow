import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Providers')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @ApiOperation({ summary: 'Create a provider' })
  @Post()
  async create(@Body() data: CreateProviderDto) {
    return this.providersService.create(data);
  }

  @ApiOperation({ summary: 'List providers' })
  @Get()
  async findAll() {
    return this.providersService.findAll();
  }

  @ApiOperation({ summary: 'Get provider by ID', })
  @Get(":id")
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.providersService.findById(id);
  }

  @ApiOperation({ summary: 'Update provider' })
  @Patch(":id")
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateProviderDto) {
    return this.providersService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete provider' })
  @Delete(":id")
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.providersService.delete(id);
  }
}
