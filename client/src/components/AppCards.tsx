import type { App } from "@shared/schema";
import { X, Plus } from "lucide-react";

interface AppCardsProps {
  apps: App[];
  onDelete: (id: number) => void;
  onCreateNew: () => void;
}

export default function AppCards({ apps, onDelete, onCreateNew }: AppCardsProps) {
  return (
    <div className="app-cards-container">
      {apps.map((app) => (
        <div key={app.id} className="app-card-wrapper">
          <button
            className="app-delete-btn"
            onClick={() => onDelete(app.id)}
            title="Deletar"
          >
            <X size={12} />
          </button>
          <div className="app-card">
            {app.logoUrl ? (
              <img
                src={app.logoUrl}
                alt={app.name}
                className="app-logo"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%231e3a8a' width='100' height='100' rx='50'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='white' font-size='40'%3E%3F%3C/text%3E%3C/svg%3E";
                }}
              />
            ) : (
              <div className="app-logo-placeholder">
                {app.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <a
            href={`/playstore/${app.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="app-open-link"
          >
            Abrir Site
          </a>
        </div>
      ))}

      <div className="app-card-wrapper">
        <div className="app-card create-new" onClick={onCreateNew}>
          <Plus size={32} />
          <span className="create-label">Criar Novo</span>
        </div>
      </div>
    </div>
  );
}
