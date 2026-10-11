import React, { useState, useEffect } from 'react';
import { DAGNode } from '../../types/architecture';
import { CollapsibleSection } from '../common/CollapsibleSection';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { 
  ShieldCheck, 
  Cpu, 
  Lock, 
  Network, 
  RotateCw, 
  GitBranch, 
  Server,
  Zap,
  Activity,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  TrendingUp,
  Radio,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  X,
  EyeOff,
  Maximize2,
  Minimize2,
  Trash2
} from 'lucide-react';

interface UtilizationPoint {
  time: string;
  cpu: number;
  memory: number;
  throughput: number;
}

interface NodeInspectorProps {
  node: DAGNode | null;
  onUpdateConfig: (nodeId: string, updatedConfig: Partial<DAGNode['config']>) => void;
  isSimulating?: boolean;
  currentThroughput?: number;
  onTriggerSpike?: (nodeId: string) => void;
  onClose?: () => void;
  onDeleteNode?: (nodeId: string) => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  node,
  onUpdateConfig,
  isSimulating = false,
  currentThroughput = 22600,
  onTriggerSpike,
  onClose,
  onDeleteNode
}) => {
  const [spikeActive, setSpikeActive] = useState(false);
  const [sparklineMetric, setSparklineMetric] = useState<'combined' | 'cpu' | 'memory'>('combined');
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  // Real-time sparkline telemetry trend history
  const [sparklineHistory, setSparklineHistory] = useState<UtilizationPoint[]>([
    { time: '00s', cpu: 24, memory: 28, throughput: 18200 },
    { time: '05s', cpu: 28, memory: 31, throughput: 19400 },
    { time: '10s', cpu: 32, memory: 33, throughput: 20500 },
    { time: '15s', cpu: 36, memory: 35, throughput: 21800 },
    { time: '20s', cpu: 40, memory: 38, throughput: 22600 },
    { time: '25s', cpu: 44, memory: 40, throughput: 23100 },
    { time: '30s', cpu: 42, memory: 42, throughput: 23800 },
    { time: '35s', cpu: 46, memory: 44, throughput: 24500 },
    { time: '40s', cpu: 48, memory: 45, throughput: 25100 },
    { time: '45s', cpu: 52, memory: 48, throughput: 26000 }
  ]);

  // Telemetry stream effect updating sparkline data points
  useEffect(() => {
    if (!isSimulating && !spikeActive) return;

    const interval = setInterval(() => {
      setSparklineHistory(prev => {
        const lastIdx = prev.length;
        const timeLabel = `${(lastIdx * 5) % 60}s`;

        let newCpu = 40 + Math.floor(Math.random() * 16);
        let newMem = 38 + Math.floor(Math.random() * 12);
        let newThroughput = currentThroughput + Math.floor((Math.random() - 0.5) * 4000);

        if (spikeActive) {
          newCpu = 86 + Math.floor(Math.random() * 12); // Spike load 86-98%
          newMem = 78 + Math.floor(Math.random() * 10); // Spike RAM 78-88%
          newThroughput = 68000 + Math.floor(Math.random() * 6000);
        }

        const nextPoint: UtilizationPoint = {
          time: timeLabel,
          cpu: Math.min(100, Math.max(10, newCpu)),
          memory: Math.min(100, Math.max(10, newMem)),
          throughput: Math.max(5000, newThroughput)
        };

        const updated = [...prev.slice(1), nextPoint];
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating, spikeActive, currentThroughput]);

  if (!node) {
    return (
      <aside className="w-80 lg:w-96 border-l border-slate-800 bg-slate-950/80 p-6 flex flex-col items-center justify-center text-center text-slate-400 shrink-0">
        <Server className="w-8 h-8 text-slate-500 mb-3" />
        <p className="text-xs font-semibold text-slate-200">No Node Selected</p>
        <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
          Select any node on the canvas to inspect its secure container profile, auto-scaling parameters, and lineage.
        </p>
      </aside>
    );
  }

  const { config } = node;
  const autoScaling = config.autoScaling || {
    enabled: false,
    minCpu: '1.0 vCPU',
    maxCpu: '8.0 vCPU',
    minMemory: '2.0 GiB',
    maxMemory: '16.0 GiB',
    targetMetric: 'Throughput (rec/s)' as const,
    targetValue: 20000,
    scaleUpThresholdPercent: 80,
    scaleDownThresholdPercent: 25,
    currentScaledCpu: config.cpuAllocation,
    currentScaledMemory: config.memoryAllocation,
    scalingState: 'Nominal' as const,
    lastScalingEvent: 'Baseline allocation active'
  };

  const handleToggleAutoScaling = (enabled: boolean) => {
    onUpdateConfig(node.id, {
      autoScaling: {
        ...autoScaling,
        enabled,
        currentScaledCpu: enabled ? (autoScaling.currentScaledCpu || config.cpuAllocation) : config.cpuAllocation,
        currentScaledMemory: enabled ? (autoScaling.currentScaledMemory || config.memoryAllocation) : config.memoryAllocation,
        scalingState: enabled ? 'Nominal' : undefined,
        lastScalingEvent: enabled ? 'Auto-scaling enabled by architect' : 'Switched to static allocation'
      }
    });
  };

  const handleSimulateSpike = () => {
    setSpikeActive(true);
    const maxCpu = autoScaling.maxCpu || '8.0 vCPU';
    const maxMem = autoScaling.maxMemory || '16.0 GiB';
    
    onUpdateConfig(node.id, {
      autoScaling: {
        ...autoScaling,
        enabled: true,
        currentScaledCpu: maxCpu,
        currentScaledMemory: maxMem,
        scalingState: 'Scaling Up',
        lastScalingEvent: `Spike event (+50,000 rec/s detected) -> Dynamically scaled to ${maxCpu} / ${maxMem}`
      }
    });

    if (onTriggerSpike) {
      onTriggerSpike(node.id);
    }

    setTimeout(() => {
      setSpikeActive(false);
      onUpdateConfig(node.id, {
        autoScaling: {
          ...autoScaling,
          enabled: true,
          currentScaledCpu: autoScaling.minCpu || '2.0 vCPU',
          currentScaledMemory: autoScaling.minMemory || '4.0 GiB',
          scalingState: 'Nominal',
          lastScalingEvent: 'Traffic normalized -> Scaled down to baseline capacity'
        }
      });
    }, 4500);
  };

  const throughputValue = isSimulating ? (spikeActive ? 68000 : currentThroughput) : 0;
  const loadPercentage = autoScaling.enabled && autoScaling.targetValue 
    ? Math.min(100, Math.round((throughputValue / (autoScaling.targetValue * 2)) * 100))
    : 35;

  return (
    <aside className="w-80 lg:w-96 border-l border-slate-800 bg-slate-950/90 flex flex-col h-full shrink-0 select-none overflow-hidden">
      {/* Workflow Details Header with Collapse / Hide Control */}
      <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>Workflow Details Section</span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 hover:text-white bg-slate-950 border border-cyan-900/60 hover:bg-slate-800 flex items-center gap-1 transition-colors"
            title="Hide details page of workflow (or click anywhere on canvas)"
          >
            <EyeOff className="w-3 h-3 text-cyan-400" />
            <span>Hide Details</span>
          </button>
        )}
      </div>

      {/* Node Header with Collapsible Toggle */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/70">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
              {node.typeLabel}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              ID: {node.id}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title={isHeaderCollapsed ? "Expand Inspector Header" : "Collapse Inspector Header"}
            >
              {isHeaderCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                title="Hide Inspector Panel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <h3 className="text-sm font-bold text-white truncate flex items-center justify-between gap-2">
          <span>{node.name}</span>
          {autoScaling.enabled && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1 shrink-0">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Auto-Scaling</span>
            </span>
          )}
        </h3>

        {!isHeaderCollapsed && (
          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
            {node.description}
          </p>
        )}
      </div>

      {/* Collapsible Sub-Sections Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
        {/* SUB-HEADER 1: Compute, Memory & Elastic Auto-Scaling */}
        <CollapsibleSection
          title="Compute & Resource Auto-Scaling"
          subtitle={
            autoScaling.enabled
              ? `Elastic: ${autoScaling.currentScaledCpu || config.cpuAllocation} · ${autoScaling.currentScaledMemory || config.memoryAllocation}`
              : `Static: ${config.cpuAllocation} · ${config.memoryAllocation}`
          }
          badge={autoScaling.enabled ? 'Dynamic Scale' : 'Static OCI'}
          badgeColor={autoScaling.enabled ? 'bg-amber-950 text-amber-300 border border-amber-800/60' : 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'}
          icon={Cpu}
          defaultOpen={true}
        >
          <div className="space-y-3 text-xs">
            {/* AUTO-SCALING TOGGLE SWITCH CARD */}
            <div className={`p-3 rounded-xl border transition-all ${
              autoScaling.enabled
                ? 'bg-gradient-to-br from-slate-900 to-amber-950/30 border-amber-500/50 shadow-md shadow-amber-950/30'
                : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${autoScaling.enabled ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200 block text-xs">
                      Elastic Resource Auto-Scaling
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Dynamically scale vCPU & RAM by data volume
                    </span>
                  </div>
                </div>

                {/* Custom Toggle Switch */}
                <button
                  type="button"
                  onClick={() => handleToggleAutoScaling(!autoScaling.enabled)}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    autoScaling.enabled ? 'bg-amber-500' : 'bg-slate-800'
                  }`}
                  role="switch"
                  aria-checked={autoScaling.enabled}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      autoScaling.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* DYNAMIC AUTO-SCALING CONTROLS & LIVE TELEMETRY */}
              {autoScaling.enabled ? (
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2.5">
                  {/* Live Simulation Metric Meter */}
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Activity className="w-3 h-3 text-cyan-400" />
                        <span>Data Volume Throughput:</span>
                      </span>
                      <span className="text-cyan-300 font-bold">
                        {throughputValue.toLocaleString()} rec/s
                      </span>
                    </div>

                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${loadPercentage}%` }}
                        className={`h-full rounded-full transition-all duration-300 ${
                          loadPercentage > 75 ? 'bg-rose-500' : loadPercentage > 50 ? 'bg-amber-500' : 'bg-cyan-500'
                        }`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Target: {autoScaling.targetValue.toLocaleString()} rec/s</span>
                      <span className={spikeActive ? 'text-amber-400 font-bold animate-pulse' : 'text-emerald-400'}>
                        {spikeActive ? '⚡ Scaling Burst Triggered' : (autoScaling.scalingState || 'Nominal')}
                      </span>
                    </div>
                  </div>

                  {/* Real-time Dynamic Allocation Readout */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Current Scaled CPU</span>
                      <span className="text-sm font-bold text-cyan-400 font-mono block">
                        {autoScaling.currentScaledCpu || config.cpuAllocation}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono block mt-0.5">
                        Bounds: {autoScaling.minCpu} – {autoScaling.maxCpu}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Current Scaled Memory</span>
                      <span className="text-sm font-bold text-purple-400 font-mono block">
                        {autoScaling.currentScaledMemory || config.memoryAllocation}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono block mt-0.5">
                        Bounds: {autoScaling.minMemory} – {autoScaling.maxMemory}
                      </span>
                    </div>
                  </div>

                  {/* Auto-scaling Bounds Adjustment Selectors */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Min / Max CPU</span>
                      <div className="flex items-center gap-1">
                        <select
                          value={autoScaling.minCpu}
                          onChange={(e) => onUpdateConfig(node.id, {
                            autoScaling: { ...autoScaling, minCpu: e.target.value }
                          })}
                          className="w-1/2 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-200 font-mono"
                        >
                          <option value="1.0 vCPU">1 vCPU</option>
                          <option value="2.0 vCPU">2 vCPU</option>
                          <option value="4.0 vCPU">4 vCPU</option>
                        </select>
                        <select
                          value={autoScaling.maxCpu}
                          onChange={(e) => onUpdateConfig(node.id, {
                            autoScaling: { ...autoScaling, maxCpu: e.target.value }
                          })}
                          className="w-1/2 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-200 font-mono"
                        >
                          <option value="8.0 vCPU">8 vCPU</option>
                          <option value="16.0 vCPU">16 vCPU</option>
                          <option value="32.0 vCPU">32 vCPU</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Min / Max RAM</span>
                      <div className="flex items-center gap-1">
                        <select
                          value={autoScaling.minMemory}
                          onChange={(e) => onUpdateConfig(node.id, {
                            autoScaling: { ...autoScaling, minMemory: e.target.value }
                          })}
                          className="w-1/2 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-200 font-mono"
                        >
                          <option value="2.0 GiB">2 GB</option>
                          <option value="4.0 GiB">4 GB</option>
                          <option value="8.0 GiB">8 GB</option>
                        </select>
                        <select
                          value={autoScaling.maxMemory}
                          onChange={(e) => onUpdateConfig(node.id, {
                            autoScaling: { ...autoScaling, maxMemory: e.target.value }
                          })}
                          className="w-1/2 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-200 font-mono"
                        >
                          <option value="16.0 GiB">16 GB</option>
                          <option value="32.0 GiB">32 GB</option>
                          <option value="64.0 GiB">64 GB</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* MINI REAL-TIME SPARKLINE CHART (RECHARTS) FOR CPU & MEMORY TRENDS */}
                  <div className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[11px] font-semibold text-slate-200">
                          Utilization Trends (Real-Time Sparkline)
                        </span>
                      </div>
                      
                      {/* Metric Toggle Tabs */}
                      <div className="flex items-center bg-slate-900 rounded p-0.5 border border-slate-800 text-[9px] font-mono">
                        <button
                          type="button"
                          onClick={() => setSparklineMetric('combined')}
                          className={`px-1.5 py-0.5 rounded transition-colors ${
                            sparklineMetric === 'combined'
                              ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          All
                        </button>
                        <button
                          type="button"
                          onClick={() => setSparklineMetric('cpu')}
                          className={`px-1.5 py-0.5 rounded transition-colors ${
                            sparklineMetric === 'cpu'
                              ? 'bg-cyan-500/30 text-cyan-300 font-bold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          CPU
                        </button>
                        <button
                          type="button"
                          onClick={() => setSparklineMetric('memory')}
                          className={`px-1.5 py-0.5 rounded transition-colors ${
                            sparklineMetric === 'memory'
                              ? 'bg-purple-500/30 text-purple-300 font-bold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          RAM
                        </button>
                      </div>
                    </div>

                    {/* Current Trend Stats */}
                    <div className="flex items-center justify-between text-[10px] font-mono px-1">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                          CPU: {sparklineHistory[sparklineHistory.length - 1]?.cpu || 42}%
                        </span>
                        <span className="text-purple-400 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
                          RAM: {sparklineHistory[sparklineHistory.length - 1]?.memory || 38}%
                        </span>
                      </div>
                      <span className={`text-[9px] font-bold ${spikeActive ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                        {spikeActive ? 'Burst Peak Active' : 'Adaptive Scaling OK'}
                      </span>
                    </div>

                    {/* Recharts Area Sparkline */}
                    <div className="h-24 w-full pt-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={sparklineHistory}
                          margin={{ top: 4, right: 2, left: -25, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="cpuSparkGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                            </linearGradient>
                            <linearGradient id="memSparkGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.5}/>
                              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0}/>
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="time" 
                            stroke="#475569" 
                            fontSize={8} 
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis 
                            domain={[0, 100]} 
                            stroke="#475569" 
                            fontSize={8} 
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload as UtilizationPoint;
                                return (
                                  <div className="bg-slate-900 border border-slate-700 p-1.5 rounded shadow-xl text-[9px] font-mono">
                                    <div className="text-slate-400 mb-0.5">T+{data.time}</div>
                                    <div className="text-cyan-300">vCPU: {data.cpu}%</div>
                                    <div className="text-purple-300">RAM: {data.memory}%</div>
                                    <div className="text-slate-400 text-[8px]">{data.throughput.toLocaleString()} rec/s</div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          {(sparklineMetric === 'combined' || sparklineMetric === 'cpu') && (
                            <Area
                              type="monotone"
                              dataKey="cpu"
                              stroke="#06b6d4"
                              strokeWidth={1.5}
                              fillOpacity={1}
                              fill="url(#cpuSparkGradient)"
                              isAnimationActive={false}
                            />
                          )}
                          {(sparklineMetric === 'combined' || sparklineMetric === 'memory') && (
                            <Area
                              type="monotone"
                              dataKey="memory"
                              stroke="#a855f7"
                              strokeWidth={1.5}
                              fillOpacity={1}
                              fill="url(#memSparkGradient)"
                              isAnimationActive={false}
                            />
                          )}
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Interactive Test Action Button */}
                  <button
                    type="button"
                    onClick={handleSimulateSpike}
                    disabled={spikeActive}
                    className="w-full py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{spikeActive ? '⚡ Traffic Spike Active (Auto-Scaling to Max)' : 'Simulate Traffic Spike (+50k rec/s)'}</span>
                  </button>

                  {/* Last Event Log */}
                  {autoScaling.lastScalingEvent && (
                    <div className="text-[10px] font-mono text-slate-400 bg-slate-950 p-1.5 rounded border border-slate-850">
                      <span className="text-slate-400">Audit Log: </span>
                      <span className="text-amber-300">{autoScaling.lastScalingEvent}</span>
                    </div>
                  )}
                </div>
              ) : (
                /* Static Allocation Mode Inputs */
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block mb-1">Static CPU</span>
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
                      <span className="text-[10px] text-slate-400 block mb-1">Static Memory</span>
                      <input
                        type="text"
                        value={config.memoryAllocation}
                        onChange={(e) => onUpdateConfig(node.id, { memoryAllocation: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Fixed capacity assigned. Toggle auto-scaling to allow dynamic expansion during heavy pipelines.
                  </span>
                </div>
              )}
            </div>

            {/* Container Runtime Specs */}
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

        {/* SUB-HEADER 4: Security Scanning & CVE Vulnerability Checks */}
        <CollapsibleSection
          title="Security Scanning & Supply Chain"
          subtitle="SBOM attestation · SAST taint analysis · Zero CVEs"
          badge="Verified"
          badgeColor="bg-emerald-950 text-emerald-400 border border-emerald-800/60"
          icon={FileCheck2}
          defaultOpen={false}
        >
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Software Bill of Materials (SBOM):</span>
              <span className="text-emerald-400 font-mono">SPDX 2.3 Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">SAST Taint Analysis:</span>
              <span className="text-emerald-400 font-mono">Passed (Zero Taint)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Vulnerability Gate:</span>
              <span className="text-cyan-300 font-mono">{config.securityScanning.vulnerabilityThreshold}</span>
            </div>
          </div>
        </CollapsibleSection>

        {/* SUB-HEADER 5: Fault Tolerance, Retries & Dead-Letter Handling */}
        <CollapsibleSection
          title="Fault Tolerance & Retry Policies"
          subtitle={`Max ${config.retryPolicy.maxAttempts} attempts · ${config.retryPolicy.backoffStrategy}`}
          badge="DLQ Active"
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

        {/* SUB-HEADER 6: Schema Contract & Lineage Ports */}
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

        {/* Delete Selected Node Button */}
        {onDeleteNode && (
          <div className="pt-4 border-t border-slate-800 pb-6">
            <button
              onClick={() => onDeleteNode(node.id)}
              className="w-full py-2.5 px-3 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 hover:border-rose-600 rounded-lg text-xs font-semibold text-rose-300 hover:text-white flex items-center justify-center gap-2 transition-all shadow-sm group"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
              <span>Delete Node &ldquo;{node.name}&rdquo; from Workflow</span>
            </button>
            <p className="text-[10px] text-slate-500 text-center mt-1.5 font-mono">
              Permanently detaches node and associated incident edges
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
