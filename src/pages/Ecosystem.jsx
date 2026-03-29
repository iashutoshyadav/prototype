import React from 'react'
import { 
  Database, GitMerge, Layers, Cpu, 
  Search, CheckCircle2, AlertCircle, 
  History, Share2, Workflow
} from 'lucide-react'

const MEMORY_STATES = [
  { key: 'user_profile', accuracy: 0.98, status: 'Synced' },
  { key: 'session_history', accuracy: 0.95, status: 'Synced' },
  { key: 'goal_state', accuracy: 1.0, status: 'Synced' },
  { key: 'tool_output_cache', accuracy: 0.89, status: 'Degraded' },
  { key: 'vector_index_01', accuracy: 0.92, status: 'Synced' },
  { key: 'long_term_prefs', accuracy: 0.94, status: 'Synced' },
]

const COLLABORATION_TRACE = [
  { time: '10:00:01', agent: 'Supervisor', action: 'Task Received', status: 'success' },
  { time: '10:00:02', agent: 'Orchestrator', action: 'Plan Generated', status: 'success' },
  { time: '10:00:05', agent: 'Researcher', action: 'Query Executed', status: 'success' },
  { time: '10:00:12', agent: 'Writer', action: 'Content Drafted', status: 'pending' },
  { time: '10:00:15', agent: 'Supervisor', action: 'Review Started', status: 'waiting' },
]

export default function Ecosystem() {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">MoFA Ecosystem Integration</h1>
        <p className="text-sm text-stone-500 mt-0.5">
          Memory System Validation · Orchestrator Auditing · Multi-Agent Collaboration
        </p>
      </div>

      {/* Integration Badges */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Memory Accuracy', value: '96.4%', icon: Database, color: 'text-cyber' },
          { label: 'Orchestration Sync', value: '99.2%', icon: GitMerge, color: 'text-brand-400' },
          { label: 'Cross-Agent Latency', value: '14ms', icon: Cpu, color: 'text-success' },
          { label: 'Consistency Score', value: '0.98', icon: Layers, color: 'text-warn' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-4 px-5 py-4">
            <div className={`p-2.5 rounded-xl bg-stone-100 border border-stone-200 ${color} glow-sm`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-xs text-stone-500">{label}</p>
              <p className="text-xl font-bold text-stone-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Memory Validation */}
        <div className="card">
          <h3 className="section-title mb-4">
            <Database size={16} className="text-cyber" />
            Memory Persistence Validation
          </h3>
          <div className="space-y-2">
            {MEMORY_STATES.map((s, i) => (
              <div key={i} className="glass-light rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${s.status === 'Synced' ? 'bg-success' : 'bg-warn'} animate-pulse`} />
                  <div>
                    <p className="text-sm font-semibold text-stone-800 font-mono italic">{s.key}</p>
                    <p className="text-xs text-stone-500">Status: {s.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${s.accuracy > 0.95 ? 'text-success' : 'text-warn'}`}>
                    {(s.accuracy * 100).toFixed(1)}%
                  </p>
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider">Accuracy</p>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary w-full mt-4 flex items-center justify-center gap-2">
            <Search size={14} />
            Deep Scan Memory Context
          </button>
        </div>

        {/* Orchestrator Audit */}
        <div className="card">
          <h3 className="section-title mb-4">
            <Workflow size={16} className="text-brand-400" />
            Multi-Agent Collaboration Trace
          </h3>
          <div className="relative pl-6 border-l border-stone-200 space-y-6">
            {COLLABORATION_TRACE.map((step, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-8 top-1 w-4 h-4 rounded-full border-2 border-white ${
                  step.status === 'success' ? 'bg-success' : step.status === 'pending' ? 'bg-cyber' : 'bg-stone-300'
                }`} />
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-tighter">{step.agent}</span>
                    <span className="text-[10px] font-mono text-stone-400">{step.time}</span>
                  </div>
                  <p className="text-sm text-stone-800 mt-1">{step.action}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                      step.status === 'success' ? 'bg-success/10 border-success/20 text-success' : 'bg-stone-100 border-stone-200 text-stone-500'
                    }`}>
                      {step.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-brand w-full mt-6 flex items-center justify-center gap-2">
            <History size={14} />
            Export Trace Log (JUnit)
          </button>
        </div>
      </div>

      {/* Orchestrator Metrics */}
      <div className="card">
        <h3 className="section-title mb-4">
          <Share2 size={16} className="text-cyber" />
          Orchestrator Decision Quality
        </h3>
        <div className="h-48 flex items-end gap-2 px-2">
          {[65, 82, 45, 90, 75, 88, 92, 70, 85, 95].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-gradient-to-t from-brand-500/10 to-brand-500/30 rounded-t-lg border-x border-t border-brand-500/20 transition-all hover:to-brand-500/40"
                style={{ height: `${h}%` }}
              />
              <span className="text-[10px] text-stone-400 font-mono">T-{10-i}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
