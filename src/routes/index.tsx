import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel do Bot — Visão geral" },
      {
        name: "description",
        content: "Painel de controle do bot: servidores, comandos, moderação e logs em tempo real.",
      },
      { property: "og:title", content: "Painel do Bot — Visão geral" },
      {
        property: "og:description",
        content: "Painel de controle do bot: servidores, comandos, moderação e logs em tempo real.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});
