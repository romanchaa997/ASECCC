
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
  CheckCircle2
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
  const [showBlueprint, setShowBlueprint] = useState(false);

  const generateStrategicAdvice = useCallback(async (query?: string) => {
    setIsAnalyzing(true);
    try {
      // Initialize GoogleGenAI with API key from environment variables
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const blueprintPrompt = `
        ACT AS: Principal Post-Quantum Security Architect for AuditorSEC.
        OBJECTIVE: Provide a detailed technical implementation blueprint for 'Hybrid Off-Chain Proving with Rust-SNOVA Batching'.
        
        SNOVA CRATE SPECIFICATION:
        1. Describe a conceptual 'snova-pq' Rust crate designed for high-throughput batching.
        2. Include imports like 'snova_pq::{KeyPair, Batcher, Signature, Verifier}'.
        3. Provide a detailed Rust example showing:
           - Initializing a Batcher with specific security parameters (e.g., NIST level 1 or 3).
           - Collecting multiple transaction payloads into a batch.
           - Generating a single batched signature over N messages using multivariate quadratic cryptography.
           - A verification example showing the batched proof being checked by an aggregator.
        4. Include clear function signatures for:
           - fn generate_batch_proof(messages: &[Vec<u8>], key: &SecretKey) -> Result<BatchedSignature, SnovaError>
           - fn verify_batch_proof(proof: &BatchedSignature, messages: &[Vec<u8>], key: &PublicKey) -> bool
        
        DEPLOYMENT & INTEGRATION:
        5. Provide a Docker Compose configuration for the proving node (Rust-based).
        6. Explain the Solidity side: How a 'verifyBatchedSnova' function in an AuditorSEC Smart Contract would receive the off-chain proof and update the audit trail registry.
        
        Format as professional technical documentation with syntax-highlighted markdown code blocks. Be concise but extremely technical.
      `;

      const standardPrompt = `
        Context: You are the Lead Architect for AuditorSEC, a multi-track cybersecurity and legal AI ecosystem.
        Current focus: ${activeTrack.type}.
        Current Progress: ${activeTrack.progress}%.
        Key Milestones: ${activeTrack.milestones.map(m => m.title).join(', ')}.
        Critical Risks: ${activeTrack.criticalRisks.join(', ')}.
        
        Task: ${query || `Suggest 3 strategic alternatives to accelerate the completion of the ${activeTrack.type} track while maintaining SOC 2 compliance and high security standards.`}
        
        Requirements:
        - Be technical and realistic.
        - Reference specific technologies like SNOVA, Rust, Solidity, and EU Court APIs where applicable.
        - Format with clear headings and bullet points.
      `;

      // Use gemini-3-pro-preview for complex technical coding and cryptographic reasoning tasks
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: query?.includes('blueprint') || showBlueprint ? blueprintPrompt : standardPrompt,
      });

      setAnalysis(response.text || 'Analysis unavailable at this time.');
    } catch (error) {
      console.error('Strategic Advice Error:', error);
      setAnalysis('Critical failure in strategic engine. Please re-authenticate.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [activeTrack, showBlueprint]);

  useEffect(() => {
    generateStrategicAdvice();
  }, [generateStrategicAdvice]);

  const toggleBlueprint = () => {
    setShowBlueprint(!showBlueprint);
    generateStrategicAdvice();
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
            // Using 'any' for dynamic component name to bypass JSX namespace and IntrinsicElements typing issues
            const TextTag = `h${Math.min(level + 3, 6)}` as any;
            return (
              <TextTag key={i} className="text-cyan-400 font-bold mt-8 mb-4 border-b border-cyan-500/10 pb-2 flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-500/60" /> {line.replace(/#/g, '').trim()}
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
              onClick={() => { setActiveTrack(track); setShowBlueprint(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                activeTrack.id === track.id 
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
              <span className="text-[10px] font-medium text-slate-400">GEN-AI ADVISOR READY</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">Series A metrics tracking: SNOVA Batching Selected.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-grid-slate-900/[0.04]">
        <header className="sticky top-0 z-30 glass border-b border-slate-800 p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">{activeTrack.type} Overview</h2>
            <div className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20">
              {activeTrack.revenue} / Status
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
          {/* Dashboard Header Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-3xl space-y-4 border-t-4 border-t-cyan-500">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Selected Path</p>
                <div className="p-2 bg-cyan-500/10 rounded-lg"><Cpu className="w-4 h-4 text-cyan-400" /></div>
              </div>
              <h3 className="text-lg font-bold">SNOVA Hybrid Proving</h3>
              <p className="text-xs text-slate-400">Implementation phase for NIST Multivariate Signature batching on Rust.</p>
            </div>
            
            <div className="glass p-6 rounded-3xl space-y-4 border-t-4 border-t-yellow-500">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Latency Budget</p>
                <div className="p-2 bg-yellow-500/10 rounded-lg"><Activity className="w-4 h-4 text-yellow-400" /></div>
              </div>
              <h3 className="text-lg font-bold">120ms Target</h3>
              <p className="text-xs text-slate-400">Off-chain proving window for 10k signatures per block.</p>
            </div>

            <div className="glass p-6 rounded-3xl space-y-4 border-t-4 border-t-green-500">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Gas Efficiency</p>
                <div className="p-2 bg-green-500/10 rounded-lg"><Zap className="w-4 h-4 text-green-400" /></div>
              </div>
              <h3 className="text-lg font-bold">85% Reduction</h3>
              <p className="text-xs text-slate-400">Compared to per-transaction Dilithium verification.</p>
            </div>
          </div>

          {/* Strategic Advisor / Blueprint Section */}
          <div className="glass rounded-3xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center neon-border">
                  {showBlueprint ? <Code className="text-cyan-400 w-7 h-7" /> : <BrainCircuit className="text-cyan-400 w-7 h-7" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{showBlueprint ? 'Implementation Blueprint' : 'Strategic Advisor'}</h3>
                  <p className="text-xs text-slate-400">{showBlueprint ? 'Technical Scaffolding & Config' : 'Multi-track Development Analysis'}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={toggleBlueprint}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all border ${
                    showBlueprint 
                      ? 'bg-slate-800 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-100 hover:border-slate-500'
                  }`}
                >
                  <Terminal className="w-5 h-5" />
                  {showBlueprint ? 'VIEW STRATEGY' : 'GENERATE BLUEPRINT'}
                </button>
                
                <button 
                  onClick={() => generateStrategicAdvice()}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50"
                >
                  {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                  REFRESH ENGINE
                </button>
              </div>
            </div>

            <div className="min-h-[400px] bg-[#0f172a]/80 rounded-2xl p-8 border border-slate-800 relative overflow-hidden">
              {isAnalyzing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm z-10">
                  <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
                  <p className="text-cyan-400 font-medium animate-pulse tracking-widest text-xs uppercase">Computing Implementation Vectors...</p>
                </div>
              )}
              
              <div className="prose prose-invert max-w-none">
                {renderAnalysis()}
              </div>
            </div>

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
                EXECUTE QUERY
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Deployment / Infrastructure Monitor */}
      <aside className="w-80 border-l border-slate-800 glass hidden 2xl:flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-900/40">
          <h3 className="font-bold flex items-center gap-2 uppercase tracking-widest text-[10px] text-cyan-400">
            <Server className="w-3 h-3" />
            Infrastructure Deployment
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
                { name: 'Rust SNOVA Engine', status: 'Running', load: '12%' },
                { name: 'Batch Aggregator', status: 'Running', load: '45%' },
                { name: 'Polygon RPC Bridge', status: 'Degraded', load: '98%' },
                { name: 'KMS Vault', status: 'Running', load: '2%' },
              ].map((svc, i) => (
                <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 hover:border-cyan-500/30 transition-all group">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">{svc.name}</span>
                    <span className="text-[9px] text-slate-500">{svc.status}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div className={`h-full ${svc.load === '98%' ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: svc.load }} />
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span className="text-[9px] text-slate-600 uppercase font-bold">Load Metric</span>
                    <span className={`text-[9px] font-bold ${svc.load === '98%' ? 'text-red-400' : 'text-slate-400'}`}>{svc.load}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10 space-y-4">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
               <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Post-Quantum Readiness</p>
             </div>
             <div className="grid grid-cols-2 gap-2">
               <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                 <p className="text-[9px] text-slate-500 mb-1">PQ CORE</p>
                 <p className="text-xs font-bold text-cyan-400">SNOVA v2.1</p>
               </div>
               <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                 <p className="text-[9px] text-slate-500 mb-1">BATCH SZ</p>
                 <p className="text-xs font-bold text-cyan-400">512 TX</p>
               </div>
             </div>
             <button className="w-full py-2.5 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-slate-900 text-[10px] font-bold rounded-xl border border-cyan-500/30 transition-all">
               DECODE AUDIT TRAIL
             </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
