import { useEffect } from 'react'
import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  useMap,
} from '@vis.gl/react-google-maps'
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_MAP_ID } from '../../lib/env'
import type { MapRing, MapViewProps } from './types'

/** Lingkaran radius digambar langsung lewat google.maps.Circle. */
function Rings({
  origin,
  rings,
}: {
  origin: { lat: number; lng: number }
  rings: MapRing[]
}) {
  const map = useMap()
  useEffect(() => {
    if (!map || typeof google === 'undefined') return
    const circles = rings.map(
      (ring) =>
        new google.maps.Circle({
          map,
          center: origin,
          radius: ring.radiusM,
          strokeColor: ring.color,
          strokeOpacity: 0.7,
          strokeWeight: 1.5,
          fillColor: ring.color,
          fillOpacity: 0.04,
        }),
    )
    return () => circles.forEach((c) => c.setMap(null))
  }, [map, origin, rings])
  return null
}

/** Menyesuaikan viewport agar lingkaran radius tertentu muat seluruhnya. */
function FitRadius({
  origin,
  radiusM,
}: {
  origin: { lat: number; lng: number }
  radiusM: number
}) {
  const map = useMap()
  useEffect(() => {
    if (!map || typeof google === 'undefined') return
    const circle = new google.maps.Circle({ center: origin, radius: radiusM })
    const bounds = circle.getBounds()
    if (bounds) map.fitBounds(bounds, 8)
    circle.setMap(null)
  }, [map, origin, radiusM])
  return null
}

function MapBody({
  center,
  zoom,
  pins,
  rings = [],
  origin,
  fitRadiusM,
  selectedId,
  onSelect,
}: MapViewProps) {
  return (
    <GoogleMap
      defaultCenter={center}
      defaultZoom={zoom}
      center={center}
      zoom={zoom}
      mapId={GOOGLE_MAPS_MAP_ID}
      gestureHandling="greedy"
      disableDefaultUI={false}
      className="h-full w-full"
      onClick={() => onSelect?.(null)}
    >
      {origin && <Rings origin={origin} rings={rings} />}
      {origin && fitRadiusM ? <FitRadius origin={origin} radiusM={fitRadiusM} /> : null}

      {origin && (
        <AdvancedMarker position={origin} title={origin.label} zIndex={1000}>
          <span className="flex h-[26px] w-[26px] items-center justify-center rounded-md border-2 border-white bg-navy text-[11px] font-bold text-gold shadow-md">
            M
          </span>
        </AdvancedMarker>
      )}

      {pins.map((pin) => {
        const active = pin.id === selectedId
        return (
          <AdvancedMarker
            key={pin.id}
            position={{ lat: pin.lat, lng: pin.lng }}
            title={pin.title}
            onClick={() => onSelect?.(pin.id)}
          >
            <span
              className="block rounded-full shadow"
              style={{
                width: active ? 22 : 16,
                height: active ? 22 : 16,
                background: pin.color,
                border: active ? '3px solid #0A2E5C' : '2px solid #ffffff',
              }}
            />
          </AdvancedMarker>
        )
      })}
    </GoogleMap>
  )
}

export default function GoogleMapView(props: MapViewProps) {
  return (
    <div className={props.className ?? 'h-full w-full'}>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <MapBody {...props} />
      </APIProvider>
    </div>
  )
}
