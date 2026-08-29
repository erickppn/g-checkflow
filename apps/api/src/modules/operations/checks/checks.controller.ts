import { Body, Controller, Delete, Param, Patch } from "@nestjs/common";
import { ChecksService } from "./checks.service";
import { UpdateCheckDto } from "./dtos/update-check.dto";
import { ReturnCheckDto } from "./dtos/return-check.dto";

@Controller("checks")
export class ChecksController {
  constructor(
    private readonly checksService: ChecksService,
  ) { }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() data: UpdateCheckDto,
  ) {
    return this.checksService.update(id, data);
  }

  @Patch(":id/compensate")
  compensate(@Param("id") id: string) {
    return this.checksService.compensate(id);
  }

  @Patch(":id/return")
  return(
    @Param("id") id: string,
    @Body() data: ReturnCheckDto,
  ) {
    return this.checksService.return(id, data);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.checksService.delete(id);
  }
}