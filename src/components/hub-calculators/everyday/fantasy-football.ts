import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ passingYds: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), passingTds: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), ints: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), rushingYds: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), rushingTds: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), receptions: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), receivingYds: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), receivingTds: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), fumblesLost: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0'), twoPtConv: z.string().min(1).refine(v => parseFloat(v) >= 0, '>=0') }),
  fields: [
    { name: 'passingYds', label: 'Passing Yards', type: 'number', min: 0, step: '1' },
    { name: 'passingTds', label: 'Passing TDs', type: 'number', min: 0, step: '1' },
    { name: 'ints', label: 'Interceptions', type: 'number', min: 0, step: '1' },
    { name: 'rushingYds', label: 'Rushing Yards', type: 'number', min: 0, step: '1' },
    { name: 'rushingTds', label: 'Rushing TDs', type: 'number', min: 0, step: '1' },
    { name: 'receptions', label: 'Receptions', type: 'number', min: 0, step: '1' },
    { name: 'receivingYds', label: 'Receiving Yards', type: 'number', min: 0, step: '1' },
    { name: 'receivingTds', label: 'Receiving TDs', type: 'number', min: 0, step: '1' },
    { name: 'fumblesLost', label: 'Fumbles Lost', type: 'number', min: 0, step: '1' },
    { name: 'twoPtConv', label: '2-Pt Conversions', type: 'number', min: 0, step: '1' },
  ],
  defaults: { passingYds: '250', passingTds: '2', ints: '1', rushingYds: '30', rushingTds: '0', receptions: '0', receivingYds: '0', receivingTds: '0', fumblesLost: '0', twoPtConv: '0' },
  presets: [
    { label: 'QB MVP Performance (Lamar Jackson)', values: { passingYds: '340', passingTds: '3', ints: '0', rushingYds: '85', rushingTds: '1', receptions: '0', receivingYds: '0', receivingTds: '0', fumblesLost: '0', twoPtConv: '1' } },
    { label: 'RB Workhorse (Christian McCaffrey)', values: { passingYds: '0', passingTds: '0', ints: '0', rushingYds: '135', rushingTds: '2', receptions: '7', receivingYds: '55', receivingTds: '0', fumblesLost: '0', twoPtConv: '0' } },
    { label: 'WR Heavy Target (Justin Jefferson)', values: { passingYds: '0', passingTds: '0', ints: '0', rushingYds: '0', rushingTds: '0', receptions: '11', receivingYds: '165', receivingTds: '2', fumblesLost: '0', twoPtConv: '0' } },
    { label: 'TE Tight End Streamer', values: { passingYds: '0', passingTds: '0', ints: '0', rushingYds: '0', rushingTds: '0', receptions: '4', receivingYds: '48', receivingTds: '1', fumblesLost: '0', twoPtConv: '0' } },
  ],
  compute: (v) => {
    const passingPts = v.passingYds * 0.04 + v.passingTds * 4 - v.ints * 2
    const rushingPts = v.rushingYds * 0.1 + v.rushingTds * 6
    const receivingPts = v.receptions * 0.5 + v.receivingYds * 0.1 + v.receivingTds * 6
    const miscPts = -v.fumblesLost * 2 + v.twoPtConv * 2
    const pts = passingPts + rushingPts + receivingPts + miscPts
    const passingTDpct = pts > 0 ? (v.passingTds * 4 / pts) * 100 : 0
    const halfPPR = pts - v.receptions * 0.5
    const standard = pts - v.receptions * 1
    const fptsPerTouch = (v.rushingYds * 0.1 + v.receivingYds * 0.1 + v.rushingTds * 6 + v.receivingTds * 6) / Math.max(1, v.rushingYds / 4 + v.receptions)
    const totalYards = v.passingYds + v.rushingYds + v.receivingYds
    const totalTds = v.passingTds + v.rushingTds + v.receivingTds
    return { result: pts, label: 'Fantasy Points (PPR)', unit: 'pts', steps: [
      { label: 'Passing', value: `${v.passingYds} yds×0.04 + ${v.passingTds} TD×4 - ${v.ints} INT×2 = ${passingPts.toFixed(2)} pts` },
      { label: 'Rushing', value: `${v.rushingYds} yds×0.1 + ${v.rushingTds} TD×6 = ${rushingPts.toFixed(2)} pts` },
      { label: 'Receiving', value: `${v.receptions} rec×0.5 + ${v.receivingYds} yds×0.1 + ${v.receivingTds} TD×6 = ${receivingPts.toFixed(2)} pts` },
      { label: 'Misc (Fumbles, 2PT)', value: `${v.fumblesLost} FL×-2 + ${v.twoPtConv} 2PT×2 = ${miscPts.toFixed(2)} pts` },
      { label: 'Full PPR Total', value: `${pts.toFixed(2)} pts` },
      { label: 'Half-PPR Total', value: `${halfPPR.toFixed(2)} pts` },
      { label: 'Standard (No PPR)', value: `${standard.toFixed(2)} pts` },
      { label: 'Total Yards / TDs', value: `${totalYards} yds, ${totalTds} TDs` },
    ] ,
    extras: [
      { label: "Positional Scoring Benchmarks", value: "QB: 18-25 pts (QB1), 12-18 (QB2). RB: 15-22 pts (RB1), 10-15 (RB2). WR: 14-20 pts (WR1), 9-14 (WR2). TE: 12-18 (TE1), 6-12 (TE2). D/ST: 6-10 pts (D/ST1). K: 8-11 pts (K1). A QB throwing for 300+ yds + 3 TDs = ~26 pts. An RB with 100 total yds + 1 TD + 4 rec = ~20 pts in PPR." },
      { label: "PPR vs Standard Strategy", value: "In Full PPR, target volume-heavy WRs and pass-catching RBs (Ekeler, McCaffrey, Kamara). A WR with 8 rec/80 yds scores 13 pts (PPR) vs 8 pts (standard) = 62% more valuable. Standard scoring favors TD-dependent RBs and deep-threat WRs. Half-PPR is the modern default — balances both approaches." },
      { label: "QB Scoring Systems", value: "4 pts/pass TD (this calc) is standard. 6 pts/pass TD leagues (increasingly common) add ~4-6 pts/game for top QBs — Mahomes goes from ~22 to ~28 pts avg. Bonus for 300+ yd games (+3 pts) also common. In 4pt TD: QB is ~5th most valuable. In 6pt TD: QB is ~2nd most valuable." },
      { label: "Draft Strategy by Scoring", value: "PPR: Zero-RB strategy viable — load up on WRs early (5-6 in first 8 rounds), target RBs with 40+ reception projections late. Standard: RB-RB-RB in first 3 rounds — TDs and yardage dominate. Best Ball: target high-variance players with 40% boom games vs 30% consistent scorers." },
      { label: "Waiver Wire Points Per Game", value: "Top waiver adds: 12-18 pts/game (league winners). Solid streamers: 8-12 pts/game. Filler (bye week replacement): 5-8 pts/game. Threshold to start: >10 pts avg for flex, >13 for RB/WR2, >15 for RB/WR1. Defense streaming: target teams facing rookie QBs or teams with 3+ offensive line injuries." },
      { label: "Trade Value Calculator Method", value: "Use 3-week rolling average + schedule strength next 4 weeks. Trade a player with tough upcoming schedule (facing top-5 defenses) for one with easy schedule (bottom-5 defenses). Target players after down games (buy low), sell after career highs (sell high). Dynasty: value future picks as ~70% of current value." },
      { label: "Bye Week Replacement Math", value: "Plan 3-4 weeks ahead. Each starter's bye week costs ~20% of their weekly value to replace via waiver. 3 bye weeks × 3 starters on bye × ~5 pts drop = ~45 pts lost over season. Draft players with same bye week (concentrate the pain) or spread them (manageable weekly loss). Consensus: spread byes is better." },
      { label: "League Settings Impact", value: "Superflex (2 QB): QB value doubles — draft QB in first 3 rounds. 3 WR + Flex: WR premium — deeper WR pool needed. IDP: adds 20-40 roster spots, emphasize LBs (highest scoring IDP, 8-12 pts/game). Dynasty: age adjustment — 0.8× for >28, 1.2× for <24. Auction: budget 60-70% on first 3 picks, $1-3 on K/DST." },
    ]}
  },
  description: 'Calculate full PPR fantasy football points with simultaneous half-PPR and standard scoring conversion. Breaks down passing, rushing, receiving, and miscellaneous scoring components for any skill position.',
  formula: 'Total = (PassYds×0.04 + PassTD×4 - INT×2) + (RushYds×0.1 + RushTD×6) + (Rec×0.5 + RecYds×0.1 + RecTD×6) - FumLost×2 + 2Pt×2 | Half-PPR = Total - Rec×0.5 | Std = Total - Rec×1.0',
  interpretation: 'In Full PPR, a WR with 8 catches for 100 yards scores 18 points — the same as a RB with 120 yards and 2 TDs. This scoring system rewards volume and consistency over boom-or-bust touchdown dependency. Elite weekly scores: QB >28, RB >25, WR >22, TE >18. Replacement-level: QB ~15, RB ~9, WR ~8, TE ~6. The difference between a league-winning waiver pickup (12 ppg) and a replacement player (7 ppg) is 5 points per week — enough to flip 4-5 losses into wins over a season.'
}

export default calcDef
