import React, { useState } from 'react';
import { DAGNode } from '../../types/architecture';
import { CollapsibleSection } from '../common/CollapsibleSection';
import { 
  ShieldCheck, 
  Cpu, 
  Key, 
  Network, 
  RotateCw, 
  GitBranch, 
  Lock, 
  Terminal,
  AlertTriangle,
  Server
} from 'lucide-react';

interface NodeInspectorProps {
  node: DAGNode | null;
  onUpdateConfig: (nodeId: string, updatedConfig: Partial<DAGNode['config']>) => void;
  onClose?: () => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  node,
  onUpdateConfig,
}) => {
  if (!node) {
    return (
      <aside className="w-80 lg:w-96 border-l border-slate-800 bg-slate-950/80 p-6 flex flex-col items-center justify-center text-center text-slate-400 shrink-0">
        <Server className="w-8 h-8 text-slate-400 mb-3" />
        <p className="text-xs font-medium text-slate-300">No Node Selected</p>
        <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
          Select any node on the canvas to inspect its secure container profile and lineage.
        </p>
      </aside>
    );
  }

  const { config } = node;

  return (
    <aside className="w-80 lg:w-96 border-l border-slate-800 bg-slate-950/90 flex flex-col h-full shrink-0 select-none overflow-hidden">
      {/* Node Header */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
            {node.typeLabel}
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Node ID: {node.id}
          </span>
        </div>
        <h3 className="text-sm font-bold text-white truncate">
          {node.name}
        </h3>
        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
          {node.description}
        </p>
      </div>

      {/* Collapsible Sub-Sections Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
        {/* SUB-HEADER 1: Compute & Container Runtime */}
        <CollapsibleSection
          title="Compute & Container Runtime"
          subtitle={`${config.cpuAllocation} · ${config.memoryAllocation}`}
          badge="OCI Rootless"
          badgeColor="bg-cyan-950 text-cyan-400 border border-cyan-800/60"
          icon={Cpu}
          defaultOpen={true}
        >
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">CPU Allocation</span>
                <select
                  value={config.cpuAllocation}
                  onChange={(e) => onUpdateConfig(node.id, { cpuAllocation: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="1.0 vCPU">1.0 vCPU</option>
                  <option value="2.0 vCPU">2.0 vCPU</option>
                  <option value="4.0 vCPU">4.0 vCPU</option>
                  <option value="8.0 vCPU">8.0 vCPU</option>
                  <option value="16.0 vCPU">16.0 vCPU</option>
                </select>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">Memory Allocation</span>
                <input
                  type="text"
                  value={config.memoryAllocation}
                  onChange={(e) => onUpdateConfig(node.id, { memoryAllocation: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Sandbox Isolation:</span>
                <span className="text-cyan-400">{config.containerRuntime.isolation}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Rootless Execution:</span>
                <span className="text-emerald-400">Enforced (UID 10001)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Read-Only Rootfs:</span>
                <span className="text-emerald-400">Yes (Immutable)</span>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* SUB-HEADER 2: Secrets Management & Encryption */}
        <CollapsibleSection
          title="Secrets & Envelope Encryption"
          subtitle={config.encryption.kmsKeyPlaceholder}
          badge="KMS CMEK"
          badgeColor="bg-amber-950 text-amber-400 border border-amber-800/60"
          icon={Lock}
          defaultOpen={true}
        >
          <div className="space-y-2.5 text-[11px]">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Provider:</span>
                <span className="text-slate-200 font-medium">{config.secretsManagement.provider}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Rotation:</span>
                <span className="text-slate-300">{config.secretsManagement.rotationPolicy}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">RAM Zeroing:</span>
                <span className="text-emerald-400 font-medium">Active (Zero-Leak)</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
              <div>
                <span className="text-slate-400 block text-[10px]">In-Transit Encryption</span>
                <span className="text-slate-200 font-mono text-[11px]">{config.encryption.transit}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">At-Rest Encryption</span>
                <span className="text-slate-200 font-mono text-[11px]">{config.encryption.rest}</span>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* SUB-HEADER 3: Network Controls & AI Guardrails */}
        <CollapsibleSection
          title="Network Controls & AI Guardrails"
          subtitle="Air-gapped private subnet · Zero public IPs"
          badge="Air-Gapped"
          badgeColor="bg-emerald-950 text-emerald-400 border border-emerald-800/60"
          icon={Network}
          defaultOpen={false}
        >
          <div className="space-y-2 text-[11px]">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px]">Subnet Topology</span>
              <span className="text-slate-200 font-medium block">{config.networkControls.subnetType}</span>
              <span className="text-emerald-400 font-mono block text-[10px]">Public IP: Strictly Disabled</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-200">Prompt Sanitization Gate</span>
                <input
                  type="checkbox"
                  checked={config.aiGuardrails.promptSanitization}
                  onChange={(e) => onUpdateConfig(node.id, {
                    aiGuardrails: { ...config.aiGuardrails, promptSanitization: e.target.checked }
                  })}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                />
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-200">PII Tokenization Gate</span>
                <input
                  type="checkbox"
                  checked={config.aiGuardrails.piiAnonymization}
                  onChange={(e) => onUpdateConfig(node.id, {
                    aiGuardrails: { ...config.aiGuardrails, piiAnonymization: e.target.checked }
                  })}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* SUB-HEADER 4: Fault Tolerance & Retries */}
        <CollapsibleSection
          title="Fault Tolerance & Retries"
          subtitle={`Max ${config.retryPolicy.maxAttempts} attempts · ${config.retryPolicy.backoffStrategy}`}
          badge="DLQ Configured"
          badgeColor="bg-rose-950 text-rose-400 border border-rose-800/60"
          icon={RotateCw}
          defaultOpen={false}
        >
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Circuit Breaker Trip:</span>
              <span className="font-mono text-amber-400">{config.failureHandling.circuitBreakerThresholdPercent}% error rate</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Dead-Letter Destination:</span>
              <span className="text-rose-400 font-mono text-[10px] break-all">{config.failureHandling.deadLetterQueue}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Fallback Policy:</span>
              <span className="text-slate-300 text-[10px]">{config.failureHandling.fallbackAction}</span>
            </div>
          </div>
        </CollapsibleSection>

        {/* SUB-HEADER 5: Schema Contract & Lineage */}
        <CollapsibleSection
          title="Schema Contract & Lineage Ports"
          subtitle={`${node.inputs.length} Inputs · ${node.outputs.length} Outputs`}
          badge="OpenLineage"
          badgeColor="bg-purple-950 text-purple-400 border border-purple-800/60"
          icon={GitBranch}
          defaultOpen={false}
        >
          <div className="space-y-2 text-[11px]">
            {config.schemaContract && (
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Output Schema Fields:</span>
                <div className="rounded bg-slate-950 border border-slate-800 divide-y divide-slate-850 overflow-hidden">
                  {config.schemaContract.outputSchema.map((field, idx) => (
                    <div key={idx} className="p-2 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-200">{field.field}</span>
                      <span className="text-cyan-400">{field.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleSection>
      </div>
    </aside>
  );
};
