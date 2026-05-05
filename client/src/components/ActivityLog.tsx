import { trpc } from "../lib/trpc";
import { Clock, Activity } from "lucide-react";

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "agora";
  if (diff < 3600) return `${Math.floor(diff / 60)}m atras`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atras`;
  return `${Math.floor(diff / 86400)}d atras`;
}

export default function ActivityLog() {
  const logsQuery = trpc.activity.list.useQuery();
  const logs = logsQuery.data ?? [];

  return (
    <div className="activity-log-container">
      <h2 className="activity-title">
        <Activity size={20} /> Historico de Atividades
      </h2>

      {logs.length === 0 ? (
        <div className="activity-empty">
          <Clock size={40} />
          <p>Nenhuma atividade registrada ainda.</p>
          <span>Suas acoes no painel serao registradas aqui.</span>
        </div>
      ) : (
        <div className="activity-timeline">
          {logs.map((log) => (
            <div key={log.id} className="activity-item">
              <div className="activity-dot" />
              <div className="activity-info">
                <strong>{log.action}</strong>
                <p>{log.details}</p>
                <span className="activity-time">
                  <Clock size={12} /> {timeAgo(log.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
