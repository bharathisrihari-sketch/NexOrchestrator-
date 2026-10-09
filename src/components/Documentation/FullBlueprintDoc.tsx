import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  Network, 
  CalendarRange,
  BookOpen
} from 'lucide-react';
import { 
  ASCII_UI_WIREFRAME, 
  ASCII_REFERENCE_ARCHITECTURE, 
  READINESS_PILLARS, 
  ROADMAP_PHASES
} from '../../data/blueprintData';
import { CollapsibleSection } from '../common/CollapsibleSection';

export const FullBlueprintDoc: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const generateMarkdown = () => {
    return `# Enterprise Architecture Blueprint: NexOrchestrator
**Platform**: Low-Code / No-Code AI-Powered ETL & Data Integration Platform
**Audience**: Architecture Review Board (ARB), C-Suite Leadership, Enterprise RFPs
**Classification**: Enterprise Architecture Specification (Vendor-Neutral)
**Prepared By**: Principal Enterprise Architect

---

## Executive Summary
NexOrchestrator is a cloud-neutral, zero-trust enterprise ETL and data integration platform designed to ingest high-volume structured, semi-structured, and streaming datasets. It combines a visual DAG canvas, natural-language AI copilot workflow synthesis, hardware-enclave format-preserving tokenization, and multi-tenant isolated worker runtimes.

---

## 1. High-Level UI Layout & Canvas Wireframe
\`\`\`
${ASCII_UI_WIREFRAME}
\`\`\`

---

## 2. Interactive AI Workflow Copilot
### Natural-Language Prompt
> "Build a pipeline that ingests structured and semi-structured data, masks sensitive information, enriches records using reference datasets, aggregates business metrics, and writes curated data to an analytics repository."

### AI Semantic Analysis
- Identified Sources: Source Dataset A (Structured CDC/RDBMS), Source Dataset B (Semi-Structured JSON/Parquet in Object Storage)
- Transformation Requirements: Format-Preserving Masking, Reference Dataset Join, Windowed Aggregations
- Target Destinations: Curated Analytics Repository (Enterprise Data Warehouse)

---

## 3. Node Configuration & Secure Execution Inspector
- CPU Allocation: 2.0 vCPU to 16.0 vCPU autoscale per pod
- Memory Allocation: 4.0 GiB to 32.0 GiB in-memory memory limits
- Container Runtime: OCI compliant, rootless non-root UID 10001, read-only rootfs, gVisor / microVM sandbox
- Secrets Management: Enterprise Secrets Vault, CSI RAMFS injection, in-memory zeroing
- Encryption: TLS 1.3 in-transit, AES-256-GCM / Customer-Managed Keys (CMEK) at-rest
- Network Controls: Isolated private VPC subnet, 0 public IPs, mTLS Envoy service mesh

---

## 4. Enterprise Readiness Assessment Scorecard
| Pillar | Current Maturity | Target Maturity | Status | Readiness Score |
|---|---|---|---|---|
| 1. Security & Compliance | Level 4 | Level 5 | Ready | 92% |
| 2. Scalability & Elasticity | Level 4 | Level 5 | Ready | 88% |
| 3. Reliability & DR | Level 4 | Level 5 | Ready | 85% |
| 4. Governance & Lineage | Level 3 | Level 5 | In Progress | 78% |
| 5. Observability & Monitoring | Level 4 | Level 5 | Ready | 90% |
| 6. DevOps & Automation | Level 4 | Level 5 | Ready | 86% |

---

## 5. End-to-End Cloud Reference Architecture
\`\`\`
${ASCII_REFERENCE_ARCHITECTURE}
\`\`\`

---

## 6. 90-Day Implementation Roadmap
- Phase 1 (Weeks 1-4): Foundation & Secure Execution
- Phase 2 (Weeks 5-8): Scalability & Resiliency
- Phase 3 (Weeks 9-12): Governance & Production Readiness
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NexOrchestrator_Enterprise_Architecture_Blueprint.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 lg:p-10 space-y-6 max-w-5xl mx-auto w-full text-slate-100 select-none">
      {/* Document Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 print:hidden">
        <div>
          <span className="text-xs font-mono uppercase text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60">
            Dossier View · ARB Architecture Specification
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">
            Enterprise Architecture Blueprint & RFP Dossier
          </h1>
          <p className="text-xs text-slate-400">
            Prepared by Principal Enterprise Architect · Reusable & Vendor-Neutral
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-medium rounded-lg text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy MD'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-medium rounded-lg text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download .md</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm shadow-cyan-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Formatted Dossier Sections (All Collapsible!) */}
      <div className="space-y-4">
        {/* SECTION 1: Overview */}
        <CollapsibleSection
          title="1. Executive Overview & Problem Statement"
          subtitle="Enterprise data integration challenges and platform mission"
          badge="Overview"
          badgeColor="bg-slate-800 text-slate-300"
          icon={BookOpen}
          defaultOpen={true}
        >
          <p className="text-xs text-slate-300 leading-relaxed">
            Enterprise organizations require a modern, vendor-neutral data integration platform that enables both citizen data analysts and senior engineers to ingest, govern, and transform heterogeneous data streams without vendor lock-in. NexOrchestrator unites intuitive visual DAG authoring, generative AI pipeline synthesis, hardware-enclave format-preserving tokenization, and strict schema contracts into a single hardened architecture.
          </p>
        </CollapsibleSection>

        {/* SECTION 2: UI Layout Wireframe */}
        <CollapsibleSection
          title="2. High-Level UI Layout & Canvas Wireframe (Section 1)"
          subtitle="6-Zone synchronized operational studio layout"
          badge="ASCII Wireframe"
          badgeColor="bg-cyan-950 text-cyan-400 border border-cyan-800/60"
          icon={Layers}
          defaultOpen={true}
        >
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 overflow-x-auto shadow-inner">
            <pre className="font-mono text-[11px] text-cyan-300 leading-snug whitespace-pre select-all">
              {ASCII_UI_WIREFRAME}
            </pre>
          </div>
        </CollapsibleSection>

        {/* SECTION 3: AI Copilot */}
        <CollapsibleSection
          title="3. Interactive AI Workflow Copilot (Section 2)"
          subtitle="Natural language to deterministic DAG compilation"
          badge="AI Synthesis"
          badgeColor="bg-amber-950 text-amber-400 border border-amber-800/60"
          icon={Sparkles}
          defaultOpen={true}
        >
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Validated Input Prompt:</span>
            <p className="text-amber-300 font-medium italic">
              "Build a pipeline that ingests structured and semi-structured data, masks sensitive information, enriches records using reference datasets, aggregates business metrics, and writes curated data to an analytics repository."
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-slate-300">
              <div>
                <span className="font-bold text-white block">AI Discovery:</span>
                <span className="text-slate-400 text-[11px]">2 Sources, Enclave Tokenization, Window Aggregation, Curated Sink Commit</span>
              </div>
              <div>
                <span className="font-bold text-white block">Security Assertions:</span>
                <span className="text-slate-400 text-[11px]">Zero plain-text leakage verified; air-gapped private subnet enforced</span>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* SECTION 4: Secure Execution Matrix */}
        <CollapsibleSection
          title="4. Node Configuration & Secure Execution Inspector (Section 3)"
          subtitle="Hardened runtime, envelope encryption, and fault tolerance"
          badge="Security Profile"
          badgeColor="bg-emerald-950 text-emerald-400 border border-emerald-800/60"
          icon={ShieldCheck}
          defaultOpen={true}
        >
          <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 font-mono text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Specification Parameter</th>
                  <th className="p-3">Enterprise Architectural Standard</th>
                  <th className="p-3">Enforcement Mechanism</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                <tr>
                  <td className="p-3 font-semibold text-white">CPU & Memory Allocation</td>
                  <td className="p-3 font-mono">2.0 to 16.0 vCPU · 4.0 to 32.0 GiB RAM</td>
                  <td className="p-3">Kubernetes cgroups v2 resource limits with autoscale</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Container Execution Sandbox</td>
                  <td className="p-3">Rootless OCI Distroless Container</td>
                  <td className="p-3">gVisor (Runsc) / Hardware Enclave AMD SEV microVM</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Secret Management</td>
                  <td className="p-3">Ephemeral IAM STS Workload Identity</td>
                  <td className="p-3">CSI Secret Volume Driver (RAMFS only, zero-leak wipe)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Cryptographic Standards</td>
                  <td className="p-3">TLS 1.3 In-Transit · AES-256-GCM / FF3-1 At-Rest</td>
                  <td className="p-3">Customer-Managed Key (CMEK) via Enterprise HSM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* SECTION 5: End-to-End Reference Architecture */}
        <CollapsibleSection
          title="5. End-to-End Cloud Reference Architecture (Section 5)"
          subtitle="Users → WAF → LB → Frontend → Copilot → Engine → Workers → Stores"
          badge="ASCII Architecture"
          badgeColor="bg-purple-950 text-purple-400 border border-purple-800/60"
          icon={Network}
          defaultOpen={true}
        >
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 overflow-x-auto shadow-inner">
            <pre className="font-mono text-[11px] text-cyan-300 leading-snug whitespace-pre select-all">
              {ASCII_REFERENCE_ARCHITECTURE}
            </pre>
          </div>
        </CollapsibleSection>

        {/* SECTION 6: 90-Day Implementation Roadmap */}
        <CollapsibleSection
          title="6. 90-Day Implementation Roadmap (Section 6)"
          subtitle="3 Phased 30-Day iterations broken down week-by-week"
          badge="12 Weeks"
          badgeColor="bg-teal-950 text-teal-400 border border-teal-800/60"
          icon={CalendarRange}
          defaultOpen={true}
        >
          <div className="space-y-3">
            {ROADMAP_PHASES.map((phase) => (
              <div key={phase.phase} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{phase.name}</h4>
                  <span className="text-[11px] font-mono text-teal-400">{phase.timeframe}</span>
                </div>
                <p className="text-[11px] text-slate-300">{phase.objective}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
};
