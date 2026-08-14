import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import Cursor from './Cursor'

export default function Layout() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Cursor />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
