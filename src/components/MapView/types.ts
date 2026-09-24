/**
 * Kontrak peta yang netral terhadap penyedia. Halaman hanya bergantung pada
 * tipe di file ini, sehingga Google Maps dan Leaflet bisa ditukar lewat
 * VITE_MAP_PROVIDER tanpa mengubah kode halaman.
 */

export interface MapPin {
  id: string
  lat: number
  lng: number
  /** Warna isi marker (hex). */
  color: string
  title: string
  subtitle?: string
}

export interface MapRing {
  radiusM: number
  color: string
  label: string
}

export interface MapOrigin {
  lat: number
  lng: number
  label: string
}

export interface MapViewProps {
  center: { lat: number; lng: number }
  zoom: number
  pins: MapPin[]
  /** Lingkaran radius yang digambar dari `origin`. */
  rings?: MapRing[]
  origin?: MapOrigin
  /**
   * Bila diisi, peta menyesuaikan tampilan agar lingkaran sebesar radius ini
   * (dalam meter, berpusat di `origin`) muat seluruhnya - lebih andal daripada
   * menebak level zoom.
   */
  fitRadiusM?: number
  selectedId?: string | null
  onSelect?: (id: string | null) => void
  className?: string
}
