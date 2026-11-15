export const SERVIDOR_URL = "http://localhost:8080";
const API_URL = `${SERVIDOR_URL}/api/v1`;

async function requisitar<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Erro ${response.status}: ${errorBody || response.statusText}`);
  }

  const texto = await response.text();
  return (texto ? JSON.parse(texto) : undefined) as T;
}

export async function get<T>(endpoint: string): Promise<T> {
  return requisitar<T>(endpoint, { method: 'GET' });
}

export async function post<T>(endpoint: string, body: unknown): Promise<T> {
  return requisitar<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
}

export async function put<T>(endpoint: string, body: unknown): Promise<T> {
  return requisitar<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) });
}

export async function del(endpoint: string): Promise<void> {
  return requisitar<void>(endpoint, { method: 'DELETE' });
}