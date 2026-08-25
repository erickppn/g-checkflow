import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsInt, IsNumber, Max, Min } from "class-validator";

export class CreateProviderDto {
  @ApiProperty({
    example: 'Gustavo Henrique',
    description: 'Provider full name',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: '(11) 99999-9999',
    description: 'Provider phone number',
  })
  @IsString()
  @MaxLength(20)
  phone!: string;

  @ApiPropertyOptional({
    example: 'Brings cheques every Friday.',
    description: 'Additional information',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  notes?: string;

  @ApiProperty({
    example: 4.5,
    description: "Taxa de juros padrão do prestador (%)",
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  defaultInterestRate!: number;

  @ApiProperty({
    example: 1,
    description: "Dias de compensação padrão",
  })
  @IsInt()
  @Min(0)
  defaultCompensationDays!: number;
}