import React from 'react';
import { 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  BarChart3, 
  Network, 
  CalendarRange, 
  FileText, 
  Download,
  Presentation
} from 'lucide-react';

export type ActiveTab = 
  | 'canvas'
  | 'copilot'
  | 'inspector'
  | 'readiness'
  | 'reference'
  | 'roadmap'
  | 'dossier';

interface NavigationHeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenExportModal: () => void;
  onOpenPresentation: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenExportModal,
  onOpenPresentation
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-6 flex items-center justify-between gap-8 sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a 
          href="#canvas" 
          onClick={(e) => { e.preventDefault(); onTabChange('canvas'); }}
          className="text-base font-bold tracking-tight text-white whitespace-nowrap flex items-center gap-2 hover:text-cyan-400 transition-colors"
        >
          <span className="w-6 h-6 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-black text-slate-950 shadow-sm shadow-cyan-500/30">
            N
          </span>
          <span>NexOrchestrator Enterprise Studio</span>
        </a>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-medium text-slate-300">
        <button
          onClick={() => onTabChange('canvas')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'canvas'
              ? 'bg-slate-800 text-cyan-400 font-semibold shadow-inner'
              : 'hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Workflow Canvas</span>
        </button>

        <button
          onClick={() => onTabChange('copilot')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'copilot'
              ? 'bg-slate-800 text-cyan-400 font-semibold shadow-inner'
              : 'hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>AI Copilot</span>
        </button>

        <button
          onClick={() => onTabChange('inspector')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'inspector'
              ? 'bg-slate-800 text-cyan-400 font-semibold shadow-inner'
              : 'hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secure Execution</span>
        </button>

        <button
          onClick={() => onTabChange('readiness')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'readiness'
              ? 'bg-slate-800 text-cyan-400 font-semibold shadow-inner'
              : 'hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
          <span>Readiness Scorecard</span>
        </button>

        <button
          onClick={() => onTabChange('reference')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'reference'
              ? 'bg-slate-800 text-cyan-400 font-semibold shadow-inner'
              : 'hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Network className="w-3.5 h-3.5 text-purple-400" />
          <span>Reference Architecture</span>
        </button>

        <button
          onClick={() => onTabChange('roadmap')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'roadmap'
              ? 'bg-slate-800 text-cyan-400 font-semibold shadow-inner'
              : 'hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <CalendarRange className="w-3.5 h-3.5 text-teal-400" />
          <span>90-Day Roadmap</span>
        </button>

        <button
          onClick={() => onTabChange('dossier')}
          className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'dossier'
              ? 'bg-slate-800 text-cyan-400 font-semibold shadow-inner'
              : 'hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>ARB Blueprint Dossier</span>
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenPresentation}
          className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded transition-colors whitespace-nowrap flex items-center gap-1.5"
          title="Executive Presentation Mode"
        >
          <Presentation className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Executive Deck</span>
        </button>

        <button
          onClick={onOpenExportModal}
          className="px-3 py-1.5 text-xs font-medium text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm shadow-cyan-500/20"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Blueprint</span>
        </button>
      </div>
    </header>
  );
};
