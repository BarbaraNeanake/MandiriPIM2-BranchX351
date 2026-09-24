import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Activity, ActivityDraft, Community, CommunityDraft } from '../types'
import { repo } from '../lib/repo'

interface DataState {
  communities: Community[]
  activities: Activity[]
  byId: Map<string, Community>
  loading: boolean
  error: string | null
  backend: string
  addCommunity: (draft: CommunityDraft) => Promise<Community>
  editCommunity: (id: string, patch: Partial<CommunityDraft>) => Promise<Community>
  removeCommunity: (id: string) => Promise<void>
  addActivity: (draft: ActivityDraft) => Promise<Activity>
  removeActivity: (id: string) => Promise<void>
  resetData: () => Promise<void>
}

const DataContext = createContext<DataState | null>(null)

/** Urutan bawaan: terdekat dari cabang lebih dulu. */
function byDistance(a: Community, b: Community): number {
  return a.distance_km - b.distance_km || a.name.localeCompare(b.name, 'id')
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [communities, setCommunities] = useState<Community[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    const [c, a] = await Promise.all([repo.listCommunities(), repo.listActivities()])
    setCommunities([...c].sort(byDistance))
    setActivities([...a].sort((x, y) => y.date.localeCompare(x.date)))
  }, [])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        await repo.init()
        if (alive) await reload()
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : String(err))
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [reload])

  const guard = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    try {
      const result = await fn()
      setError(null)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
      throw err
    }
  }, [])

  const addCommunity = useCallback(
    (draft: CommunityDraft) =>
      guard(async () => {
        const created = await repo.createCommunity(draft)
        setCommunities((prev) => [...prev, created].sort(byDistance))
        return created
      }),
    [guard],
  )

  const editCommunity = useCallback(
    (id: string, patch: Partial<CommunityDraft>) =>
      guard(async () => {
        const updated = await repo.updateCommunity(id, patch)
        setCommunities((prev) =>
          prev.map((c) => (c.id === id ? updated : c)).sort(byDistance),
        )
        return updated
      }),
    [guard],
  )

  const removeCommunity = useCallback(
    (id: string) =>
      guard(async () => {
        await repo.deleteCommunity(id)
        setCommunities((prev) => prev.filter((c) => c.id !== id))
        setActivities((prev) => prev.filter((a) => a.community_id !== id))
      }),
    [guard],
  )

  const addActivity = useCallback(
    (draft: ActivityDraft) =>
      guard(async () => {
        const created = await repo.createActivity(draft)
        setActivities((prev) => [created, ...prev].sort((x, y) => y.date.localeCompare(x.date)))
        // Aktivitas yang membawa NTB ikut memperbarui total pada komunitasnya.
        if (created.ntb_added > 0) {
          const target = await repo.listCommunities().then((all) =>
            all.find((c) => c.id === created.community_id),
          )
          if (target) {
            const updated = await repo.updateCommunity(created.community_id, {
              ntb_acquired: (target.ntb_acquired ?? 0) + created.ntb_added,
            })
            setCommunities((prev) =>
              prev.map((c) => (c.id === updated.id ? updated : c)).sort(byDistance),
            )
          }
        }
        return created
      }),
    [guard],
  )

  const removeActivity = useCallback(
    (id: string) =>
      guard(async () => {
        await repo.deleteActivity(id)
        setActivities((prev) => prev.filter((a) => a.id !== id))
      }),
    [guard],
  )

  const resetData = useCallback(
    () =>
      guard(async () => {
        await repo.resetToSeed()
        await reload()
      }),
    [guard, reload],
  )

  const byId = useMemo(() => new Map(communities.map((c) => [c.id, c])), [communities])

  const value: DataState = {
    communities,
    activities,
    byId,
    loading,
    error,
    backend: repo.kind,
    addCommunity,
    editCommunity,
    removeCommunity,
    addActivity,
    removeActivity,
    resetData,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataState {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData harus dipakai di dalam DataProvider')
  return ctx
}
