import { trpc } from "../lib/trpc";
import { BarChart3, Users, AppWindow, Activity } from "lucide-react";

export default function StatsCards() {
  const statsQuery = trpc.stats.get.useQuery();
  const stats = statsQuery.data;

  const cards = [
    {
      icon: <AppWindow size={24} />,
      label: "Apps Criados",
      value: stats?.apps ?? 0,
      color: "#ff1e1e",
    },
    {
      icon: <Users size={24} />,
      label: "Clientes",
      value: stats?.clients ?? 0,
      color: "#06b6d4",
    },
    {
      icon: <Activity size={24} />,
      label: "Atividades",
      value: stats?.activities ?? 0,
      color: "#8b5cf6",
    },
    {
      icon: <BarChart3 size={24} />,
      label: "Sistema",
      value: "Online",
      color: "#22c55e",
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, i) => (
        <div key={i} className="stat-card-dash" style={{ borderColor: card.color }}>
          <div className="stat-card-icon" style={{ color: card.color }}>
            {card.icon}
          </div>
          <div className="stat-card-info">
            <span className="stat-card-value" style={{ color: card.color }}>
              {card.value}
            </span>
            <span className="stat-card-label">{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
