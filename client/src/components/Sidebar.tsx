interface SidebarProps {
  activeView: string;
  onNavClick: (view: "dashboard" | "playstore" | "transportadora" | "encurtador") => void;
  onLogout: () => void;
}

const menuItems = [
  { id: "dashboard" as const, label: "Dashboard" },
  { id: "playstore" as const, label: "Criar/Editar Play store" },
  { id: "transportadora" as const, label: "Painel Transportadora" },
  { id: "encurtador" as const, label: "Encurtador de link" },
];

export default function Sidebar({ activeView, onNavClick, onLogout }: SidebarProps) {
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
    </aside>
  );
}
