import { TestingModule, Test } from "@nestjs/testing";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { makeLoginDto, makeUser } from "../../../test/factories/user.factory";
import { Response } from "express";
import { UnauthorizedException } from "@nestjs/common";

describe('AuthController', () => {
  let authController: AuthController;
  let authServiceMock: DeepMockProxy<AuthService>;

  beforeEach(async () => {
    authServiceMock = mockDeep<AuthService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        AuthController,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();

    delete process.env.COOKIE_SAME_SITE;
  });

  describe('login', () => {
    it('deve fazer login com sucesso', async () => {
      const dto = makeLoginDto();

      const user = makeUser();

      authServiceMock.login.mockResolvedValue({
        accessToken: 'fake-jwt-token',
        user
      });

      const response = {
        cookie: jest.fn(),
      } as unknown as Response;

      const result = await authController.login(dto, response);

      expect(authServiceMock.login).toHaveBeenCalledWith(dto);

      process.env.COOKIE_SAME_SITE = "lax";

      expect(response.cookie).toHaveBeenCalledWith(
        "access_token",
        "fake-jwt-token",
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 60 * 60 * 1000,
        }),
      );

      expect(result).toEqual({
        message: "Login realizado com sucesso",
        user,
      });
    });

    it("deve propagar UnauthorizedException se o login falhar", async () => {
      const dto = makeLoginDto();

      const response = {
        cookie: jest.fn(),
      } as unknown as Response;

      authServiceMock.login.mockRejectedValue(
        new UnauthorizedException("Invalid credentials or email"),
      );

      await expect(authController.login(dto, response)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(response.cookie).not.toHaveBeenCalled();
    });
  });
});