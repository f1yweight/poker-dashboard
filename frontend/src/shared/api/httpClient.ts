import { getAuthToken } from '../../features/auth/authToken';

const API_BASE_URL = 'http://localhost:8080';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type HttpRequestOptions = {
  method?: HttpMethod;
  body?: unknown;
};

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export async function httpRequest<TResponse>(
  path: string,
  options: HttpRequestOptions = {},
): Promise<TResponse> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new HttpError(
      response.status,
      `Request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<TResponse>;
}