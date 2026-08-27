import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class UpdateIssuerDto {
  @ApiProperty({
    example: "João da Silva",
    description: "Issuer name",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;
}