import { useEffect } from 'react'
import L from 'leaflet'
import { Circle, MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { MapPin, MapViewProps } from './types'

/**
 * Marker dibuat dengan divIcon sehingga tidak bergantung pada aset gambar
 * bawaan Leaflet (yang kerap rusak saat di-bundle) dan warnanya bisa mengikuti
 * status komunitas.
 */
function pinIcon(pin: MapPin, active: boolean): L.DivIcon {
  const size = active ? 22 : 16
  const ring = active ? '3px solid #0A2E5C' : '2px solid #ffffff'
  return L.divIcon({
    className: 'pim2-pin',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html:
      '<span style="display:block;width:' +
      size +
      'px;height:' +
      size +
      'px;border-radius:9999px;background:' +
      pin.color +
      ';border:' +
      ring +
      ';box-shadow:0 1px 4px rgba(4,18,38,.45)"></span>',
  })
}

function branchIcon(): L.DivIcon {
  return L.divIcon({
    className: 'pim2-branch',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    html:
      '<span style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;' +
      'border-radius:6px;background:#0A2E5C;color:#F5B400;border:2px solid #fff;font-size:11px;' +
      'font-weight:700;box-shadow:0 2px 6px rgba(4,18,38,.5)">M</span>',
  })
}

function ViewSync({
  center,
  zoom,
  fitRadiusM,
}: {
  center: { lat: number; lng: number }
  zoom: number
  fitRadiusM?: number
}) {
  const map = useMap()
  useEffect(() => {
    const target = L.latLng(center.lat, center.lng)
    if (fitRadiusM) map.fitBounds(target.toBounds(fitRadiusM * 2), { padding: [8, 8] })
    else map.setView(target, zoom)
  }, [map, center.lat, center.lng, zoom, fitRadiusM])
  return null
}

function FlyToSelected({ pins, selectedId }: { pins: MapPin[]; selectedId?: string | null }) {
  const map = useMap()
  useEffect(() => {
    if (!selectedId) return
    const pin = pins.find((p) => p.id === selectedId)
    if (pin) map.panTo([pin.lat, pin.lng], { animate: true })
  }, [map, pins, selectedId])
  return null
}

export default function LeafletMapView({
  center,
  zoom,
  pins,
  rings = [],
  origin,
  fitRadiusM,
  selectedId,
  onSelect,
  className,
}: MapViewProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      scrollWheelZoom
      className={className ?? 'h-full w-full'}
      attributionControl
    >
      <TileLayer
        attribution='&copy; kontributor <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <ViewSync center={center} zoom={zoom} fitRadiusM={fitRadiusM} />
      <FlyToSelected pins={pins} selectedId={selectedId} />

      {origin &&
        rings.map((ring) => (
          <Circle
            key={ring.radiusM}
            center={[origin.lat, origin.lng]}
            radius={ring.radiusM}
            pathOptions={{
              color: ring.color,
              weight: 1.5,
              opacity: 0.7,
              fillColor: ring.color,
              fillOpacity: 0.04,
              dashArray: '6 6',
            }}
          />
        ))}

      {origin && (
        <Marker position={[origin.lat, origin.lng]} icon={branchIcon()} zIndexOffset={1000}>
          <Tooltip direction="top" offset={[0, -14]}>
            {origin.label}
          </Tooltip>
        </Marker>
      )}

      {pins.map((pin) => (
        <Marker
          key={pin.id}
          position={[pin.lat, pin.lng]}
          icon={pinIcon(pin, pin.id === selectedId)}
          eventHandlers={{ click: () => onSelect?.(pin.id) }}
        >
          <Tooltip direction="top" offset={[0, -10]}>
            <span className="font-semibold">{pin.title}</span>
            {pin.subtitle ? <span className="block text-[11px]">{pin.subtitle}</span> : null}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  )
}
