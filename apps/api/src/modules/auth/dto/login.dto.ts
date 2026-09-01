import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({
    example: "gustavo@meuemail.com.br",
    description: "E-mail do usuário",
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: "minhaSenha123",
    description: "Senha do usuário",
  })
  @IsNotEmpty()
  @IsString()
  password!: string;
}