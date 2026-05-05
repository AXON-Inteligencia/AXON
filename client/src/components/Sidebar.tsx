import { trpc } from "../lib/trpc";
import { Bell } from "lucide-react";

interface SidebarProps {
  activeView: string;
  onNavClick: (view: "dashboard" | "playstore" | "transportadora" | "encurtador" | "perfil" | "atividades") => void;
  onLogout: () => void;
  onToggleNotifications: () => void;
  onToggleTheme: () => void;
  theme: "dark" | "light";
}

const menuItems = [
  { id: "dashboard" as const, label: "Dashboard" },
  { id: "playstore" as const, label: "Criar/Editar Play store" },
  { id: "transportadora" as const, label: "Painel Transportadora" },
  { id: "encurtador" as const, label: "Encurtador de link" },
  { id: "atividades" as const, label: "Historico de Atividades" },
  { id: "perfil" as const, label: "Meu Perfil" },
];

export default function Sidebar({ activeView, onNavClick, onLogout, onToggleNotifications, onToggleTheme, theme }: SidebarProps) {
  const notifQuery = trpc.notifications.list.useQuery();
  const unreadCount = (notifQuery.data ?? []).filter((n) => !n.read).length;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <a
            key={item.id}
            href="#"
            className={`sidebar-link ${activeView === item.id ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              onNavClick(item.id);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button className="sidebar-icon-btn" onClick={onToggleNotifications} title="Notificacoes">
          <Bell size={18} />
          {unreadCount > 0 && <span className="sidebar-badge">{unreadCount}</span>}
        </button>
        <button className="sidebar-icon-btn theme-toggle-btn" onClick={onToggleTheme} title={theme === "dark" ? "Modo Claro" : "Modo Escuro"}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <a
          href="#"
          className="sidebar-logout"
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }}
        >
          Sair
        </a>
      </div>
    </aside>
  );
}
