import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateIssuerDto {
  @ApiProperty({
    example: "João da Silva",
    description: "Issuer name",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;
}