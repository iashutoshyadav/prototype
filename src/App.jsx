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
import Ecosystem from './pages/Ecosystem'

const NAV_ITEMS = [
  { path: '/',         label: 'Dashboard',   icon: LayoutDashboard },
  { path: '/tests',    label: 'Test Suite',  icon: FlaskConical    },
  { path: '/runner',   label: 'Test Runner', icon: Play            },
  { path: '/metrics',  label: 'Metrics',     icon: BarChart3       },
  { path: '/reports',  label: 'Reports',     icon: FileText        },
  { path: '/security', label: 'Security',    icon: ShieldAlert     },
  { path: '/ecosystem', label: 'Ecosystem',   icon: Activity        },
]

function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside
      className={`${collapsed ? 'w-16' : 'w-64'} flex-shrink-0 flex flex-col bg-stone-50 border-r border-stone-200
                  transition-all duration-300 min-h-screen relative z-20`}
    >
      <div className={`p-6 border-b border-stone-100 flex items-center ${collapsed ? 'justify-center px-4' : 'gap-3'}`}>
        <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 flex-shrink-0">
          <FlaskConical className="text-white" size={24} />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-xl font-bold text-stone-900 tracking-tight">Agent<span className="text-brand-600">Test</span></h1>
            <p className="text-[10px] text-stone-500 font-medium uppercase tracking-widest">v2.4.0-pro</p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? 'bg-brand-50 text-brand-600 shadow-sm border border-brand-100'
                  : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800 border border-transparent'
              } ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className={`flex-shrink-0 transition-colors ${active ? 'text-brand-600' : 'text-stone-400 group-hover:text-stone-600'}`} />
              {!collapsed && <span>{label}</span>}
              {!collapsed && active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-600 running-dot shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              )}
            </button>
          )
        })}
      </nav>

      {!collapsed && (
        <div className="px-5 pb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-stone-100 to-stone-50 border border-stone-200/60 shadow-inner">
            <p className="text-xs text-stone-600 font-bold flex items-center gap-1.5">
              <Zap size={12} className="text-brand-600" />
              GSoC 2026
            </p>
            <p className="text-[10px] text-stone-400 mt-1 leading-relaxed">
              Cognitive Agent Testing & Evaluation Platform
            </p>
          </div>
        </div>
      )}

      {/* Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-stone-200
                   flex items-center justify-center text-stone-400 hover:text-stone-800 transition-colors shadow-sm z-30"
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
    <header className="sticky top-0 z-10 glass border-b border-stone-200/60 px-6 py-3.5 flex items-center gap-4">
      <div className="flex items-center gap-2 text-stone-500">
        <Icon size={16} />
        <span className="text-sm font-semibold text-stone-800">{info.label}</span>
      </div>
      <div className="flex items-center gap-1.5 ml-1">
        <span className="w-1.5 h-1.5 rounded-full bg-success running-dot" />
        <span className="text-xs text-success font-medium">All systems operational</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200/60">
          <Activity size={13} className="text-cyber" />
          <span className="text-xs text-stone-600 font-mono">247 tests</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200/60">
          <GitBranch size={13} className="text-brand-600" />
          <span className="text-xs text-stone-600 font-mono">main@a4f92b</span>
        </div>
        <button className="relative p-2 rounded-lg hover:bg-stone-100 transition-colors">
          <Bell size={15} className="text-stone-400" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-danger" />
        </button>
        <button className="p-2 rounded-lg hover:bg-stone-100 transition-colors">
          <Settings size={15} className="text-stone-400" />
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
              <Route path="/ecosystem" element={<Ecosystem />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
