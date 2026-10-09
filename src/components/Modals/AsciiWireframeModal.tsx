import React, { useState } from 'react';
import { X, Copy, Check, Code } from 'lucide-react';
import { ASCII_UI_WIREFRAME } from '../../data/blueprintData';

interface AsciiWireframeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AsciiWireframeModal: React.FC<AsciiWireframeModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(ASCII_UI_WIREFRAME);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-5xl rounded-xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Section 1 · High-Level UI Layout & Canvas Wireframe (ASCII)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium rounded text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy ASCII'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Monospace ASCII Body */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-[11px] text-cyan-300 leading-snug select-all">
          <pre className="whitespace-pre">{ASCII_UI_WIREFRAME}</pre>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <span>Conforms to Section 1 requirements: Nav, Env, Workspace, Left Toolbox, AI Copilot, Central DAG Canvas, Node Inspector, Execution Console.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
