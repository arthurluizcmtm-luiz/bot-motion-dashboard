import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  ArrowUpRight,
  Bot,
  Gavel,
  Hash,
  LogIn,
  Power,
  Server,
  TerminalSquare,
  TriangleAlert,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { activitySeries, spark, topCommands, type Range } from "../data";
import {
  ChartTooltip,
  CountUp,
  Gauge,
  LiveDot,
  Panel,
  PanelHeader,
  Segmented,
  Sparkline,
  stagger,
  toneClasses,
  type Tone,
} from "../shared";

const stats: {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  delta: string;
  icon: typeof Server;
  tone: Tone;
  seed: number;
}[] = [
  { label: "Servidores", value: 1284, delta: "+12,4%", icon: Server, tone: "primary", seed: 3 },
  { label: "Usuários alcançados", value: 482910, delta: "+8,1%", icon: Users, tone: "info", seed: 11 },
  { label: "Comandos hoje", value: 38402, delta: "+21,7%", icon: TerminalSquare, tone: "warning", seed: 23 },
  { label: "Uptime (30d)", value: 99.98, decimals: 2, suffix: "%", delta: "estável", icon: Zap, tone: "primary", seed: 31 },
];

export function Overview() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.9fr)]">
        <BotStatusCard />
        <div className="grid gap-5 sm:grid-cols-2">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <ActivityChart className="xl:col-span-2" />
        <TopCommands />
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <LiveFeed className="xl:col-span-2" />
        <Resources />
      </div>
    </motion.div>
  );
}

function StatCard({
  label,
  value,
  decimals,
  suffix,
  delta,
  icon: Icon,
  tone,
  seed,
}: (typeof stats)[number]) {
  return (
    <Panel interactive className="flex flex-col">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="flex items-center justify-between">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl ring-1", toneClasses[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
          <ArrowUpRight className="h-3 w-3" />
          {delta}
        </span>
      </div>
      <div className="mt-4 text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-3xl font-bold text-foreground">
        <CountUp value={value} decimals={decimals} suffix={suffix} />
      </div>
      <Sparkline data={spark(seed)} tone={tone} className="mt-3" />
    </Panel>
  );
}

