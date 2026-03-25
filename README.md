# Cognitive Agent Testing & Evaluation Platform (Prototype)

A high-fidelity, interactive prototype designed for the **GSoC 2026 Proposal (Idea 6: Cognitive Agent Testing & Evaluation Platform)**. This platform provides a systematic framework for validating AI agents against functional, performance, and security benchmarks.

## 🚀 Overview

This prototype demonstrates the proposed architecture and UI/UX for the MoFA agent testing infrastructure. It allows developers to:
- **Run Functional Tests**: Validate agent reasoning and tool usage.
- **Security Audit (Adversarial)**: Benchmark agents against the **OWASP LLM Top 10** threat categories (32+ prompt corpus).
- **MoFA Ecosystem Integration**: Automated validation for the **Memory System** and **Orchestrator** (Multi-agent collaboration).
- **Performance Telemetry**: Monitor latency, token usage, and resource consumption.
- **Visual Reporting**: Interactively explore test results and security postures.

## ✨ Core Features

- **Dashboard**: Real-time overview of test coverage, success rates, and security posture.
- **Test Runner**: Interface to define and execute agent test suites.
- **Security Module**: Systematic adversarial testing (Prompt Injection, Sensitive Info Disclosure, etc.).
- **CI/CD Integration**: Mocked interface for automated regression testing.

## 🛠️ Tech Stack

- **Frontend**: React.js 18+
- **Styling**: Tailwind CSS (Premium Terminal Aesthetic)
- **Icons**: Lucide-React
- **Charts**: Recharts
- **Build Tool**: Vite

## 🏃 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- `npm` or `yarn`

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/iashutoshyadav/prototype.git
   cd prototype
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5174`.

## 📂 Project Structure
- `src/pages/`: Core UI modules (Security, Dashboard, etc.).
- `src/components/`: Reusable UI components (Sidebar, Layout).
- `src/data.js`: Synthetic data engine mirroring the `mofa-testing` Rust crate output.

## ⚖️ License
MIT License - Part of the MoFA Framework GSoC Contribution.
