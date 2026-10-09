import React, { useState } from 'react';
import { 
  Network, 
  Copy, 
  Check, 
  Layers, 
  ShieldCheck, 
  Server, 
  Cpu, 
  Database, 
  Key, 
  Sparkles, 
  ArrowDown, 
  Code2
} from 'lucide-react';
import { ASCII_REFERENCE_ARCHITECTURE } from '../../data/blueprintData';

export const ReferenceArchitectureView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'visual' | 'ascii'>('visual');

  const handleCopyAscii = () => {
    navigator.clipboard.writeText(ASCII_REFERENCE_ARCHITECTURE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const layers = [
    {
      num: 1,
      title: 'Perimeter Security & Edge Ingress Layer',
      icon: ShieldCheck,
      color: 'text-rose-400 border-rose-900/40 bg-rose-950/20',
      nodes: [
        { name: 'Web Application Firewall (WAF)', desc: 'L7 inspection, OWASP Top 10 mitigation, rate limiting, IP reputation filtering.' },
        { name: 'Zero-Trust Identity Gateway', desc: 'SAML 2.0 / OIDC enterprise SSO, PKCE authentication, ephemeral token exchange.' },
        { name: 'Multi-AZ Cloud Load Balancer', desc: 'TLS 1.3 termination, HTTP/2 multiplexing, health probing, cross-zone failover.' }
      ]
    },
    {
      num: 2,
      title: 'Presentation & AI Copilot Orchestration',
      icon: Sparkles,
      color: 'text-amber-400 border-amber-900/40 bg-amber-950/20',
      nodes: [
        { name: 'Frontend Application Pods', desc: 'Stateless React SPA containers, micro-frontend UI orchestration, WebSockets.' },
        { name: 'AI Copilot Synthesizer Service', desc: 'Natural-language prompt parser, deterministic DAG compiler, AST validation engine.' }
      ]
    },
    {
      num: 3,
      title: 'Workflow Orchestration & Distributed Control Plane',
      icon: Server,
      color: 'text-cyan-400 border-cyan-900/40 bg-cyan-950/20',
      nodes: [
        { name: 'Workflow Engine Core', desc: 'Distributed DAG scheduler, topological sort, state machine, cron and event dispatcher.' },
        { name: 'Enterprise AI Services (Inference)', desc: 'Low-latency private endpoint, toxic token filtering, deterministic prompt jailbreak fence.' },
        { name: 'Message Queue & Event Bus', desc: 'Partitioned log broker, reactive stream backpressure, consumer group offset tracker.' }
      ]
    },
    {
      num: 4,
      title: 'Secure Data Plane & Distributed Worker Pool',
      icon: Cpu,
      color: 'text-emerald-400 border-emerald-900/40 bg-emerald-950/20',
      nodes: [
        { name: 'Worker Pool: Ingestion Connectors', desc: 'OCI rootless containers, gVisor sandbox isolation, CDC & object store streams.' },
        { name: 'Worker Pool: Cryptographic Enclave', desc: 'Hardware-enclave microVM, format-preserving encryption (FF3-1), PII redaction.' },
        { name: 'Worker Pool: Distributed Aggregator', desc: 'In-memory broadcast hash joins, tumbling window rollups, out-of-core spill guard.' }
      ]
    },
    {
      num: 5,
      title: 'Persistence, State & Encryption Control Tier',
      icon: Database,
      color: 'text-purple-400 border-purple-900/40 bg-purple-950/20',
      nodes: [
        { name: 'Metadata Store (ACID RDBMS)', desc: 'Pipeline schema catalog, execution history, user roles, lineage graphs.' },
        { name: 'Workflow State Store', desc: 'Low-latency distributed key-value store, task checkpointing, dead-letter storage.' },
        { name: 'Object Storage (Data Lake)', desc: 'Immutable multi-tier storage (Bronze raw, Silver masked, Gold analytics).' },
        { name: 'Secrets Management & KMS', desc: 'Hardware Security Module (HSM), customer-managed encryption key (CMEK), CSI RAMFS.' }
      ]
    },
    {
      num: 6,
      title: 'Target Analytics Repositories & Sinks',
      icon: Layers,
      color: 'text-blue-400 border-blue-900/40 bg-blue-950/20',
      nodes: [
        { name: 'Enterprise Data Warehouse', desc: 'Columnar analytical cluster, ACID transactional commits, partition pruning.' },
        { name: 'Curated Analytics Repository', desc: 'Iceberg / Delta Parquet lakehouse format, automated snapshot time-travel.' }
      ]
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
            Section 5 · End-to-End Enterprise Architecture
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Network className="w-6 h-6 text-purple-400" />
            <span>End-to-End Cloud Reference Architecture</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-3xl">
            Vendor-neutral cloud reference architecture for NexOrchestrator, encompassing perimeter security, presentation, AI synthesis, workflow scheduling, worker isolation, and persistent storage tiers.
          </p>
        </div>

        {/* View Mode & Copy Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setViewMode('visual')}
              className={`px-3 py-1 rounded transition-colors ${
                viewMode === 'visual' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Visual Topology
            </button>
            <button
              onClick={() => setViewMode('ascii')}
              className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
                viewMode === 'ascii' ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>ASCII Architecture</span>
            </button>
          </div>

          <button
            onClick={handleCopyAscii}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied ASCII' : 'Copy Diagram'}</span>
          </button>
        </div>
      </div>

      {/* VIEW: VISUAL ARCHITECTURE */}
      {viewMode === 'visual' && (
        <div className="space-y-6">
          {/* Consumers Strip */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              Enterprise Users & Workloads
            </span>
            <div className="text-sm font-bold text-white">
              Data Engineers · Analytics Teams · Operations Roles · Governance Stewards · Executive Reviewers
            </div>
            <div className="text-xs text-slate-400">
              Connecting via TLS 1.3 Enterprise Private Network / VPN / Zero-Trust Tunnel
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-slate-600" />
          </div>

          {/* Layer Cards */}
          <div className="space-y-6">
            {layers.map((layer, idx) => {
              const Icon = layer.icon;

              return (
                <div key={layer.num} className="space-y-4">
                  <div className={`p-5 rounded-xl border ${layer.color} backdrop-blur-sm space-y-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h2 className="text-sm font-bold text-white">
                          Layer {layer.num}: {layer.title}
                        </h2>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        Zero-Trust Domain
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {layer.nodes.map((node, nIdx) => (
                        <div key={nIdx} className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/90 space-y-1.5">
                          <span className="text-xs font-semibold text-slate-100 block">
                            {node.name}
                          </span>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            {node.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {idx < layers.length - 1 && (
                    <div className="flex justify-center">
                      <ArrowDown className="w-4 h-4 text-slate-700" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: DETAILED ASCII ARCHITECTURE */}
      {viewMode === 'ascii' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Vendor-Neutral Enterprise Cloud Reference Architecture (ASCII Format)</span>
            <span className="font-mono text-[11px]">Monospace · Ready for RFP / RFC Insertion</span>
          </div>

          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 overflow-x-auto shadow-2xl">
            <pre className="font-mono text-xs text-cyan-300 leading-snug whitespace-pre select-all">
              {ASCII_REFERENCE_ARCHITECTURE}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
