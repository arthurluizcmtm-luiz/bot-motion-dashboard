import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Crown, Search, Users } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { servers as initial } from "../data";
import { CountUp, Panel, Segmented, stagger } from "../shared";

const FILTERS = ["Todos", "Premium", "Grandes", "Pausados"] as const;
type Filter = (typeof FILTERS)[number];

export function Servers() {
  const [list, setList] = useState(initial);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("Todos");

  const shown = list.filter((s) => {
    if (q && !s.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (filter === "Premium") return s.premium;
    if (filter === "Grandes") return s.members > 30000;
    if (filter === "Pausados") return !s.active;
    return true;
  });

  const totalMembers = list.reduce((a, b) => a + b.members, 0);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-3">
        {[
          { k: "Servidores ativos", v: list.filter((s) => s.active).length },
          { k: "Membros somados", v: totalMembers },
          { k: "Servidores premium", v: list.filter((s) => s.premium).length },
        ].map((s) => (
          <Panel key={s.k} interactive>
            <div className="text-xs text-muted-foreground">{s.k}</div>
            <div className="mt-1 font-display text-3xl font-bold text-foreground">
              <CountUp value={s.v} />
            </div>
          </Panel>
        ))}
      </div>

      <Panel className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-surface/70 px-3 py-2 text-sm text-muted-foreground focus-within:border-primary/40 sm:max-w-xs">
            <Search className="h-4 w-4" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar servidor..."
              className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>
          <Segmented options={FILTERS} value={filter} onChange={setFilter} layoutId="server-filter" />
        </div>
      </Panel>

      <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((s, i) => (
            <motion.div
              key={s.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: i * 0.04 } }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              whileHover={{ y: -6 }}
              className={cn(
                "glass group relative overflow-hidden rounded-2xl transition-shadow hover:shadow-glow",
                !s.active && "opacity-60",
              )}
            >
              <div className={cn("relative h-20 overflow-hidden", s.banner)}>
                <div className="absolute inset-0 bg-grid opacity-60" />
                <motion.div
                  className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-foreground/10 blur-xl"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                {s.premium && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-warning backdrop-blur">
                    <Crown className="h-3 w-3" /> Premium
                  </span>
                )}
              </div>
              <div className="px-5 pb-5">
                <div className={cn("relative z-10 -mt-7 flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-card font-display text-lg font-bold text-foreground", s.banner)}>
                  {s.name
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("").toUpperCase()}
                </div>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-foreground">{s.name}</h3>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {s.members.toLocaleString("pt-BR")}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {s.online.toLocaleString("pt-BR")} online
                      </span>
                    </div>
                  </div>
                  <Switch
                    checked={s.active}
                    onCheckedChange={(v) =>
                      setList((prev) => prev.map((x) => (x.id === s.id ? { ...x, active: v } : x)))
                    }
                  />
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.online / s.members) * 100 * 3}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full rounded-full bg-gradient-signal"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {shown.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center text-sm text-muted-foreground">
          Nenhum servidor encontrado.
        </motion.div>
      )}
    </motion.div>
  );
}
