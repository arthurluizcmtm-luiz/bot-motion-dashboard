import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { logTemplates, type LogLevel } from "../data";
import { LiveDot, Panel, Segmented, stagger } from "../shared";

type Line = { id: number; time: string; level: LogLevel; msg: string };

const LEVELS = ["Todos", "INFO", "WARN", "ERROR", "DEBUG"] as const;

const levelClass: Record<LogLevel, string> = {
  INFO: "text-primary",
  WARN: "text-warning",
  ERROR: "text-destructive",
  DEBUG: "text-info",
};

const initialLines: Line[] = logTemplates.slice(0, 8).map((t, i) => ({
  id: i,
  time: `22:31:${String(10 + i * 4).padStart(2, "0")}`,
  ...t,
}));

export function Logs() {
  const [lines, setLines] = useState<Line[]>(initialLines);
  const [paused, setPaused] = useState(false);
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("Todos");
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    let n = 1000;
    const t = setInterval(() => {
      const tpl = logTemplates[Math.floor(Math.random() * logTemplates.length)]!;
      const d = new Date();
      const time = d.toLocaleTimeString("pt-BR", { hour12: false });
      setLines((prev) => [...prev, { id: n++, time, ...tpl }].slice(-80));
    }, 900);
    return () => clearInterval(t);
  }, [paused]);

  useEffect(() => {
    const el = box.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const shown = lines.filter((l) => level === "Todos" || l.level === level);
  const counts = lines.reduce<Record<string, number>>((a, l) => ((a[l.level] = (a[l.level] ?? 0) + 1), a), {});

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-5">
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {(["INFO", "WARN", "ERROR", "DEBUG"] as LogLevel[]).map((l) => (
          <Panel key={l} interactive className="py-4">
            <div className={cn("font-mono text-xs font-semibold", levelClass[l])}>{l}</div>
            <motion.div
              key={counts[l] ?? 0}
              initial={{ scale: 1.2, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-1 origin-left font-display text-2xl font-bold text-foreground"
            >
              {counts[l] ?? 0}
            </motion.div>
          </Panel>
        ))}
      </div>

      <Panel className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-destructive/80" />
              <span className="h-3 w-3 rounded-full bg-warning/80" />
              <span className="h-3 w-3 rounded-full bg-primary/80" />
            </div>
            <span className="font-mono text-xs text-muted-foreground">bot@servidor ~ logs</span>
            {!paused && (
              <span className="flex items-center gap-1.5 text-xs text-primary">
                <LiveDot /> transmitindo
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Segmented options={LEVELS} value={level} onChange={setLevel} layoutId="log-level" />
            <button
              onClick={() => setPaused((p) => !p)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface/70 text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              aria-label={paused ? "Retomar" : "Pausar"}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={paused ? "p" : "r"} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}>
                  {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </motion.span>
              </AnimatePresence>
            </button>
            <button
              onClick={() => setLines([])}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface/70 text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
              aria-label="Limpar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div ref={box} className="h-[460px] overflow-y-auto bg-background/60 p-4 font-mono text-[13px] leading-relaxed">
          <AnimatePresence initial={false}>
            {shown.map((l) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, x: -10, backgroundColor: "oklch(0.89 0.21 128 / 0.12)" }}
                animate={{ opacity: 1, x: 0, backgroundColor: "oklch(0.89 0.21 128 / 0)" }}
                transition={{ duration: 0.6 }}
                className="flex gap-3 rounded px-2 py-0.5"
              >
                <span className="shrink-0 text-muted-foreground/70">{l.time}</span>
                <span className={cn("w-12 shrink-0 font-semibold", levelClass[l.level])}>{l.level}</span>
                <span className="text-foreground/90">{l.msg}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="flex gap-3 px-2 py-0.5 text-primary">
            <span>❯</span>
            <span className="inline-block h-4 w-2 translate-y-0.5 bg-primary animate-blink" />
          </div>
        </div>
      </Panel>
    </motion.div>
  );
}
