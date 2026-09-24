import { lazy, Suspense } from 'react'
import { GOOGLE_MAPS_API_KEY, MAP_PROVIDER } from '../../lib/env'
import type { MapViewProps } from './types'

export type { MapOrigin, MapPin, MapRing, MapViewProps } from './types'

const LeafletMapView = lazy(() => import('./LeafletMapView'))
const GoogleMapView = lazy(() => import('./GoogleMapView'))

function MapFallback({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-navy-50 p-6 text-center text-sm text-navy-400">
      {children}
    </div>
  )
}

/**
 * Adapter peta. Penyedia ditentukan oleh VITE_MAP_PROVIDER:
 *   leaflet (default) - OpenStreetMap, tanpa API key
 *   google            - @vis.gl/react-google-maps, butuh VITE_GOOGLE_MAPS_API_KEY
 */
export default function MapView(props: MapViewProps) {
  const useGoogle = MAP_PROVIDER === 'google' && Boolean(GOOGLE_MAPS_API_KEY)

  if (MAP_PROVIDER === 'google' && !GOOGLE_MAPS_API_KEY) {
    return (
      <MapFallback>
        VITE_MAP_PROVIDER diatur ke <b className="mx-1">google</b> tetapi
        VITE_GOOGLE_MAPS_API_KEY kosong. Isi kunci pada file .env atau kembalikan ke
        <b className="mx-1">leaflet</b>.
      </MapFallback>
    )
  }

  return (
    <Suspense fallback={<MapFallback>Memuat peta...</MapFallback>}>
      {useGoogle ? <GoogleMapView {...props} /> : <LeafletMapView {...props} />}
    </Suspense>
  )
}
