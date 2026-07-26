export interface Provider {
  id: number;

  name: string;
  phone: string | null;
  notes: string | null;

  defaultInterestRate: number;
  defaultCompensationDays: number;

  createdAt: string;
  updatedAt: string;
}