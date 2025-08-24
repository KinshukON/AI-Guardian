# **AI Guardian** — The Smart Safety Net for Kids in the Age of AI

> **Protect. Guide. Empower.**  
> **AI Guardian** is a values-aligned companion that analyzes the **safety**, **learning quality**, and **bias** of AI-powered content (videos, chatbots, apps) kids use. It gives parents and educators **plain-English explanations**, **actionable nudges**, and a **calm, modern dashboard**—without creepy surveillance.

---

## ✨ Features

- **Content Safety Analyzer**  
  Flags violence, bullying, sexual content, scams, and self-harm. Shows *why* with evidence snippets and confidence scores.

- **Learning Quality Scorer**  
  Rates factuality, clarity, cognitive depth, and curriculum alignment proxies. Suggests better prompts for deeper learning.

- **Bias & Framing Detector**  
  Surfaces stereotypes, framing polarity, and missing perspectives. One-tap **Balanced View** generates dual-perspective summaries.

- **Guardian Dashboard**  
  Daily digest, wellbeing insights, trends, and quick actions (timeouts, nudges, whitelist/graylist).

- **KidGPT (Values-Aligned Mentor)**  
  Cited, age-appropriate answers with “Explain like I’m 12.” Includes safe refusals and escalation guidance.

- **Weekly Reports**  
  Parent summary and educator pack (PDF + web) with sources, alerts, and conversation starters.

- **Privacy First**  
  No keystroke logging. Data minimization, consent ledger, retention controls, export/delete, and full audit logs.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, TailwindCSS, Radix UI, TanStack Router/Query, Framer Motion (light), Recharts  
- **Extension**: WebExtension polyfill for Live Coach overlay (Chrome/Edge/Firefox)  
- **Backend**: Node.js (Fastify/NestJS), TypeScript, Zod validation, OpenAPI 3.1  
- **ML Service**: Python FastAPI, scikit-learn, transformers, shap/fairlearn heuristics, pandas, onnxruntime  
- **Data**: PostgreSQL (row-level security), Redis (cache/queues), S3-compatible storage (reports only)  
- **Auth**: OIDC (Auth0/Cognito), TOTP MFA, Passkeys  
- **Infra**: Docker Compose (dev), Terraform + Helm on AWS EKS (prod), GitHub Actions CI/CD  
- **Observability**: OpenTelemetry, Loki/Promtail, Grafana, Sentry  

---

## 📂 Project Structure

```plaintext
ai-guardian/
├── apps/
│   ├── web/              # React frontend (Dashboard + KidGPT UI)
│   ├── extension/        # Browser extension (Live Coach overlay)
│   ├── api/              # Node backend (Fastify/NestJS)
│   └── ml/               # Python ML service (FastAPI)
│
├── packages/
│   ├── ui/               # Shared React UI primitives
│   └── config/           # ESLint, tsconfig, Tailwind, Prettier
│
├── docs/                 # Documentation + ADRs
├── infra/                # Docker, Kubernetes, Terraform, CI/CD pipelines
├── scripts/              # Seeders, synthetic data generators
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
└── README.md
