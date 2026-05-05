import { useState } from "react";
import { trpc } from "../lib/trpc";
import Sidebar from "../components/Sidebar";
import AppCards from "../components/AppCards";
import CreateAppModal from "../components/CreateAppModal";
import TransportPanel from "../components/TransportPanel";
import LinkShortener from "../components/LinkShortener";
import MatrixRain from "../components/MatrixRain";
import StatsCards from "../components/StatsCards";
import ProfileModal from "../components/ProfileModal";
import NotificationPanel from "../components/NotificationPanel";
import ActivityLog from "../components/ActivityLog";
import UserManagement from "../components/UserManagement";

interface DashboardProps {
  onLogout: () => void;
}

type ActiveView = "dashboard" | "playstore" | "transportadora" | "encurtador" | "perfil" | "atividades" | "usuarios";

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShortener, setShowShortener] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("theme") as "dark" | "light") || "dark";
  });

  const utils = trpc.useUtils();
  const appsQuery = trpc.apps.list.useQuery();
  const deleteAppMutation = trpc.apps.delete.useMutation({
    onSuccess: () => {
      utils.apps.list.invalidate();
      utils.stats.get.invalidate();
      utils.activity.list.invalidate();
      utils.notifications.list.invalidate();
    },
  });

  const handleNavClick = (view: ActiveView) => {
    if (view === "playstore") {
      setShowCreateModal(true);
      setShowShortener(false);
    } else if (view === "encurtador") {
      setShowShortener(true);
      setShowCreateModal(false);
    } else if (view === "perfil") {
      setShowProfile(true);
      setShowCreateModal(false);
      setShowShortener(false);
    } else {
      setShowCreateModal(false);
      setShowShortener(false);
    }
    setActiveView(view);
    setShowNotifications(false);
  };

  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  const handleDeleteApp = (id: number) => {
    if (confirm("Deseja realmente deletar este app?")) {
      deleteAppMutation.mutate({ id });
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className={`dashboard-layout ${theme === "light" ? "theme-light" : ""}`}>
      <Sidebar
        activeView={activeView}
        onNavClick={handleNavClick}
        onLogout={onLogout}
        onToggleNotifications={() => setShowNotifications(!showNotifications)}
        onToggleTheme={toggleTheme}
        theme={theme}
      />

      <main className="dashboard-main">
        <div className="dashboard-bg" />
        <MatrixRain />

        <div className="dashboard-content">
          {activeView === "transportadora" ? (
            <TransportPanel />
          ) : activeView === "atividades" ? (
            <ActivityLog />
          ) : activeView === "usuarios" ? (
            <UserManagement />
          ) : (
            <>
              <AppCards
                apps={appsQuery.data ?? []}
                onDelete={handleDeleteApp}
                onCreateNew={handleCreateNew}
              />

              <div className="logo-container">
                <div className="logo-wings" />
                <h1 className="logo-text">
                  CONEXAO
                  <br />
                  GANGSTA
                </h1>
              </div>

            </>
          )}
        </div>

        <div className="stats-footer">
          <StatsCards />
        </div>

        {showCreateModal && (
          <CreateAppModal onClose={() => setShowCreateModal(false)} />
        )}

        {showShortener && (
          <LinkShortener onClose={() => setShowShortener(false)} />
        )}

        {showProfile && (
          <ProfileModal onClose={() => { setShowProfile(false); setActiveView("dashboard"); }} />
        )}

        {showNotifications && (
          <NotificationPanel onClose={() => setShowNotifications(false)} />
        )}
      </main>
    </div>
  );
}