function useUptime(start: number) {
  const [s, setS] = useState(start);
  useEffect(() => {
    const t = setInterval(() => setS((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d}d ${pad(h)}h ${pad(m)}m ${pad(sec)}s`;
}

function BotStatusCard() {
  const uptime = useUptime(12 * 86400 + 4 * 3600 + 33 * 60 + 12);
  return (
    <Panel className="flex flex-col p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px shimmer-line animate-shimmer" />
      <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl animate-aurora" />
      <div className="relative flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0">
          <div className="absolute inset-0 rounded-full conic-ring animate-spin-slow" />
          <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-surface">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              <Bot className="h-7 w-7 text-primary-foreground animate-float" />
            </div>
          </div>
          <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-surface">
            <LiveDot />
          </span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-xl font-bold text-foreground">Seu Bot</h2>
            <span className="rounded-md bg-info/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-info">
              bot
            </span>
          </div>
          <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            <LiveDot /> Online e operando
          </div>
        </div>
      </div>

      <div className="relative mt-6 rounded-xl border border-border bg-surface/60 p-4">
        <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Tempo online
        </div>
        <div className="mt-1 font-mono text-2xl font-semibold text-gradient-signal">{uptime}</div>
      </div>

      <div className="relative mt-4 grid grid-cols-3 gap-3 text-center">
        {[
          { k: "Ping", v: "42ms" },
          { k: "Shards", v: "16" },
          { k: "Versão", v: "v1.0" },
        ].map((i) => (
          <div key={i.k} className="rounded-xl border border-border bg-surface/40 py-2.5">
            <div className="font-mono text-sm font-semibold text-foreground">{i.v}</div>
            <div className="text-[11px] text-muted-foreground">{i.k}</div>
          </div>
        ))}
      </div>

      <div className="relative mt-auto flex gap-2 pt-5">
        <button
          onClick={() => toast.success("Link de convite copiado!")}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <UserPlus className="h-4 w-4" /> Convidar
        </button>
        <button
          onClick={() => toast("Reiniciando o bot...", { description: "Volta em alguns segundos." })}
          className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface/70 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
        >
          <Power className="h-4 w-4" /> Reiniciar
        </button>
      </div>
    </Panel>
  );
}

const RANGES = ["24h", "7d", "30d"] as const;

function ActivityChart({ className }: { className?: string | undefined }) {
  const [range, setRange] = useState<Range>("24h");
  const data = useMemo(() => activitySeries(range), [range]);
  const total = data.reduce((a, b) => a + b.comandos, 0);
  return (
    <Panel className={className}>
      <PanelHeader
        title="Atividade"
        subtitle="Comandos e mensagens processadas"
        action={<Segmented options={RANGES} value={range} onChange={setRange} layoutId="range-pill" />}
      />
      <div className="mb-4 flex flex-wrap items-end gap-6">
        <div>
          <div className="font-display text-3xl font-bold text-foreground">
            <CountUp value={total} duration={0.9} />
          </div>
          <div className="text-xs text-muted-foreground">comandos no período</div>
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" /> Comandos
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-info" /> Mensagens
          </span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -18, right: 4, top: 4 }}>
            <defs>
              <linearGradient id="gCmd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gMsg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--info)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--info)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--border-strong)" }} />
            <Area type="monotone" dataKey="mensagens" stroke="var(--info)" strokeWidth={2} fill="url(#gMsg)" animationDuration={900} />
            <Area type="monotone" dataKey="comandos" stroke="var(--primary)" strokeWidth={2.5} fill="url(#gCmd)" animationDuration={900} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function TopCommands() {
  const max = topCommands[0]?.uses ?? 1;
  return (
    <Panel>
      <PanelHeader title="Mais usados" subtitle="Top comandos da semana" />
      <ul className="space-y-4">
        {topCommands.map((c, i) => (
          <li key={c.name}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-mono text-foreground">
                <span className="w-4 text-xs text-muted-foreground">{i + 1}</span>
                {c.name}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {c.uses.toLocaleString("pt-BR")}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(c.uses / max) * 100}%` }}
                transition={{ delay: 0.3 + i * 0.08, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className={cn("h-full rounded-full", i === 0 ? "bg-gradient-primary shadow-glow" : "bg-gradient-signal opacity-70")}
              />
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

type FeedItem = { id: number; icon: typeof Server; tone: Tone; text: string; meta: string };

const feedPool: Omit<FeedItem, "id">[] = [
  { icon: LogIn, tone: "primary", text: "Bot adicionado em Arena Valorant BR", meta: "86.422 membros" },
  { icon: Hash, tone: "info", text: "/play usado por luna.exe", meta: "Lofi & Chill" },
  { icon: Gavel, tone: "destructive", text: "AutoMod baniu raid_bot_99", meta: "Anti-raid" },
  { icon: UserPlus, tone: "info", text: "128 novos membros alcançados", meta: "última hora" },
  { icon: TriangleAlert, tone: "warning", text: "Rate limit próximo em /rank", meta: "Shard 3" },
  { icon: Hash, tone: "info", text: "/daily usado por zezinho", meta: "Clube do Anime" },
  { icon: LogIn, tone: "primary", text: "Bot adicionado em Torre de Estudos", meta: "7.720 membros" },
];

function LiveFeed({ className }: { className?: string | undefined }) {
  const [items, setItems] = useState<FeedItem[]>(() =>
    feedPool.slice(0, 5).map((f, i) => ({ ...f, id: i })),
  );
  useEffect(() => {
    let n = 100;
    const t = setInterval(() => {
      const next = feedPool[Math.floor(Math.random() * feedPool.length)]!;
      setItems((prev) => [{ ...next, id: n++ }, ...prev].slice(0, 5));
    }, 2800);
    return () => clearInterval(t);
  }, []);
  return (
    <Panel className={className}>
      <PanelHeader
        title="Atividade ao vivo"
        subtitle="Eventos chegando em tempo real"
        action={
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            <LiveDot /> ao vivo
          </span>
        }
      />
      <ul className="relative space-y-2">
        <AnimatePresence initial={false}>
          {items.map((it, idx) => {
            const Icon = it.icon;
            return (
              <motion.li
                key={it.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ type: "spring", stiffness: 340, damping: 30 }}
                className={cn(
                  "flex items-center gap-3 rounded-xl border border-border bg-surface/50 px-3 py-2.5",
                  idx === 0 && "border-primary/20 bg-primary/5",
                )}
              >
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1", toneClasses[it.tone])}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-foreground">{it.text}</div>
                  <div className="text-xs text-muted-foreground">{it.meta}</div>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {idx === 0 ? "agora" : `${idx * 3}s`}
                </span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </Panel>
  );
}

function Resources() {
  const [cpu, setCpu] = useState(34);
  const [ram, setRam] = useState(58);
  const [ping, setPing] = useState(42);
  useEffect(() => {
    const t = setInterval(() => {
      setCpu((v) => Math.max(12, Math.min(88, v + (Math.random() - 0.5) * 18)));
      setRam((v) => Math.max(40, Math.min(82, v + (Math.random() - 0.5) * 6)));
      setPing((v) => Math.max(28, Math.min(90, v + (Math.random() - 0.5) * 14)));
    }, 1800);
    return () => clearInterval(t);
  }, []);
  const shards = Array.from({ length: 16 }, (_, i) => (i === 6 ? "warning" : i === 13 ? "info" : "primary"));
  return (
    <Panel>
      <PanelHeader title="Sistema" subtitle="Recursos em tempo real" />
      <div className="grid grid-cols-3 gap-2">
        <Gauge value={cpu} label="CPU" display={`${Math.round(cpu)}%`} tone={cpu > 75 ? "warning" : "primary"} />
        <Gauge value={ram} label="Memória" display={`${Math.round(ram)}%`} tone="info" />
        <Gauge value={ping} label="Latência" display={`${Math.round(ping)}ms`} tone={ping > 70 ? "destructive" : "primary"} />
      </div>
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Shards</span>
          <span className="font-mono">15/16 saudáveis</span>
        </div>
        <div className="grid grid-cols-8 gap-1.5">
          {shards.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.03 }}
              title={`Shard ${i}`}
              className={cn(
                "aspect-square rounded-md ring-1",
                s === "primary" && "bg-primary/25 ring-primary/40",
                s === "warning" && "bg-warning/30 ring-warning/50 animate-pulse",
                s === "info" && "bg-info/25 ring-info/40",
              )}
            />
          ))}
        </div>
      </div>
    </Panel>
  );
}
