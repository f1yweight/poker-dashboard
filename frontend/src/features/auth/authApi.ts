import { httpRequest } from '../../shared/api/httpClient';

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UserResponse = {
  id: number;
  username: string;
  email: string;
};

export type LoginResponse = {
  token: string;
  user: UserResponse;
};

export function registerUser(request: RegisterRequest) {
  return httpRequest<UserResponse>('/api/users/register', {
    method: 'POST',
    body: request,
  });
}

export function loginUser(request: LoginRequest) {
  return httpRequest<LoginResponse>('/api/users/login', {
    method: 'POST',
    body: request,
  });
}