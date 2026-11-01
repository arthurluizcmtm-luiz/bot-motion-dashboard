import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { MobileTabs, Sidebar, Topbar, type TabId } from "./nav";
import { Overview } from "./tabs/Overview";
import { Servers } from "./tabs/Servers";
import { Commands } from "./tabs/Commands";
import { Moderation } from "./tabs/Moderation";
import { Logs } from "./tabs/Logs";
import { Settings } from "./tabs/Settings";

const views: Record<TabId, () => React.JSX.Element> = {
  overview: Overview,
  servers: Servers,
  commands: Commands,
  moderation: Moderation,
  logs: Logs,
  settings: Settings,
};

export function Dashboard() {
  const [tab, setTab] = useState<TabId>("overview");
  const View = views[tab];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-primary/10 blur-[120px] animate-aurora" />
        <div className="absolute -right-40 top-1/3 h-[480px] w-[480px] rounded-full bg-info/10 blur-[120px] animate-aurora-slow" />
        <div className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-primary-glow/5 blur-[100px] animate-aurora" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      <div className="relative flex">
        <Sidebar tab={tab} onChange={setTab} />
        <main className="min-w-0 flex-1 px-4 pb-12 pt-4 sm:px-6 lg:px-10 lg:pt-8">
          <MobileTabs tab={tab} onChange={setTab} />
          <Topbar tab={tab} />
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <View />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
