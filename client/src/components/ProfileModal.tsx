import { useState } from "react";
import { trpc } from "../lib/trpc";
import { User, Mail, Lock, Save, X } from "lucide-react";

interface ProfileModalProps {
  onClose: () => void;
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
  const meQuery = trpc.auth.me.useQuery();
  const utils = trpc.useUtils();

  const [name, setName] = useState(meQuery.data?.name ?? "");
  const [email, setEmail] = useState(meQuery.data?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateMutation = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      setMessage("Perfil atualizado com sucesso!");
      setError("");
      setCurrentPassword("");
      setNewPassword("");
      utils.auth.me.invalidate();
      utils.activity.list.invalidate();
      utils.notifications.list.invalidate();
    },
    onError: (err) => {
      setError(err.message || "Erro ao atualizar perfil");
      setMessage("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const data: { name?: string; email?: string; currentPassword?: string; newPassword?: string } = {};
    if (name !== meQuery.data?.name) data.name = name;
    if (email !== meQuery.data?.email) data.email = email;
    if (newPassword) {
      data.currentPassword = currentPassword;
      data.newPassword = newPassword;
    }

    if (Object.keys(data).length === 0) {
      setMessage("Nenhuma alteracao detectada");
      return;
    }

    updateMutation.mutate(data);
  };

  if (meQuery.isLoading) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <h2>Meu Perfil</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="profile-avatar">
          <div className="avatar-circle">
            {(meQuery.data?.name?.[0] ?? "U").toUpperCase()}
          </div>
          <span className="avatar-role">{meQuery.data?.role === "admin" ? "Administrador" : "Usuario"}</span>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-field">
            <label><User size={14} /> Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
            />
          </div>

          <div className="profile-field">
            <label><Mail size={14} /> E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>

          <div className="profile-divider">Alterar Senha</div>

          <div className="profile-field">
            <label><Lock size={14} /> Senha Atual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Digite a senha atual"
            />
          </div>

          <div className="profile-field">
            <label><Lock size={14} /> Nova Senha</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite a nova senha (min 6 caracteres)"
            />
          </div>

          {message && <div className="profile-success">{message}</div>}
          {error && <div className="profile-error">{error}</div>}

          <button type="submit" className="profile-save-btn" disabled={updateMutation.isPending}>
            <Save size={16} />
            {updateMutation.isPending ? "Salvando..." : "Salvar Alteracoes"}
          </button>
        </form>
      </div>
    </div>
  );
}
