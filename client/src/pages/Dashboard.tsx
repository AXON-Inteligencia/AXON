import { useState } from "react";
import { trpc } from "../lib/trpc";
import Sidebar from "../components/Sidebar";
import AppCards from "../components/AppCards";
import CreateAppModal from "../components/CreateAppModal";
import TransportPanel from "../components/TransportPanel";
import LinkShortener from "../components/LinkShortener";

interface DashboardProps {
  onLogout: () => void;
}

type ActiveView = "dashboard" | "playstore" | "transportadora" | "encurtador";

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShortener, setShowShortener] = useState(false);

  const utils = trpc.useUtils();
  const appsQuery = trpc.apps.list.useQuery();
  const deleteAppMutation = trpc.apps.delete.useMutation({
    onSuccess: () => utils.apps.list.invalidate(),
  });

  const handleNavClick = (view: ActiveView) => {
    if (view === "playstore") {
      setShowCreateModal(true);
      setShowShortener(false);
    } else if (view === "encurtador") {
      setShowShortener(true);
      setShowCreateModal(false);
    } else {
      setShowCreateModal(false);
      setShowShortener(false);
    }
    setActiveView(view);
  };

  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  const handleDeleteApp = (id: number) => {
    if (confirm("Deseja realmente deletar este app?")) {
      deleteAppMutation.mutate({ id });
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        activeView={activeView}
        onNavClick={handleNavClick}
        onLogout={onLogout}
      />

      <main className="dashboard-main">
        <div className="dashboard-bg" />

        <div className="dashboard-content">
          {activeView === "transportadora" ? (
            <TransportPanel />
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

        {showCreateModal && (
          <CreateAppModal onClose={() => setShowCreateModal(false)} />
        )}

        {showShortener && (
          <LinkShortener onClose={() => setShowShortener(false)} />
        )}
      </main>
    </div>
  );
}
