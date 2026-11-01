import { motion } from "motion/react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Ban, Link2, MessageSquareWarning, ShieldAlert, VolumeX, Waves, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { modCases, modWeek } from "../data";
import { ChartTooltip, CountUp, Panel, PanelHeader, stagger, toneClasses, type Tone } from "../shared";

const rulesInit = [
  { id: "spam", icon: Waves, name: "Anti-spam", desc: "Bloqueia mensagens repetidas", on: true },
  { id: "link", icon: Link2, name: "Anti-link", desc: "Remove convites e links suspeitos", on: true },
  { id: "words", icon: MessageSquareWarning, name: "Filtro de palavras", desc: "Lista personalizada de termos", on: true },
  { id: "raid", icon: ShieldAlert, name: "Anti-raid", desc: "Detecta entradas em massa", on: true },
  { id: "flood", icon: Zap, name: "Anti-flood", desc: "Limita mensagens por segundo", on: false },
];

const actionTone: Record<string, Tone> = { Ban: "destructive", Mute: "warning", Aviso: "info", Kick: "warning" };

export function Moderation() {
  const [rules, setRules] = useState(rulesInit);
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-3">
        {[
          { k: "Banimentos (7d)", v: 105, icon: Ban, tone: "destructive" as Tone },
          { k: "Silenciados (7d)", v: 231, icon: VolumeX, tone: "warning" as Tone },
          { k: "Avisos (7d)", v: 349, icon: MessageSquareWarning, tone: "info" as Tone },
        ].map((s) => (
          <Panel key={s.k} interactive>
            <div className="flex items-center gap-4">
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl ring-1", toneClasses[s.tone])}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{s.k}</div>
                <div className="font-display text-3xl font-bold text-foreground">
                  <CountUp value={s.v} />
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Panel>
          <PanelHeader title="Ações na semana" subtitle="Bans, mutes e avisos por dia" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modWeek} margin={{ left: -24, right: 4 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--accent)", opacity: 0.4 }} />
                <Bar dataKey="avisos" stackId="a" fill="var(--info)" radius={[0, 0, 6, 6]} />
                <Bar dataKey="mutes" stackId="a" fill="var(--warning)" />
                <Bar dataKey="bans" stackId="a" fill="var(--destructive)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="AutoMod" subtitle="Proteções automáticas" />
          <ul className="space-y-2">
            {rules.map((r) => (
              <motion.li
                key={r.id}
                layout
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
                  r.on ? "border-primary/20 bg-primary/5" : "border-border bg-surface/40",
                )}
              >
                <motion.div
                  animate={{ rotate: r.on ? 0 : -20, scale: r.on ? 1 : 0.9 }}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg ring-1",
                    r.on ? toneClasses.primary : "bg-muted text-muted-foreground ring-border",
                  )}
                >
                  <r.icon className="h-4 w-4" />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground">{r.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{r.desc}</div>
                </div>
                <Switch
                  checked={r.on}
                  onCheckedChange={(v) => setRules((p) => p.map((x) => (x.id === r.id ? { ...x, on: v } : x)))}
                />
              </motion.li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel className="p-2">
        <div className="px-4 pb-1 pt-3">
          <PanelHeader title="Casos recentes" subtitle="Últimas ações de moderação" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <th className="px-4 py-2 font-medium">Caso</th>
                <th className="px-4 py-2 font-medium">Usuário</th>
                <th className="px-4 py-2 font-medium">Ação</th>
                <th className="px-4 py-2 font-medium">Moderador</th>
                <th className="px-4 py-2 font-medium">Motivo</th>
                <th className="px-4 py-2 text-right font-medium">Quando</th>
              </tr>
            </thead>
            <tbody>
              {modCases.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="border-t border-border transition-colors hover:bg-accent/40"
                >
                  <td className="px-4 py-3 font-mono text-muted-foreground">#{c.id}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{c.user}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold ring-1", toneClasses[actionTone[c.action]])}>
                      {c.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.mod}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.reason}</td>
                  <td className="px-4 py-3 text-right text-xs text-muted-foreground">{c.time}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </motion.div>
  );
}
