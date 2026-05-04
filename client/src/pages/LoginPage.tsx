import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";

interface LoginPageProps {
  onLogin: (token: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      onLogin(data.token);
    },
    onError: (err) => {
      setError(err.message || "Email ou senha incorretos");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="login-page">
      <div className="login-bg" />

      <div className="login-stats-left">
        <div className="stat-card">
          <div className="stat-icon">&#128101;</div>
          <div className="stat-value neon-green">+100</div>
          <div className="stat-label">Clientes satisfeitos</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">PERFORMANCE</div>
          <div className="stat-gauge">
            <svg viewBox="0 0 120 120" className="gauge-svg">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#1a1a2e" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#ff1e1e"
                strokeWidth="10"
                strokeDasharray="290 314"
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="55" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="bold">
                98%
              </text>
              <text x="60" y="75" textAnchor="middle" fill="#888" fontSize="10">
                Performance Total
              </text>
            </svg>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-title">SEGURANCA</div>
          <div className="stat-row">
            <span className="shield-icon">&#128737;</span>
            <span className="stat-value neon-green">100%</span>
          </div>
          <div className="stat-label">Sistema Protegido</div>
        </div>
      </div>

      <div className="login-stats-right">
        <div className="stat-card">
          <div className="stat-title">ATIVIDADE GLOBAL</div>
          <div className="world-map-placeholder" />
        </div>
        <div className="stat-card">
          <div className="stat-title">ANALISE DE DADOS</div>
          <div className="stat-value neon-red">7.842.271</div>
          <div className="stat-label">EVENTOS</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">SISTEMA</div>
          <div className="stat-value neon-green blink">ONLINE</div>
          <div className="stat-label">Status do Servidor</div>
        </div>
      </div>

      <div className="login-container">
        <div className="login-wings" />
        <div className="login-box">
          <div className="login-header">
            <span className="bracket">[ </span>
            <span className="header-label">ACESSO RESTRITO</span>
            <span className="bracket"> ]</span>
          </div>
          <h1 className="login-title">LOGIN</h1>
          <p className="login-subtitle">Acesse seu Painel Administrativo</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">E-MAIL</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">SENHA</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="........"
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "ENTRANDO..." : "ENTRAR"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="login-divider">
            <span>SUPORTE</span>
          </div>
          <p className="login-support">
            Contato com administrador &rarr;{" "}
            <a href="#" className="support-link">
              @ConexaoGangsta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
