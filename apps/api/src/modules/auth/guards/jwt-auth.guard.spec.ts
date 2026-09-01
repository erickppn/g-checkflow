import { Reflector } from "@nestjs/core";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { ExecutionContext } from "@nestjs/common";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { Test, TestingModule } from "@nestjs/testing";
import { IS_PUBLIC_KEY } from "../../../common/decorators/public.decorator";
import { AuthGuard } from "@nestjs/passport";

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflectorMock: DeepMockProxy<Reflector>;
  let contextMock: DeepMockProxy<ExecutionContext>;

  beforeEach(async () => {
    reflectorMock = mockDeep<Reflector>();
    contextMock = mockDeep<ExecutionContext>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        { provide: Reflector, useValue: reflectorMock },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(guard).toBeDefined();
  });

  it('deve permitir acesso se a rota for pública', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(true);

    const result = await guard.canActivate(contextMock);

    expect(result).toBe(true);

    expect(reflectorMock.getAllAndOverride).toHaveBeenCalledWith(
      IS_PUBLIC_KEY,
      [
        contextMock.getHandler(),
        contextMock.getClass(),
      ],
    );
  });

  it('deve delegar a autenticação quando a rota não for pública', async () => {
    const superCanActivateSpy = jest
      .spyOn(AuthGuard('jwt').prototype, 'canActivate')
      .mockResolvedValue(true);

    reflectorMock.getAllAndOverride.mockReturnValue(false);

    const result = await guard.canActivate(contextMock);

    expect(result).toBe(true);
    expect(superCanActivateSpy).toHaveBeenCalledWith(contextMock);

    superCanActivateSpy.mockRestore();
  });
});