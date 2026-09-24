import { handleMockRequest, MockHttpError } from '../mocks/backend'

export const AUTH_EXPIRED_EVENT = 'verifi:auth-expired'

const getToken = () => localStorage.getItem('accessToken')

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function request<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  await wait(80)
  const method = (options.method ?? 'GET').toUpperCase()
  let body: Record<string, unknown> | undefined
  if (typeof options.body === 'string' && options.body) {
    try {
      body = JSON.parse(options.body) as Record<string, unknown>
    } catch {
      body = undefined
    }
  }

  try {
    return handleMockRequest(path, method, body, getToken()) as T
  } catch (err) {
    if (err instanceof MockHttpError && err.status === 401) {
      localStorage.removeItem('accessToken')
      window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT))
      throw new Error(err.message)
    }
    if (err instanceof MockHttpError) throw new Error(err.message)
    throw err
  }
}

export const api = {
  get: <T = unknown>(path: string) => request<T>(path),
  post: <T = unknown>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T = unknown>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T = unknown>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T = unknown>(path: string) => request<T>(path, { method: 'DELETE' }),
}
