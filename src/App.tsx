import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CommunityMap from './pages/CommunityMap'
import Database from './pages/Database'
import Pipeline from './pages/Pipeline'
import ActivityLog from './pages/ActivityLog'
import { useData } from './state/DataContext'

function Loading() {
  return (
    <div className="flex h-64 items-center justify-center text-sm text-navy-400">
      Memuat data komunitas...
    </div>
  )
}

export default function App() {
  const { loading } = useData()
  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/peta" element={<CommunityMap />} />
          <Route path="/database" element={<Database />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/aktivitas" element={<ActivityLog />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </Layout>
  )
}
