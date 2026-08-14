import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Github, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: '框架榜', to: '/' },
  { label: '产品榜', to: '/products' },
  { label: 'Wiki 档案', to: '/wiki' },
  { label: '最小 Demo', to: '/demos' },
  { label: '洞察', to: '/insights' },
  { label: '方法论', to: '/about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-300',
        scrolled ? 'border-line bg-bg/85 backdrop-blur-md' : 'border-transparent bg-transparent'
      )}
    >
      <div className="container-site flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3" data-cursor="link">
          <img src="/logo.svg" alt="Agent VS Wiki" className="h-7 w-7" />
          <span className="font-display text-lg font-bold tracking-tight">
            AGENT <span className="text-vs">VS</span> WIKI
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'mono-label transition-colors hover:text-ink',
                  isActive ? 'text-vs' : 'text-ink-dim'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <span className="mono-label border border-line px-2 py-1 text-ink-faint">
            评审时间 2026.08
          </span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-ink-dim transition-colors hover:text-ink"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>

        <button
          className="text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="菜单"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col gap-2 border-t border-line bg-bg/95 p-6 backdrop-blur-lg md:hidden"
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i, duration: 0.35 }}
              >
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block border-b border-line py-4 font-display text-2xl font-bold',
                      isActive ? 'text-vs' : 'text-ink'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </motion.div>
            ))}
            <span className="mono-label mt-6 text-ink-faint">评审时间 2026.08</span>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
