import { useEffect, useState } from "react";
import { trpc } from "../lib/trpc";

interface PlayStorePageProps {
  appId: number;
}

const SIMILAR_APPS = [
  { name: "WhatsApp Business", developer: "WhatsApp LLC", rating: "4,4", icon: "/playstore-assets/whatsapp-business.webp" },
  { name: "Pinterest", developer: "Pinterest", rating: "4,6", icon: "/playstore-assets/pinterest.webp" },
  { name: "ChatGPT", developer: "OpenAI", rating: "4,8", icon: "/playstore-assets/chatgpt.webp" },
  { name: "Instagram", developer: "Instagram", rating: "4,5", icon: "/playstore-assets/instagram.webp" },
  { name: "WhatsApp Messenger", developer: "WhatsApp LLC", rating: "4,5", icon: "/playstore-assets/whatsapp.webp" },
  { name: "Grok - Assistente de IA", developer: "xAI", rating: "4,9", icon: "/playstore-assets/grok.webp" },
];

const REVIEWS = [
  {
    name: "Ryan Alves",
    avatar: "/playstore-assets/reviewer1.webp",
    rating: 3,
    date: "13 de abril de 2025",
    text: "Estou gostando muito desta atualização! O aplicativo está mais rápido, estável e seguro. As correções de bugs realmente melhoraram a experiência, e a navegação está muito mais fluida. Sinto que tudo funciona de forma mais eficiente e confiável agora. Recomendo a todos que atualizem para aproveitar essas melhorias!",
    helpful: 552,
  },
  {
    name: "Thiago Jesus",
    avatar: "/playstore-assets/reviewer2.webp",
    rating: 1,
    date: "4 de setembro de 2025",
    text: "O aplicativo ainda apresenta alguns travamentos e lentidão em certas telas. Sinto que poderia estar mais estável e confiável, e a experiência não é tão boa quanto esperava. Espero que as próximas atualizações corrijam esses pontos.",
    helpful: 33,
  },
  {
    name: "Tainá Sanchez",
    avatar: "/playstore-assets/reviewer3.webp",
    rating: 2,
    date: "31 de agosto de 2025",
    text: "A atualização trouxe algumas melhorias perceptíveis, como maior estabilidade e correções de pequenos bugs. No entanto, ainda notei travamentos ocasionais e lentidão em certas funções. Espero que futuras atualizações tornem o aplicativo ainda mais confiável.",
    helpful: 24,
  },
];

