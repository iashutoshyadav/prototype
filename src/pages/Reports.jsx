import React, { useState } from 'react'
import {
  FileText, Download, Github, Gitlab,
  CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight,
  BarChart2, TrendingUp, Boxes
} from 'lucide-react'
import { AB_TEST_DATA } from '../data'

const FORMATS = ['JSON', 'HTML', 'JUnit', 'Allure', 'Markdown']

const JSON_REPORT = `{
  "summary": {
    "total": 247, "passed": 238,
    "failed": 7,  "skipped": 2,
    "passRate": 96.4,
    "duration": "45.2s",
    "timestamp": "2025-03-25T03:12:59Z"
  },
  "suites": [
    {
      "name": "GreetingAgent",
      "tests": 32, "passed": 32,
      "duration": "1.2s"
    },
    {
      "name": "SafetyTests",
      "tests": 45, "passed": 44,
      "failures": [
        {
          "test": "RegressionTest::GoldenResponse",
          "message": "Similarity 0.89 < threshold 0.92",
          "actual": "...", "expected": "..."
        }
      ]
    }
  ],
  "metrics": {
    "accuracy": 94.7,
    "safety": 99.1,
    "alignment": 95.3,
    "p99_latency_ms": 432,
    "cost_usd": 0.066
  }
}`

const JUNIT_REPORT = `<?xml version="1.0" encoding="UTF-8"?>
<testsuites tests="247" failures="7" 
            time="45.2" timestamp="2025-03-25T03:12:59Z">
  <testsuite name="GreetingAgent" tests="32" failures="0">
    <testcase name="BasicResponse" time="0.042" />
    <testcase name="MultiTurnDialogue" time="0.087" />
    <testcase name="SentimentAnalysis" time="0.056" />
  </testsuite>
  <testsuite name="RegressionTests" tests="10" failures="1">
    <testcase name="GoldenResponse" time="0.078">
      <failure message="Similarity 0.89 &lt; 0.92">
        Expected similarity >= 0.92 but got 0.89
      </failure>
    </testcase>
  </testsuite>
</testsuites>`

const MD_REPORT = `# Agent Test Report — 2025-03-25

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | 247 |
| ✅ Passed | 238 (96.4%) |
| ❌ Failed | 7 |
| Duration | 45.2s |
| P99 Latency | 432ms |

## Failed Tests

### ❌ RegressionTest::GoldenResponse
- **Expected**: similarity ≥ 0.92
- **Actual**: 0.89
- **Category**: regression

## Safety Coverage

| Category | Score |
|----------|-------|
| Harmful Refusal | 99.1% |
| Injection Resistance | 97.8% |
| OWASP LLM Top 10 | 90% covered |`

const REPORTS = { JSON: JSON_REPORT, JUnit: JUNIT_REPORT, Markdown: MD_REPORT }

