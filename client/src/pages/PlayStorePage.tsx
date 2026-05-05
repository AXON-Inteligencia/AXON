import { useEffect, useState } from "react";
import { trpc } from "../lib/trpc";

interface PlayStorePageProps {
  appId: number;
}

export default function PlayStorePage({ appId }: PlayStorePageProps) {
  const appQuery = trpc.apps.getById.useQuery({ id: appId });
  const [currentImage, setCurrentImage] = useState(0);

  const app = appQuery.data;

  useEffect(() => {
    if (app) {
      document.title = `${app.name} Google Play Store`;
    }
  }, [app]);

  if (appQuery.isLoading) {
    return (
      <div className="playstore-loading">
        <div className="playstore-spinner" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="playstore-loading">
        <p>App nao encontrado.</p>
      </div>
    );
  }

  const images = app.images ?? [];

  const handleInstall = () => {
    if (app.apkLink) {
      window.location.href = app.apkLink;
    }
  };

  const prevImage = () => {
    setCurrentImage((p) => (p > 0 ? p - 1 : images.length - 1));
  };

  const nextImage = () => {
    setCurrentImage((p) => (p < images.length - 1 ? p + 1 : 0));
  };

  return (
    <div className="playstore-page">
      {/* Header */}
      <header className="ps-header">
        <div className="ps-header-inner">
          <img
            src="https://www.gstatic.com/android/market_images/web/play_prism_hlock_2x.png"
            alt="Google Play"
            className="ps-logo"
          />
          <nav className="ps-nav">
            <a className="ps-nav-item ps-nav-active">Jogos</a>
            <a className="ps-nav-item">Apps</a>
            <a className="ps-nav-item">Filmes</a>
            <a className="ps-nav-item">Livros</a>
            <a className="ps-nav-item">Criancas</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="ps-content">
        <div className="ps-main">
          {/* App Info */}
          <div className="ps-app-header">
            <img
              src={app.logoUrl}
              alt={app.name}
              className="ps-app-icon"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%234285f4' width='100' height='100' rx='20'/%3E%3Ctext x='50' y='60' text-anchor='middle' fill='white' font-size='40'%3EA%3C/text%3E%3C/svg%3E";
              }}
            />
            <div className="ps-app-info">
              <h1 className="ps-app-name">{app.name}</h1>
              <p className="ps-app-developer">
                {app.shortDescription || app.name}
              </p>
              <p className="ps-app-badges">
                Contem anuncios · Compras no app
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="ps-stats">
            <div className="ps-stat">
              <div className="ps-stat-value">4,8 ★</div>
              <div className="ps-stat-label">4,9 mi avaliacoes</div>
            </div>
            <div className="ps-stat-divider" />
            <div className="ps-stat">
              <div className="ps-stat-value">12 mi+</div>
              <div className="ps-stat-label">downloads</div>
            </div>
            <div className="ps-stat-divider" />
            <div className="ps-stat">
              <div className="ps-stat-value">
                <span className="ps-rating-badge">18</span>
              </div>
              <div className="ps-stat-label">Classificacao</div>
            </div>
          </div>

          {/* Install Button */}
          <button className="ps-install-btn" onClick={handleInstall}>
            Instalar
          </button>

          <div className="ps-share-row">
            <span>↗ Compartilhar</span>
            <span>♡ Adicionar a lista de desejos</span>
          </div>

          <p className="ps-available">
            Este app esta disponivel para seu dispositivo
          </p>

          {/* Screenshots */}
          {images.length > 0 && (
            <div className="ps-screenshots">
              <button className="ps-carousel-btn ps-carousel-prev" onClick={prevImage}>
                ‹
              </button>
              <div className="ps-screenshot-track">
                {images.map((img: string, i: number) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Screenshot ${i + 1}`}
                    className={`ps-screenshot ${i === currentImage ? "active" : ""}`}
                  />
                ))}
              </div>
              <button className="ps-carousel-btn ps-carousel-next" onClick={nextImage}>
                ›
              </button>
            </div>
          )}

          {images.length === 0 && (
            <div className="ps-no-images">Nenhuma imagem disponivel.</div>
          )}

          {/* About */}
          <div className="ps-about">
            <h2 className="ps-section-title">Sobre este app</h2>
            <p className="ps-about-text">
              {app.aboutApp || "Sem descricao disponivel."}
            </p>
          </div>

          {/* Data Safety */}
          <div className="ps-safety">
            <h2 className="ps-section-title">Seguranca dos dados</h2>
            <p className="ps-safety-intro">
              Sua seguranca comeca quando voce entende como os desenvolvedores
              coletam e compartilham seus dados. As praticas de seguranca e
              privacidade de dados podem variar de acordo com o uso, a regiao e a
              idade. O desenvolvedor forneceu as informacoes a seguir, que podem
              ser atualizadas ao longo do tempo.
            </p>
            <div className="ps-safety-items">
              <div className="ps-safety-item">
                <span className="ps-safety-icon">🔒</span>
                <span>Os dados nao sao compartilhados com terceiros</span>
              </div>
              <div className="ps-safety-item">
                <span className="ps-safety-icon">📊</span>
                <span>
                  Este app pode coletar estes tipos de dados: Local, Informacoes
                  pessoais e mais 11
                </span>
              </div>
              <div className="ps-safety-item">
                <span className="ps-safety-icon">🔐</span>
                <span>Os dados sao criptografados em transito</span>
              </div>
              <div className="ps-safety-item">
                <span className="ps-safety-icon">🗑️</span>
                <span>Voce pode solicitar a exclusao dos dados</span>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="ps-reviews">
            <h2 className="ps-section-title">Avaliacoes</h2>
            <div className="ps-rating-summary">
              <span className="ps-rating-big">4,8</span>
              <span className="ps-rating-stars">★★★★★</span>
              <span className="ps-rating-count">4,9 mi avaliacoes</span>
            </div>

            <div className="ps-review">
              <div className="ps-review-header">
                <div className="ps-review-avatar">U</div>
                <div>
                  <div className="ps-review-name">Usuario</div>
                  <div className="ps-review-stars">★★★★★</div>
                </div>
              </div>
              <p className="ps-review-text">
                Estou gostando muito desta atualizacao! O aplicativo esta mais rapido,
                estavel e seguro. As correcoes de bugs realmente melhoraram a
                experiencia, e a navegacao esta muito mais fluida. Sinto que tudo
                funciona de forma mais eficiente e confiavel agora. Recomendo a todos
                que atualizem para aproveitar essas melhorias!
              </p>
              <p className="ps-review-helpful">
                Essa avaliacao foi marcada como util por 552 pessoas
              </p>
            </div>

            <div className="ps-review">
              <div className="ps-review-header">
                <div className="ps-review-avatar">U</div>
                <div>
                  <div className="ps-review-name">Usuario</div>
                  <div className="ps-review-stars">★★★☆☆</div>
                </div>
              </div>
              <p className="ps-review-text">
                O aplicativo ainda apresenta alguns travamentos e lentidao em certas
                telas. Sinto que poderia estar mais estavel e confiavel, e a
                experiencia nao e tao boa quanto esperava. Espero que as proximas
                atualizacoes corrijam esses pontos.
              </p>
              <p className="ps-review-helpful">
                Essa avaliacao foi marcada como util por 33 pessoas
              </p>
            </div>

            <div className="ps-review">
              <div className="ps-review-header">
                <div className="ps-review-avatar">U</div>
                <div>
                  <div className="ps-review-name">Usuario</div>
                  <div className="ps-review-stars">★★★★☆</div>
                </div>
              </div>
              <p className="ps-review-text">
                A atualizacao trouxe algumas melhorias perceptiveis, como maior
                estabilidade e correcoes de pequenos bugs. No entanto, ainda notei
                travamentos ocasionais e lentidao em certas funcoes. Espero que
                futuras atualizacoes tornem o aplicativo ainda mais confiavel.
              </p>
              <p className="ps-review-helpful">
                Essa avaliacao foi marcada como util por 24 pessoas
              </p>
            </div>
          </div>

          {/* What's New */}
          <div className="ps-whats-new">
            <h2 className="ps-section-title">Novidades</h2>
            <p className="ps-about-text">
              Esta atualizacao traz melhorias de desempenho, correcoes de bugs e
              aprimoramentos na seguranca. O aplicativo agora esta mais rapido e
              estavel. Foram feitas otimizacoes para reduzir falhas e travamentos.
              A experiencia do usuario foi aprimorada em todas as telas. Atualize
              para aproveitar todos os recursos e a seguranca mais recente.
            </p>
          </div>

          {/* Similar Apps */}
          <div className="ps-similar">
            <h2 className="ps-section-title">Apps semelhantes</h2>
            <div className="ps-similar-grid">
              {[
                { name: "WhatsApp Business", rating: "4,4", icon: "💬" },
                { name: "Pinterest", rating: "4,6", icon: "📌" },
                { name: "ChatGPT", rating: "4,8", icon: "🤖" },
                { name: "Instagram", rating: "4,3", icon: "📷" },
                { name: "WhatsApp Messenger", rating: "4,2", icon: "📱" },
              ].map((similar) => (
                <div key={similar.name} className="ps-similar-app">
                  <div className="ps-similar-icon">{similar.icon}</div>
                  <div className="ps-similar-name">{similar.name}</div>
                  <div className="ps-similar-rating">★ {similar.rating}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="ps-footer">
        <p>Google Play | Termos de Servico | Privacidade</p>
      </footer>
    </div>
  );
}
