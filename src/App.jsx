import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, FlaskConical, Play, BarChart3,
  FileText, ShieldAlert, ChevronLeft, ChevronRight,
  Zap, Activity, GitBranch, Bell, Settings
} from 'lucide-react'

import Dashboard from './pages/Dashboard'
import TestSuite from './pages/TestSuite'
import TestRunner from './pages/TestRunner'
import Metrics from './pages/Metrics'
import Reports from './pages/Reports'
import Security from './pages/Security'

const NAV_ITEMS = [
  { path: '/',         label: 'Dashboard',   icon: LayoutDashboard },
  { path: '/tests',    label: 'Test Suite',  icon: FlaskConical    },
  { path: '/runner',   label: 'Test Runner', icon: Play            },
  { path: '/metrics',  label: 'Metrics',     icon: BarChart3       },
  { path: '/reports',  label: 'Reports',     icon: FileText        },
  { path: '/security', label: 'Security',    icon: ShieldAlert     },
]

function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside
      className={`${collapsed ? 'w-16' : 'w-60'} flex-shrink-0 flex flex-col glass border-r border-gray-800/60
                  transition-all duration-300 min-h-screen relative z-20`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-800/60 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-cyber flex items-center justify-center flex-shrink-0 glow-brand">
          <Zap size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white leading-tight">AgentTest</span>
            <span className="text-xs text-gray-500 leading-tight">Eval Platform</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`nav-item w-full text-left ${active ? 'nav-item-active' : 'nav-item-inactive'}
                          ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
              {!collapsed && active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400 running-dot" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      {!collapsed && (
        <div className="px-3 pb-4 space-y-1">
          <div className="px-3 py-2 rounded-xl bg-brand-600/10 border border-brand-500/20">
            <p className="text-xs text-brand-300 font-medium">GSoC 2026 Prototype</p>
            <p className="text-xs text-gray-500 mt-0.5">MoFA Agent Framework</p>
          </div>
        </div>
      )}

      {/* Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-gray-800 border border-gray-700
                   flex items-center justify-center text-gray-400 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  )
}

function Header() {
  const location = useLocation()
  const info = NAV_ITEMS.find(n => n.path === location.pathname) || NAV_ITEMS[0]
  const Icon = info.icon
  return (
    <header className="sticky top-0 z-10 glass border-b border-gray-800/60 px-6 py-3.5 flex items-center gap-4">
      <div className="flex items-center gap-2 text-gray-300">
        <Icon size={16} />
        <span className="text-sm font-semibold text-gray-200">{info.label}</span>
      </div>
      <div className="flex items-center gap-1.5 ml-1">
        <span className="w-1.5 h-1.5 rounded-full bg-success running-dot" />
        <span className="text-xs text-success font-medium">All systems operational</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700/60">
          <Activity size={13} className="text-cyber" />
          <span className="text-xs text-gray-300 font-mono">247 tests</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700/60">
          <GitBranch size={13} className="text-brand-400" />
          <span className="text-xs text-gray-300 font-mono">main@a4f92b</span>
        </div>
        <button className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors">
          <Bell size={15} className="text-gray-400" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-danger" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
          <Settings size={15} className="text-gray-400" />
        </button>
      </div>
    </header>
  )
}

function App() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-6 overflow-auto animate-fade-in">
            <Routes>
              <Route path="/"         element={<Dashboard />} />
              <Route path="/tests"    element={<TestSuite />} />
              <Route path="/runner"   element={<TestRunner />} />
              <Route path="/metrics"  element={<Metrics />} />
              <Route path="/reports"  element={<Reports />} />
              <Route path="/security" element={<Security />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
