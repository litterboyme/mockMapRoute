import request from '../utils/request'

const commonUrl = '/mock'

export function postRoute(params: { origin: string; destination: string }) {
  return request.post(`${commonUrl}/route`, params)
}

export function postRoute500(params: { origin: string; destination: string }) {
  return request.post(`${commonUrl}route/500`, params)
}

export function postRouteSuccess(params: {
  origin: string
  destination: string
}) {
  return request.post(`${commonUrl}/route/success`, params)
}

export function getRoute(token: string) {
  return request.get(`${commonUrl}/route/${token}`)
}

export function getRoute500() {
  return request.get(`${commonUrl}/route/500`)
}

export function getRouteStatusInprogress() {
  return request.get(`${commonUrl}/route/inprogress`)
}

export function getRoutefailure() {
  return request.get(`${commonUrl}/route/failure`)
}

export function getRoutesuccess() {
  return request.get(`${commonUrl}/route/success`)
}
