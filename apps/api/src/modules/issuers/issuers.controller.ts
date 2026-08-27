import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { IssuersService } from "./issuers.service";

import { CreateIssuerDto } from "./dto/create-issuer.dto";
import { UpdateIssuerDto } from "./dto/update-issuer.dto";

@ApiTags("Issuers")
@Controller("issuers")
export class IssuersController {
  constructor(private readonly issuersService: IssuersService) {}

  @ApiOperation({ summary: "Create an issuer" })
  @Post()
  async create(@Body() data: CreateIssuerDto) {
    return this.issuersService.create(data);
  }

  @ApiOperation({ summary: "List issuers" })
  @Get()
  async findAll(@Query("search") search?: string) {
    return this.issuersService.findAll(search);
  }

  @ApiOperation({ summary: "Get issuer by ID" })
  @Get(":id")
  async findById(@Param("id") id: string) {
    return this.issuersService.findById(id);
  }

  @ApiOperation({ summary: "Update issuer" })
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() data: UpdateIssuerDto,
  ) {
    return this.issuersService.update(id, data);
  }

  @ApiOperation({ summary: "Delete issuer" })
  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.issuersService.delete(id);
  }
}