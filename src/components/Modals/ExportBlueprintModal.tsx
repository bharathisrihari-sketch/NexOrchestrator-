import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileCode2, 
  FileText, 
  Code2, 
  Archive, 
  Loader2,
  Sparkles,
  Bot,
  ExternalLink,
  Layers,
  FileCheck
} from 'lucide-react';
import { 
  ASCII_UI_WIREFRAME, 
  ASCII_REFERENCE_ARCHITECTURE, 
  INITIAL_NODES, 
  INITIAL_EDGES, 
  READINESS_PILLARS, 
  ROADMAP_PHASES 
} from '../../data/blueprintData';
import { 
  exportProjectZip, 
  downloadClaudeMarkdownFile, 
  generateClaudeMarkdownBundle 
} from '../../utils/projectZipExporter';

interface ExportBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflows?: any[];
  currentWorkflowId?: string;
}

export const ExportBlueprintModal: React.FC<ExportBlueprintModalProps> = ({
  isOpen,
  onClose,
  workflows,
  currentWorkflowId
}) => {
  const [activeFormat, setActiveFormat] = useState<'claude' | 'zip' | 'markdown' | 'json' | 'ascii' | 'text'>('claude');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await exportProjectZip({
        appName: 'NxtGenOrchestrator',
        workflows,
        currentWorkflowId
      });
    } catch (err) {
      console.error('Failed to create zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadClaudeMarkdown = () => {
    downloadClaudeMarkdownFile({
      appName: 'NxtGenOrchestrator',
      workflows,
      currentWorkflowId
    });
  };

  const getExportContent = () => {
    if (activeFormat === 'claude') {
      return generateClaudeMarkdownBundle({
        appName: 'NxtGenOrchestrator',
        workflows,
        currentWorkflowId
      });
    }

    if (activeFormat === 'zip') {
      return `================================================================================
NXTGENORCHESTRATOR – COMPLETE CODEBASE (.ZIP BUNDLE READY TO RUN OR CHECK IN CLAUDE)
================================================================================
Contains all real source code, React 19 components, Tailwind v4 styling, DAG state machine, 
Power BI DirectLake targets, execution telemetry, and TypeScript files.

Included in the .zip bundle:
  ✓ package.json & tsconfig.json (All dependencies and TypeScript configuration)
  ✓ vite.config.ts & index.html (Tailwind v4 setup & entrypoints)
  ✓ CLAUDE_PROMPT_ALL_CODE.md (Single comprehensive prompt file formatted for Claude)
  ✓ src/App.tsx & src/main.tsx (Root application & state management)
  ✓ src/components/Canvas/* (Visual DAG Canvas, Floating Parameters Pill, Dropdown Header, Connectors)
  ✓ src/components/ExecutionResults/* (Timestamped logs, audit trail & execution metrics)
  ✓ src/components/Documentation/* (Master Technical Specifications & ARB Dossier)
  ✓ src/data/* (Workflow catalog, DAG nodes, edges, and architecture data)
  ✓ src/utils/* (Lineage parser, Markdown/ZIP exporters)
  ✓ README.md (Complete guide to run under any machine or user login)

Click "Download App ZIP (.zip)" below to download the package now.`;
    }

    if (activeFormat === 'json') {
      return JSON.stringify({
        platform: "NxtGenOrchestrator – Low-Code / No-Code AI-Powered ETL & Data Integration Platform",
        version: "4.5.0-enterprise",
        nodes: INITIAL_NODES,
        edges: INITIAL_EDGES,
        readinessScorecard: READINESS_PILLARS,
        roadmap: ROADMAP_PHASES
      }, null, 2);
    }

    if (activeFormat === 'ascii') {
      return `=== SECTION 1: UI LAYOUT & CANVAS WIREFRAME ===\n${ASCII_UI_WIREFRAME}\n\n=== SECTION 5: END-TO-END CLOUD REFERENCE ARCHITECTURE ===\n${ASCII_REFERENCE_ARCHITECTURE}`;
    }

    if (activeFormat === 'text') {
      return `NXTGENORCHESTRATOR – ENTERPRISE ARCHITECTURE BLUEPRINT & CODE SPECIFICATION
================================================================================
Platform: NxtGenOrchestrator (Low-Code / No-Code AI-Powered ETL & Data Integration Platform)
Audience: Principal Enterprise Architects, Architecture Review Board (ARB), RFPs
Classification: Vendor-Neutral Enterprise Architecture Specification
Export Generated: ${new Date().toISOString()}

1. SYSTEM COMPONENT INVENTORY & METRICS
--------------------------------------------------------------------------------
* Total DAG Orchestration Nodes: ${INITIAL_NODES.length}
* Total Connection Channels: ${INITIAL_EDGES.length}
* Multi-AZ Isolation: Production, Pre-Prod Staging, Sandbox Dev
* Execution Runtime: Rootless OCI Containers (gVisor Kernel Sandbox)
* Envelope Encryption: KMS Master Key / AES-256-GCM
* Target Sinks: Power BI Report DirectLake, Snowflake, BigQuery, S3 Iceberg

2. CORE DAG NODES & PROFILES
--------------------------------------------------------------------------------
${INITIAL_NODES.map((n, i) => `[Node ${i + 1}] ${n.name} (${n.typeLabel})
  - Category: ${n.category}
  - Base Resources: ${n.config.cpuAllocation} / ${n.config.memoryAllocation}
  - Secrets: ${n.config.secretsManagement.keyStore}
  - Isolation: ${n.config.containerRuntime.isolation}`).join('\n\n')}

================================================================================
END OF SPECIFICATION - NXTGENORCHESTRATOR`;
    }

    // Markdown
    return `# NxtGenOrchestrator Enterprise Architecture Blueprint & Technical Specification
Prepared for: Architecture Review Board (ARB), RFPs, and Executive Review
Platform: Low-Code / No-Code AI-Powered ETL & Data Integration Platform

## 1. UI Layout & Wireframe (ASCII)
\`\`\`
${ASCII_UI_WIREFRAME}
\`\`\`

## 2. Cloud Reference Architecture (ASCII)
\`\`\`
${ASCII_REFERENCE_ARCHITECTURE}
\`\`\`
`;
  };

  const handleCopy = () => {
    const content = getExportContent();
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (activeFormat === 'claude') {
      handleDownloadClaudeMarkdown();
      return;
    }

    const content = getExportContent();
    let filename = `nxtgenorchestrator-spec.${activeFormat === 'json' ? 'json' : activeFormat === 'markdown' ? 'md' : 'txt'}`;
    let mimeType = activeFormat === 'json' ? 'application/json' : 'text/plain';

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 text-cyan-400">
              <Bot className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Download Code &amp; Specifications</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold">
                  For Claude &amp; Production
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Download the complete codebase to check in Claude, inspect full code files, or run locally.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Bar */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveFormat('claude')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeFormat === 'claude' 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/30' 
                  : 'bg-slate-900 text-amber-300 hover:text-white border border-amber-500/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>For Claude (Prompt &amp; Code)</span>
            </button>

            <button
              onClick={() => setActiveFormat('zip')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeFormat === 'zip' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/30' 
                  : 'bg-slate-900 text-cyan-300 hover:text-white border border-cyan-800'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Complete App ZIP (.zip)</span>
            </button>

            <button
              onClick={() => setActiveFormat('markdown')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                activeFormat === 'markdown' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Markdown Spec (.md)</span>
            </button>

            <button
              onClick={() => setActiveFormat('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                activeFormat === 'json' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>JSON DAG (.json)</span>
            </button>

            <button
              onClick={() => setActiveFormat('ascii')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                activeFormat === 'ascii' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>ASCII Diagrams (.txt)</span>
            </button>

            <button
              onClick={() => setActiveFormat('text')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                activeFormat === 'text' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Full Text (.txt)</span>
            </button>
          </div>

          {/* Quick Claude Action Badges */}
          {activeFormat === 'claude' && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                ⚡ Ready for Claude
              </span>
            </div>
          )}
        </div>

        {/* Claude Quick Download Banner */}
        {activeFormat === 'claude' && (
          <div className="px-4 py-2.5 bg-gradient-to-r from-amber-950/40 to-slate-950 border-b border-amber-900/40 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-amber-200">
              <Bot className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                To check in Claude: Download the <strong>.zip file</strong> or <strong>.md file</strong>, or copy below and paste into Claude!
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
              >
                {isZipping ? <Loader2 className="w-3 h-3 animate-spin" /> : <Archive className="w-3 h-3" />}
                <span>Download .ZIP (All Files)</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadClaudeMarkdown}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Download .MD</span>
              </button>
            </div>
          </div>
        )}

        {/* Preview Area */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-slate-300 leading-snug">
          <pre className="whitespace-pre font-mono text-[11px]">{getExportContent()}</pre>
        </div>

        {/* Footer Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            {activeFormat === 'claude'
              ? 'Complete multi-file source package ready to drag into Claude or paste into Claude chat.'
              : activeFormat === 'zip'
              ? 'Stand-alone bundle: extract and run `npm install && npm run dev` under any user login.'
              : 'Exportable technical blueprint documentation for Enterprise Review Boards.'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied to Clipboard!' : activeFormat === 'claude' ? 'Copy All Code for Claude' : 'Copy Text'}</span>
            </button>

            {activeFormat === 'zip' ? (
              <button
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="px-4 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-sm shadow-cyan-500/20 disabled:opacity-50"
              >
                {isZipping ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating ZIP...</span>
                  </>
                ) : (
                  <>
                    <Archive className="w-3.5 h-3.5" />
                    <span>Download App ZIP (.zip)</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleDownload}
                className="px-4 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-sm shadow-cyan-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{activeFormat === 'claude' ? 'Download Claude Prompt (.md)' : 'Download File'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
