import { Shield, Zap, BarChart3, Headphones, Code, Bot, LayoutDashboard, Cloud, Search, Users, ArrowRight, ChevronRight, Monitor, Lock, MessageSquare, LineChart } from "lucide-react";
import MatrixRain from "../components/MatrixRain";

interface LandingPageProps {
  onGoToLogin: () => void;
}

export default function LandingPage({ onGoToLogin }: LandingPageProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-page">
      <MatrixRain />

      {/* Header */}
      <header className="landing-header">
        <nav className="landing-nav">
          <ul>
            <li><button onClick={() => scrollTo("hero")} className="nav-active">Inicio</button></li>
            <li><button onClick={() => scrollTo("sobre")}>Sobre</button></li>
            <li><button onClick={() => scrollTo("servicos")}>Servicos</button></li>
            <li><button onClick={() => scrollTo("paineis")}>Paineis</button></li>
            <li><button onClick={() => scrollTo("planos")}>Planos</button></li>
            <li><button onClick={() => scrollTo("contato")}>Contato</button></li>
          </ul>
        </nav>
        <button onClick={onGoToLogin} className="landing-cta-btn header-cta">
          <Monitor size={16} />
          Acessar Dashboard
        </button>
      </header>

      {/* Hero Section */}
      <section id="hero" className="landing-hero">
        <div className="hero-bg">
          <img src="/images/hacker-bg.jpg" alt="" className="hero-bg-img" />
          <div className="hero-overlay" />
        </div>

        <div className="hero-content">
          <p className="hero-subtitle">Tecnologia &middot; Estrategia &middot; Performance</p>
          <h1 className="hero-title">
            Solucoes<br />
            <span className="text-gradient-red">inteligentes</span><br />
            para resultados<br />
            <strong>extraordinarios</strong>
          </h1>
          <p className="hero-desc">
            Tecnologia, estrategia e performance pra transformar dados em poder.
          </p>
          <div className="hero-buttons">
            <button onClick={onGoToLogin} className="btn-primary">
              Acessar Dashboard <ArrowRight size={16} />
            </button>
            <button onClick={() => scrollTo("servicos")} className="btn-secondary">
              Conhecer Servicos <ChevronRight size={16} />
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <Users size={20} />
              <span className="hero-stat-value">+100</span>
              <span className="hero-stat-label">Clientes Ativos</span>
            </div>
            <div className="hero-stat">
              <Zap size={20} />
              <span className="hero-stat-value">+98%</span>
              <span className="hero-stat-label">Performance</span>
            </div>
            <div className="hero-stat">
              <Shield size={20} />
              <span className="hero-stat-value">100%</span>
              <span className="hero-stat-label">Seguranca</span>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="landing-section diferenciais-section">
        <p className="section-label">Nossos Diferenciais</p>
        <h2 className="section-title">Tecnologia. Estrategia. <span className="text-gradient-red">Resultados.</span></h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Shield size={24} /></div>
            <h3>Seguranca Avancada</h3>
            <p>Protecao de nivel militar pra seus dados.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Zap size={24} /></div>
            <h3>Alta Performance</h3>
            <p>Sistemas otimizados pra maxima performance.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><BarChart3 size={24} /></div>
            <h3>Dados Inteligentes</h3>
            <p>Dashboards completos pra decisoes estrategicas.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Headphones size={24} /></div>
            <h3>Suporte Premium</h3>
            <p>Atendimento especializado sempre que precisar.</p>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="landing-section sobre-section">
        <p className="section-label">Sobre nos</p>
        <h2 className="section-title">Quem e a <span className="text-gradient-gold">CONEXAO GANGSTA</span></h2>
        <div className="sobre-content">
          <div className="sobre-text">
            <h3>Tecnologia que transforma dados em poder.</h3>
            <p>
              Servico personalizado e unico: sistemas robustos, dashboards inteligentes e 
              protecao de nivel militar pra quem opera no limite.
            </p>
            <p>
              Nao criamos tecnologia "comum". Construimos infraestrutura critica pra quem 
              precisa de performance sem concessoes.
            </p>
            <p>
              Nossos clientes nao tem um usuario, tem uma chave para ferramentas totalmente 
              bem feitas e funcionais, adaptadas pra trabalhar sobre vapor!
            </p>
          </div>
          <div className="sobre-cards">
            <div className="sobre-card">
              <Lock size={20} />
              <h4>Especializacao</h4>
              <p>Equipe dedicada em ciberseguranca, automacao e analise de dados em alta escala.</p>
            </div>
            <div className="sobre-card">
              <Users size={20} />
              <h4>Confianca</h4>
              <p>+100 usuarios ativos confiam na nossa stack diariamente.</p>
            </div>
            <div className="sobre-card">
              <Headphones size={20} />
              <h4>Compromisso</h4>
              <p>Suporte humano premium 24h. Sem chatbot generico, sem ticket frio.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Servicos */}
      <section id="servicos" className="landing-section servicos-section">
        <p className="section-label">Nossos servicos</p>
        <h2 className="section-title">O que entregamos</h2>
        <div className="servicos-grid">
          {[
            { icon: <Code size={24} />, num: "01", title: "Sistemas Sob Demanda", desc: "Aplicacoes web e desktop construidas do zero, sob medida pra sua operacao. Stack moderna, codigo limpo, performance auditada." },
            { icon: <Shield size={24} />, num: "02", title: "Ciberseguranca", desc: "Hardening de servidores, criptografia ponta-a-ponta, monitoramento ativo. Protecao que nao falha quando o dado e critico." },
            { icon: <Bot size={24} />, num: "03", title: "Automacao Inteligente", desc: "Bots e fluxos automatizados pra eliminar trabalho repetitivo. Integracao com WhatsApp, Telegram, CRM e APIs externas." },
            { icon: <BarChart3 size={24} />, num: "04", title: "Dashboards & BI", desc: "Paineis de controle com dados em tempo real. KPIs visuais, relatorios estrategicos, exportacao inteligente." },
            { icon: <Cloud size={24} />, num: "05", title: "Infraestrutura Cloud", desc: "Provisionamento, deploy continuo, escalabilidade horizontal. Infraestrutura preparada pra crescer." },
            { icon: <Search size={24} />, num: "06", title: "Consultoria Tecnica", desc: "Auditoria de codigo, revisao de arquitetura, mentoria de equipe. Visao externa de quem ja passou por isso." },
          ].map((s) => (
            <div key={s.num} className="servico-card">
              <span className="servico-num">{s.num}</span>
              <div className="servico-icon">{s.icon}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Paineis */}
      <section id="paineis" className="landing-section paineis-section">
        <p className="section-label">Nossos paineis</p>
        <h2 className="section-title">Solucoes prontas pra usar</h2>
        <div className="paineis-grid">
          {[
            { icon: <LayoutDashboard size={24} />, title: "Painel Multi App", desc: "Hub central pra gerenciar multiplas aplicacoes com login unificado, controle de acesso por role e logs detalhados." },
            { icon: <MessageSquare size={24} />, title: "Painel WhatsApp/CRM", desc: "Integracao completa com WhatsApp Business, qualificacao automatica por IA, transferencia inteligente pro consultor." },
            { icon: <Search size={24} />, title: "Painel Web Scraping", desc: "Coleta automatica de dados publicos, monitoramento de concorrencia e alertas em tempo real." },
            { icon: <LineChart size={24} />, title: "Painel Analytics", desc: "Metricas de produto, funis de conversao, retencao de usuarios. Dashboards customizaveis com export." },
          ].map((p) => (
            <div key={p.title} className="painel-card">
              <div className="painel-icon">{p.icon}</div>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="landing-section planos-section">
        <p className="section-label">Nossos planos</p>
        <h2 className="section-title">Escolha o seu nivel</h2>
        <div className="planos-grid">
          <div className="plano-card">
            <h3>Starter</h3>
            <div className="plano-price">R$--<span>/mes</span></div>
            <p className="plano-billing">Cobranca mensal</p>
            <ul>
              <li>Acesso a 1 painel</li>
              <li>Ate 500 leads/mes</li>
              <li>Suporte por e-mail</li>
              <li>Atualizacoes de seguranca</li>
            </ul>
            <button className="btn-outline">Comecar agora</button>
          </div>
          <div className="plano-card plano-featured">
            <h3>Pro</h3>
            <div className="plano-price">R$300<span>/mes</span></div>
            <p className="plano-billing">Cobranca mensal</p>
            <ul>
              <li>Acesso a todos os paineis</li>
              <li>Suporte prioritario 24h</li>
              <li>Customizacoes inclusas</li>
              <li>Onboarding com especialista</li>
            </ul>
            <button className="btn-primary">Assinar Pro</button>
          </div>
          <div className="plano-card">
            <h3>Enterprise</h3>
            <div className="plano-price">--<span></span></div>
            <p className="plano-billing">Contrato customizado</p>
            <ul>
              <li>Tudo do plano Pro</li>
              <li>Infraestrutura dedicada</li>
              <li>Gerente de conta exclusivo</li>
              <li>SLA contratual</li>
              <li>Desenvolvimento sob demanda</li>
            </ul>
            <button className="btn-outline">Falar com consultor</button>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="landing-section contato-section">
        <p className="section-label">Fale com a gente</p>
        <h2 className="section-title">Vamos conversar</h2>
        <div className="contato-content">
          <h3>Entre em contato direto</h3>
          <p>Atendimento humano, sem chatbot. Resposta em ate 2 horas em horario comercial.</p>
          <div className="contato-buttons">
            <a href="#" className="btn-primary">
              <MessageSquare size={16} /> Telegram
            </a>
            <button onClick={onGoToLogin} className="btn-secondary">
              Acessar Dashboard <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2024 CONEXAO GANGSTA. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
