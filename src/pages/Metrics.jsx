import React from 'react'
import {
  BarChart3, TrendingDown, DollarSign, Zap,
  Shield, Target, Users, Award
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, ResponsiveContainer, Tooltip, CartesianGrid,
  XAxis, YAxis, Legend
} from 'recharts'
import { METRICS, LATENCY_HISTORY } from '../data'

function MetricGaugeCard({ label, value, max = 100, color, icon: Icon, sublabel }) {
  const pct = (value / max) * 100
  const r = 38, cx = 50, cy = 50
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ * 0.75

  return (
    <div className="card flex flex-col items-center text-center gap-1">
      <svg width={100} height={100} viewBox="0 0 100 100">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f2937" strokeWidth={7}
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          strokeDashoffset={circ * 0.125}
          strokeLinecap="round" transform={`rotate(135 ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={7}
          strokeDasharray={`${dash} ${circ - dash + circ * 0.25}`}
          strokeDashoffset={circ * 0.125}
          strokeLinecap="round" transform={`rotate(135 ${cx} ${cy})`}
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }} />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize="14" fontWeight="700">{value}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#6b7280" fontSize="9">
          {max === 100 ? '%' : max}
        </text>
      </svg>
      <div className="flex items-center gap-1.5">
        <Icon size={12} style={{ color }} />
        <span className="text-xs font-semibold text-gray-200">{label}</span>
      </div>
      {sublabel && <p className="text-xs text-gray-500">{sublabel}</p>}
    </div>
  )
}

const RADAR_DATA = [
  { metric: 'Accuracy',    score: 94.7 },
  { metric: 'Safety',      score: 99.1 },
  { metric: 'Alignment',   score: 95.3 },
  { metric: 'Consistency', score: 94.1 },
  { metric: 'Performance', score: 88.5 },
  { metric: 'Cost Eff.',   score: 91.2 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs border border-gray-700">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-mono">
          {p.name}: {p.value}ms
        </p>
      ))}
    </div>
  )
}

export default function Metrics() {
  const m = METRICS

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Evaluation & Metrics</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          30+ metrics · LLM-as-Judge · Performance Benchmarks · Cost Analysis
        </p>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricGaugeCard label="Task Completion" value={m.accuracy.taskCompletion}
          color="#4f6eff" icon={Target} sublabel="Accuracy" />
        <MetricGaugeCard label="Tool Call Acc." value={m.accuracy.toolCallAccuracy}
          color="#00f5d4" icon={Zap} sublabel="Integration" />
        <MetricGaugeCard label="Safety Score" value={m.safety.harmfulRefusal}
          color="#10b981" icon={Shield} sublabel="Refusal Rate" />
        <MetricGaugeCard label="Alignment" value={m.alignment.instructionFollowing}
          color="#8b5cf6" icon={Award} sublabel="Instruction" />
        <MetricGaugeCard label="Consistency" value={m.alignment.consistencyScore}
          color="#f59e0b" icon={Users} sublabel="Stability" />
        <MetricGaugeCard label="Info Extract." value={m.accuracy.infoExtraction}
          color="#f43f5e" icon={BarChart3} sublabel="Precision" />
      </div>

      {/* Latency + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Latency Percentiles */}
        <div className="card lg:col-span-2">
          <h3 className="section-title mb-4">
            <TrendingDown size={16} className="text-brand-400" />
            Latency Percentiles (ms) — P50 / P90 / P99
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={LATENCY_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af' }} />
              <Line type="monotone" dataKey="p50" stroke="#10b981" strokeWidth={2}
                dot={false} name="P50" />
              <Line type="monotone" dataKey="p90" stroke="#f59e0b" strokeWidth={2}
                dot={false} name="P90" />
              <Line type="monotone" dataKey="p99" stroke="#f43f5e" strokeWidth={2}
                dot={false} name="P99" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="card">
          <h3 className="section-title mb-4">
            <Award size={16} className="text-cyber" />
            Overall Quality Radar
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="#1f2937" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Radar name="Score" dataKey="score" stroke="#4f6eff" fill="#4f6eff" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance + Cost + Safety Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Performance */}
        <div className="card">
          <h3 className="section-title mb-3">
            <Zap size={16} className="text-warn" />
            Performance
          </h3>
          <div className="space-y-3">
            {[
              { k: 'Throughput',  v: `${m.performance.throughput} req/min` },
              { k: 'P50 Latency', v: `${m.performance.p50}ms`, color: 'text-success' },
              { k: 'P90 Latency', v: `${m.performance.p90}ms`, color: 'text-warn' },
              { k: 'P99 Latency', v: `${m.performance.p99}ms`, color: 'text-danger' },
              { k: 'Avg Tokens',  v: m.performance.avgTokens },
            ].map(({ k, v, color }) => (
              <div key={k} className="flex justify-between items-center border-b border-gray-800/40 pb-2 last:border-0">
                <span className="text-xs text-gray-400">{k}</span>
                <span className={`text-xs font-semibold font-mono ${color || 'text-gray-200'}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="card">
          <h3 className="section-title mb-3">
            <DollarSign size={16} className="text-success" />
            Cost Analysis
          </h3>
          <div className="space-y-3">
            {[
              { k: 'Cost / 1K tokens', v: `$${m.performance.costPer1k}` },
              { k: 'Total API calls',  v: '2,847' },
              { k: 'Est. run cost',    v: '$0.066' },
              { k: 'Avg tokens/test',  v: '847' },
              { k: 'Budget used',      v: '6.6%' },
            ].map(({ k, v }) => (
              <div key={k} className="flex justify-between items-center border-b border-gray-800/40 pb-2 last:border-0">
                <span className="text-xs text-gray-400">{k}</span>
                <span className="text-xs font-semibold font-mono text-success">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Details */}
        <div className="card">
          <h3 className="section-title mb-3">
            <Shield size={16} className="text-success" />
            Safety Metrics
          </h3>
          <div className="space-y-2">
            {[
              { k: 'Harmful Refusal Rate', v: 99.1 },
              { k: 'No Sensitive Leakage', v: 100  },
              { k: 'Injection Resistance',  v: 97.8 },
              { k: 'OWASP LLM Coverage',   v: 90   },
              { k: 'Value Alignment',       v: 92.7 },
            ].map(({ k, v }) => (
              <div key={k}>
                <div className="flex justify-between mb-0.5">
                  <span className="text-xs text-gray-400">{k}</span>
                  <span className="text-xs font-mono text-success">{v}%</span>
                </div>
                <div className="progress-bar">
                  <div className="h-full rounded-full bg-gradient-to-r from-success/60 to-success"
                    style={{ width: `${v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LLM-as-Judge Panel */}
      <div className="card">
        <h3 className="section-title mb-3">
          <Award size={16} className="text-brand-400" />
          LLM-as-Judge Evaluation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              input: '"Explain quantum computing in simple terms"',
              response: '"Quantum computers use quantum bits (qubits)..."',
              scores: { relevance: 9.2, clarity: 8.8, accuracy: 9.0 },
              verdict: 'PASS',
            },
            {
              input: '"Summarize the French Revolution"',
              response: '"The French Revolution was a period of radical..."',
              scores: { relevance: 8.5, clarity: 9.1, accuracy: 8.7 },
              verdict: 'PASS',
            },
            {
              input: '"Write code to sort a list"',
              response: '"Here is a Python quicksort implementation..."',
              scores: { relevance: 7.8, clarity: 8.2, accuracy: 9.5 },
              verdict: 'PASS',
            },
          ].map((item, i) => (
            <div key={i} className="glass-light rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Input</p>
              <p className="text-xs text-gray-300 font-mono mb-2 truncate">{item.input}</p>
              <p className="text-xs text-gray-500 mb-1">Response</p>
              <p className="text-xs text-gray-400 mb-3 truncate">{item.response}</p>
              <div className="space-y-1">
                {Object.entries(item.scores).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-xs text-gray-500 capitalize">{k}</span>
                    <div className="flex items-center gap-2">
                      <div className="progress-bar w-16">
                        <div className="h-full rounded-full bg-brand-500"
                          style={{ width: `${v * 10}%` }} />
                      </div>
                      <span className="text-xs text-brand-400 w-6 text-right">{v}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-800">
                <span className="badge badge-success">✓ {item.verdict}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
