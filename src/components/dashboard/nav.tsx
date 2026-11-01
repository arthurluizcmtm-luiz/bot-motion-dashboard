import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  Bell,
  Bot,
  LayoutDashboard,
  Search,
  Server,
  Settings2,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LiveDot } from "./shared";

export const TABS = [
  { id: "overview", label: "Visão geral", icon: LayoutDashboard, hint: "Tudo que está rolando agora" },
  { id: "servers", label: "Servidores", icon: Server, hint: "Onde o bot está presente" },
  { id: "commands", label: "Comandos", icon: TerminalSquare, hint: "Ative, desative e acompanhe" },
  { id: "moderation", label: "Moderação", icon: ShieldCheck, hint: "AutoMod e casos recentes" },
  { id: "logs", label: "Logs ao vivo", icon: Activity, hint: "Tudo em tempo real" },
  { id: "settings", label: "Configurações", icon: Settings2, hint: "Deixe o bot do seu jeito" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

export function Sidebar({ tab, onChange }: { tab: TabId; onChange: (t: TabId) => void }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/70 px-4 py-6 backdrop-blur-xl lg:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-display text-base font-semibold leading-none text-foreground">
            Seu Bot
          </div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            painel
          </div>
        </div>
      </div>

      <div className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
        Menu
      </div>
      <nav className="flex flex-col gap-1">
        {TABS.map((t, i) => {
          const active = t.id === tab;
          const Icon = t.icon;
          return (
            <motion.button
              key={t.id}
              onClick={() => onChange(t.id)}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, type: "spring", stiffness: 300, damping: 26 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active && (
                <>
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl border border-primary/25 bg-primary/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                  <motion.span
                    layoutId="sidebar-bar"
                    className="absolute -left-4 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary shadow-glow"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                </>
              )}
              <span className="absolute inset-0 rounded-xl bg-accent/0 transition-colors group-hover:bg-accent/40" />
              <Icon
                className={cn(
                  "relative z-10 h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110",
                  active && "text-primary",
                )}
              />
              <span className="relative z-10">{t.label}</span>
              {t.id === "logs" && (
                <span className="relative z-10 ml-auto">
                  <LiveDot />
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative mt-auto overflow-hidden rounded-2xl border border-primary/20 p-4"
      >
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/25 blur-2xl animate-aurora" />
        <Sparkles className="relative h-5 w-5 text-primary animate-float" />
        <div className="relative mt-3 font-display text-sm font-semibold text-foreground">
          Plano Premium
        </div>
        <p className="relative mt-1 text-xs text-muted-foreground">
          Desbloqueie shards dedicados e música em alta qualidade.
        </p>
        <button className="relative mt-3 w-full rounded-lg bg-gradient-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]">
          Conhecer
        </button>
      </motion.div>
    </aside>
  );
}

export function MobileTabs({ tab, onChange }: { tab: TabId; onChange: (t: TabId) => void }) {
  return (
    <div className="sticky top-0 z-30 -mx-4 mb-4 overflow-x-auto border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl lg:hidden">
      <div className="flex w-max gap-1">
        {TABS.map((t) => {
          const active = t.id === tab;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={cn(
                "relative flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium",
                active ? "text-primary-foreground" : "text-muted-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="mobile-active"
                  className="absolute inset-0 rounded-xl bg-primary shadow-glow"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10 whitespace-nowrap">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Topbar({ tab }: { tab: TabId }) {
  const current = TABS.find((t) => t.id === tab)!;
  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span>Painel</span>
          <span className="text-border-strong">/</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-primary"
            >
              {current.label}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="relative h-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.h1
              key={tab}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="text-2xl font-bold text-foreground sm:text-3xl"
            >
              {current.label}
            </motion.h1>
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
            exit={{ opacity: 0 }}
            className="text-sm text-muted-foreground"
          >
            {current.hint}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2">
        <label className="group hidden items-center gap-2 rounded-xl border border-border bg-surface/70 px-3 py-2 text-sm text-muted-foreground transition-colors focus-within:border-primary/40 md:flex">
          <Search className="h-4 w-4" />
          <input
            placeholder="Buscar..."
            className="w-44 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
            ⌘K
          </kbd>
        </label>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface/70 text-muted-foreground transition-colors hover:text-foreground">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2.5 top-2.5">
            <LiveDot tone="destructive" />
          </span>
        </button>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface/70 py-1 pl-1 pr-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-signal font-display text-xs font-bold text-primary-foreground">
            VC
          </div>
          <div className="hidden text-left sm:block">
            <div className="text-xs font-semibold leading-none text-foreground">Você</div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">Dono</div>
          </div>
        </div>
      </div>
    </header>
  );
}
