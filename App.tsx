
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldAlert, 
  ChevronRight, 
  BarChart3, 
  Layers, 
  Activity, 
  BrainCircuit,
  Settings,
  Bell,
  MessageSquare,
  Search,
  ArrowUpRight,
  Loader2,
  Zap,
  Code,
  Terminal,
  Server,
  Cpu,
  CheckCircle2,
  FileText,
  TrendingUp,
  Target
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { TrackData, TrackType } from './types';
import { INITIAL_DATA, TRACK_ICONS } from './constants';

const REVENUE_DATA = [
  { name: 'Jul', rev: 4000, target: 4500 },
  { name: 'Aug', rev: 7000, target: 8000 },
  { name: 'Sep', rev: 12000, target: 11000 },
  { name: 'Oct', rev: 25000, target: 20000 },
  { name: 'Nov', rev: 45000, target: 35000 },
  { name: 'Dec', rev: 65000, target: 50000 },
];

export default function App() {
  const [activeTrack, setActiveTrack] = useState<TrackData>(INITIAL_DATA[2]); // Default to Crypto
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [viewMode, setViewMode] = useState<'track' | 'blueprint' | 'report'>('track');

  const generateStrategicAdvice = useCallback(async (query?: string, modeOverride?: 'track' | 'blueprint' | 'report') => {
    setIsAnalyzing(true);
    const mode = modeOverride || viewMode;
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let prompt = '';
      
      if (mode === 'report') {
        prompt = `
          ACT AS: AuditorSEC Strategic Ecosystem Advisor.
          OBJECTIVE: Generate a comprehensive Series A Readiness Report for Q1 2026.
          
          ECOSYSTEM DATA:
          1. Legal AI Shield (Progress: 45%):
             - Focus: Cabinet.court.gov.ua integration, debt collection automation.
             - Key Tech: Self-RAG Agents, UKR Court API Bridge.
          2. Audityzer.Web3 (Progress: 75%):
             - Focus: On-chain audit registries, hybrid smart contract security.
             - Key Tech: Polygon integration, Solidity Audit Engines.
          3. Post-Quantum R&D (Progress: 30%):
             - Focus: SNOVA Multivariate signatures, off-chain batch proving.
             - Key Tech: Rust snova-pq crate, NIST Round 2 standard.

          REPORT REQUIREMENTS:
          - EXECUTIVE SUMMARY: Current ecosystem health and readiness for Series A.
          - FEATURE MATRIX: Comparison of implemented vs. pending core features across all 3 tracks.
          - Q1 2026 ROADMAP: Critical milestones for the next 4 months leading to deployment.
          - RISK ASSESSMENT: Legal, Technical, and Market risks.
          
          Format as an investment-grade professional report with markdown. Use distinct sections and bold highlights.
        `;
      } else if (mode === 'blueprint') {
        prompt = `
          ACT AS: Principal Post-Quantum Security Architect for AuditorSEC.
          OBJECTIVE: Provide a detailed technical implementation blueprint for 'Hybrid Off-Chain Proving with Rust-SNOVA Batching'.
          TRACK CONTEXT: ${activeTrack.type}.
          
          SNOVA CRATE SPECIFICATION:
          1. Rust code for 'snova-pq' crate: KeyPair, Batcher, Signature.
          2. Detailed Rust example: Batch signature generation and verification signatures.
          3. Docker Compose for Proving Node.
          4. Solidity 'verifyBatchedSnova' integration.
          Format as technical documentation with syntax-highlighted markdown.
        `;
      } else {
        prompt = `
          Context: You are the Lead Architect for AuditorSEC.
          Current focus: ${activeTrack.type}.
          Current Progress: ${activeTrack.progress}%.
          Key Milestones: ${activeTrack.milestones.map(m => m.title).join(', ')}.
          
          Task: ${query || `Suggest 3 strategic alternatives to accelerate the completion of the ${activeTrack.type} track.`}
          Format with headings and bullet points.
        `;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      setAnalysis(response.text || 'Analysis unavailable at this time.');
    } catch (error) {
      console.error('Strategic Advice Error:', error);
      setAnalysis('Critical failure in strategic engine. Please re-authenticate.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [activeTrack, viewMode]);

  useEffect(() => {
    generateStrategicAdvice();
  }, [generateStrategicAdvice]);

  const handleModeSwitch = (mode: 'track' | 'blueprint' | 'report') => {
    setViewMode(mode);
    generateStrategicAdvice(undefined, mode);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (userQuery.trim()) {
      generateStrategicAdvice(userQuery);
    }
  };

  const renderAnalysis = () => {
    if (!analysis) return (
      <div className="flex flex-col items-center justify-center py-24 opacity-20">
        <MessageSquare className="w-16 h-16 mb-4" />
        <p className="font-bold tracking-widest uppercase">System Standby</p>
      </div>
    );

    let inCodeBlock = false;
    return (
      <div className="space-y-1 text-slate-300">
        {analysis.split('\n').map((line, i) => {
          if (line.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            return <div key={i} className="h-2" />;
          }

          if (inCodeBlock) {
            return (
              <div key={i} className="bg-slate-950/80 font-mono text-[11px] px-6 py-0.5 border-l-2 border-cyan-500/40 text-cyan-100/90 whitespace-pre-wrap leading-relaxed tracking-tight">
                {line}
              </div>
            );
          }

          if (line.trim().startsWith('#')) {
            const level = line.match(/^#+/)?.[0].length || 1;
            const TextTag = `h${Math.min(level + 3, 6)}` as any;
            return (
              <TextTag key={i} className="text-cyan-400 font-bold mt-8 mb-4 border-b border-cyan-500/10 pb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-500/60" /> {line.replace(/#/g, '').trim()}
              </TextTag>
            );
          }

          if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
            return (
              <div key={i} className="flex items-start gap-2 ml-4 py-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 mt-1 flex-shrink-0" />
                <span className="text-sm">{line.replace(/^[*|-]\s*/, '').trim()}</span>
              </div>
            );
          }

          return line.trim() ? <p key={i} className="text-sm leading-relaxed mb-4 text-slate-300/90">{line}</p> : <div key={i} className="h-2" />;
        })}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 flex flex-col glass">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center neon-border">
              <ShieldAlert className="text-cyan-400 w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">AuditorSEC</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Unified Command</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <p className="px-4 py-2 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Development Tracks</p>
          {INITIAL_DATA.map((track) => (
            <button
              key={track.id}
              onClick={() => { setActiveTrack(track); handleModeSwitch('track'); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTrack.id === track.id && viewMode !== 'report'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              }`}
            >
              {TRACK_ICONS[track.type]}
              <span className="text-sm font-medium">{track.type}</span>
            </button>
          ))}
          
          <div className="pt-8 space-y-2">
            <p className="px-4 py-2 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Operations</p>
            <button 
              onClick={() => handleModeSwitch('report')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                viewMode === 'report' 
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">Readiness Report</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 rounded-xl transition-all">
              <Layers className="w-5 h-5" />
              <span className="text-sm font-medium">Compliance Vault</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 rounded-xl transition-all">
              <Activity className="w-5 h-5" />
              <span className="text-sm font-medium">System Health</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-medium text-slate-400 uppercase">Series A Active Tracking</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">System observing multiple tracks for Q1 deployment.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-grid-slate-900/[0.04]">
        <header className="sticky top-0 z-30 glass border-b border-slate-800 p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">
              {viewMode === 'report' ? 'Series A Ecosystem Readiness' : `${activeTrack.type} Overview`}
            </h2>
            <div className={`px-3 py-1 rounded-full text-xs border ${
              viewMode === 'report' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
            }`}>
              {viewMode === 'report' ? 'Global Status' : activeTrack.revenue}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Query implementation..."
                className="bg-slate-900 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-100 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Dashboard Summary Cards - Only show in track/blueprint mode */}
          {viewMode !== 'report' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-3xl space-y-4 border-t-4 border-t-cyan-500">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Progress</p>
                  <div className="p-2 bg-cyan-500/10 rounded-lg"><Cpu className="w-4 h-4 text-cyan-400" /></div>
                </div>
                <h3 className="text-lg font-bold">{activeTrack.progress}% Complete</h3>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-cyan-500 h-full transition-all duration-1000" style={{ width: `${activeTrack.progress}%` }} />
                </div>
              </div>
              
              <div className="glass p-6 rounded-3xl space-y-4 border-t-4 border-t-yellow-500">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Latency Budget</p>
                  <div className="p-2 bg-yellow-500/10 rounded-lg"><Activity className="w-4 h-4 text-yellow-400" /></div>
                </div>
                <h3 className="text-lg font-bold">Sub-150ms Target</h3>
                <p className="text-xs text-slate-400">Optimization active for off-chain proving nodes.</p>
              </div>

              <div className="glass p-6 rounded-3xl space-y-4 border-t-4 border-t-green-500">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Efficiency</p>
                  <div className="p-2 bg-green-500/10 rounded-lg"><Zap className="w-4 h-4 text-green-400" /></div>
                </div>
                <h3 className="text-lg font-bold">Tier 1 Optimization</h3>
                <p className="text-xs text-slate-400">NIST Round 2 compliance reached in v2.1-stable.</p>
              </div>
            </div>
          )}

          {/* Strategic Advisor / Report Section */}
          <div className={`glass rounded-3xl p-8 space-y-6 ${viewMode === 'report' ? 'border-purple-500/30 bg-purple-500/[0.02]' : ''}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center neon-border ${
                  viewMode === 'report' ? 'bg-purple-500/20 border-purple-500/40' : 'bg-cyan-500/20'
                }`}>
                  {viewMode === 'report' ? <FileText className="text-purple-400 w-7 h-7" /> : (viewMode === 'blueprint' ? <Code className="text-cyan-400 w-7 h-7" /> : <BrainCircuit className="text-cyan-400 w-7 h-7" />)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {viewMode === 'report' ? 'Deployment Status Report' : (viewMode === 'blueprint' ? 'Technical Blueprint' : 'Strategic Advisor')}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {viewMode === 'report' ? 'Consolidated Series A Readiness Audit' : 'AI-Driven Multi-Track Intelligence'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                {viewMode !== 'report' && (
                  <button 
                    onClick={() => handleModeSwitch(viewMode === 'blueprint' ? 'track' : 'blueprint')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all border ${
                      viewMode === 'blueprint' 
                        ? 'bg-slate-800 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-100 hover:border-slate-500'
                    }`}
                  >
                    <Terminal className="w-5 h-5" />
                    {viewMode === 'blueprint' ? 'VIEW STRATEGY' : 'GENERATE BLUEPRINT'}
                  </button>
                )}
                
                <button 
                  onClick={() => generateStrategicAdvice()}
                  disabled={isAnalyzing}
                  className={`flex items-center gap-2 px-6 py-2.5 font-bold rounded-xl transition-all shadow-xl disabled:opacity-50 ${
                    viewMode === 'report' ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20' : 'bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-cyan-500/20'
                  }`}
                >
                  {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                  {viewMode === 'report' ? 'RE-SCAN ECOSYSTEM' : 'REFRESH ENGINE'}
                </button>
              </div>
            </div>

            <div className={`min-h-[450px] rounded-2xl p-8 border relative overflow-hidden ${
              viewMode === 'report' ? 'bg-purple-950/20 border-purple-500/20 shadow-inner' : 'bg-[#0f172a]/80 border-slate-800'
            }`}>
              {isAnalyzing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm z-10">
                  <div className={`w-12 h-12 border-4 rounded-full animate-spin mb-4 ${
                    viewMode === 'report' ? 'border-purple-500/20 border-t-purple-500' : 'border-cyan-500/20 border-t-cyan-500'
                  }`} />
                  <p className={`font-medium animate-pulse tracking-widest text-xs uppercase ${
                    viewMode === 'report' ? 'text-purple-400' : 'text-cyan-400'
                  }`}>
                    {viewMode === 'report' ? 'Scanning Global Readiness Metrics...' : 'Computing Implementation Vectors...'}
                  </p>
                </div>
              )}
              
              <div className="prose prose-invert max-w-none">
                {renderAnalysis()}
              </div>
            </div>

            {viewMode !== 'report' && (
              <form onSubmit={handleManualSearch} className="flex gap-3">
                <input 
                  type="text" 
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Ask technical questions (e.g. 'Optimizing MQ polynomial batching')..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all font-mono"
                />
                <button 
                  type="submit"
                  disabled={isAnalyzing}
                  className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl transition-all border border-slate-700 font-bold"
                >
                  EXECUTE
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Deployment / Infrastructure Monitor */}
      <aside className="w-80 border-l border-slate-800 glass hidden 2xl:flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-900/40">
          <h3 className="font-bold flex items-center gap-2 uppercase tracking-widest text-[10px] text-cyan-400">
            <Server className="w-3 h-3" />
            Infrastructure Status
          </h3>
        </div>
        <div className="flex-1 p-6 space-y-8 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Services</span>
              <span className="text-[10px] text-green-500 px-2 py-0.5 bg-green-500/10 rounded border border-green-500/20">HEALTHY</span>
            </div>
            <div className="space-y-3">
              {[
                { name: 'SNOVA Batch Engine', status: 'Active', load: '18%' },
                { name: 'Legal AI RAG Node', status: 'Standby', load: '4%' },
                { name: 'Audityzer.Web3 API', status: 'Active', load: '62%' },
                { name: 'Polygon RPC Node', status: 'Active', load: '31%' },
              ].map((svc, i) => (
                <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 hover:border-cyan-500/30 transition-all">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">{svc.name}</span>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest">{svc.status}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full" style={{ width: svc.load }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10 space-y-4">
             <div className="flex items-center gap-2">
               <Target className="w-3 h-3 text-cyan-400" />
               <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Global Readiness Score</p>
             </div>
             <div className="flex items-end gap-2">
               <span className="text-3xl font-bold tracking-tighter">72.4</span>
               <span className="text-xs text-slate-500 mb-1">/ 100</span>
             </div>
             <div className="pt-2">
               <button 
                onClick={() => handleModeSwitch('report')}
                className="w-full py-2.5 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-slate-900 text-[10px] font-bold rounded-xl border border-cyan-500/30 transition-all uppercase tracking-widest">
                 Open Readiness Console
               </button>
             </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
