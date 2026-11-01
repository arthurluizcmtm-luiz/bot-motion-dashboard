import { motion } from "motion/react";
import { useState } from "react";
import { Bot, Check, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Panel, PanelHeader, stagger } from "../shared";

const swatches = [
  { id: "lime", cls: "swatch-lime", border: "border-l-primary" },
  { id: "cyan", cls: "swatch-cyan", border: "border-l-info" },
  { id: "amber", cls: "swatch-amber", border: "border-l-warning" },
  { id: "coral", cls: "swatch-coral", border: "border-l-destructive" },
  { id: "mint", cls: "swatch-mint", border: "border-l-primary-glow" },
] as const;

const notifs = [
  { id: "join", label: "Quando o bot entrar em um servidor", on: true },
  { id: "error", label: "Erros críticos", on: true },
  { id: "weekly", label: "Resumo semanal por e-mail", on: false },
];

export function Settings() {
  const [prefix, setPrefix] = useState("!");
  const [color, setColor] = useState<(typeof swatches)[number]["id"]>("lime");
  const [n, setN] = useState(notifs);
  const sw = swatches.find((s) => s.id === color)!;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div className="grid gap-5">
        <Panel>
          <PanelHeader title="Geral" subtitle="O básico do seu bot" />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="text-xs text-muted-foreground">Prefixo</span>
              <input
                value={prefix}
                onChange={(e) => setPrefix(e.target.value.slice(0, 3))}
                className="rounded-xl border border-input bg-surface/70 px-3 py-2.5 font-mono text-sm text-foreground outline-none transition-colors focus:border-primary/50"
              />
            </label>
            <div className="grid gap-1.5">
              <span className="text-xs text-muted-foreground">Idioma</span>
              <Select defaultValue="pt">
                <SelectTrigger className="h-[42px] rounded-xl bg-surface/70">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">Português (Brasil)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Aparência" subtitle="Cor das mensagens do bot" />
          <div className="flex gap-3">
            {swatches.map((s) => (
              <button
                key={s.id}
                onClick={() => setColor(s.id)}
                className="relative h-11 w-11 rounded-xl transition-transform hover:scale-110"
                aria-label={s.id}
              >
                <span className={cn("absolute inset-1 rounded-lg", s.cls)} />
                {color === s.id && (
                  <motion.span
                    layoutId="swatch-ring"
                    className="absolute inset-0 rounded-xl ring-2 ring-foreground"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {color === s.id && (
                  <Check className="absolute inset-0 m-auto h-4 w-4 text-primary-foreground" />
                )}
              </button>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Notificações" />
          <ul className="divide-y divide-border">
            {n.map((x) => (
              <li key={x.id} className="flex items-center justify-between gap-4 py-3">
                <span className="text-sm text-foreground">{x.label}</span>
                <Switch checked={x.on} onCheckedChange={(v) => setN((p) => p.map((y) => (y.id === x.id ? { ...y, on: v } : y)))} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid content-start gap-5">
        <Panel>
          <PanelHeader title="Prévia" subtitle="Como o bot responde no chat" />
          <div className="rounded-xl bg-background/70 p-4">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-primary">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-foreground">Seu Bot</span>
                  <span className="rounded bg-info/20 px-1 text-[10px] font-semibold text-info">BOT</span>
                  <span className="text-xs text-muted-foreground">hoje às 22:33</span>
                </div>
                <motion.div
                  key={color}
                  initial={{ opacity: 0.4, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn("mt-2 rounded-lg border-l-4 bg-surface-2 p-3", sw.border)}
                >
                  <div className="text-sm font-semibold text-foreground">Bem-vindo(a)! 🎉</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Use <span className="font-mono text-foreground">{prefix || "!"}ajuda</span> para ver todos os
                    comandos disponíveis.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </Panel>

        <Panel className="border-destructive/25">
          <PanelHeader title="Zona de perigo" subtitle="Ações que não dá pra desfazer" />
          <button
            onClick={() => toast.error("Ação bloqueada na prévia")}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/40 px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <RotateCcw className="h-4 w-4" /> Resetar configurações
          </button>
        </Panel>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => toast.success("Configurações salvas!")}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          <Save className="h-4 w-4" /> Salvar alterações
        </motion.button>
      </div>
    </motion.div>
  );
}
