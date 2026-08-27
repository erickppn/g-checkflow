import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsUUID, ValidateNested } from "class-validator";
import { CreateCheckDto } from "./create-check.dto";

export class CreateOperationDto {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "Id do prestador responsável por trazer os cheques",
  })
  @IsUUID()
  providerId!: string;

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