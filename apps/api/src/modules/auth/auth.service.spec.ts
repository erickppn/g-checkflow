import { JwtService } from "@nestjs/jwt";
import { TestingModule, Test } from "@nestjs/testing";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { UsersService } from "../users/users.service";
import { AuthService } from "./auth.service";
import { makeLoginDto, makeUser } from "../../../test/factories/user.factory";
import * as argon2 from "argon2";
import { UnauthorizedException } from "@nestjs/common";

describe('AuthService', () => {
  let authService: AuthService;
  let usersServiceMock: DeepMockProxy<UsersService>;
  let jwtServiceMock: DeepMockProxy<JwtService>;

  beforeEach(async () => {
    usersServiceMock = mockDeep<UsersService>();
    jwtServiceMock = mockDeep<JwtService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("deve fazer login com sucesso", async () => {
      const dto = makeLoginDto();

      const passwordHash = await argon2.hash(dto.password);

      const user = makeUser({
        passwordHash,
      });

      usersServiceMock.findByEmail.mockResolvedValue(user);

      jwtServiceMock.sign.mockReturnValue("fake-jwt-token");

      const result = await authService.login(dto);

      const { passwordHash: _, ...expectedUser } = user;

      expect(result).toEqual({
        accessToken: "fake-jwt-token",
        user: expectedUser,
      });

      expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(dto.email);

      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        sub: user.id,
        role: user.role,
      });
    });

    it("deve lançar UnauthorizedException se o usuário não existir", async () => {
      const dto = makeLoginDto();

      usersServiceMock.findByEmail.mockResolvedValue(null);

      await expect(authService.login(dto)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(jwtServiceMock.sign).not.toHaveBeenCalled();
    });

    it("deve lançar UnauthorizedException se a senha estiver incorreta", async () => {
      const dto = makeLoginDto();

      const user = makeUser({
        passwordHash: await argon2.hash("outra-senha"),
      });

      usersServiceMock.findByEmail.mockResolvedValue(user);

      await expect(authService.login(dto)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(jwtServiceMock.sign).not.toHaveBeenCalled();
    });
  });
});