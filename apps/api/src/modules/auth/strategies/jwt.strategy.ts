import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { Request } from 'express';
import { ConfigService } from "@nestjs/config";
import { UserRole } from "../../../generated/prisma/enums";

const extractJwtFromCookie = (request: Request): string | null => {
  return request.cookies?.access_token ?? null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: extractJwtFromCookie,
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET"), 
    });
  }

  async validate(payload: { sub: string; role: UserRole }) {
    return {
      id: payload.sub,
      role: payload.role,
    };
  }
}