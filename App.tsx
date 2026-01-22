
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Target,
  Download,
  Filter,
  X,
  AlertTriangle,
  Info,
  ExternalLink,
  Globe,
  Clock
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
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { TrackData, TrackType, Notification, MilestoneFilter } from './types';
import { INITIAL_DATA, TRACK_ICONS } from './constants';

const REVENUE_DATA = [
  { name: 'Jul', rev: 4000, target: 4500 },
  { name: 'Aug', rev: 7000, target: 8000 },
  { name: 'Sep', rev: 12000, target: 11000 },
  { name: 'Oct', rev: 25000, target: 20000 },
  { name: 'Nov', rev: 45000, target: 35000 },
  { name: 'Dec', rev: 65000, target: 50000 },
];

const COLORS = ['#22d3ee', '#818cf8', '#fbbf24', '#f87171'];

export default function App() {
  const [activeTrack, setActiveTrack] = useState<TrackData>(INITIAL_DATA[2]);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [viewMode, setViewMode] = useState<'track' | 'blueprint' | 'report' | 'global'>('global');
  const [milestoneFilter, setMilestoneFilter] = useState<MilestoneFilter>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Critical Vulnerability', message: 'SNOVA whipping attack vector detected in dev-branch.', type: 'critical', timestamp: '2m ago' },
    { id: '2', title: 'Milestone Delayed', message: 'Cabinet.court.gov.ua API refactoring takes longer than expected.', type: 'warning', timestamp: '15m ago' },
    { id: '3', title: 'New Pilot Secured', message: 'EU Legal Council joined the beta program.', type: 'success', timestamp: '1h ago' }
  ]);

  const generateStrategicAdvice = useCallback(async (query?: string, modeOverride?: 'track' | 'blueprint' | 'report' | 'global') => {
    setIsAnalyzing(true);
    const mode = modeOverride || viewMode;
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let prompt = '';
      
      if (mode === 'global') {
        prompt = "Analyze the AuditorSEC global ecosystem state across Legal, Security, and Crypto tracks. Identify cross-track synergies and the top 3 high-level bottlenecks for Series A readiness.";
      } else if (mode === 'report') {
        prompt = "Generate a comprehensive Series A Readiness Report for Q1 2026 covering all tracks, risk matrices, and resource allocation requirements.";
      } else if (mode === 'blueprint') {
        prompt = `Generate technical blueprint for ${activeTrack.type} focusing on high-performance implementations.`;
      } else {
        prompt = `Suggest 3 strategic alternatives to accelerate ${activeTrack.type}.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query || prompt,
      });

      setAnalysis(response.text || 'Analysis unavailable.');
    } catch (error) {
      console.error('Strategic Advice Error:', error);
      setAnalysis('Critical failure in strategic engine.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [activeTrack, viewMode]);

  useEffect(() => {
    generateStrategicAdvice();
  }, [generateStrategicAdvice]);

  const filteredMilestones = useMemo(() => {
    return activeTrack.milestones.filter(m => {
      if (milestoneFilter === 'all') return true;
      const [year, month] = m.date.split('-').map(Number);
      if (milestoneFilter === 'Q3-2025') return year === 2025 && month >= 7 && month <= 9;
      if (milestoneFilter === 'Q4-2025') return year === 2025 && month >= 10 && month <= 12;
      if (milestoneFilter === '2026') return year === 2026;
      return true;
    });
  }, [activeTrack, milestoneFilter]);

  const handleExport = (format: 'PDF' | 'Excel') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`Successfully exported ${viewMode} data to ${format}`);
    }, 1500);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const renderAnalysis = () => {
    if (!analysis) return <div className="p-8 text-center opacity-20"><Loader2 className="animate-spin inline mr-2" /> Initializing Intelligence...</div>;
    return (
      <div className="space-y-4 text-slate-300">
        {analysis.split('\n').map((line, i) => {
          if (line.trim().startsWith('#')) {
             return <h4 key={i} className="text-cyan-400 font-bold mt-4 flex items-center gap-2 border-b border-cyan-500/10 pb-1">{line.replace(/#/g, '').trim()}</h4>;
          }
          if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
             return <li key={i} className="ml-4 list-disc marker:text-cyan-500 text-sm">{line.replace(/^[*|-]\s*/, '').trim()}</li>;
          }
          return line.trim() ? <p key={i} className="text-sm leading-relaxed">{line}</p> : null;
        })}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 flex flex-col glass z-40">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center neon-border">
              <ShieldAlert className="text-cyan-400 w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">AuditorSEC</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Command Center</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => setViewMode('global')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              viewMode === 'global' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-800/50'
            }`}
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm font-medium">Global Dashboard</span>
          </button>

          <p className="px-4 py-4 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Active Tracks</p>
          {INITIAL_DATA.map((track) => (
            <button
              key={track.id}
              onClick={() => { setActiveTrack(track); setViewMode('track'); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTrack.id === track.id && viewMode === 'track'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                  : 'text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              {TRACK_ICONS[track.type]}
              <span className="text-sm font-medium">{track.type}</span>
            </button>
          ))}
          
          <p className="px-4 py-4 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Operations</p>
          <button 
            onClick={() => setViewMode('report')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              viewMode === 'report' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' : 'text-slate-400 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-sm font-medium">Series A Report</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/40">
           <div className="flex items-center gap-3 mb-4">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-cyan-500 border border-slate-900" />
                <div className="w-6 h-6 rounded-full bg-purple-500 border border-slate-900" />
                <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center text-[8px]">+4</div>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Collaborators Online</span>
           </div>
           <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold rounded-lg border border-slate-700 uppercase tracking-wider transition-all">
             Invite Architect
           </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#020617]">
        {/* Top Header */}
        <header className="glass border-b border-slate-800 p-6 flex justify-between items-center z-30">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold flex items-center gap-3">
              {viewMode === 'global' ? 'Ecosystem Readiness' : viewMode === 'report' ? 'Investment Report' : `${activeTrack.type}`}
              {viewMode === 'track' && <span className="text-xs font-normal text-slate-500">Track ID: {activeTrack.id}</span>}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button 
                  onClick={() => handleExport('PDF')}
                  disabled={isExporting}
                  className="px-3 py-1.5 text-[10px] font-bold hover:bg-slate-800 rounded-lg flex items-center gap-2 transition-all"
                >
                  {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                  PDF
                </button>
                <button 
                  onClick={() => handleExport('Excel')}
                  disabled={isExporting}
                  className="px-3 py-1.5 text-[10px] font-bold hover:bg-slate-800 rounded-lg flex items-center gap-2 transition-all"
                >
                  <FileText className="w-3 h-3" />
                  XLS
                </button>
             </div>
             <div className="h-8 w-px bg-slate-800" />
             <div className="relative">
                <button className="p-2 bg-slate-900 rounded-xl border border-slate-800 text-slate-400 hover:text-cyan-400 transition-all relative">
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900" />}
                </button>
             </div>
             <button className="p-2 bg-slate-900 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-100 transition-all">
               <Settings className="w-5 h-5" />
             </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-20">
          
          {/* View: Global Dashboard */}
          {viewMode === 'global' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass p-6 rounded-3xl border-t-4 border-t-cyan-500 space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Total Ecosystem Progress</p>
                  <p className="text-4xl font-bold neon-text-cyan">58.2%</p>
                  <div className="flex items-center gap-2 text-[10px] text-green-400">
                    <TrendingUp className="w-3 h-3" /> +4.2% since last week
                  </div>
                </div>
                <div className="glass p-6 rounded-3xl border-t-4 border-t-purple-500 space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Live Project Pilots</p>
                  <p className="text-4xl font-bold text-purple-400">19</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <Globe className="w-3 h-3" /> Across 8 Regions
                  </div>
                </div>
                <div className="glass p-6 rounded-3xl border-t-4 border-t-yellow-500 space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Active Risks</p>
                  <p className="text-4xl font-bold text-yellow-400">07</p>
                  <div className="flex items-center gap-2 text-[10px] text-red-400">
                    <AlertTriangle className="w-3 h-3" /> 2 Critical Path Blocks
                  </div>
                </div>
                <div className="glass p-6 rounded-3xl border-t-4 border-t-green-500 space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Ecosystem Revenue (Est.)</p>
                  <p className="text-4xl font-bold text-green-400">$60K</p>
                  <div className="flex items-center gap-2 text-[10px] text-green-400 font-bold uppercase">
                    MRR Target: $100K
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="glass p-8 rounded-3xl space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold flex items-center gap-2"><BarChart3 className="text-cyan-400" /> Revenue Growth Velocity</h3>
                      <button className="text-[10px] text-slate-500 hover:text-slate-300">DETAILS <ChevronRight className="w-3 h-3 inline" /></button>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={REVENUE_DATA}>
                          <defs>
                            <linearGradient id="colorGlobal" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                          <Area type="monotone" dataKey="rev" stroke="#22d3ee" fillOpacity={1} fill="url(#colorGlobal)" strokeWidth={3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="glass p-8 rounded-3xl space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold flex items-center gap-2"><Target className="text-purple-400" /> Resource Allocation</h3>
                      <button className="text-[10px] text-slate-500 hover:text-slate-300">RE-BALANCE <ChevronRight className="w-3 h-3 inline" /></button>
                    </div>
                    <div className="h-64 flex items-center justify-center">
                       <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                           <Pie
                             data={[
                               { name: 'Legal AI', value: 45 },
                               { name: 'Web3 Security', value: 25 },
                               { name: 'PQ Crypto', value: 30 },
                             ]}
                             cx="50%"
                             cy="50%"
                             innerRadius={60}
                             outerRadius={100}
                             paddingAngle={8}
                             dataKey="value"
                           >
                             {INITIAL_DATA.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                             ))}
                           </Pie>
                           <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                         </PieChart>
                       </ResponsiveContainer>
                       <div className="absolute flex flex-col items-center">
                          <span className="text-[10px] text-slate-500 uppercase">Series A</span>
                          <span className="text-xl font-bold">READY</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* View: Track Mode */}
          {viewMode === 'track' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               {/* Milestone Filters */}
               <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-2 uppercase tracking-widest">
                      <Filter className="w-3 h-3" /> Filter Milestones
                    </span>
                    <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 gap-1">
                      {(['all', 'Q3-2025', 'Q4-2025', '2026'] as MilestoneFilter[]).map(f => (
                        <button 
                          key={f}
                          onClick={() => setMilestoneFilter(f)}
                          className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                            milestoneFilter === f ? 'bg-cyan-500 text-slate-900' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                          }`}
                        >
                          {f === 'all' ? 'All Time' : f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-bold text-yellow-500">2 OVERDUE</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Milestone List */}
                  <div className="xl:col-span-2 space-y-6">
                    <div className="grid gap-4">
                      {filteredMilestones.map(m => (
                        <div key={m.id} className="glass p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/40 transition-all group relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-4 h-4 text-cyan-400 cursor-pointer" />
                          </div>
                          <div className="flex items-start gap-4">
                            <div className={`mt-1 p-2 rounded-lg flex-shrink-0 transition-transform group-hover:scale-110 ${
                              m.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                              m.status === 'in-progress' ? 'bg-cyan-500/10 text-cyan-400' :
                              m.status === 'delayed' ? 'bg-red-500/10 text-red-400' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {m.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
                               m.status === 'in-progress' ? <Clock className="w-5 h-5 animate-pulse" /> : 
                               m.status === 'delayed' ? <AlertTriangle className="w-5 h-5" /> :
                               <Activity className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-slate-100">{m.title}</h4>
                                  {m.status === 'in-progress' && (
                                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[8px] font-bold border border-cyan-500/30 uppercase tracking-tighter flex items-center gap-1">
                                      <div className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />
                                      Active
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">{m.date}</span>
                              </div>
                              <p className="text-xs text-slate-400 mb-4">{m.description}</p>
                              
                              {/* New Progress Indicators */}
                              {m.status === 'in-progress' && (
                                <div className="mb-4 space-y-2">
                                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                    <span>Work Stream Progress</span>
                                    <span className="text-cyan-400">65%</span>
                                  </div>
                                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                                    <div 
                                      className="bg-cyan-500 h-full relative overflow-hidden transition-all duration-1000 ease-out" 
                                      style={{ width: '65%' }}
                                    >
                                      {/* Glimmer effect for active bars */}
                                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-20 h-full animate-[shimmer_2s_infinite] -translate-x-full" />
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-4">
                                <div className="flex -space-x-1.5">
                                   <div className="w-5 h-5 rounded-full bg-cyan-500 border border-slate-900 shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                                   <div className="w-5 h-5 rounded-full bg-slate-700 border border-slate-900" />
                                </div>
                                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Architect Assigned</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredMilestones.length === 0 && (
                        <div className="p-12 text-center opacity-30 border-2 border-dashed border-slate-800 rounded-3xl">
                          <Info className="w-10 h-10 mx-auto mb-2" />
                          <p className="text-sm font-bold">No milestones found for this period</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Strategic Context Panel */}
                  <div className="space-y-6">
                    <div className="glass p-8 rounded-3xl space-y-6 border border-slate-800 shadow-2xl">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center neon-border">
                            <BrainCircuit className="text-cyan-400 w-6 h-6" />
                          </div>
                          <h3 className="text-lg font-bold">Track Intelligence</h3>
                       </div>
                       <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 relative min-h-[300px]">
                          {isAnalyzing && (
                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-2xl">
                              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
                              <p className="text-[10px] text-cyan-400 font-bold uppercase animate-pulse">Running Neural Inference...</p>
                            </div>
                          )}
                          {renderAnalysis()}
                       </div>
                       <button 
                        onClick={() => generateStrategicAdvice()}
                        className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                       >
                         REFRESH ADVICE
                       </button>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* View: Readiness Report */}
          {viewMode === 'report' && (
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-700">
               <div className="text-center space-y-4">
                  <p className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.3em]">Confidential Ecosystem Analysis</p>
                  <h1 className="text-5xl font-extrabold tracking-tight">Series A Readiness Report</h1>
                  <p className="text-slate-500 max-w-lg mx-auto">Consolidated technical audit, legal compliance mapping, and market traction analysis for the Q1 2026 deployment phase.</p>
               </div>
               
               <div className="glass p-12 rounded-[3rem] border border-purple-500/20 shadow-2xl shadow-purple-500/5">
                 {isAnalyzing ? (
                   <div className="py-24 text-center space-y-6">
                      <div className="w-20 h-20 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin mx-auto" />
                      <p className="text-purple-400 font-bold uppercase tracking-widest animate-pulse">Assembling Investment-Grade Data...</p>
                   </div>
                 ) : renderAnalysis()}
               </div>
            </div>
          )}
        </div>

        {/* Global Chat / Query Bar */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent z-40">
           <form onSubmit={(e) => { e.preventDefault(); generateStrategicAdvice(userQuery); }} className="max-w-4xl mx-auto flex gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                <input 
                  type="text" 
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Ask the system architecture (e.g., 'Compare current burn rate with Series A targets')..."
                  className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700 hover:border-slate-500 focus:border-cyan-500/50 py-4 pl-14 pr-6 rounded-2xl text-sm focus:outline-none transition-all shadow-2xl"
                />
              </div>
              <button className="px-8 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-2xl border border-slate-700 transition-all flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                QUERY
              </button>
           </form>
        </div>
      </main>

      {/* Right Intelligence Panel (Notifications & Logs) */}
      <aside className="w-80 border-l border-slate-800 glass hidden 2xl:flex flex-col z-40">
        <div className="p-6 border-b border-slate-800 bg-slate-900/40">
           <h3 className="font-bold flex items-center justify-between">
             <span className="flex items-center gap-2 uppercase tracking-widest text-[10px] text-cyan-400">
               <Activity className="w-3 h-3" /> Notifications Center
             </span>
             {notifications.length > 0 && (
               <span className="bg-red-500 text-[8px] px-1.5 py-0.5 rounded-full text-white">{notifications.length}</span>
             )}
           </h3>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
           {notifications.length > 0 ? (
             <div className="space-y-4">
               {notifications.map(n => (
                 <div key={n.id} className={`p-4 rounded-2xl border transition-all hover:translate-x-1 relative group ${
                   n.type === 'critical' ? 'bg-red-500/5 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]' :
                   n.type === 'warning' ? 'bg-yellow-500/5 border-yellow-500/20' :
                   n.type === 'success' ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-800/30 border-slate-700'
                 }`}>
                   <button 
                    onClick={() => removeNotification(n.id)}
                    className="absolute top-2 right-2 p-1 text-slate-500 hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     <X className="w-3 h-3" />
                   </button>
                   <div className="flex items-center gap-2 mb-2">
                     {n.type === 'critical' && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                     {n.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />}
                     {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />}
                     {n.type === 'info' && <Info className="w-3.5 h-3.5 text-cyan-400" />}
                     <span className="text-[10px] font-bold uppercase text-slate-300">{n.title}</span>
                   </div>
                   <p className="text-[11px] text-slate-400 leading-relaxed mb-2">{n.message}</p>
                   <span className="text-[9px] text-slate-600 font-bold">{n.timestamp}</span>
                 </div>
               ))}
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center py-20 text-slate-700">
                <CheckCircle2 className="w-10 h-10 mb-2 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">No New Alerts</p>
             </div>
           )}

           <div className="pt-6 border-t border-slate-800 space-y-4">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Infrastructure Logs</span>
              <div className="space-y-3 font-mono text-[9px]">
                 <div className="flex gap-2 text-slate-500">
                    <span className="text-cyan-600">[14:22:01]</span>
                    <span>SNOVA-PQ/Batcher active (shards: 4)</span>
                 </div>
                 <div className="flex gap-2 text-slate-500">
                    <span className="text-cyan-600">[14:21:45]</span>
                    <span>Court-API-UKR ping: 42ms (stable)</span>
                 </div>
                 <div className="flex gap-2 text-yellow-500">
                    <span className="text-yellow-600">[14:19:33]</span>
                    <span>Solidity/Audit memory leak detected (non-critical)</span>
                 </div>
                 <div className="flex gap-2 text-slate-500">
                    <span className="text-cyan-600">[14:15:10]</span>
                    <span>Series-A Readiness Score recalculated: 58.2</span>
                 </div>
              </div>
           </div>
        </div>
        
        <div className="p-6 border-t border-slate-800">
           <div className="bg-cyan-500/5 rounded-2xl p-4 border border-cyan-500/10 space-y-3">
              <div className="flex items-center justify-between">
                 <span className="text-[10px] text-cyan-400 font-bold uppercase">System Uptime</span>
                 <span className="text-[10px] text-cyan-400">99.98%</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden flex gap-0.5">
                 {Array.from({length: 20}).map((_, i) => (
                   <div key={i} className={`flex-1 h-full ${i === 12 ? 'bg-yellow-500' : 'bg-cyan-500'}`} />
                 ))}
              </div>
           </div>
        </div>
      </aside>
    </div>
  );
}
