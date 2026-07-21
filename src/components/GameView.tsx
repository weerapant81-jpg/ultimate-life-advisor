import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Gamepad2, RotateCcw, Share2, ArrowRight } from 'lucide-react';
import { ActiveTab } from '../types';
import { CAREERS, CAREER_LIST } from '../lib/game/careers';
import {
  DEFAULT_PLAN, PERIOD_YEARS, START_AGE, TOTAL_YEARS,
  applyCheckpoint, applyEventChoice, checkpointAt, computeInsights, createGame,
  finishGame, netWorth, periodOf, resolveYear,
  type CheckpointView,
} from '../lib/game/engine';
import { newSeed } from '../lib/game/rng';
import type {
  CareerId, DecisionLog, EventInstance, GameState, LoggedEvent, PlanChoices, RiskLevel,
} from '../lib/game/types';
import TurnstileWidget, { TurnstileHandle } from './TurnstileWidget';

/* ── เกมเศรษฐี — จำลองชีวิตการเงิน 30 ปี (ธีม editorial ของ Ultimate Life) ──
   เนื้อหาเกมเป็นภาษาไทย (กลุ่มเป้าหมายคนไทย) — โครง 3 จอ: intro → play → summary */

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
const SAVE_KEY = 'ula_game_v1';
const TICK_MS = 620;

interface GameViewProps {
  lang: 'EN' | 'TH';
  setActiveTab: (tab: ActiveTab) => void;
}

interface SaveBlob { state: GameState; log: DecisionLog }

function loadSave(): SaveBlob | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const b = JSON.parse(raw) as SaveBlob;
    return b?.state?.history && b.state.year < TOTAL_YEARS && b.log ? b : null;
  } catch { return null; }
}

const fmtTH = (n: number): string => {
  const neg = n < 0;
  const v = Math.abs(n);
  const s = v >= 1_000_000
    ? `${(v / 1_000_000).toFixed(v >= 10_000_000 ? 1 : 2)} ล้าน`
    : Math.round(v).toLocaleString('th-TH');
  return (neg ? '-' : '') + s;
};

const fmtAxis = (v: number) =>
  Math.abs(v) >= 1_000_000 ? `${(v / 1_000_000).toFixed(1).replace(/\.0$/, '')}ล.`
  : Math.abs(v) >= 1000 ? `${Math.round(v / 1000)}k` : `${Math.round(v)}`;

const happyEmoji = (h: number) => (h >= 75 ? '😄' : h >= 55 ? '🙂' : h >= 40 ? '😐' : h >= 25 ? '😟' : '😣');

const gradeClasses = (g: string) =>
  g === 'A' ? 'text-emerald-600 border-emerald-500 bg-emerald-50'
  : g === 'B' ? 'text-teal-600 border-teal-500 bg-teal-50'
  : g === 'C' ? 'text-amber-600 border-amber-500 bg-amber-50'
  : g === 'D' ? 'text-orange-600 border-orange-500 bg-orange-50'
  : 'text-red-600 border-red-500 bg-red-50';

