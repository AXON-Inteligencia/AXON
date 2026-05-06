import { useState } from "react";
import { trpc } from "../lib/trpc";
import { UserPlus, Trash2, Copy, Eye, EyeOff } from "lucide-react";

export default function UserManagement() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [createdInfo, setCreatedInfo] = useState<{ email: string; password: string } | null>(null);
  const [error, setError] = useState("");

  const utils = trpc.useUtils();
  const usersQuery = trpc.admin.listUsers.useQuery();
  const createMutation = trpc.admin.createUser.useMutation({
    onSuccess: () => {
      setCreatedInfo({ email, password });
      setName("");
      setEmail("");
      setPassword("");
      setError("");
      utils.admin.listUsers.invalidate();
    },
    onError: (err) => {
      setError(err.message);
    },
  });
  const deleteMutation = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      utils.admin.listUsers.invalidate();
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Preencha todos os campos");
      return;
    }
    setError("");
    createMutation.mutate({ name, email, password });
  };

  const handleDelete = (id: number, userName: string) => {
    if (confirm(`Deseja realmente deletar o usuario "${userName}"? Todos os dados dele serao removidos.`)) {
      deleteMutation.mutate({ id });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const users = usersQuery.data ?? [];

  return (
    <div className="user-management">
      <h2 className="section-title">Gerenciar Usuarios</h2>

      <div className="user-create-form">
        <h3>Criar Novo Login</h3>
        <form onSubmit={handleCreate}>
          <div className="form-row">
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do cliente"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="form-group">
              <label>Senha</label>
              <div className="password-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimo 6 caracteres"
                />
                <button type="button" className="toggle-pass" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-create-user" disabled={createMutation.isPending}>
            <UserPlus size={18} />
            {createMutation.isPending ? "Criando..." : "Criar Usuario"}
          </button>
        </form>
      </div>

      {createdInfo && (
        <div className="user-created-info">
          <h4>Usuario criado com sucesso!</h4>
          <p>Envie esses dados de acesso para o cliente:</p>
          <div className="credentials-box">
            <div className="credential-row">
              <span>URL:</span>
              <code>{window.location.origin}/login</code>
              <button onClick={() => copyToClipboard(`${window.location.origin}/login`)} title="Copiar">
                <Copy size={14} />
              </button>
            </div>
            <div className="credential-row">
              <span>Email:</span>
              <code>{createdInfo.email}</code>
              <button onClick={() => copyToClipboard(createdInfo.email)} title="Copiar">
                <Copy size={14} />
              </button>
            </div>
            <div className="credential-row">
              <span>Senha:</span>
              <code>{createdInfo.password}</code>
              <button onClick={() => copyToClipboard(createdInfo.password)} title="Copiar">
                <Copy size={14} />
              </button>
            </div>
            <button className="btn-copy-all" onClick={() => copyToClipboard(
              `Acesse: ${window.location.origin}/login\nEmail: ${createdInfo.email}\nSenha: ${createdInfo.password}`
            )}>
              <Copy size={16} /> Copiar Tudo
            </button>
          </div>
          <button className="btn-dismiss" onClick={() => setCreatedInfo(null)}>Fechar</button>
        </div>
      )}

      <div className="users-list">
        <h3>Usuarios Cadastrados ({users.length})</h3>
        <div className="users-table">
          <div className="users-header">
            <span>Nome</span>
            <span>Email</span>
            <span>Tipo</span>
            <span>Acao</span>
          </div>
          {users.map((user) => (
            <div key={user.id} className="user-row">
              <span>{user.name}</span>
              <span>{user.email}</span>
              <span className={`user-role ${user.role}`}>{user.role === "admin" ? "Admin" : "Cliente"}</span>
              <span>
                {user.role !== "admin" && (
                  <button
                    className="btn-delete-user"
                    onClick={() => handleDelete(user.id, user.name)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
