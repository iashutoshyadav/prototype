import React from 'react'
import {
  CheckCircle2, XCircle, Clock, TrendingUp,
  Activity, Zap, Target, Shield, Play, ArrowUpRight
} from 'lucide-react'
import {
  LineChart, Line, ResponsiveContainer, Tooltip, CartesianGrid, YAxis, XAxis
} from 'recharts'
import { METRICS, PASS_RATE_HISTORY, ACTIVITY_FEED, TEST_CASES } from '../data'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'


function StatCard({ label, value, sub, icon: Icon, color, trend }) {
  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${color} mb-2`}>
          <Icon size={18} />
        </div>
        {trend && (
          <span className="flex items-center gap-0.5 text-xs text-success font-medium">
            <ArrowUpRight size={12} /> {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-stone-900">{value}</p>
      <p className="text-sm font-medium text-stone-600">{label}</p>
      {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function MiniGauge({ label, value, color }) {
  const r = 30, cx = 40, cy = 40
  const circ = 2 * Math.PI * r
  const dash = (value / 100) * circ * 0.75
  const gap  = circ - dash

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={80} height={80} viewBox="0 0 80 80">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e7e5e4" strokeWidth={6}
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          strokeDashoffset={circ * 0.125}
          strokeLinecap="round" transform={`rotate(135 ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={`${dash} ${gap + circ * 0.25}`}
          strokeDashoffset={circ * 0.125}
          strokeLinecap="round" transform={`rotate(135 ${cx} ${cy})`} />
        <text x={cx} y={cy + 5} textAnchor="middle" fill="#1c1917" fontSize="12" fontWeight="700">{value}%</text>
      </svg>
      <span className="text-xs text-stone-500 text-center leading-tight">{label}</span>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs border border-stone-200 shadow-sm">
      <p className="text-stone-500 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}%</p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  
  useEffect(() => {
    fetch('/test_report.json')
      .then(r => r.json())
      .then(setReport)
      .catch(e => console.error("Error loading test report:", e))
  }, [])

  const m = report ? report.summary : METRICS.overall

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Testing Overview</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Cognitive Agent Testing & Evaluation Platform — Last run: {m.lastRun}
          </p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/runner')}>
          <Play size={14} /> Run All Tests
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tests" value={m.totalTests} sub="8 suites active"
          icon={FlaskConical2} color="bg-brand-100 text-brand-700" trend="+12 this week" />
        <StatCard label="Pass Rate" value={`${m.passRate}%`} sub={`${m.passed} passed · ${m.failed} failed`}
          icon={CheckCircle2} color="bg-success/10 text-success" trend="+0.5%" />
        <StatCard label="Avg Latency" value={`${m.avgDuration}ms`} sub="P99: 432ms"
          icon={Zap} color="bg-warn/10 text-warn" />
        <StatCard label="Coverage" value={`${m.coverage}%`} sub="Code branch coverage"
          icon={Target} color="bg-cyber/10 text-cyber" trend="+1.2%" />
      </div>

      {/* Charts + Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pass Rate Chart */}
        <div className="card lg:col-span-2">
          <h3 className="section-title mb-4">
            <TrendingUp size={16} className="text-brand-400" />
            Pass Rate Trend (7 days)
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={PASS_RATE_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#78716c' }} />
              <YAxis domain={[88, 100]} tick={{ fontSize: 11, fill: '#78716c' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="rate" stroke="#d97706" strokeWidth={2.5}
                dot={{ fill: '#d97706', r: 3 }} name="Pass Rate" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gauges */}
        <div className="card">
          <h3 className="section-title mb-4">
            <Shield size={16} className="text-cyber" />
            Key Metrics
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <MiniGauge label="Task Completion" value={94.7} color="#d97706" />
            <MiniGauge label="Safety Score"    value={99.1} color="#16a34a" />
            <MiniGauge label="Alignment"       value={95.3} color="#0d9488" />
            <MiniGauge label="Consistency"     value={94.1} color="#ea580c" />
          </div>
        </div>
      </div>

      {/* Recent Tests + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Tests */}
        <div className="card">
          <h3 className="section-title mb-3">
            <Activity size={16} className="text-brand-400" />
            Recent Test Results
          </h3>
          <div className="space-y-0">
            {TEST_CASES.slice(0, 6).map(tc => (
              <div key={tc.id} className="table-row flex items-center gap-3 py-2.5 px-1">
                {tc.status === 'pass'
                  ? <CheckCircle2 size={14} className="text-success flex-shrink-0" />
                  : <XCircle size={14} className="text-danger flex-shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-stone-800 truncate">{tc.name}</p>
                  <p className="text-xs text-stone-400">{tc.category} · {tc.assertions} assertions</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`badge ${tc.status === 'pass' ? 'badge-success' : 'badge-danger'}`}>
                    {tc.status}
                  </span>
                  <p className="text-xs text-stone-400 mt-0.5">{tc.duration}ms</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/tests')} className="btn-secondary w-full mt-3 justify-center text-xs">
            View All Tests →
          </button>
        </div>

        {/* Activity Feed */}
        <div className="card">
          <h3 className="section-title mb-3">
            <Activity size={16} className="text-cyber" />
            Live Activity Feed
          </h3>
          <div className="space-y-2">
            {ACTIVITY_FEED.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-stone-100 last:border-0">
                <span className="text-xs text-stone-400 font-mono flex-shrink-0 mt-0.5">{item.time}</span>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${
                  item.type === 'pass' ? 'bg-success' :
                  item.type === 'fail' ? 'bg-danger' :
                  item.type === 'warn' ? 'bg-warn' : 'bg-brand-500'
                }`} />
                <p className={`text-xs leading-relaxed ${
                  item.type === 'fail' ? 'text-danger' :
                  item.type === 'warn' ? 'text-warn' : 'text-stone-600'
                }`}>{item.msg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Icon shim (lucide doesn't have FlaskConical2)
function FlaskConical2({ size, className }) {
  return <CheckCircle2 size={size} className={className} />
}