export default function Reports() {
  const [fmt, setFmt] = useState('JSON')
  const ab = AB_TEST_DATA

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Reports & CI/CD</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            5 report formats · GitHub/GitLab integration · A/B testing · Canary deployment
          </p>
        </div>
        <button className="btn-primary">
          <Download size={14} /> Export Report
        </button>
      </div>

      {/* CI Gate Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          { label: 'Quality Gate',   status: 'PASSED', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/5 border-success/10' },
          { label: 'Regression Gate',status: 'FAILED', icon: XCircle,      color: 'text-danger',  bg: 'bg-danger/5 border-danger/10' },
          { label: 'Safety Gate',    status: 'PASSED', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/5 border-success/10' },
          { label: 'Perf. Gate',     status: 'PASSED', icon: CheckCircle2, color: 'text-success', bg: 'bg-success/5 border-success/10' },
        ].map(({ label, status, icon: Icon, color, bg }) => (
          <div key={label} className={`card border ${bg}`}>
            <div className="flex items-center gap-2 mb-1">
              <Icon size={16} className={color} />
              <span className={`text-sm font-bold ${color}`}>{status}</span>
            </div>
            <p className="text-xs text-stone-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Report Viewer */}
      <div className="card">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="section-title">
            <FileText size={16} className="text-brand-400" />
            Report Output
          </h3>
          <div className="flex items-center gap-1">
            {FORMATS.map(f => (
              <button
                key={f}
                onClick={() => setFmt(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  fmt === f ? 'bg-brand-600 text-white shadow-sm' : 'bg-stone-100 text-stone-500 hover:text-stone-800 hover:bg-stone-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="code-block max-h-72 overflow-y-auto">
          <pre className={`text-xs leading-5 ${
            fmt === 'JSON'     ? 'text-green-600' :
            fmt === 'JUnit'    ? 'text-blue-600'  :
            fmt === 'Markdown' ? 'text-stone-600'  :
            'text-stone-600'
          }`}>
            {REPORTS[fmt] || `[${fmt} report format]\nSupported by mofa-testing crate.\nThis format requires the --report=${fmt.toLowerCase()} flag.`}
          </pre>
        </div>
      </div>

      {/* A/B Testing */}
      <div className="card">
        <h3 className="section-title mb-4">
          <BarChart2 size={16} className="text-cyber" />
          A/B Testing — Statistical Comparison
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Control */}
          <div className="glass-light rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge badge-brand">Control</span>
              <span className="text-sm font-semibold text-stone-800">{ab.control.name}</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Pass Rate</span>
                <span className="text-stone-800 font-mono">{ab.control.passRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Avg Latency</span>
                <span className="text-stone-800 font-mono">{ab.control.avgLatency}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Cost/1K</span>
                <span className="text-stone-800 font-mono">${ab.control.costPer1k}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Samples</span>
                <span className="text-stone-800 font-mono">{ab.control.samples}</span>
              </div>
            </div>
          </div>

          {/* Winner badge */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
              <TrendingUp size={24} className="text-success" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-success">Variant Wins</p>
              <p className="text-xs text-stone-500">p = {ab.pValue} (significant)</p>
            </div>
            <span className="badge badge-success text-xs">95% confidence</span>
          </div>

          {/* Variant */}
          <div className="glass-light rounded-xl p-4 border border-success/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge badge-success">Variant ✓</span>
              <span className="text-sm font-semibold text-stone-800">{ab.variant.name}</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Pass Rate</span>
                <div className="flex items-center gap-1 text-success font-mono font-semibold">
                  <ArrowUpRight size={10} />
                  {ab.variant.passRate}%
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Avg Latency</span>
                <div className="flex items-center gap-1 text-success font-mono font-semibold">
                  <ArrowDownRight size={10} />
                  {ab.variant.avgLatency}ms
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Cost/1K</span>
                <div className="flex items-center gap-1 text-success font-mono font-semibold">
                  <ArrowDownRight size={10} />
                  ${ab.variant.costPer1k}
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Samples</span>
                <span className="text-stone-800 font-mono">{ab.variant.samples}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CI/CD Integration */}
      <div className="card">
        <h3 className="section-title mb-4">
          <Github size={16} className="text-stone-600" />
          CI/CD Integration
        </h3>
        <div className="code-block text-xs text-stone-300 max-h-52 overflow-auto">
          <pre>{`# .github/workflows/agent-tests.yml
name: Agent Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Rust
        uses: dtolnay/rust-toolchain@stable

      - name: Run Agent Tests
        run: |
          cargo test --workspace
          cargo run -p mofa-testing -- \\
            --parallel 8 \\
            --seed 42 \\
            --report json,junit,html \\
            --gate pass_rate:95 \\
            --gate p99_latency:500

      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: test-reports
          path: target/test-reports/

      - name: Comment PR
        uses: mofa-org/agent-test-reporter@v1
        with:
          report: target/test-reports/report.json`}
          </pre>
        </div>
      </div>
    </div>
  )
}
