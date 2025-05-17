import { describe, it, expect, vi } from 'vitest'
import { getRouteWithRetry } from './functions/getRouteWithRetry'
import * as api from '../apis'

// mock getRoute
vi.mock('../apis', () => ({
  getRoute: vi.fn(),
  getRouteStatusInprogress: vi.fn(() =>
    Promise.resolve({ data: { status: 'in progress' } })
  ),
  getRoutesuccess: vi.fn(() =>
    Promise.resolve({ data: { status: 'success', path: ['A', 'B'] } })
  ),
  getRoutefailure: vi.fn(() =>
    Promise.resolve({ data: { status: 'failure', error: 'route not found' } })
  ),
  getRoute500: vi.fn(() => {
    const error = new Error('Internal Server Error')
    error.response = { status: 500, data: 'server error' }
    return Promise.reject(error)
  }),
}))

it('retries on in progress and succeeds', async () => {
  const getRouteMock = api.getRoute
  getRouteMock
    .mockResolvedValueOnce(await api.getRouteStatusInprogress())
    .mockResolvedValueOnce(await api.getRoutesuccess())

  const result = await getRouteWithRetry('abc123')
  expect(result.path).toEqual(['A', 'B'])
})

it('returns error message on failure status', async () => {
  const getRouteMock = api.getRoute
  getRouteMock.mockResolvedValueOnce(await api.getRoutefailure())

  const result = await getRouteWithRetry('abc123')
  expect(result).toBe('route not found')
})

it('throws after max retries of in progress', async () => {
  const getRouteMock = api.getRoute
  getRouteMock.mockResolvedValue(await api.getRouteStatusInprogress())
  await expect(getRouteWithRetry('abc123')).rejects.toThrow(
    'Maximum retry attempts reached'
  )
}, 15000)

it('handles 500 error by catching and logging', async () => {
  const getRouteMock = api.getRoute
  getRouteMock.mockImplementationOnce(await api.getRoutefailure());
  await expect(getRouteWithRetry('abc123')).rejects.toThrow();
});
