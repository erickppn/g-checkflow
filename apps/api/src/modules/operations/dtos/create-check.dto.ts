import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsInt, IsNotEmpty, IsNumber, IsString, IsUUID, Length, Max, Min } from "class-validator";

export class CreateCheckDto {
  @ApiProperty({
    example: "João da Silva",
    description: "Id do emitente do cheque",
  })
  @IsUUID()
  issuerId!: string;

  @ApiProperty({
    example: "341",
    description: "Código do banco emissor",
  })
  @IsString()
  @Length(3, 3)
  bankCode!: string;

  @ApiProperty({
    example: "123456",
    description: "Número do cheque",
  })
  @IsNotEmpty()
  @IsString()
  checkNumber!: string

  @ApiProperty({
    example: 1500.50,
    description: "Valor bruto do cheque",
  })
  @IsNumber()
  @Min(0.01)
  amount!: number

  @ApiProperty({
    example: 4.5,
    description: "Taxa de juros mensal (%)",
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  interestRate!: number

  @ApiProperty({
    example: "2026-07-15",
    description: "Data de emissão do cheque",
  })
  @Type(() => Date)
  @IsDate()
  issueDate!: Date;

  @ApiProperty({
    example: "2026-08-15",
    description: "Data de vencimento do cheque",
  })
  @Type(() => Date)
  @IsDate()
  dueDate!: Date;

  @ApiProperty({
    example: 1,
    description: "Dias adicionais para compensação",
  })
  @IsInt()
  @Min(0)
  additionalDays!: number;
}