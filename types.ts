
export enum TrackType {
  LEGAL = 'Legal AI Shield',
  SECURITY = 'Audityzer.Web3',
  IOT = 'Bakhmach Hub',
  FINANCE = 'Financial Ecosystem',
  CRYPTO = 'Post-Quantum R&D'
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'in-progress' | 'pending' | 'delayed';
  description: string;
}

export interface Alternative {
  name: string;
  pros: string[];
  cons: string[];
  riskLevel: 'low' | 'medium' | 'high';
  impact: number; // 1-10
}

export interface TrackData {
  id: string;
  type: TrackType;
  progress: number;
  revenue: string;
  activePilots: number;
  milestones: Milestone[];
  alternatives: Alternative[];
  criticalRisks: string[];
}
