import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from "class-validator";
import { UserRole } from "../../../generated/prisma/enums";

export class CreateUserDto {
  @ApiProperty({
    example: "Gustavo Silva",
    description: "Nome do usuário",
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    example: "gustavo@potencialjeans.com.br",
    description: "E-mail do usuário",
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: "senha123",
    description: "Senha do usuário",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    example: UserRole.MASTER,
    enum: UserRole,
    description: "Nível de acesso do usuário",
  })
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "Id do prestador vinculado ao usuário",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  providerId?: string;
}