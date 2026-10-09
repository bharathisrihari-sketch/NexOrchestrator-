import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Network, 
  CalendarRange, 
  Layers, 
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { 
  ASCII_UI_WIREFRAME, 
  ASCII_REFERENCE_ARCHITECTURE,
  READINESS_PILLARS,
  ROADMAP_PHASES
} from '../../data/blueprintData';

interface ExecutiveDeckProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveDeck: React.FC<ExecutiveDeckProps> = ({
  isOpen,
  onClose
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Executive Architecture Blueprint",
      subtitle: "NexOrchestrator – Low-Code / No-Code AI-Powered ETL & Data Integration Platform",
      tag: "OVERVIEW",
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-800/40 space-y-4">
            <h3 className="text-2xl font-bold text-white">
              The Enterprise Challenge & Platform Mission
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              Modern enterprises struggle with brittle custom code pipelines, slow turnaround for analytics, and heightened security and compliance scrutiny. NexOrchestrator unifies visual low-code/no-code DAG authoring with natural language AI workflow synthesis, hardware-enclave format-preserving tokenization, and multi-tenant isolated worker pools.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="font-bold text-cyan-400 block mb-1">Low-Code & AI First</span>
                <span className="text-slate-400">Natural language to deterministic DAG in seconds</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">Zero-Trust Security</span>
                <span className="text-slate-400">Hardware enclave tokenization and rootless runtimes</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                <span className="font-bold text-purple-400 block mb-1">Vendor-Neutral Cloud</span>
                <span className="text-slate-400">Deployable across any cloud or Kubernetes mesh</span>
              </div>
            </div>
          </div>
        </div>
      ),
      presenterNotes: "Emphasize vendor neutrality, no cloud lock-in, and the bridge between citizen data engineers and enterprise ARB standards."
    },
    {
      title: "Section 1: High-Level UI Layout & Canvas Wireframe",
      subtitle: "Structured 6-Zone Operational Studio with Real-Time DAG Interaction",
      tag: "UI / UX BLUEPRINT",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-bold text-cyan-400 block">1. Global Navigation</span>
              <span className="text-slate-400 text-[11px]">Env & Workspace switchers, Execution Role</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-bold text-cyan-400 block">2. Left Toolbox</span>
              <span className="text-slate-400 text-[11px]">Sources, transforms, guardrails, sinks</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-bold text-cyan-400 block">3. Visual DAG Canvas</span>
              <span className="text-slate-400 text-[11px]">Interactive nodes, bezier edges, live simulation</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-bold text-cyan-400 block">4. Right Node Inspector</span>
              <span className="text-slate-400 text-[11px]">Compute, secrets, encryption, lineage</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-bold text-cyan-400 block">5. AI Copilot Bar</span>
              <span className="text-slate-400 text-[11px]">Natural-language prompt pipeline generator</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-bold text-cyan-400 block">6. Bottom Console</span>
              <span className="text-slate-400 text-[11px]">Live logs, throughput, quality assertions</span>
            </div>
          </div>
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 overflow-x-auto max-h-56">
            <pre className="font-mono text-[10px] text-cyan-300 leading-tight whitespace-pre select-all">
              {ASCII_UI_WIREFRAME}
            </pre>
          </div>
        </div>
      ),
      presenterNotes: "Highlight the seamless integration between canvas authoring, inspector verification, and live execution telemetry."
    },
    {
      title: "Section 2: Interactive AI Workflow Copilot",
      subtitle: "Deterministic Pipeline Synthesis from Natural-Language Prompts",
      tag: "AI SYNTHESIS",
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
            <span className="text-xs font-mono text-amber-400 uppercase">Input Prompt Tested:</span>
            <p className="text-sm text-slate-200 italic font-medium">
              "Build a pipeline that ingests structured and semi-structured data, masks sensitive information, enriches records using reference datasets, aggregates business metrics, and writes curated data to an analytics repository."
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-cyan-400 block">1. Semantic Ingestion</span>
              <span className="text-slate-400 text-[11px]">Auto-identifies CDC RDBMS & Object Storage JSON/Parquet</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-400 block">2. Security Gate</span>
              <span className="text-slate-400 text-[11px]">Assigns hardware enclave tokenization (SHA-256 + FF3-1)</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-blue-400 block">3. Data Quality Gate</span>
              <span className="text-slate-400 text-[11px]">Injects 4 automated assertions (completeness, drift, bounds)</span>
            </div>
          </div>
        </div>
      ),
      presenterNotes: "Stress that the AI Copilot outputs deterministic, validated ASTs that compile directly to compliant container execution graphs."
    },
    {
      title: "Section 3: Node Configuration & Secure Execution",
      subtitle: "Hardened OCI Container Sandbox & Cryptographic Profile",
      tag: "SECURE RUNTIME",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Compute Limits</span>
            <span className="font-bold text-white text-sm">2.0 to 16.0 vCPU</span>
            <span className="text-[11px] text-cyan-400">4.0 to 32.0 GiB RAM</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Container Sandbox</span>
            <span className="font-bold text-white text-sm">Rootless Distroless</span>
            <span className="text-[11px] text-emerald-400">gVisor / Enclave Isolation</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Secret Management</span>
            <span className="font-bold text-white text-sm">CSI Driver RAMFS</span>
            <span className="text-[11px] text-amber-400">Zero-leak memory zeroing</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Network Isolation</span>
            <span className="font-bold text-white text-sm">Air-Gapped Private VPC</span>
            <span className="text-[11px] text-purple-400">Zero public IP allocations</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Encryption</span>
            <span className="font-bold text-white text-sm">TLS 1.3 & AES-256</span>
            <span className="text-[11px] text-cyan-400">Customer KMS CMEK Key</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-mono block">AI Guardrails</span>
            <span className="font-bold text-white text-sm">Prompt Sanitization</span>
            <span className="text-[11px] text-emerald-400">Deterministic schema fence</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Security Scan</span>
            <span className="font-bold text-white text-sm">SBOM & SAST Gates</span>
            <span className="text-[11px] text-amber-400">Cosign image attestation</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-mono block">Fault Tolerance</span>
            <span className="font-bold text-white text-sm">Jitter Backoff & DLQ</span>
            <span className="text-[11px] text-rose-400">Circuit breaker protection</span>
          </div>
        </div>
      ),
      presenterNotes: "Zero plain-text storage, rootless containers, and RAMFS injection satisfy the strictest banking and defense security requirements."
    },
    {
      title: "Section 4: Enterprise Readiness Scorecard",
      subtitle: "Comprehensive Evaluation Across 6 Non-Functional Architecture Pillars",
      tag: "READINESS SCORECARD",
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {READINESS_PILLARS.map(p => (
              <div key={p.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white truncate">{p.name.split('.')[1] || p.name}</span>
                  <span className="text-emerald-400 font-mono font-bold text-[11px]">{p.readinessScore}%</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Current: L{p.currentMaturity}</span>
                  <span className="text-cyan-400">Target: L{p.targetMaturity}</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  Action: {p.keyRemediationActions[0]?.timeline} ({p.keyRemediationActions[0]?.owner.split(' ')[0]})
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span>Overall Readiness Rating: <strong className="text-cyan-400">86.5% Enterprise Ready</strong></span>
            <span className="font-mono text-emerald-400">CMMI Level 4 (Quantitatively Managed)</span>
          </div>
        </div>
      ),
      presenterNotes: "All 6 pillars have defined remediation actions and milestones leading to Level 5 CMMI maturity within the 90-day plan."
    },
    {
      title: "Section 5: End-to-End Cloud Reference Architecture",
      subtitle: "Users → WAF → Load Balancer → Frontend → AI → Workflow → Workers → Sinks",
      tag: "REFERENCE ARCHITECTURE",
      content: (
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 overflow-x-auto max-h-72">
            <pre className="font-mono text-[10px] text-cyan-300 leading-tight whitespace-pre select-all">
              {ASCII_REFERENCE_ARCHITECTURE}
            </pre>
          </div>
        </div>
      ),
      presenterNotes: "Diagram demonstrates strict separation between Control Plane (Workflow Engine, Copilot) and Data Plane (Worker Pool, Enclaves)."
    },
    {
      title: "Section 6: 90-Day Implementation Roadmap",
      subtitle: "3 Phased 30-Day Iterations Broken Down Week-by-Week",
      tag: "IMPLEMENTATION ROADMAP",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-teal-800/60 space-y-2">
            <span className="text-[10px] font-mono text-teal-400 font-bold uppercase block">Phase 1 (Weeks 1-4)</span>
            <h4 className="font-bold text-white text-sm">Foundation & Secure Execution</h4>
            <p className="text-slate-400 text-[11px]">ARB sign-off, core workflow scheduler, rootless containers, and tokenization enclave.</p>
            <span className="text-[10px] font-mono text-cyan-300 block pt-1">Milestone: M1 ARB & M2 Security</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-blue-800/60 space-y-2">
            <span className="text-[10px] font-mono text-blue-400 font-bold uppercase block">Phase 2 (Weeks 5-8)</span>
            <h4 className="font-bold text-white text-sm">Scalability & Resiliency</h4>
            <p className="text-slate-400 text-[11px]">In-memory transforms, AI copilot pipeline synthesis, backpressure flow controls, multi-AZ DR drill.</p>
            <span className="text-[10px] font-mono text-cyan-300 block pt-1">Milestone: M3 Copilot & M4 DR</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-purple-800/60 space-y-2">
            <span className="text-[10px] font-mono text-purple-400 font-bold uppercase block">Phase 3 (Weeks 9-12)</span>
            <h4 className="font-bold text-white text-sm">Governance & Production Launch</h4>
            <p className="text-slate-400 text-[11px]">Columnar OpenLineage tracking, automated data quality assertion gates, OpenTelemetry telemetry, cutover.</p>
            <span className="text-[10px] font-mono text-cyan-300 block pt-1">Milestone: M5 Quality & M6 Launch</span>
          </div>
        </div>
      ),
      presenterNotes: "Clear 90-day trajectory with concrete exit criteria ensures executive confidence and predictable budget allocation."
    }
  ];

  const handleNext = () => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
  const handlePrev = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide]);

  if (!isOpen) return null;

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-5xl h-[85vh] rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Presentation Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              {slide.tag}
            </span>
            <span className="text-xs text-slate-400">
              Slide {currentSlide + 1} of {slides.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Body */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                {slide.title}
              </h2>
              <p className="text-sm text-slate-400">
                {slide.subtitle}
              </p>
            </div>

            <div className="pt-2">
              {slide.content}
            </div>
          </div>

          {/* Presenter Notes */}
          <div className="mt-6 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
            <span className="font-mono text-cyan-400 text-[10px] uppercase font-bold shrink-0 mt-0.5">Presenter Notes:</span>
            <span>{slide.presenterNotes}</span>
          </div>
        </div>

        {/* Slide Navigation Bottom Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-6 bg-cyan-400' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Jump to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentSlide === slides.length - 1}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-slate-950 text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
