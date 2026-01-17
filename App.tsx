
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
  Zap
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
  const [activeTrack, setActiveTrack] = useState<TrackData>(INITIAL_DATA[1]);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userQuery, setUserQuery] = useState('');

  // Use Gemini API to generate strategic advice for the active development track
  const generateStrategicAdvice = useCallback(async (query?: string) => {
    setIsAnalyzing(true);
    try {
      // Initialize the Gemini API client using the environment variable
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
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

      // Call the Gemini model for strategic analysis using the specified model for basic/general text tasks
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      // Extract generated text directly from the response property
      setAnalysis(response.text || 'Analysis unavailable at this time.');
    } catch (error) {
      console.error('Strategic Advice Error:', error);
      setAnalysis('Critical failure in strategic engine. Please re-authenticate.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [activeTrack]);

  useEffect(() => {
    generateStrategicAdvice();
  }, [generateStrategicAdvice]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (userQuery.trim()) {
      generateStrategicAdvice(userQuery);
    }
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
              onClick={() => setActiveTrack(track)}
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
            <p className="text-[10px] text-slate-500 leading-relaxed">System observing Series A metrics for Q1 2026 deployment.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-grid-slate-900/[0.04]">
        {/* Header */}
        <header className="sticky top-0 z-30 glass border-b border-slate-800 p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">{activeTrack.type} Overview</h2>
            <div className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20">
              {activeTrack.revenue} / Month
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Query system intelligence..."
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
          {/* Top Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progress Card */}
            <div className="glass p-6 rounded-3xl space-y-6">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                  <BarChart3 className="text-cyan-400 w-6 h-6" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Global Progress</p>
                  <p className="text-3xl font-bold neon-text-cyan">{activeTrack.progress}%</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-cyan-500 h-full transition-all duration-1000 ease-out" 
                    style={{ width: `${activeTrack.progress}%` }} 
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>MVP READY</span>
                  <span>BETA DEPLOY</span>
                </div>
              </div>
            </div>

            {/* Performance Card */}
            <div className="glass p-6 rounded-3xl col-span-2">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Growth Velocity</p>
                  <p className="text-2xl font-bold">Performance Analytics</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span className="text-[10px] text-cyan-400">ACTUAL</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    <span className="text-[10px] text-yellow-400">TARGET</span>
                  </div>
                </div>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                      itemStyle={{ fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="rev" stroke="#22d3ee" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                    <Line type="monotone" dataKey="target" stroke="#facc15" strokeDasharray="5 5" strokeWidth={1} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Middle Section: Milestones & Alternatives */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Strategic Alternatives
              </h3>
              <div className="grid gap-4">
                {activeTrack.alternatives.map((alt, i) => (
                  <div key={i} className="glass p-5 rounded-2xl border-l-4 border-l-cyan-500 hover:bg-slate-800/30 transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">{alt.name}</h4>
                      <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        alt.riskLevel === 'low' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        alt.riskLevel === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {alt.riskLevel} Risk
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-semibold">Pros</p>
                        <ul className="space-y-1">
                          {alt.pros.map((p, j) => <li key={j} className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-cyan-500" /> {p}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-semibold">Cons</p>
                        <ul className="space-y-1">
                          {alt.cons.map((c, j) => <li key={j} className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-red-500/50" /> {c}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-yellow-400" />
                Critical Risks & Security
              </h3>
              <div className="glass rounded-3xl overflow-hidden border border-slate-800">
                <div className="bg-slate-800/50 p-4 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Risk Matrix</span>
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                </div>
                <div className="p-6 space-y-4">
                  {activeTrack.criticalRisks.map((risk, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:bg-red-500/20 transition-all">
                        <ShieldAlert className="w-4 h-4 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-200">{risk}</p>
                        <div className="w-full bg-slate-800 h-1 rounded-full mt-2">
                          <div className="bg-red-500 h-full" style={{ width: `${80 - (i * 20)}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 mt-4 border-t border-slate-800">
                    <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-700">
                      GENERATE MITIGATION PLAN
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Gemini Strategic Analysis */}
          <div className="glass rounded-3xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center neon-border">
                  <BrainCircuit className="text-cyan-400 w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Strategic Advisor</h3>
                  <p className="text-xs text-slate-400">Powered by Gemini-3 Flash Intelligence</p>
                </div>
              </div>
              <button 
                onClick={() => generateStrategicAdvice()}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50"
              >
                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                RE-EVALUATE TRACK
              </button>
            </div>

            <div className="min-h-[200px] bg-slate-900/50 rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
              {isAnalyzing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm z-10">
                  <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
                  <p className="text-cyan-400 font-medium animate-pulse">Analyzing multi-dimensional risk vectors...</p>
                </div>
              )}
              
              <div className="prose prose-invert max-w-none prose-sm">
                {analysis ? (
                  <div className="space-y-4 text-slate-300 leading-relaxed">
                    {analysis.split('\n').map((line, i) => (
                      line.trim().startsWith('#') ? 
                        <h4 key={i} className="text-cyan-400 font-bold mt-4 mb-2 border-b border-cyan-500/20 pb-1">{line.replace(/#/g, '').trim()}</h4> :
                        line.trim().startsWith('*') ?
                        <li key={i} className="ml-4 list-disc marker:text-cyan-500">{line.replace(/\*/g, '').trim()}</li> :
                        <p key={i}>{line}</p>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 opacity-30">
                    <MessageSquare className="w-12 h-12 mb-2" />
                    <p>Initialize strategic engine to receive analysis</p>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleManualSearch} className="flex gap-3">
              <input 
                type="text" 
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Ask for specific alternatives (e.g., 'Compare SNOVA with Dilithium implementation costs')..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-6 py-3 text-sm focus:outline-none focus:border-cyan-500/50 transition-all"
              />
              <button 
                type="submit"
                disabled={isAnalyzing}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl transition-all border border-slate-700"
              >
                CONSULT
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Right Intelligence Panel */}
      <aside className="w-80 border-l border-slate-800 glass hidden 2xl:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h3 className="font-bold flex items-center gap-2 uppercase tracking-widest text-xs">
            <Activity className="w-4 h-4 text-cyan-400" />
            Live Ecosystem Logs
          </h3>
        </div>
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="space-y-4">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Recent Events</p>
            {[
              { time: '2m ago', event: 'SNOVA Sig verification passed', type: 'success' },
              { time: '15m ago', event: 'Court API Latency Spike (2.4s)', type: 'warning' },
              { time: '1h ago', event: 'New Series A Term Sheet generated', type: 'info' },
              { time: '3h ago', event: 'SOC 2 Audit log rotation active', type: 'info' },
              { time: '6h ago', event: 'Security Vulnerability Scanned (0 critical)', type: 'success' },
            ].map((log, i) => (
              <div key={i} className="flex items-start gap-3 border-b border-slate-800 pb-3 last:border-0">
                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                  log.type === 'success' ? 'bg-green-500' : 
                  log.type === 'warning' ? 'bg-yellow-500' : 'bg-cyan-500'
                }`} />
                <div>
                  <p className="text-xs font-medium text-slate-200 leading-tight">{log.event}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{log.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-cyan-500/5 rounded-2xl p-4 border border-cyan-500/10 space-y-4">
            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Integration Map</p>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">PostgreSQL Cloud</span>
                <span className="text-cyan-400">CONNECTED</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">Monobank API</span>
                <span className="text-cyan-400">STABLE</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">Polygon Node</span>
                <span className="text-cyan-400">SYNCING...</span>
              </div>
            </div>
            <div className="pt-2">
              <button className="w-full flex items-center justify-center gap-2 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[10px] font-bold rounded-lg border border-cyan-500/20 transition-all">
                VIEW ARCHITECTURE <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
