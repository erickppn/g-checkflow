import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import * as argon2 from "argon2";
import { LoginDto } from "./dto/login.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly logger = new Logger(AuthService.name)
  ) { }

  async login(data: LoginDto) {
    this.logger.log(`Login attempt: ${data.email}`);

    const user = await this.usersService.findByEmail(data.email);

    this.logger.log(`User found: ${!!user}`);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials or email");
    }

    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      data.password,
    );

    this.logger.log(`Password matches: ${isPasswordValid}`);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials or email");
    }

    const { passwordHash, ...userWithoutPassword } = user;

    const payload = {
      sub: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: userWithoutPassword
    };
  }

  async me(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return user;
  }
}