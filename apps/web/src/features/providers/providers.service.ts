// import { api } from "@/lib/api"
// import type { ProviderWithOperationsCount } from "./provider.types"
import { providersMock } from "./providers.mocks"

export const providersService = {
  getAll: async () => {
    await new Promise((r) => setTimeout(r, 400));
    return providersMock

    // const response = await api.get<ProviderWithOperationsCount[]>(
    //   "/providers"
    // )

    // return response.data;
  }
}