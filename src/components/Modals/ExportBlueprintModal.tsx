import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode2, FileText, Code2 } from 'lucide-react';
import { 
  ASCII_UI_WIREFRAME, 
  ASCII_REFERENCE_ARCHITECTURE, 
  INITIAL_NODES, 
  INITIAL_EDGES, 
  READINESS_PILLARS, 
  ROADMAP_PHASES 
} from '../../data/blueprintData';

interface ExportBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportBlueprintModal: React.FC<ExportBlueprintModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeFormat, setActiveFormat] = useState<'markdown' | 'json' | 'ascii'>('markdown');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getExportContent = () => {
    if (activeFormat === 'json') {
      return JSON.stringify({
        platform: "NexOrchestrator – Low-Code / No-Code AI-Powered ETL & Data Integration Platform",
        version: "1.0.0-enterprise",
        nodes: INITIAL_NODES,
        edges: INITIAL_EDGES,
        readinessScorecard: READINESS_PILLARS,
        roadmap: ROADMAP_PHASES
      }, null, 2);
    }

    if (activeFormat === 'ascii') {
      return `=== SECTION 1: UI LAYOUT & CANVAS WIREFRAME ===\n${ASCII_UI_WIREFRAME}\n\n=== SECTION 5: END-TO-END CLOUD REFERENCE ARCHITECTURE ===\n${ASCII_REFERENCE_ARCHITECTURE}`;
    }

    // Markdown
    return `# NexOrchestrator Enterprise Architecture Blueprint & Technical Specification
Prepared for: Architecture Review Board (ARB), RFPs, and Executive Review
Platform: Low-Code / No-Code AI-Powered ETL & Data Integration Platform
Classification: Enterprise Confidential / Generic Reusable

## 1. UI Layout & Wireframe (ASCII)
\`\`\`
${ASCII_UI_WIREFRAME}
\`\`\`

## 2. End-to-End Cloud Reference Architecture (ASCII)
\`\`\`
${ASCII_REFERENCE_ARCHITECTURE}
\`\`\`
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = getExportContent();
    const extension = activeFormat === 'json' ? 'json' : activeFormat === 'ascii' ? 'txt' : 'md';
    const mime = activeFormat === 'json' ? 'application/json' : 'text/plain';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NexOrchestrator_Architecture_Blueprint.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-3xl rounded-xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Export Architecture Blueprint</h3>
            <p className="text-xs text-slate-400">Download or copy vendor-neutral enterprise specifications</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center gap-3">
          <span className="text-xs text-slate-400">Format:</span>
          <button
            onClick={() => setActiveFormat('markdown')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeFormat === 'markdown' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Markdown Specification (.md)</span>
          </button>

          <button
            onClick={() => setActiveFormat('json')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeFormat === 'json' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>JSON DAG & Specs (.json)</span>
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
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-slate-300 leading-snug">
          <pre className="whitespace-pre">{getExportContent()}</pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <span className="text-xs text-slate-400">Suitable for RFPs, Architecture Review Boards, and executive summaries.</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy to Clipboard'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-sm shadow-cyan-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