function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span className="gp-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= rating ? "#e8710a" : "#dadce0"}>
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </span>
  );
}

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="gp-rating-bar-row">
      <span className="gp-rating-bar-label">{label}</span>
      <div className="gp-rating-bar-track">
        <div className="gp-rating-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function PlayStorePage({ appId }: PlayStorePageProps) {
  const appQuery = trpc.apps.getById.useQuery({ id: appId });
  const [currentImage, setCurrentImage] = useState(0);
  const [installState, setInstallState] = useState<'idle' | 'installing' | 'installed'>('idle');

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
        <p>App não encontrado.</p>
      </div>
    );
  }

  const images = app.images ?? [];
  const totalRatings = 11019831;
  const ratingCounts = [9820078, 580063, 203592, 88502, 327596];

  const handleInstall = () => {
    if (installState !== 'idle') return;
    setInstallState('installing');

    if (app.apkLink) {
      const a = document.createElement('a');
      a.href = app.apkLink;
      a.download = `${app.name.replace(/\s+/g, '_')}.apk`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    setTimeout(() => {
      setInstallState('installed');
    }, 5000);
  };

  const prevImage = () => {
    setCurrentImage((p) => (p > 0 ? p - 1 : images.length - 1));
  };

  const nextImage = () => {
    setCurrentImage((p) => (p < images.length - 1 ? p + 1 : 0));
  };

  return (
    <div className="gp-page">
      {/* Google Play Header */}
      <header className="gp-header">
        <nav className="gp-header-nav">
          <a className="gp-logo-link" href="https://play.google.com/store/games">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 24" width="110" height="24">
              <path fill="#5f6368" d="M6.635 7.22c-.455.04-.9.267-1.2.567-.578.578-.89 1.378-.845 2.178v4.4c-.045.8.267 1.6.845 2.178.3.3.756.534 1.2.578.534.044 1.023-.134 1.423-.49.4-.355.623-.844.623-1.378 0-.534-.223-1.023-.623-1.378a1.757 1.757 0 0 0-1.423-.49c.044-.134.044-.312.044-.49V8.508c0-.178 0-.356-.044-.49a1.8 1.8 0 0 0 1.423-.489c.4-.356.623-.845.623-1.378 0-.534-.223-1.023-.623-1.378-.4-.4-.889-.6-1.423-.534z"/>
              <path fill="#EA4335" d="M3.95 14.367c0 .8-.267 1.6-.845 2.178C2.55 17.1 1.75 17.412.95 17.367H.905v-2.09H.95c.356.046.712-.088.978-.355.223-.267.356-.578.312-.934V8.553c-.044-.356.09-.667.312-.934.267-.267.623-.4.978-.356h.046V5.175H.95C1.75 5.13 2.55 5.442 3.106 6c.578.578.845 1.378.845 2.178z"/>
              <path fill="#4285F4" d="M6.635 5.175v2.089c-.355-.045-.712.09-.978.356-.222.267-.355.578-.31.934v4.4c-.046.357.088.668.31.935.267.267.623.4.978.356v2.09c-.8.044-1.6-.268-2.178-.846-.578-.578-.845-1.378-.845-2.178V8.197c0-.8.267-1.6.845-2.178.578-.623 1.378-.89 2.178-.845z"/>
              <path fill="#34A853" d="M7.88 7.264c.045.534-.134 1.023-.49 1.378-.355.4-.844.623-1.378.623.044-.134.044-.312.044-.49V8.508c0-.178 0-.356-.044-.49.534-.044 1.023.134 1.378.49.045 0 .356.356.49.756z"/>
              <path fill="#FBBC04" d="M6.012 15.256c.044.178.044.312.044.49v.267c0 .178 0 .312-.044.49.534.044 1.023-.134 1.378-.49.356-.355.534-.844.49-1.378-.134.4-.49.756-.89.978-.355.267-.667.49-.978.645z"/>
              <text x="18" y="18" fontFamily="Google Sans,Roboto,Arial,sans-serif" fontSize="16" fill="#5f6368" fontWeight="400">
                <tspan fill="#4285F4">G</tspan><tspan fill="#EA4335">o</tspan><tspan fill="#FBBC04">o</tspan><tspan fill="#4285F4">g</tspan><tspan fill="#34A853">l</tspan><tspan fill="#EA4335">e</tspan>
                <tspan dx="4" fill="#5f6368">Play</tspan>
              </text>
            </svg>
          </a>
          <div className="gp-nav-tabs">
            <button className="gp-nav-tab">Jogos</button>
            <button className="gp-nav-tab gp-nav-tab-active">Apps</button>
            <button className="gp-nav-tab">Livros</button>
            <button className="gp-nav-tab">Crianças</button>
          </div>
          <div className="gp-header-actions">
            <button className="gp-icon-btn" aria-label="Pesquisar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#5f6368"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            </button>
            <button className="gp-icon-btn" aria-label="Ajuda">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#5f6368"><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg>
            </button>
            <button className="gp-avatar-btn" aria-label="Conta">
              <img src="/playstore-assets/user-avatar.png" alt="" className="gp-avatar-img" />
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="gp-body">
        <div className="gp-content-wrapper">
          {/* Left Column */}
          <div className="gp-main-col">
            {/* App Header */}
            <div className="gp-app-header">
              <div className="gp-app-logo-wrapper">
                <img src={app.logoUrl} alt={app.name} className="gp-app-icon" onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%234285f4' width='100' height='100' rx='20'/%3E%3Ctext x='50' y='60' text-anchor='middle' fill='white' font-size='40'%3EA%3C/text%3E%3C/svg%3E";
                }} />
                {installState === 'installing' && <div className="gp-progress-ring" />}
              </div>
              <div className="gp-app-meta">
                <h1 className="gp-app-title">{app.name}</h1>
                <a className="gp-app-developer">{app.shortDescription || app.name}</a>
                <div className="gp-app-badges-text">Contém anúncios · Compras no app</div>
              </div>
            </div>

            {/* Stats */}
            <div className="gp-stats-row">
              <div className="gp-stat-item">
                <div className="gp-stat-val">
                  4,8
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#5f6368" style={{ marginLeft: 2, verticalAlign: "middle" }}>
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
                <div className="gp-stat-sub">4,9 mi avaliações</div>
              </div>
              <div className="gp-stat-sep" />
              <div className="gp-stat-item">
                <div className="gp-stat-val">12 mi+</div>
                <div className="gp-stat-sub">downloads</div>
              </div>
              <div className="gp-stat-sep" />
              <div className="gp-stat-item">
                <div className="gp-stat-val">
                  <img src="/playstore-assets/rating-18.webp" alt="18" className="gp-rating-badge-img" />
                </div>
                <div className="gp-stat-sub">
                  Classificação
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#5f6368" style={{ marginLeft: 4, verticalAlign: "middle", cursor: "pointer" }}>
                    <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Install Button */}
            <button
              className={`gp-install-btn ${installState !== 'idle' ? 'gp-install-btn-disabled' : ''}`}
              onClick={handleInstall}
            >
              <span className="gp-install-text">
                {installState === 'idle' && 'Instalar'}
                {installState === 'installing' && 'Instalando...'}
                {installState === 'installed' && 'Instalado'}
              </span>
              {installState === 'installing' && <span className="gp-install-loader" />}
            </button>

            {/* Share & Wishlist */}
            <div className="gp-action-row">
              <button className="gp-action-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#01875f"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
                Compartilhar
              </button>
              <button className="gp-action-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#01875f"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Adicionar à lista de desejos
              </button>
            </div>

            <div className="gp-device-info">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#5f6368"><path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z"/></svg>
              <span>Este app está disponível para seu dispositivo</span>
            </div>

            {/* Screenshots */}
            {images.length > 0 ? (
              <div className="gp-screenshots">
                <button className="gp-carousel-arrow gp-carousel-left" onClick={prevImage}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#5f6368"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                </button>
                <div className="gp-screenshot-track">
                  {images.map((img: string, i: number) => (
                    <img key={i} src={img} alt={`Screenshot ${i + 1}`} className={`gp-screenshot-img ${i === currentImage ? "active" : ""}`} />
                  ))}
                </div>
                <button className="gp-carousel-arrow gp-carousel-right" onClick={nextImage}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#5f6368"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                </button>
              </div>
            ) : (
              <div className="gp-no-images">Nenhuma imagem disponível.</div>
            )}

            {/* About */}
            <section className="gp-section">
              <header className="gp-section-header">
                <h2 className="gp-section-title">Sobre este app</h2>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#5f6368" className="gp-section-arrow"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
              </header>
              <div className="gp-section-body">
                <p>{app.aboutApp || "Sem descrição disponível."}</p>
              </div>
            </section>

            <hr className="gp-divider" />

            {/* Data Safety */}
            <section className="gp-section">
              <header className="gp-section-header">
                <h2 className="gp-section-title">Segurança dos dados</h2>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#5f6368" className="gp-section-arrow"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
              </header>
              <div className="gp-section-body">
                <p className="gp-safety-desc">
                  Sua segurança começa quando você entende como os desenvolvedores coletam e compartilham seus dados. As práticas de segurança e privacidade de dados podem variar de acordo com o uso, a região e a idade. O desenvolvedor forneceu as informações a seguir, que podem ser atualizadas ao longo do tempo.
                </p>
                <div className="gp-safety-card">
                  <div className="gp-safety-row">
                    <img src="/playstore-assets/share-icon.webp" alt="" className="gp-safety-icon" />
                    <div>
                      <div className="gp-safety-primary">Os dados não são compartilhados com terceiros</div>
                      <div className="gp-safety-secondary"><a href="#">Saiba mais</a> sobre como os desenvolvedores declaram o compartilhamento</div>
                    </div>
                  </div>
                  <div className="gp-safety-row">
                    <img src="/playstore-assets/collect-icon.webp" alt="" className="gp-safety-icon" />
                    <div>
                      <div className="gp-safety-primary">Este app pode coletar estes tipos de dados</div>
                      <div className="gp-safety-secondary">Local, Informações pessoais e mais 11</div>
                    </div>
                  </div>
                  <div className="gp-safety-row">
                    <img src="/playstore-assets/encrypt-icon.webp" alt="" className="gp-safety-icon" />
                    <span className="gp-safety-primary">Os dados são criptografados em trânsito</span>
                  </div>
                  <div className="gp-safety-row">
                    <img src="/playstore-assets/delete-icon.webp" alt="" className="gp-safety-icon" />
                    <span className="gp-safety-primary">Você pode solicitar a exclusão dos dados</span>
                  </div>
                  <a href="#" className="gp-safety-details-link">Mais detalhes</a>
                </div>
              </div>
            </section>

            <hr className="gp-divider" />

            {/* Ratings & Reviews */}
            <section className="gp-section">
              <header className="gp-section-header">
                <h2 className="gp-section-title">Classificações e resenhas</h2>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#5f6368" className="gp-section-arrow"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
              </header>
              <div className="gp-verified-badge">
                As notas e avaliações são verificadas
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#5f6368" style={{ marginLeft: 4 }}><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
              </div>

              <div className="gp-device-tabs">
                <button className="gp-device-tab gp-device-tab-active">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H8C6.34 1 5 2.34 5 4v16c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V4c0-1.66-1.34-3-3-3zm-2 20h-4v-1h4v1zm3.25-3H6.75V4h10.5v14z"/></svg>
                  Telefone
                </button>
                <button className="gp-device-tab">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>
                  Chromebook
                </button>
                <button className="gp-device-tab">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.5 0h-14C3.12 0 2 1.12 2 2.5v19C2 22.88 3.12 24 4.5 24h14c1.38 0 2.5-1.12 2.5-2.5v-19C21 1.12 19.88 0 18.5 0zm-7 23c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm7.5-4H4V3h15v16z"/></svg>
                  Tablet
                </button>
              </div>

              <div className="gp-rating-overview">
                <div className="gp-rating-left">
                  <div className="gp-rating-big">4,8</div>
                  <StarRating rating={5} size={14} />
                  <div className="gp-rating-total">4,9 mi avaliações</div>
                </div>
                <div className="gp-rating-bars">
                  <RatingBar label="5" count={ratingCounts[0]} total={totalRatings} />
                  <RatingBar label="4" count={ratingCounts[1]} total={totalRatings} />
                  <RatingBar label="3" count={ratingCounts[2]} total={totalRatings} />
                  <RatingBar label="2" count={ratingCounts[3]} total={totalRatings} />
                  <RatingBar label="1" count={ratingCounts[4]} total={totalRatings} />
                </div>
              </div>

              {/* Reviews */}
              {REVIEWS.map((review, i) => (
                <div key={i} className="gp-review">
                  <div className="gp-review-top">
                    <img src={review.avatar} alt="" className="gp-review-avatar" />
                    <span className="gp-review-name">{review.name}</span>
                    <button className="gp-review-more" aria-label="Mais">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#5f6368"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                    </button>
                  </div>
                  <div className="gp-review-rating-row">
                    <StarRating rating={review.rating} size={12} />
                    <span className="gp-review-date">{review.date}</span>
                  </div>
                  <p className="gp-review-text">{review.text}</p>
                  <div className="gp-review-helpful">Essa avaliação foi marcada como útil por {review.helpful} pessoas</div>
                  <div className="gp-review-feedback">
                    <span>Você achou isso útil?</span>
                    <button className="gp-feedback-btn">Sim</button>
                    <button className="gp-feedback-btn">Não</button>
                  </div>
                </div>
              ))}
              <button className="gp-see-all-link">Ver todas as avaliações</button>
            </section>

            <hr className="gp-divider" />

            {/* What's New */}
            <section className="gp-section">
              <header className="gp-section-header">
                <h2 className="gp-section-title">O que há de novo?</h2>
              </header>
              <div className="gp-section-body">
                <p>
                  Esta atualização traz melhorias de desempenho, correções de bugs e aprimoramentos na segurança.
                  O aplicativo agora está mais rápido e estável. Foram feitas otimizações para reduzir falhas e travamentos.
                  A experiência do usuário foi aprimorada em todas as telas.
                  Atualize para aproveitar todos os recursos e a segurança mais recente.
                </p>
              </div>
            </section>

            <div className="gp-flag-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#5f6368"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>
              Sinalizar como impróprio
            </div>
          </div>

          {/* Right Column: Similar Apps */}
          <aside className="gp-sidebar">
            <section>
              <header className="gp-section-header">
                <h2 className="gp-section-title">Apps semelhantes</h2>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#5f6368" className="gp-section-arrow"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
              </header>
              <div className="gp-similar-list">
                {SIMILAR_APPS.map((sa) => (
                  <a key={sa.name} className="gp-similar-item" href="#">
                    <img src={sa.icon} alt={sa.name} className="gp-similar-icon" />
                    <div className="gp-similar-info">
                      <div className="gp-similar-name">{sa.name}</div>
                      <div className="gp-similar-dev">{sa.developer}</div>
                      <div className="gp-similar-rating">
                        {sa.rating}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#5f6368" style={{ marginLeft: 2 }}>
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="gp-footer">
        <div className="gp-footer-inner">
          <div className="gp-footer-cols">
            <div className="gp-footer-col">
              <h3>Google Play</h3>
              <a href="#">Play Pass</a>
              <a href="#">Pontos do Play Points</a>
              <a href="#">Vales-presente</a>
              <a href="#">Resgatar</a>
              <a href="#">Política de reembolso</a>
            </div>
            <div className="gp-footer-col">
              <h3>Crianças e família</h3>
              <a href="#">Guia para a família</a>
              <a href="#">Compartilhamento em família</a>
            </div>
          </div>
          <div className="gp-footer-bottom">
            <a href="#">Termos de Serviço</a>
            <a href="#">Privacidade</a>
            <a href="#">Sobre o Google Play</a>
            <a href="#">Desenvolvedores</a>
            <a href="#">Google Store</a>
            <span className="gp-footer-tax">Todos os preços incluem Tributo.</span>
            <div className="gp-footer-country">
              <img src="/playstore-assets/brazil.png" alt="Brasil" width="20" height="14" />
              Brasil (Português)
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
