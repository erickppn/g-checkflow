export interface Issuer {
  id: string;
  name: string;
  normalizedName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIssuerInput {
  name: string
}