import { trpc } from "../lib/trpc";
import { Bell, CheckCheck, X, Info, CheckCircle, AlertTriangle } from "lucide-react";

interface NotificationPanelProps {
  onClose: () => void;
}

function getIcon(type: string) {
  switch (type) {
    case "success": return <CheckCircle size={16} color="#22c55e" />;
    case "warning": return <AlertTriangle size={16} color="#eab308" />;
    case "error": return <AlertTriangle size={16} color="#ef4444" />;
    default: return <Info size={16} color="#06b6d4" />;
  }
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "agora";
  if (diff < 3600) return `${Math.floor(diff / 60)}m atras`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atras`;
  return `${Math.floor(diff / 86400)}d atras`;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const notifQuery = trpc.notifications.list.useQuery();
  const utils = trpc.useUtils();

  const markReadMutation = trpc.notifications.markRead.useMutation({
    onSuccess: () => utils.notifications.list.invalidate(),
  });

  const markAllReadMutation = trpc.notifications.markAllRead.useMutation({
    onSuccess: () => utils.notifications.list.invalidate(),
  });

  const notifications = notifQuery.data ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notification-panel">
      <div className="notif-header">
        <h3><Bell size={18} /> Notificacoes {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}</h3>
        <div className="notif-actions">
          {unreadCount > 0 && (
            <button onClick={() => markAllReadMutation.mutate()} className="notif-mark-all" title="Marcar todas como lidas">
              <CheckCheck size={16} />
            </button>
          )}
          <button onClick={onClose} className="notif-close">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="notif-list">
        {notifications.length === 0 ? (
          <div className="notif-empty">Nenhuma notificacao</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`notif-item ${!n.read ? "notif-unread" : ""}`}
              onClick={() => !n.read && markReadMutation.mutate({ id: n.id })}
            >
              <div className="notif-icon">{getIcon(n.type)}</div>
              <div className="notif-content">
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                <span className="notif-time">{timeAgo(n.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
