export interface LoginInput {
  email: string;
  password: string;
}

export interface User {
  id: string;

  name: string;
  email: string;
  role: string;
  providerId: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}