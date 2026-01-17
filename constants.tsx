
import React from 'react';
import { Shield, Lock, Cpu, Landmark, Zap } from 'lucide-react';
import { TrackData, TrackType } from './types';

export const TRACK_ICONS = {
  [TrackType.LEGAL]: <Shield className="w-6 h-6" />,
  [TrackType.SECURITY]: <Lock className="w-6 h-6" />,
  [TrackType.IOT]: <Cpu className="w-6 h-6" />,
  [TrackType.FINANCE]: <Landmark className="w-6 h-6" />,
  [TrackType.CRYPTO]: <Zap className="w-6 h-6" />
};

export const INITIAL_DATA: TrackData[] = [
  {
    id: 'track-1',
    type: TrackType.LEGAL,
    progress: 45,
    revenue: '$10K MRR',
    activePilots: 12,
    criticalRisks: ['Court API downtime', 'Regulatory shifts in Ukraine'],
    milestones: [
      { id: 'm1', title: 'Cabinet.court.gov.ua Integration', date: '2025-10', status: 'in-progress', description: 'Real-time data fetching for debt cases.' },
      { id: 'm2', title: 'Self-RAG Agent Prototype', date: '2025-12', status: 'pending', description: 'Advanced legal documentation synthesis.' }
    ],
    alternatives: [
      { name: 'Direct Court Integration', pros: ['High reliability', 'Official status'], cons: ['Slow approval process'], riskLevel: 'medium', impact: 9 },
      { name: 'Scraper-Based Collection', pros: ['Fast implementation'], cons: ['Legal grey area', 'Brittle'], riskLevel: 'high', impact: 6 }
    ]
  },
  {
    id: 'track-2',
    type: TrackType.SECURITY,
    progress: 75,
    revenue: '$50K MRR',
    activePilots: 5,
    criticalRisks: ['Contract vulnerability coverage', 'Gas cost for ZK proofs'],
    milestones: [
      { id: 'm3', title: 'CoopToken.sol Audit', date: '2025-09', status: 'completed', description: 'Mainnet audit for Polygon ecosystem.' },
      { id: 'm4', title: 'Hybrid PQ Registry', date: '2026-01', status: 'in-progress', description: 'On-chain audit trails with Dilithium signatures.' }
    ],
    alternatives: [
      { name: 'Symbolic Execution', pros: ['Exhaustive checking'], cons: ['Compute intensive', 'State explosion'], riskLevel: 'low', impact: 8 },
      { name: 'AI-Agent Fuzzing', pros: ['Extremely fast', 'Low false-positives'], cons: ['May miss edge cases'], riskLevel: 'medium', impact: 10 }
    ]
  },
  {
    id: 'track-5',
    type: TrackType.CRYPTO,
    progress: 30,
    revenue: 'R&D Funding',
    activePilots: 2,
    criticalRisks: ['SNOVA whipping attack vulnerabilities', 'Large key sizes'],
    milestones: [
      { id: 'm5', title: 'SNOVA Rust Crate', date: '2025-07', status: 'completed', description: 'Implementation of NIST Round 2 multivariate sigs.' },
      { id: 'm6', title: 'ML-KEM Integration', date: '2025-11', status: 'pending', description: 'Lattice-based key encapsulation mechanism.' }
    ],
    alternatives: [
      { name: 'Dilithium (Lattice)', pros: ['NIST Primary choice', 'Balanced size'], cons: ['Complex implementation'], riskLevel: 'low', impact: 9 },
      { name: 'Falcon (Lattice)', pros: ['Smallest signatures'], cons: ['Floating point requirements'], riskLevel: 'medium', impact: 8 },
      { name: 'SPHINCS+ (Hash)', pros: ['Max robustness'], cons: ['Very large signatures'], riskLevel: 'low', impact: 7 }
    ]
  }
];
