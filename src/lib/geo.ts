import { BRANCH } from './constants'
import type { RadiusBand } from '../types'

const EARTH_RADIUS_KM = 6371.0088

const toRad = (deg: number) => (deg * Math.PI) / 180

/** Jarak lingkaran besar antara dua koordinat, dalam kilometer. */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat))
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** Jarak dari titik cabang PIM 2. */
export function distanceFromBranchKm(point: { lat: number; lng: number }): number {
  return haversineKm(BRANCH, point)
}

export function radiusBandOf(distanceKm: number): RadiusBand {
  if (distanceKm < 1) return '<1km'
  if (distanceKm <= 3) return '1-3km'
  if (distanceKm <= 5) return '3-5km'
  return '>5km'
}

/** Di bawah 1 km ditampilkan dalam meter, selebihnya dalam km. */
export function formatDistance(distanceKm: number): string {
  if (!Number.isFinite(distanceKm)) return '-'
  if (distanceKm < 1) return Math.round(distanceKm * 1000).toLocaleString('id-ID') + ' m'
  return distanceKm.toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' km'
}
