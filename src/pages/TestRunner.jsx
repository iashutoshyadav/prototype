import React, { useState, useEffect, useRef } from 'react'
import {
  Play, Pause, RotateCcw, Server, Cpu, CheckCircle2,
  XCircle, Clock, Zap, Shuffle, Shield, Database
} from 'lucide-react'
import { TEST_CASES, MOCK_SERVER_RESPONSES } from '../data'

const STATUSES = ['idle', 'running', 'done']

function useTestRunner(cases) {
  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState({})
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef(null)
  const runRef = useRef(null)

  const reset = () => {
    clearInterval(timerRef.current)
    clearTimeout(runRef.current)
    setStatus('idle')
    setProgress({})
    setElapsed(0)
  }

  const run = () => {
    reset()
    setStatus('running')
    // start elapsed timer
    const start = Date.now()
    timerRef.current = setInterval(() => {
      setElapsed(Math.round((Date.now() - start) / 100) / 10)
    }, 100)

    // simulate each test completing after its duration
    cases.forEach(tc => {
      setProgress(p => ({ ...p, [tc.id]: 'running' }))
      setTimeout(() => {
        setProgress(p => ({ ...p, [tc.id]: tc.status }))
      }, tc.duration * 1.5 + Math.random() * 200)
    })

    // mark done after longest test
    const max = Math.max(...cases.map(tc => tc.duration)) * 1.5 + 500
    runRef.current = setTimeout(() => {
      setStatus('done')
      clearInterval(timerRef.current)
    }, max)
  }

  useEffect(() => () => {
    clearInterval(timerRef.current)
    clearTimeout(runRef.current)
  }, [])

  return { status, progress, elapsed, run, reset }
}

function TestRow({ tc, state }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 border-b border-gray-800/50 last:border-0 transition-all">
      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
        {state === 'running' && (
          <div className="w-4 h-4 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
        )}
        {state === 'pass' && <CheckCircle2 size={16} className="text-success" />}
        {state === 'fail' && <XCircle size={16} className="text-danger" />}
        {!state && <div className="w-3 h-3 rounded-full bg-gray-700" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-200 truncate">{tc.name}</p>
        <p className="text-xs text-gray-600">{tc.category}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {state && state !== 'running' && (
          <span className={`badge text-xs ${state === 'pass' ? 'badge-success' : 'badge-danger'}`}>{state}</span>
        )}
        {state === 'running' && <span className="badge badge-brand">running</span>}
        <span className="text-xs text-gray-500 w-14 text-right font-mono">{tc.duration}ms</span>
      </div>
    </div>
  )
}

function MockServerPanel() {
  return (
    <div className="card">
      <h3 className="section-title mb-3">
        <Server size={16} className="text-cyber" />
        LLM Mock Server
      </h3>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-success running-dot" />
        <span className="text-xs text-success font-medium">Active on :8080</span>
        <span className="badge badge-cyber ml-auto">OpenAI · Anthropic · Gemini</span>
      </div>
      <div className="space-y-2">
        {MOCK_SERVER_RESPONSES.map(r => (
          <div key={r.id} className="glass-light rounded-xl px-3 py-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-brand-400">{r.pattern}</span>
              <div className="flex items-center gap-2">
                <span className="badge badge-brand text-xs">{r.model}</span>
                <span className="text-xs text-gray-500">{r.hits} hits</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 truncate font-mono">→ "{r.response}"</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TestRunner() {
  const { status, progress, elapsed, run, reset } = useTestRunner(TEST_CASES)

  const done = Object.values(progress).filter(s => s === 'pass' || s === 'fail').length
  const passed = Object.values(progress).filter(s => s === 'pass').length
  const failed = Object.values(progress).filter(s => s === 'fail').length
  const pct = TEST_CASES.length > 0 ? Math.round((done / TEST_CASES.length) * 100) : 0

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Test Runner</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Async parallel execution · LLM Mock Server · Determinism Control
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary" onClick={reset}>
            <RotateCcw size={14} /> Reset
          </button>
          <button
            className={status === 'running' ? 'btn-danger' : 'btn-primary'}
            onClick={status === 'running' ? reset : run}
          >
            {status === 'running'
              ? <><Pause size={14} /> Stop</>
              : <><Play size={14} /> Run All Tests</>
            }
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="card">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {status === 'running' && <span className="w-2 h-2 rounded-full bg-brand-400 running-dot" />}
              {status === 'done'    && <span className="w-2 h-2 rounded-full bg-success" />}
              {status === 'idle'    && <span className="w-2 h-2 rounded-full bg-gray-600" />}
              <span className="text-sm font-semibold capitalize text-gray-200">
                {status === 'idle' ? 'Ready' : status === 'running' ? 'Running...' : 'Completed'}
              </span>
            </div>
            {(status === 'running' || status === 'done') && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Clock size={12} />
                {elapsed}s elapsed
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-success font-semibold">{passed} passed</span>
            <span className="text-danger font-semibold">{failed} failed</span>
            <span className="text-gray-500">{TEST_CASES.length - done} pending</span>
          </div>
        </div>
        <div className="progress-bar h-2.5 mb-1">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              failed > 0 ? 'bg-gradient-to-r from-brand-500 to-warn' : 'bg-gradient-to-r from-brand-500 to-success'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
          <span>{done}/{TEST_CASES.length} tests</span>
          <span>{pct}%</span>
        </div>
      </div>

      {/* Config + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Config Panel */}
        <div className="space-y-4">
          {/* Execution Config */}
          <div className="card">
            <h3 className="section-title mb-3">
              <Cpu size={16} className="text-brand-400" />
              Execution Config
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Parallelism', value: '8 threads', icon: Shuffle },
                { label: 'Random Seed', value: '42 (fixed)', icon: Shield },
                { label: 'Timeout', value: '30s per test', icon: Clock },
                { label: 'Isolation', value: 'Process-level', icon: Database },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Icon size={12} />
                    {label}
                  </div>
                  <span className="text-xs text-gray-200 font-mono">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <MockServerPanel />
        </div>

        {/* Test Results */}
        <div className="card lg:col-span-2">
          <h3 className="section-title mb-3">
            <Zap size={16} className="text-warn" />
            Parallel Execution ({TEST_CASES.length} tests)
          </h3>
          <div className="max-h-[500px] overflow-y-auto">
            {TEST_CASES.map(tc => (
              <TestRow key={tc.id} tc={tc} state={progress[tc.id]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
