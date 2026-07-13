import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MaxLength, IsOptional } from "class-validator";

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
  @IsNotEmpty()
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
}