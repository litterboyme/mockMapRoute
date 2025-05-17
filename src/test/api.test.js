// src/api/route.test.ts
import { describe, it, expect, vi } from 'vitest'
import { postRoute, getRoute } from '../apis'
import request from '../utils/request'

vi.mock('../utils/request', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

describe('postRoute', () => {
  it('should call POST with correct URL and params', async () => {
    const mockResponse = { data: { token: 'mock-token' } }
    request.post.mockResolvedValue(mockResponse)

    const params = {
      origin: 'innocentre',
      destination: 'Hong Kong International Airport',
    }

    const result = await postRoute(params)

    expect(request.post).toHaveBeenCalledWith('/mock/route', params)
    expect(result).toEqual(mockResponse)
  })
})

describe('getRoute', () => {
  it('should call GET with correct token in URL', async () => {
    const token = '9d3503e0-7236-4e47-a62f-8b01b5646c16'
    const mockResponse = { data: { status: 'success', path: [] } }

    request.get.mockResolvedValue(mockResponse)

    const result = await getRoute(token)

    expect(request.get).toHaveBeenCalledWith('/mock/route/9d3503e0-7236-4e47-a62f-8b01b5646c16')
    expect(result).toEqual(mockResponse)
  })
})


