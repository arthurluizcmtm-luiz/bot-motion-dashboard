import { animate, motion, type Variants } from "motion/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Tone = "primary" | "info" | "warning" | "destructive";

export const toneVar: Record<Tone, string> = {
  primary: "var(--primary)",
  info: "var(--info)",
  warning: "var(--warning)",
  destructive: "var(--destructive)",
};

export const toneClasses: Record<Tone, string> = {
  primary: "bg-primary/12 text-primary ring-primary/25",
  info: "bg-info/12 text-info ring-info/25",
  warning: "bg-warning/12 text-warning ring-warning/25",
  destructive: "bg-destructive/12 text-destructive ring-destructive/25",
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 26 },
  },
};

export function Panel({
  className,
  children,
  interactive = false,
}: {
  className?: string;
  children: ReactNode;
  interactive?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={interactive ? { y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn("glass group relative overflow-hidden rounded-2xl p-5", className)}
    >
      {children}
    </motion.div>
  );
}

export function PanelHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CountUp({
  value,
  decimals = 0,
  duration = 1.4,
  prefix = "",
  suffix = "",
}: {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const current = useRef(0);
  useEffect(() => {
    const controls = animate(current.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        current.current = v;
        setDisplay(v);
      },
    });
    return () => controls.stop();
  }, [value, duration]);
  return (
    <span className="tabular-nums">
      {prefix}
      {display.toLocaleString("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

export function Sparkline({
  data,
  tone = "primary",
  className,
}: {
  data: number[];
  tone?: Tone;
  className?: string;
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const w = 160;
  const h = 44;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - 4 - ((v - min) / (max - min || 1)) * (h - 8),
  ]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  const color = toneVar[tone];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn("h-11 w-full", className)}>
      <defs>
        <linearGradient id={`sp${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill={`url(#sp${id})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

export function Gauge({
  value,
  label,
  display,
  tone = "primary",
}: {
  value: number;
  label: string;
  display: string;
  tone?: Tone;
}) {
  const r = 38;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border-strong)" strokeWidth="8" />
          <motion.circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={toneVar[tone]}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c - (Math.min(value, 100) / 100) * c }}
            transition={{ type: "spring", stiffness: 60, damping: 16 }}
            style={{ filter: `drop-shadow(0 0 6px ${toneVar[tone]})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold text-foreground">
          {display}
        </div>
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  layoutId,
  className,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  layoutId: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-border bg-surface/70 p-1",
        className,
      )}
    >
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={cn(
              "relative rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-lg bg-primary shadow-glow"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span className="relative z-10 whitespace-nowrap">{o}</span>
          </button>
        );
      })}
    </div>
  );
}

export function LiveDot({ tone = "primary" }: { tone?: Tone }) {
  const bg = {
    primary: "bg-primary",
    info: "bg-info",
    warning: "bg-warning",
    destructive: "bg-destructive",
  }[tone];
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className={cn("absolute inset-0 rounded-full animate-pulse-ring", bg)} />
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", bg)} />
    </span>
  );
}

export function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 text-xs">
      <div className="mb-1 font-medium text-foreground">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="capitalize">{p.name}</span>
          <span className="ml-auto font-mono text-foreground">
            {Number(p.value).toLocaleString("pt-BR")}
          </span>
        </div>
      ))}
    </div>
  );
}
