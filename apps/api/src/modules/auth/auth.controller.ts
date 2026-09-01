import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { type Response } from "express";
import { Public } from "../../common/decorators/public.decorator";
import { type AuthenticatedRequest } from "../../common/types/authenticated-request.type";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: "Login user" })
  @Public()
  @Post("login")
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, user } = await this.authService.login(data);

    const sameSiteEnv = (process.env.COOKIE_SAME_SITE as "lax" | "none") || "lax";

    response.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || sameSiteEnv === "none",
      sameSite: sameSiteEnv,
      maxAge: 60 * 60 * 1000,
      path: "/",
    });

    return {
      message: "Login realizado com sucesso",
      user
    };
  }

  @Get("me")
  me(@Req() request: AuthenticatedRequest, @Res({ passthrough: true }) response: Response) {
    response.setHeader("Cache-Control", "no-store");

    if (!request.user) {
      throw new UnauthorizedException();
    }

    return this.authService.me(request.user.id);
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) response: Response) {
    const sameSiteEnv = (process.env.COOKIE_SAME_SITE as "lax" | "none") || "lax";

    response.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || sameSiteEnv === "none",
      sameSite: sameSiteEnv,
      path: "/",
    });

    return {
      message: "Logout realizado com sucesso",
    };
  }
}