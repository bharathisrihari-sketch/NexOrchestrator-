import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  RefreshCw, 
  Send,
  Layers
} from 'lucide-react';
import { CANONICAL_COPILOT_PROMPT, SAMPLE_COPILOT_ANALYSIS } from '../../data/blueprintData';
import { CopilotAnalysisResult } from '../../types/architecture';

interface CopilotViewProps {
  onApplyToCanvas: (result: CopilotAnalysisResult) => void;
  onNavigateToCanvas: () => void;
}

export const CopilotView: React.FC<CopilotViewProps> = ({
  onApplyToCanvas,
  onNavigateToCanvas
}) => {
  const [promptInput, setPromptInput] = useState(CANONICAL_COPILOT_PROMPT);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CopilotAnalysisResult>(SAMPLE_COPILOT_ANALYSIS);
  const [activeStepTab, setActiveStepTab] = useState<'analysis' | 'security' | 'quality' | 'graph'>('analysis');

  const handleSynthesize = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      setAnalysisResult({
        ...SAMPLE_COPILOT_ANALYSIS,
        prompt: promptInput
      });
    }, 600);
  };

  const handleQuickPrompt = (prompt: string) => {
    setPromptInput(prompt);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header & Prompt Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
              Section 2 · AI Natural-Language Pipeline Synthesizer
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <span>Interactive AI Workflow Copilot</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl">
              Describe data integration workflows in natural language. The AI Copilot translates instructions into an enterprise-grade DAG, generates security guardrails, configures data quality assertions, and validates container resources.
            </p>
          </div>
        </div>

        {/* Prompt Input Box */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-300">Natural-Language Pipeline Specification</span>
            <span className="font-mono text-[11px] text-slate-400">Foundation Model: Claude/Gemini Enterprise Mesh</span>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400/80 transition-colors font-sans resize-none"
              placeholder="Describe your ETL pipeline..."
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400">Prompt Presets:</span>
              <button
                onClick={() => handleQuickPrompt(CANONICAL_COPILOT_PROMPT)}
                className="px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                Canonical Enterprise Pipeline
              </button>
              <button
                onClick={() => handleQuickPrompt("Ingest streaming event logs, detect schema drift, mask IP addresses, calculate tumbling window averages, and sink to Curated Analytics Repository.")}
                className="px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                Streaming Window Pipeline
              </button>
            </div>

            <button
              onClick={handleSynthesize}
              disabled={isSynthesizing || !promptInput.trim()}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs rounded-lg flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {isSynthesizing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Pipeline...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Generate Pipeline Graph</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* AI Synthesis Analysis Steps */}
      <div className="space-y-4">
        {/* Step Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-medium">
          <button
            onClick={() => setActiveStepTab('analysis')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeStepTab === 'analysis'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>1. Ingestion & Semantic Analysis</span>
          </button>
          <button
            onClick={() => setActiveStepTab('security')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeStepTab === 'security'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>2. Security & Guardrail Validation</span>
          </button>
          <button
            onClick={() => setActiveStepTab('quality')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeStepTab === 'quality'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>3. Data Quality & Assertions</span>
          </button>
          <button
            onClick={() => setActiveStepTab('graph')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeStepTab === 'graph'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>4. Proposed Workflow Graph (DAG)</span>
          </button>
        </div>

        {/* Tab 1: Semantic Analysis */}
        {activeStepTab === 'analysis' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Pipeline Semantic Synthesis
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysisResult.semanticAnalysis.summary}
              </p>
              <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <span className="text-[11px] text-slate-400 font-medium block">Partitioning & Indexing Pattern</span>
                <span className="text-cyan-400 font-mono text-[11px]">{analysisResult.semanticAnalysis.partitioningPattern}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Identified Entity Mappings
              </span>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Identified Ingestion Sources:</span>
                  <ul className="list-disc list-inside text-slate-200 text-[11px] mt-0.5 space-y-0.5">
                    {analysisResult.semanticAnalysis.identifiedSources.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Transformation Requirements:</span>
                  <ul className="list-disc list-inside text-slate-200 text-[11px] mt-0.5 space-y-0.5">
                    {analysisResult.semanticAnalysis.transformationRequirements.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Target Destination Sinks:</span>
                  <ul className="list-disc list-inside text-slate-200 text-[11px] mt-0.5 space-y-0.5">
                    {analysisResult.semanticAnalysis.targetDestinations.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Security Validation */}
        {activeStepTab === 'security' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  Confidential Data Discovery
                </span>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono text-sm font-bold">
                    {analysisResult.securityValidation.classificationSummary.sensitiveFieldsFound} Fields
                  </div>
                  <div className="text-xs text-slate-300">
                    Sensitive identifiers automatically routed through hardware enclave tokenization.
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 text-[11px] block">Tokenization Algorithm:</span>
                  <span className="font-mono text-cyan-400 text-[11px]">
                    {analysisResult.securityValidation.classificationSummary.tokenizationStrategy}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  Zero-Trust Policy Assertion
                </span>
                <p className="text-xs text-slate-300">
                  Execution Role validated against Enterprise IAM. No long-lived cloud keys permitted.
                </p>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-emerald-400 font-mono flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Compliant with Enterprise Zero-Trust Architecture</span>
                </div>
              </div>
            </div>

            {/* Security Rules Checklist */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Automated Security Rule Verification
              </span>
              <div className="divide-y divide-slate-800">
                {analysisResult.securityValidation.rulesChecked.map((rule, idx) => (
                  <div key={idx} className="py-2.5 flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-slate-200 block">{rule.rule}</span>
                      <span className="text-[11px] text-slate-400 block">{rule.detail}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60 shrink-0">
                      COMPLIANT
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Data Quality Checks */}
        {activeStepTab === 'quality' && (
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Automated Data Quality & Assertion Gates
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">4 Rules Configured</span>
            </div>

            <div className="divide-y divide-slate-800">
              {analysisResult.dataQualityChecks.checks.map((check, idx) => (
                <div key={idx} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-100 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{check.name}</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 block">
                      Rule: {check.assertion}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Threshold</span>
                      <span className="font-mono text-cyan-300 text-[11px]">{check.threshold}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">On Failure</span>
                      <span className="text-amber-400 text-[11px] font-medium">{check.actionOnFailure}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Proposed Workflow Graph */}
        {activeStepTab === 'graph' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block mb-1">Generated DAG Nodes</span>
                <span className="text-xl font-bold text-white font-mono">
                  {analysisResult.proposedNodes.length} Nodes
                </span>
                <span className="text-[10px] text-slate-400">2 Ingest · 3 Transforms · 1 Sink</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block mb-1">Estimated Compute Footprint</span>
                <span className="text-xl font-bold text-white font-mono flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>{analysisResult.resourceEstimate.totalEstimatedVCPU} vCPU · {analysisResult.resourceEstimate.totalEstimatedRAM}</span>
                </span>
                <span className="text-[10px] text-emerald-400">Elastic autoscale allocation</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block mb-1">Concurrency Class</span>
                <span className="text-sm font-semibold text-slate-200">
                  {analysisResult.resourceEstimate.concurrencyClass}
                </span>
                <span className="text-[10px] text-slate-400">Zero-data-loss backpressure queue</span>
              </div>
            </div>

            {/* Visual Node Sequence Preview */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Topological Execution Order
              </span>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                {analysisResult.proposedNodes.map((n, idx) => (
                  <div key={n.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[9px] font-mono text-cyan-400 block uppercase">
                      Stage 0{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-200 block truncate">
                      {n.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate font-mono">
                      {n.config.cpuAllocation} / {n.config.memoryAllocation.split(' ')[0]}G
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-white block">Ready to Load into Workflow Canvas</span>
                <span className="text-[11px] text-slate-400">
                  Transfers the synthesized DAG and secure execution parameters to the visual studio.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onApplyToCanvas(analysisResult);
                    onNavigateToCanvas();
                  }}
                  className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-cyan-500/20"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Apply & Open in Visual Canvas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
