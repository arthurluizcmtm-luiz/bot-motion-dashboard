import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Clock, Gamepad2, Music2, Shield, Wallet, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { commands as initial, type Category } from "../data";
import { Panel, Segmented, stagger, toneClasses, type Tone } from "../shared";

const CATS = ["Todos", "Moderação", "Música", "Diversão", "Utilidade", "Economia"] as const;

const catMeta: Record<Category, { icon: typeof Shield; tone: Tone }> = {
  Moderação: { icon: Shield, tone: "destructive" },
  Música: { icon: Music2, tone: "info" },
  Diversão: { icon: Gamepad2, tone: "warning" },
  Utilidade: { icon: Wrench, tone: "primary" },
  Economia: { icon: Wallet, tone: "warning" },
};

export function Commands() {
  const [list, setList] = useState(initial);
  const [cat, setCat] = useState<(typeof CATS)[number]>("Todos");
  const shown = list.filter((c) => cat === "Todos" || c.category === cat);
  const enabled = list.filter((c) => c.enabled).length;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-5">
      <Panel className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="overflow-x-auto">
            <Segmented options={CATS} value={cat} onChange={setCat} layoutId="cmd-cat" />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">Ativos</span>
            <span className="font-mono font-semibold text-foreground">
              {enabled}/{list.length}
            </span>
            <div className="h-2 w-28 overflow-hidden rounded-full bg-muted">
              <motion.div
                animate={{ width: `${(enabled / list.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className="h-full rounded-full bg-gradient-primary"
              />
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="p-2">
        <div className="hidden grid-cols-[minmax(0,2fr)_1fr_1fr_0.8fr_auto] gap-4 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground md:grid">
          <span>Comando</span>
          <span>Categoria</span>
          <span>Usos</span>
          <span>Cooldown</span>
          <span>Status</span>
        </div>
        <motion.ul layout className="space-y-1">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((c, i) => {
              const meta = catMeta[c.category];
              const Icon = meta.icon;
              return (
                <motion.li
                  key={c.name}
                  layout
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: i * 0.03 } }}
                  exit={{ opacity: 0, x: 16, transition: { duration: 0.15 } }}
                  className={cn(
                    "group grid grid-cols-[1fr_auto] items-center gap-4 rounded-xl px-4 py-3 transition-colors hover:bg-accent/50 md:grid-cols-[minmax(0,2fr)_1fr_1fr_0.8fr_auto]",
                    !c.enabled && "opacity-55",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 transition-transform group-hover:scale-110 group-hover:rotate-6", toneClasses[meta.tone])}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-sm font-semibold text-foreground">/{c.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{c.desc}</div>
                    </div>
                  </div>
                  <span className="hidden text-sm text-muted-foreground md:block">{c.category}</span>
                  <span className="hidden font-mono text-sm text-foreground md:block">
                    {c.uses.toLocaleString("pt-BR")}
                  </span>
                  <span className="hidden items-center gap-1.5 font-mono text-xs text-muted-foreground md:flex">
                    <Clock className="h-3.5 w-3.5" /> {c.cooldown}
                  </span>
                  <Switch
                    checked={c.enabled}
                    onCheckedChange={(v) => {
                      setList((prev) => prev.map((x) => (x.name === c.name ? { ...x, enabled: v } : x)));
                      toast(v ? `/${c.name} ativado` : `/${c.name} desativado`);
                    }}
                  />
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </Panel>
    </motion.div>
  );
}