/* ── กราฟความมั่งคั่งแบบ SVG ล้วน (ไม่ใช้ไลบรารีกราฟ) ── */
function NetWorthChart({ history, dotYears, height = 190 }: {
  history: { age: number; netWorth: number; year: number }[];
  dotYears?: Set<number>;
  height?: number;
}) {
  const W = 560, H = height, padL = 48, padR = 12, padT = 12, padB = 24;
  const data = history.length > 0 ? history : [{ age: START_AGE, netWorth: 0, year: -1 }];
  const min = Math.min(0, ...data.map(d => d.netWorth));
  const max = Math.max(100_000, ...data.map(d => d.netWorth)) * 1.05;
  const x = (age: number) => padL + ((age - START_AGE) / TOTAL_YEARS) * (W - padL - padR);
  const y = (v: number) => padT + (1 - (v - min) / (max - min)) * (H - padT - padB);
  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(d.age).toFixed(1)},${y(d.netWorth).toFixed(1)}`).join(' ');
  const area = `${line} L${x(data[data.length - 1].age).toFixed(1)},${y(Math.max(0, min)).toFixed(1)} L${x(data[0].age).toFixed(1)},${y(Math.max(0, min)).toFixed(1)} Z`;
  const yTicks = [0, max * 0.5, max];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="กราฟความมั่งคั่งสุทธิ">
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="#171717" strokeOpacity="0.07" strokeWidth="1" />
          <text x={padL - 6} y={y(t) + 3.5} textAnchor="end" fontSize="10" fill="#8a8a8a" fontFamily="JetBrains Mono, monospace">{fmtAxis(t)}</text>
        </g>
      ))}
      {[30, 40, 50, 60].map(age => (
        <text key={age} x={x(age)} y={H - 6} textAnchor="middle" fontSize="10" fill="#8a8a8a" fontFamily="JetBrains Mono, monospace">{age}</text>
      ))}
      <path d={area} fill="#d95f35" fillOpacity="0.12" />
      <path d={line} fill="none" stroke="#d95f35" strokeWidth="2.2" strokeLinejoin="round" />
      {dotYears && data.filter(d => dotYears.has(d.year)).map((d, i) => (
        <circle key={i} cx={x(d.age)} cy={y(d.netWorth)} r="4" fill="#171717" stroke="#fcfcfb" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

/* ══════════════════ หน้าหลักของเกม ══════════════════ */

export default function GameView({ lang, setActiveTab }: GameViewProps) {
  const [screen, setScreen] = useState<'intro' | 'play' | 'summary'>('intro');
  const [blob, setBlob] = useState<SaveBlob | null>(null);
  const [saved, setSaved] = useState<SaveBlob | null>(loadSave);

  const start = (careerId: CareerId) => {
    const state = createGame(newSeed(), careerId);
    setBlob({ state, log: { careerId, plans: [], eventChoices: {}, checkpointChoices: {} } });
    setScreen('play');
  };
  const resume = () => { if (saved) { setBlob(saved); setScreen('play'); } };
  const persist = (state: GameState, log: DecisionLog) => {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ state, log })); } catch { /* เล่นต่อได้แม้ storage ใช้ไม่ได้ */ }
  };
  const finish = (state: GameState, log: DecisionLog) => {
    setBlob({ state, log });
    setScreen('summary');
    try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
  };
  const replay = () => { setBlob(null); setSaved(null); setScreen('intro'); };

  return (
    <div id="game-view-container" className="bg-brand-cream min-h-[70vh]">
      <section className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        {lang === 'EN' && (
          <p className="mb-4 text-center text-xs text-gray-500 font-mono">This simulation is currently available in Thai.</p>
        )}
        {screen === 'intro' && <Intro onStart={start} onResume={resume} hasSave={!!saved} />}
        {screen === 'play' && blob && (
          <div key={blob.state.seed}>
            <Play initState={blob.state} initLog={blob.log} onPersist={persist} onFinish={finish} />
          </div>
        )}
        {screen === 'summary' && blob && (
          <Summary state={blob.state} log={blob.log} onReplay={replay} goContact={() => setActiveTab(ActiveTab.Contact)} />
        )}
      </section>
    </div>
  );
}

/* ══════════════════ จอเริ่ม: เลือกอาชีพ ══════════════════ */

function Intro({ onStart, onResume, hasSave }: { onStart: (c: CareerId) => void; onResume: () => void; hasSave: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center space-y-4">
        <span className="inline-flex items-center gap-2 border border-slate-200 rounded-full px-4 py-1.5 text-xs font-mono text-gray-500 uppercase tracking-wider">
          <Gamepad2 className="w-3.5 h-3.5 text-brand-orange" /> Financial Life Simulation
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-brand-charcoal tracking-tight">เกมเศรษฐี</h1>
        <p className="text-gray-600 leading-relaxed">
          จำลองชีวิตการเงิน 30 ปี — อายุ 30 ถึงเกษียณ 60<br />
          เลือกอาชีพ รับมือเหตุการณ์ไม่คาดฝัน แล้วดูว่า...<br />
          <span className="font-semibold text-brand-orange">คุณจะเกษียณได้จริงไหม?</span>
        </p>
      </div>

      {hasSave && (
        <button onClick={onResume}
          className="w-full rounded-lg border-2 border-brand-orange text-brand-orange font-display font-semibold py-3 hover:bg-brand-orange hover:text-white transition-colors">
          ▶ เล่นต่อจากเกมที่ค้างไว้
        </button>
      )}

      <p className="text-center text-sm font-display font-semibold text-gray-500 uppercase tracking-wider">เริ่มต้นชีวิตวัย 30 — คุณคือใคร?</p>

      <div className="grid gap-4">
        {CAREER_LIST.map(c => (
          <button key={c.id} onClick={() => onStart(c.id)}
            className="text-left bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-brand-orange hover:shadow-md transition-all group">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{c.emoji}</span>
              <span className="flex-1">
                <span className="block font-display text-lg font-bold text-brand-charcoal group-hover:text-brand-orange transition-colors">{c.name}</span>
                <span className="block text-xs text-gray-500">{c.tagline}</span>
              </span>
              <span className="text-right">
                <span className="block font-mono text-base font-bold text-brand-orange">{fmtTH(c.startMonthly)}</span>
                <span className="block text-[10px] text-gray-400">บาท/เดือน</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {c.perks.map(p => (
                <span key={p} className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">✓ {p}</span>
              ))}
              {c.cons.map(p => (
                <span key={p} className="text-[11px] px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">✕ {p}</span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 leading-relaxed">
        เกมนี้เป็นการจำลองเพื่อการเรียนรู้ ตัวเลขถูกทำให้ง่ายกว่าชีวิตจริง<br />
        โดยทีมที่ปรึกษา Ultimate Life Advisor
      </p>
    </motion.div>
  );
}

/* ══════════════════ จอเล่น ══════════════════ */

type Phase =
  | { kind: 'plan' }
  | { kind: 'checkpoint'; view: CheckpointView }
  | { kind: 'anim' }
  | { kind: 'event'; ev: EventInstance }
  | { kind: 'result'; emoji: string; title: string; logged: LoggedEvent };

function Play({ initState, initLog, onPersist, onFinish }: {
  initState: GameState;
  initLog: DecisionLog;
  onPersist: (s: GameState, l: DecisionLog) => void;
  onFinish: (s: GameState, l: DecisionLog) => void;
}) {
  const [game, setGame] = useState(initState);
  const logRef = useRef<DecisionLog>(initLog);
  const [plan, setPlan] = useState<PlanChoices>(
    initLog.plans[periodOf(initState.year)] ?? initLog.plans[initLog.plans.length - 1] ?? DEFAULT_PLAN,
  );
  const [phase, setPhase] = useState<Phase>(() => {
    const cp = checkpointAt(initState);
    return cp ? { kind: 'checkpoint', view: cp } : { kind: 'plan' };
  });
  const career = CAREERS[game.careerId];
  const age = START_AGE + game.year;

  const continueFlow = (s: GameState) => {
    if (s.year >= TOTAL_YEARS) { onFinish(s, logRef.current); return; }
    if (s.year % PERIOD_YEARS === 0) {
      onPersist(s, logRef.current);
      const cp = checkpointAt(s);
      setPhase(cp ? { kind: 'checkpoint', view: cp } : { kind: 'plan' });
      return;
    }
    setPhase({ kind: 'anim' });
  };

  useEffect(() => {
    if (phase.kind !== 'anim') return;
    const t = setTimeout(() => {
      const { state: ns, event } = resolveYear(game, plan);
      setGame(ns);
      if (event) { setPhase({ kind: 'event', ev: event }); return; }
      continueFlow(ns);
    }, TICK_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, game]);

  const startPeriod = () => {
    const p = periodOf(game.year);
    for (let i = 0; i <= p; i++) if (!logRef.current.plans[i]) logRef.current.plans[i] = plan;
    logRef.current.plans[p] = plan;
    onPersist(game, logRef.current);
    setPhase({ kind: 'anim' });
  };

  const chooseEvent = (ev: EventInstance, choiceId: string) => {
    logRef.current.eventChoices[ev.key] = choiceId;
    const { state: ns, logged } = applyEventChoice(game, ev, choiceId);
    setGame(ns);
    onPersist(ns, logRef.current);
    setPhase({ kind: 'result', emoji: ev.emoji, title: logged.title, logged });
  };

  const chooseCheckpoint = (view: CheckpointView, choiceId: string) => {
    logRef.current.checkpointChoices[view.id] = choiceId;
    const ns = applyCheckpoint(game, view.id, choiceId);
    setGame(ns);
    onPersist(ns, logRef.current);
    setPhase({ kind: 'plan' });
  };

  const incomeM = game.monthlyIncome + game.spouseIncome;
  const healthPremM = plan.healthIns && !career.freeHealthcare ? (12000 + 600 * game.year) / 12 : 0;
  const lifePremM = plan.lifeIns ? 15000 / 12 : 0;
  const mandatoryM = game.livingMonthly + game.rentMonthly + game.mortgageMonthly + healthPremM + lifePremM;
  const freeM = incomeM * (1 - (plan.savePct + plan.investPct) / 100) - mandatoryM;
  const periodEndAge = Math.min(60, START_AGE + (periodOf(game.year) + 1) * PERIOD_YEARS);

  const modalBtn = 'w-full text-left rounded-lg border border-slate-200 bg-white px-4 py-3 hover:border-brand-orange hover:bg-orange-50/40 transition-colors';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

      {/* แถบสถานะ */}
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-brand-charcoal text-white px-4 py-2 text-center min-w-[72px]">
          <div className="font-display text-2xl font-bold leading-none">{age}</div>
          <div className="text-[9px] text-gray-400 mt-1 font-mono uppercase">อายุ (ปี)</div>
        </div>
        <div className="flex-1">
          <div className="text-[11px] text-gray-500">ความมั่งคั่งสุทธิ</div>
          <div className={`font-mono text-2xl font-bold ${netWorth(game) >= 0 ? 'text-brand-charcoal' : 'text-red-600'}`}>
            {fmtTH(netWorth(game))} <span className="text-xs font-normal text-gray-400">บาท</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl">{happyEmoji(game.happiness)}</div>
          <div className="w-14 h-1.5 rounded-full bg-slate-100 mt-1 overflow-hidden">
            <div className="h-full rounded-full bg-brand-orange transition-all" style={{ width: `${game.happiness}%` }} />
          </div>
        </div>
      </div>

      {/* progress อายุ */}
      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full bg-brand-orange transition-all duration-500" style={{ width: `${(game.year / TOTAL_YEARS) * 100}%` }} />
      </div>

      {/* ชิปเงิน */}
      <div className={`grid gap-2 ${game.debt > 0 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2">
          <div className="text-[10px] text-gray-500">💵 เงินสด</div>
          <div className="font-mono text-sm font-bold text-brand-charcoal">{fmtTH(game.cash)}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2">
          <div className="text-[10px] text-gray-500">📈 พอร์ตลงทุน</div>
          <div className="font-mono text-sm font-bold text-brand-charcoal">{fmtTH(game.invested)}</div>
        </div>
        {game.debt > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <div className="text-[10px] text-red-500">🔥 หนี้</div>
            <div className="font-mono text-sm font-bold text-red-600">{fmtTH(game.debt)}</div>
          </div>
        )}
      </div>

      {/* กราฟ */}
      <div className="bg-white border border-slate-200 rounded-xl p-3">
        <NetWorthChart history={game.history} height={170} />
      </div>

      {/* โซนล่าง */}
      {phase.kind === 'plan' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5 shadow-sm">
          <div>
            <h3 className="font-display text-lg font-bold text-brand-charcoal">วางแผนช่วงอายุ {age}–{periodEndAge}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              รายได้ครัวเรือน ~{fmtTH(incomeM)} บาท/เดือน · รายจ่ายจำเป็น ~{fmtTH(mandatoryM)} บาท/เดือน
            </p>
          </div>

          {([['🏦 ออมเงินฝาก', 'savePct'], ['📈 ลงทุน', 'investPct']] as const).map(([label, key]) => (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm font-bold text-brand-orange font-mono">{plan[key]}% ของรายได้</span>
              </div>
              <input type="range" min={0} max={40} step={5} value={plan[key]}
                onChange={e => setPlan({ ...plan, [key]: Number(e.target.value) })}
                className="w-full h-6 accent-[#d95f35]" />
            </div>
          ))}

          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">ระดับความเสี่ยงพอร์ต</div>
            <div className="grid grid-cols-3 gap-2">
              {([['low', 'ต่ำ', 'ฝาก/พันธบัตร'], ['mid', 'กลาง', 'ผสมสมดุล'], ['high', 'สูง', 'หุ้นล้วน']] as [RiskLevel, string, string][]).map(([id, name, sub]) => (
                <button key={id} onClick={() => setPlan({ ...plan, risk: id })}
                  className={`rounded-lg border px-2 py-2 text-center transition-colors ${
                    plan.risk === id ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-slate-200 bg-white text-gray-500 hover:border-slate-300'
                  }`}>
                  <div className="text-sm font-bold font-display">{name}</div>
                  <div className="text-[10px] opacity-80">{sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {career.freeHealthcare ? (
              <div className="rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-2.5">🏥 สวัสดิการรัฐ — รักษาฟรี</div>
            ) : (
              <button onClick={() => setPlan({ ...plan, healthIns: !plan.healthIns })}
                className={`rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  plan.healthIns ? 'border-brand-orange bg-orange-50' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}>
                <div className={`text-xs font-bold ${plan.healthIns ? 'text-brand-orange' : 'text-gray-600'}`}>🛡️ ประกันสุขภาพ {plan.healthIns ? '✓' : ''}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">เบี้ย ~{fmtTH(12000 + 600 * game.year)}/ปี</div>
              </button>
            )}
            <button onClick={() => setPlan({ ...plan, lifeIns: !plan.lifeIns })}
              className={`rounded-lg border px-3 py-2.5 text-left transition-colors ${
                plan.lifeIns ? 'border-brand-orange bg-orange-50' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}>
              <div className={`text-xs font-bold ${plan.lifeIns ? 'text-brand-orange' : 'text-gray-600'}`}>👨‍👩‍👧 ประกันชีวิต {plan.lifeIns ? '✓' : ''}</div>
              <div className="text-[10px] text-gray-400 mt-0.5">เบี้ย 15,000/ปี</div>
            </button>
          </div>

          <div className={`rounded-lg text-center text-sm font-semibold px-3 py-2.5 ${
            freeM < 0 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-gray-600'
          }`}>
            {freeM < 0
              ? `แผนตึงเกินรายได้ ~${fmtTH(-freeM)}/เดือน — เกมจะลดส่วนลงทุน/ออมให้อัตโนมัติ`
              : `เหลือเงินใช้ชีวิตอิสระ ~${fmtTH(freeM)} บาท/เดือน`}
          </div>

          <button onClick={startPeriod}
            className="w-full rounded-lg bg-brand-orange text-white font-display font-bold py-3.5 hover:bg-brand-orange/90 transition-colors">
            ใช้แผนนี้ — ใช้ชีวิต 5 ปี ▶
          </button>
        </div>
      )}

      {phase.kind === 'anim' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
          <div className="text-2xl">⏳</div>
          <div className="font-display font-bold text-brand-charcoal mt-2">อายุ {age} ปี — กำลังใช้ชีวิต...</div>
          <div className="text-xs text-gray-500 mt-1">
            ออม {plan.savePct}% · ลงทุน {plan.investPct}% ({plan.risk === 'low' ? 'เสี่ยงต่ำ' : plan.risk === 'mid' ? 'เสี่ยงกลาง' : 'เสี่ยงสูง'})
          </div>
        </div>
      )}

      {/* Modal */}
      {(phase.kind === 'event' || phase.kind === 'result' || phase.kind === 'checkpoint') && (
        <div className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-[2px] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[86vh] overflow-y-auto p-6">
            {phase.kind === 'event' && (
              <>
                <div className="text-center text-5xl">{phase.ev.emoji}</div>
                <div className="text-center mt-2">
                  <span className="text-[11px] font-mono font-semibold text-brand-orange uppercase tracking-wider">อายุ {30 + phase.ev.year} ปี — เหตุการณ์!</span>
                  <h3 className="font-display text-xl font-bold text-brand-charcoal mt-1">{phase.ev.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed text-center mt-3 whitespace-pre-line">{phase.ev.desc}</p>
                <div className="grid gap-2 mt-5">
                  {phase.ev.choices.map(c => (
                    <button key={c.id} onClick={() => chooseEvent(phase.ev, c.id)} className={modalBtn}>
                      <div className="text-sm font-bold text-brand-charcoal">{c.label}</div>
                      {c.detail && <div className="text-[11px] text-gray-500 mt-0.5">{c.detail}</div>}
                    </button>
                  ))}
                </div>
              </>
            )}
            {phase.kind === 'result' && (
              <>
                <div className="text-center text-5xl">{phase.emoji}</div>
                <h3 className="font-display text-lg font-bold text-brand-charcoal text-center mt-2">{phase.title}</h3>
                {phase.logged.moneyDelta !== 0 && (
                  <div className={`text-center font-mono text-xl font-bold mt-2 ${phase.logged.moneyDelta > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {phase.logged.moneyDelta > 0 ? '+' : ''}{fmtTH(phase.logged.moneyDelta)} บาท
                  </div>
                )}
                <p className="text-sm text-gray-600 leading-relaxed text-center mt-3">{phase.logged.note}</p>
                <button onClick={() => continueFlow(game)}
                  className="w-full rounded-lg bg-brand-orange text-white font-display font-bold py-3 mt-5 hover:bg-brand-orange/90 transition-colors">
                  ไปต่อ ▶
                </button>
              </>
            )}
            {phase.kind === 'checkpoint' && (
              <>
                <div className="text-center text-5xl">{phase.view.emoji}</div>
                <div className="text-center mt-2">
                  <span className="text-[11px] font-mono font-semibold text-brand-orange uppercase tracking-wider">จุดเปลี่ยนของชีวิต</span>
                  <h3 className="font-display text-xl font-bold text-brand-charcoal mt-1">{phase.view.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed text-center mt-3">{phase.view.desc}</p>
                <div className="grid gap-2 mt-5">
                  {phase.view.choices.map(c => (
                    <button key={c.id} disabled={c.disabled} onClick={() => chooseCheckpoint(phase.view, c.id)}
                      className={`${modalBtn} ${c.disabled ? 'opacity-45 cursor-not-allowed hover:border-slate-200 hover:bg-white' : ''}`}>
                      <div className="text-sm font-bold text-brand-charcoal">{c.label}</div>
                      {c.detail && <div className="text-[11px] text-gray-500 mt-0.5">{c.detail}</div>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

/* ══════════════════ จอสรุปผล ══════════════════ */

function Summary({ state, log, onReplay, goContact }: {
  state: GameState;
  log: DecisionLog;
  onReplay: () => void;
  goContact: () => void;
}) {
  const result = React.useMemo(() => finishGame(state), [state]);
  const insights = React.useMemo(() => computeInsights(state.seed, log, state, result), [state, log, result]);
  const career = CAREERS[state.careerId];
  const forever = result.fundedAge >= 100;
  const dotYears = new Set(state.log.map(e => e.year));

  const [lead, setLead] = useState({ name: '', contact: '' });
  const [consent, setConsent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const turnstileRef = useRef<TurnstileHandle>(null);
  const [leadStatus, setLeadStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const canSubmit = lead.name.trim() && lead.contact.trim() && consent && (!TURNSTILE_SITE_KEY || captchaToken);

  const submitLead = async () => {
    if (!canSubmit || leadStatus === 'sending') return;
    setLeadStatus('sending');
    try {
      const res = await fetch('/api/game-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: lead.name.trim(),
          contact: lead.contact.trim(),
          career: career.name,
          score: result.score,
          grade: result.grade,
          fundedAge: result.fundedAge,
          netWorth: Math.round(result.netWorth),
          consent,
          captchaToken,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setLeadStatus('done');
    } catch {
      setLeadStatus('error');
      setCaptchaToken('');
      turnstileRef.current?.reset();
    }
  };

  const share = async () => {
    const text = `ฉันเล่น "เกมเศรษฐี" ของ Ultimate Life Advisor ได้เกรด ${result.grade} — ${forever ? 'เงินพอใช้ตลอดชีวิต!' : `เงินพอใช้ถึงอายุ ${result.fundedAge}`} คุณล่ะจะเกษียณได้ไหม? ลองเล่น: ${location.origin}/#/game`;
    try {
      if (navigator.share) await navigator.share({ text });
      else { await navigator.clipboard.writeText(text); alert('คัดลอกข้อความแชร์แล้ว!'); }
    } catch { /* ผู้ใช้ยกเลิก */ }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

      {/* เกรด */}
      <div className="text-center">
        <span className="text-xs font-mono font-semibold text-gray-500 uppercase tracking-wider">🎉 อายุ 60 — ถึงเวลาเกษียณแล้ว!</span>
        <div className={`w-28 h-28 mx-auto mt-4 rounded-full border-4 flex flex-col items-center justify-center ${gradeClasses(result.grade)}`}>
          <span className="font-display text-5xl font-bold leading-none">{result.grade}</span>
          <span className="text-[11px] font-mono font-semibold mt-1">{result.score}/100</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-brand-charcoal mt-4 leading-snug">
          {forever ? <>เงินของคุณพอใช้ <span className="text-emerald-600">ตลอดชีวิต</span> 🎊</>
            : <>เงินของคุณพอใช้ถึงอายุ <span className="text-brand-orange text-3xl">{result.fundedAge}</span> ปี</>}
        </h2>
        {!forever && result.fundedAge < 85 && (
          <p className="text-sm text-red-500 mt-1">คนไทยอายุยืนเฉลี่ยถึง ~85 ปี — ยังขาดอีก {85 - result.fundedAge} ปี</p>
        )}
      </div>

      {/* ตัวเลขสรุป */}
      <div className="grid grid-cols-2 gap-2">
        {[
          ['ความมั่งคั่งสุทธิ', `${fmtTH(result.netWorth)} ฿`],
          ['เงินก้อนใช้ยามเกษียณ', `${fmtTH(result.assetsAtRetire)} ฿`],
          [career.pensionPct > 0 ? 'บำนาญ/เดือน' : 'บำนาญ (ประกันสังคม)/เดือน', `${fmtTH(result.pensionMonthly)} ฿`],
          ['ความสุขบั้นปลาย', `${happyEmoji(result.happiness)} ${Math.round(result.happiness)}/100`],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border border-slate-200 rounded-lg px-4 py-3">
            <div className="text-[11px] text-gray-500">{label}</div>
            <div className="font-mono text-base font-bold text-brand-charcoal mt-0.5">{value}</div>
          </div>
        ))}
      </div>

      {/* กราฟ + จุดเหตุการณ์ */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <h3 className="font-display text-sm font-semibold text-gray-600 mb-1">เส้นทางความมั่งคั่ง 30 ปีของคุณ</h3>
        <NetWorthChart history={state.history} dotYears={dotYears} />
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-display text-sm font-bold text-brand-orange uppercase tracking-wider">💡 สิ่งที่เกมนี้อยากบอกคุณ</h3>
          {insights.map((c, i) => (
            <div key={i} className="bg-white border border-slate-200 border-l-4 border-l-brand-orange rounded-lg px-4 py-3.5">
              <div className="text-sm font-bold text-brand-charcoal">{c.emoji} {c.title}</div>
              <p className="text-[13px] text-gray-600 leading-relaxed mt-1.5">{c.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* ไทม์ไลน์ */}
      <details className="bg-white border border-slate-200 rounded-lg px-4 py-3">
        <summary className="text-sm font-semibold text-gray-600 cursor-pointer select-none">📜 เหตุการณ์ทั้งหมดในชีวิตคุณ ({state.log.length})</summary>
        <div className="space-y-2 mt-3">
          {state.log.map((e, i) => (
            <div key={i} className="flex gap-3 items-baseline text-[13px]">
              <span className="font-mono font-bold text-brand-orange min-w-[52px]">อายุ {e.age}</span>
              <span className="flex-1 text-gray-600">{e.title}</span>
              {e.moneyDelta !== 0 && (
                <span className={`font-mono font-semibold ${e.moneyDelta > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {e.moneyDelta > 0 ? '+' : ''}{fmtTH(e.moneyDelta)}
                </span>
              )}
            </div>
          ))}
        </div>
      </details>

      {/* Lead form */}
      <div className="rounded-xl border-2 border-brand-orange bg-gradient-to-br from-orange-50 to-white p-5">
        {leadStatus === 'done' ? (
          <div className="text-center py-3">
            <div className="text-4xl">🤝</div>
            <h3 className="font-display text-lg font-bold text-brand-charcoal mt-2">รับข้อมูลแล้ว ขอบคุณครับ!</h3>
            <p className="text-sm text-gray-600 mt-1">ที่ปรึกษาจะติดต่อกลับโดยเร็วที่สุด</p>
          </div>
        ) : (
          <>
            <h3 className="font-display text-lg font-bold text-brand-charcoal leading-snug">ในเกมยังแก้ตัวได้... แต่ชีวิตจริงมีรอบเดียว</h3>
            <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
              อยากรู้ว่าชีวิตจริงของคุณจะเกษียณได้ไหม? รับการวิเคราะห์แผนการเงินส่วนตัวจากที่ปรึกษา <b>ฟรี ไม่มีค่าใช้จ่าย</b>
            </p>
            <div className="space-y-2.5 mt-4">
              <input value={lead.name} onChange={e => setLead({ ...lead, name: e.target.value })} maxLength={80}
                placeholder="ชื่อเล่น / ชื่อที่ให้เรียก"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:border-brand-orange focus:outline-none" />
              <input value={lead.contact} onChange={e => setLead({ ...lead, contact: e.target.value })} maxLength={80}
                placeholder="เบอร์โทร หรือ Line ID"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm focus:border-brand-orange focus:outline-none" />
              <label className="flex items-start gap-2 text-xs text-gray-500 cursor-pointer select-none">
                <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-0.5 accent-[#d95f35]" />
                <span>ยินยอมให้ Ultimate Life Advisor ใช้ข้อมูลนี้เพื่อติดต่อกลับตาม <a href="#/legal/privacy" className="text-brand-orange underline underline-offset-2">นโยบายความเป็นส่วนตัว</a></span>
              </label>
              {TURNSTILE_SITE_KEY && (
                <TurnstileWidget ref={turnstileRef} siteKey={TURNSTILE_SITE_KEY} lang="TH" onVerify={setCaptchaToken} onExpire={() => setCaptchaToken('')} />
              )}
              <button onClick={submitLead} disabled={!canSubmit || leadStatus === 'sending'}
                className="w-full rounded-lg bg-brand-orange text-white font-display font-bold py-3.5 hover:bg-brand-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {leadStatus === 'sending' ? 'กำลังส่ง...' : 'รับคำปรึกษาฟรี 🎯'}
              </button>
              {leadStatus === 'error' && (
                <p className="text-xs text-red-500 text-center">ส่งไม่สำเร็จ ลองใหม่อีกครั้ง หรือใช้หน้า "ติดต่อเรา" แทน</p>
              )}
              <button onClick={goContact}
                className="w-full text-center text-xs font-semibold text-gray-500 hover:text-brand-orange transition-colors inline-flex items-center justify-center gap-1">
                หรือนัดหมายที่ปรึกษาโดยตรง <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 pb-6">
        <button onClick={share}
          className="rounded-lg border border-slate-200 bg-white py-3 text-sm font-semibold text-gray-600 hover:border-brand-orange hover:text-brand-orange transition-colors inline-flex items-center justify-center gap-2">
          <Share2 className="w-4 h-4" /> แชร์ผล
        </button>
        <button onClick={onReplay}
          className="rounded-lg border border-slate-200 bg-white py-3 text-sm font-semibold text-gray-600 hover:border-brand-orange hover:text-brand-orange transition-colors inline-flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" /> เล่นอีกครั้ง
        </button>
      </div>
    </motion.div>
  );
}
