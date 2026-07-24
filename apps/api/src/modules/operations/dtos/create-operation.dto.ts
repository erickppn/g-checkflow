import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, Min, ValidateNested } from "class-validator";
import { CreateCheckDto } from "./create-check.dto";

export class CreateOperationDto {
  @ApiProperty({
    example: 52,
    description: "Id do prestador responsável por trazer os cheques",
  })
  @IsInt()
  @Min(1)
  providerId!: number;

  @ApiProperty({
    type: [CreateCheckDto],
    description: "Cheques pertencentes à operação",
  })
  @ValidateNested({ each: true })
  @Type(() => CreateCheckDto)
  @IsArray()
  @ArrayMinSize(1)
  checks!: CreateCheckDto[];
}