export interface Provider {
  id: string;

  name: string;
  phone: string | null;
  notes: string | null;

  defaultInterestRate: number;
  defaultCompensationDays: number;

  createdAt: string;
  updatedAt: string;
}

export interface ProviderWithOperationsCount extends Provider {
  operationsCount: number;
}

export interface CreateProviderInput {
  name: string;
  phone: string;
  notes: string;

  defaultInterestRate: number;
  defaultCompensationDays: number;
}

export interface UpdateProviderInput extends CreateProviderInput {}