import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="ml-60 h-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
