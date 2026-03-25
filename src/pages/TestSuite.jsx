import React, { useState } from 'react'
import {
  FlaskConical, Plus, Search, Filter, ChevronDown,
  CheckCircle2, XCircle, Tag, Clock, Code2, Copy, Check
} from 'lucide-react'
import { TEST_CASES } from '../data'

const CATEGORIES = ['all', 'unit', 'integration', 'e2e', 'safety', 'adversarial', 'performance', 'regression']

function TestCard({ tc, onSelect, selected }) {
  return (
    <div
      onClick={() => onSelect(tc)}
      className={`card cursor-pointer transition-all duration-200 ${
        selected ? 'border-brand-500/60 bg-brand-600/5 glow-brand' : 'hover:border-gray-700'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {tc.status === 'pass'
            ? <CheckCircle2 size={14} className="text-success flex-shrink-0" />
            : <XCircle size={14} className="text-danger flex-shrink-0" />
          }
          <span className="text-sm font-semibold text-gray-200 truncate">{tc.name}</span>
        </div>
        <span className={`badge flex-shrink-0 ${tc.status === 'pass' ? 'badge-success' : 'badge-danger'}`}>
          {tc.status}
        </span>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <span className="badge badge-brand">{tc.category}</span>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Clock size={11} /> {tc.duration}ms
        </span>
        <span className="text-xs text-gray-500">
          {tc.passed}/{tc.assertions} assertions
        </span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {tc.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  )
}

function DSLViewer({ tc }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(tc.dsl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = tc.dsl.split('\n')

  return (
    <div className="card h-full animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="section-title">
            <Code2 size={16} className="text-brand-400" />
            DSL Source
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{tc.name}</p>
        </div>
        <button onClick={handleCopy} className="btn-secondary text-xs gap-1.5">
          {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <div className="code-block overflow-auto max-h-80">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-3 hover:bg-gray-800/30">
            <span className="text-gray-600 select-none w-6 text-right flex-shrink-0">{i + 1}</span>
            <span className={`${
              line.trim().startsWith('#[') ? 'text-cyber' :
              line.includes('async fn') ? 'text-brand-400' :
              line.includes('assert_') ? 'text-warn' :
              line.includes('let ') ? 'text-purple-400' :
              line.includes('//') ? 'text-gray-600' :
              'text-gray-300'
            }`}>{line || '\u00a0'}</span>
          </div>
        ))}
      </div>

      {/* Assertions breakdown */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-400 mb-2 font-medium">Assertions ({tc.assertions})</p>
        <div className="flex items-center gap-2">
          <div className="progress-bar flex-1">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-success transition-all"
              style={{ width: `${(tc.passed / tc.assertions) * 100}%` }} />
          </div>
          <span className="text-xs text-gray-400">{tc.passed}/{tc.assertions}</span>
        </div>
        {tc.failed > 0 && (
          <p className="text-xs text-danger mt-1">⚠ {tc.failed} assertion(s) failed</p>
        )}
      </div>

      {/* Metadata */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          ['Category', tc.category],
          ['Duration', `${tc.duration}ms`],
          ['Status', tc.status],
          ['Tags', tc.tags.join(', ')],
        ].map(([k, v]) => (
          <div key={k} className="glass-light rounded-lg px-3 py-2">
            <p className="text-xs text-gray-500">{k}</p>
            <p className="text-xs text-gray-200 font-medium mt-0.5 truncate">{v}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TestSuite() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(TEST_CASES[0])

  const filtered = TEST_CASES.filter(tc =>
    (category === 'all' || tc.category === category) &&
    tc.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Test Suite</h1>
          <p className="text-sm text-gray-400 mt-0.5">Agent Test DSL · Scenario Builder · Assertion Library</p>
        </div>
        <button className="btn-primary">
          <Plus size={14} /> New Test Case
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            className="input-field pl-9"
            placeholder="Search tests..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                category === cat
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Badges */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="badge badge-success">
          <CheckCircle2 size={10} />
          {TEST_CASES.filter(t => t.status === 'pass').length} passing
        </span>
        <span className="badge badge-danger">
          <XCircle size={10} />
          {TEST_CASES.filter(t => t.status === 'fail').length} failing
        </span>
        <span className="badge badge-brand">
          <FlaskConical size={10} />
          {TEST_CASES.length} total
        </span>
        <span className="badge badge-cyber">
          <Tag size={10} />
          50+ assertions supported
        </span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Test List */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {filtered.map(tc => (
            <TestCard
              key={tc.id}
              tc={tc}
              selected={selected?.id === tc.id}
              onSelect={setSelected}
            />
          ))}
          {filtered.length === 0 && (
            <div className="card text-center py-10 text-gray-500">
              <FlaskConical size={32} className="mx-auto mb-2 opacity-30" />
              <p>No tests match the current filter.</p>
            </div>
          )}
        </div>

        {/* DSL Viewer */}
        <div>
          {selected
            ? <DSLViewer tc={selected} />
            : (
              <div className="card h-full flex items-center justify-center text-gray-500">
                Select a test case to view its DSL source
              </div>
            )
          }
        </div>
      </div>

      {/* Assertion Library Preview */}
      <div className="card">
        <h3 className="section-title mb-4">
          <Tag size={16} className="text-warn" />
          Built-in Assertion Library (50+ types)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {[
            'assert_responds!', 'assert_contains!', 'assert_not_contains!',
            'assert_sentiment!', 'assert_toxic_free!', 'assert_tool_called!',
            'assert_tool_args_contain!', 'assert_refused!', 'assert_latency!',
            'assert_golden_match!', 'assert_memory_key!', 'assert_json_schema!',
            'assert_regex_match!', 'assert_injection_resisted!', 'assert_p99!',
            'assert_task_completed!', 'assert_similarity!', 'assert_no_secrets!',
            'assert_language!', 'assert_aligned!',
          ].map(name => (
            <div key={name} className="glass-light rounded-lg px-3 py-2">
              <code className="text-xs text-cyber font-mono">{name}</code>
            </div>
          ))}
          <div className="glass-light rounded-lg px-3 py-2 flex items-center justify-center">
            <span className="text-xs text-gray-500">+30 more...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
