import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ReturnCheckDto {
  @ApiProperty({
    example: "Cheque sem fundos",
    description: "Motivo da devolução do cheque",
  })
  @IsString()
  @IsNotEmpty()
  returnReason!: string;
}