// Mock data for the dashboard preview. Deterministic so SSR and client match.

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export type Range = "24h" | "7d" | "30d";

export function activitySeries(range: Range) {
  const rand = seeded(range === "24h" ? 7 : range === "7d" ? 19 : 42);
  const n = range === "24h" ? 24 : range === "7d" ? 7 : 30;
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const base = range === "24h" ? 1200 : range === "7d" ? 26000 : 24000;
  return Array.from({ length: n }, (_, i) => {
    const wave = Math.sin((i / n) * Math.PI * 2 - 1.2) * 0.35 + 1;
    const comandos = Math.round(base * wave * (0.75 + rand() * 0.5));
    const mensagens = Math.round(comandos * (1.6 + rand() * 0.6));
    const label =
      range === "24h" ? `${String(i).padStart(2, "0")}h` : range === "7d" ? days[i] : `${i + 1}`;
    return { label, comandos, mensagens };
  });
}

export function spark(seed: number, n = 16) {
  const rand = seeded(seed);
  let v = 50;
  return Array.from({ length: n }, () => {
    v = Math.max(10, Math.min(100, v + (rand() - 0.42) * 22));
    return v;
  });
}

export const topCommands = [
  { name: "/play", uses: 12840 },
  { name: "/rank", uses: 9311 },
  { name: "/ban", uses: 6120 },
  { name: "/daily", uses: 5402 },
  { name: "/meme", uses: 4188 },
  { name: "/ticket", uses: 2950 },
];

export type ServerItem = {
  id: string;
  name: string;
  members: number;
  online: number;
  premium: boolean;
  banner: string;
  active: boolean;
};

export const servers: ServerItem[] = [
  { id: "1", name: "Nebula Gaming", members: 48210, online: 12034, premium: true, banner: "banner-1", active: true },
  { id: "2", name: "Café dos Devs", members: 12890, online: 3021, premium: false, banner: "banner-2", active: true },
  { id: "3", name: "Arena Valorant BR", members: 86422, online: 20110, premium: true, banner: "banner-3", active: true },
  { id: "4", name: "Lofi & Chill", members: 5310, online: 980, premium: false, banner: "banner-5", active: false },
  { id: "5", name: "Clube do Anime", members: 33980, online: 7802, premium: true, banner: "banner-4", active: true },
  { id: "6", name: "Estúdio Pixel", members: 2210, online: 340, premium: false, banner: "banner-6", active: true },
  { id: "7", name: "Minecraft Brasil", members: 120440, online: 30551, premium: true, banner: "banner-1", active: true },
  { id: "8", name: "Bate-papo Geral", members: 890, online: 112, premium: false, banner: "banner-2", active: false },
  { id: "9", name: "Torre de Estudos", members: 7720, online: 1408, premium: false, banner: "banner-5", active: true },
];

export type Category = "Moderação" | "Música" | "Diversão" | "Utilidade" | "Economia";

export const commands: {
  name: string;
  desc: string;
  category: Category;
  uses: number;
  cooldown: string;
  enabled: boolean;
}[] = [
  { name: "ban", desc: "Bane um membro do servidor", category: "Moderação", uses: 6120, cooldown: "0s", enabled: true },
  { name: "mute", desc: "Silencia um membro por um tempo", category: "Moderação", uses: 4410, cooldown: "0s", enabled: true },
  { name: "clear", desc: "Apaga mensagens em massa", category: "Moderação", uses: 3888, cooldown: "5s", enabled: true },
  { name: "play", desc: "Toca uma música no canal de voz", category: "Música", uses: 12840, cooldown: "2s", enabled: true },
  { name: "queue", desc: "Mostra a fila de músicas", category: "Música", uses: 3302, cooldown: "2s", enabled: true },
  { name: "skip", desc: "Pula para a próxima música", category: "Música", uses: 5120, cooldown: "1s", enabled: true },
  { name: "meme", desc: "Envia um meme aleatório", category: "Diversão", uses: 4188, cooldown: "3s", enabled: true },
  { name: "8ball", desc: "Responde suas perguntas", category: "Diversão", uses: 1920, cooldown: "3s", enabled: false },
  { name: "rank", desc: "Mostra seu nível e XP", category: "Utilidade", uses: 9311, cooldown: "5s", enabled: true },
  { name: "ticket", desc: "Abre um ticket de suporte", category: "Utilidade", uses: 2950, cooldown: "30s", enabled: true },
  { name: "daily", desc: "Resgata sua recompensa diária", category: "Economia", uses: 5402, cooldown: "24h", enabled: true },
  { name: "loja", desc: "Abre a loja do servidor", category: "Economia", uses: 2104, cooldown: "5s", enabled: false },
];

export const modCases = [
  { id: 1284, user: "toxic_guy#2231", action: "Ban", mod: "AutoMod", reason: "Spam de links", time: "há 2 min" },
  { id: 1283, user: "luna.exe", action: "Mute", mod: "Rafa", reason: "Flood no chat", time: "há 14 min" },
  { id: 1282, user: "zezinho", action: "Aviso", mod: "AutoMod", reason: "Palavra bloqueada", time: "há 31 min" },
  { id: 1281, user: "player_one", action: "Kick", mod: "Bia", reason: "Conta suspeita", time: "há 1 h" },
  { id: 1280, user: "raid_bot_99", action: "Ban", mod: "AutoMod", reason: "Anti-raid", time: "há 2 h" },
  { id: 1279, user: "marcos_br", action: "Aviso", mod: "Leo", reason: "Fora do tópico", time: "há 3 h" },
] as const;

export const modWeek = [
  { day: "Seg", bans: 12, mutes: 30, avisos: 44 },
  { day: "Ter", bans: 8, mutes: 22, avisos: 51 },
  { day: "Qua", bans: 15, mutes: 35, avisos: 38 },
  { day: "Qui", bans: 6, mutes: 18, avisos: 29 },
  { day: "Sex", bans: 20, mutes: 41, avisos: 62 },
  { day: "Sáb", bans: 26, mutes: 48, avisos: 70 },
  { day: "Dom", bans: 18, mutes: 37, avisos: 55 },
];

export type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

export const logTemplates: { level: LogLevel; msg: string }[] = [
  { level: "INFO", msg: "Comando /play executado em Nebula Gaming" },
  { level: "INFO", msg: "Shard 4 heartbeat ok (38ms)" },
  { level: "DEBUG", msg: "Cache de membros atualizado: 1.284 servidores" },
  { level: "WARN", msg: "Rate limit próximo em /rank (45/50)" },
  { level: "INFO", msg: "Novo servidor adicionado: Torre de Estudos" },
  { level: "ERROR", msg: "Falha ao conectar no canal de voz (timeout 5000ms)" },
  { level: "INFO", msg: "AutoMod removeu 3 mensagens com links" },
  { level: "DEBUG", msg: "Gateway payload recebido: GUILD_MEMBER_ADD" },
  { level: "WARN", msg: "Uso de memória acima de 70%" },
  { level: "INFO", msg: "Backup do banco concluído em 1.2s" },
];
