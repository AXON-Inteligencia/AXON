import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Package } from "lucide-react";

export default function TransportPanel() {
  const [activeTab, setActiveTab] = useState<"clientes" | "config">("clientes");

  return (
    <div className="transport-panel">
      <div className="transport-tabs">
        <button
          className={`tab-btn ${activeTab === "clientes" ? "active" : ""}`}
          onClick={() => setActiveTab("clientes")}
        >
          Clientes
        </button>
        <button
          className={`tab-btn ${activeTab === "config" ? "active" : ""}`}
          onClick={() => setActiveTab("config")}
        >
          Configuracoes
        </button>
      </div>

      {activeTab === "clientes" ? <ClientesTab /> : <ConfigTab />}
    </div>
  );
}

function ClientesTab() {
  const [name, setName] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [address, setAddress] = useState("");
  const [product, setProduct] = useState("");
  const [trackingLink, setTrackingLink] = useState(
    `${window.location.origin}/rastreio/`
  );
  const [notification, setNotification] = useState("");

  const utils = trpc.useUtils();
  const clientsQuery = trpc.clients.list.useQuery();
  const createMutation = trpc.clients.create.useMutation({
    onSuccess: () => {
      utils.clients.list.invalidate();
      setName("");
      setOrderNumber("");
      setAddress("");
      setProduct("");
      setNotification("Cliente salvo com sucesso!");
      setTimeout(() => setNotification(""), 3000);
    },
  });
  const deleteMutation = trpc.clients.delete.useMutation({
    onSuccess: () => utils.clients.list.invalidate(),
  });

  const generateOrderNumber = () => {
    const num = Math.floor(Math.random() * 900000000) + 100000000;
    setOrderNumber(num.toString());
  };

  const copyTrackingLink = () => {
    navigator.clipboard.writeText(trackingLink);
    setNotification("Link copiado!");
    setTimeout(() => setNotification(""), 2000);
  };

  const handleSave = () => {
    if (!name.trim() || !orderNumber.trim()) {
      setNotification("Nome e Ordem de Pedido sao obrigatorios");
      setTimeout(() => setNotification(""), 3000);
      return;
    }
    createMutation.mutate({ name, orderNumber, address, product, trackingLink });
  };

  return (
    <div className="clientes-tab">
      {notification && <div className="tab-notification">{notification}</div>}

      <h2 className="section-title">Cadastrar Cliente</h2>

      <div className="form-field">
        <label className="field-label">Nome</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="field-input"
        />
      </div>

      <div className="form-field">
        <label className="field-label">Ordem de Pedido</label>
        <div className="input-with-btn">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="field-input"
          />
          <button className="inline-btn" onClick={generateOrderNumber}>
            Gerar
          </button>
        </div>
      </div>

      <div className="form-field">
        <label className="field-label">Endereco</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="field-input"
        />
      </div>

      <div className="form-field">
        <label className="field-label">Produto</label>
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="field-input"
        />
      </div>

      <div className="form-field">
        <label className="field-label">Link de Rastreio</label>
        <div className="input-with-btn">
          <input
            type="text"
            value={trackingLink}
            onChange={(e) => setTrackingLink(e.target.value)}
            className="field-input"
          />
          <button className="inline-btn" onClick={copyTrackingLink}>
            Copiar
          </button>
        </div>
      </div>

      <button className="save-btn green" onClick={handleSave}>
        Salvar
      </button>

      <h2 className="section-title mt-8">Meus Clientes</h2>
      {clientsQuery.data?.length === 0 ? (
        <p className="empty-text">Nenhum cliente cadastrado.</p>
      ) : (
        <div className="clients-list">
          {clientsQuery.data?.map((client) => (
            <div key={client.id} className="client-card">
              <div className="client-info">
                <strong>{client.name}</strong>
                <span>Pedido: {client.orderNumber}</span>
                {client.product && <span>Produto: {client.product}</span>}
                {client.address && <span>Endereco: {client.address}</span>}
              </div>
              <button
                className="delete-client-btn"
                onClick={() => deleteMutation.mutate({ id: client.id })}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ConfigTab() {
  const configQuery = trpc.tracking.getConfig.useQuery();
  const utils = trpc.useUtils();

  const [title, setTitle] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [pixValue, setPixValue] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [message, setMessage] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [notification, setNotification] = useState("");

  if (configQuery.data && !initialized) {
    setTitle(configQuery.data.title);
    setButtonText(configQuery.data.buttonText);
    setPixValue(configQuery.data.pixValue);
    setPixKey(configQuery.data.pixKey);
    setMessage(configQuery.data.message);
    setInitialized(true);
  }

  const saveMutation = trpc.tracking.saveConfig.useMutation({
    onSuccess: () => {
      utils.tracking.getConfig.invalidate();
      setNotification("Configuracoes salvas!");
      setTimeout(() => setNotification(""), 3000);
    },
  });

  const handleSave = () => {
    saveMutation.mutate({ title, buttonText, pixValue, pixKey, message });
  };

  return (
    <div className="config-tab">
      {notification && <div className="tab-notification">{notification}</div>}

      <div className="config-grid">
        <div className="config-form">
          <h2 className="section-title">Configuracoes do Rastreamento</h2>

          <div className="form-field">
            <label className="field-label">Titulo</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Frete Transportadora"
              className="field-input"
            />
          </div>

          <div className="form-field">
            <label className="field-label">Texto do Botao</label>
            <input
              type="text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="Liberamento de Pedido"
              className="field-input"
            />
          </div>

          <div className="form-field">
            <label className="field-label">Valor do Pix</label>
            <input
              type="text"
              value={pixValue}
              onChange={(e) => setPixValue(e.target.value)}
              placeholder="4,99"
              className="field-input"
            />
          </div>

          <div className="form-field">
            <label className="field-label">Chave Pix</label>
            <input
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              className="field-input"
            />
          </div>

          <div className="form-field">
            <label className="field-label">Mensagem</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Aguardando pagamento de taxa de liberacao."
              className="field-textarea"
              rows={4}
            />
          </div>

          <button className="save-btn green" onClick={handleSave}>
            Salvar Configuracoes
          </button>
        </div>

        <div className="config-preview">
          <div className="preview-label">PREVIA</div>
          <div className="preview-card">
            <Package size={40} className="preview-icon" />
            <h3 className="preview-title">
              {title || "Frete Transportadora"} {pixValue || "4,99"}
            </h3>
            <p className="preview-message">
              {message || "Aguardando pagamento de taxa de liberacao."}
            </p>
            <div className="preview-pix-display">
              Sua chave PIX aparecera aqui
            </div>
            <button className="preview-copy-btn">COPIAR CHAVE PIX</button>
            <p className="preview-release-label">Liberamento de Pedido</p>
            <a href="#" className="preview-back-link">
              Voltar ao rastreio
            </a>
          </div>

          <div className="preview-button-section">
            <div className="preview-button-label">PREVIA DO BOTAO NO RASTREIO</div>
            <button className="preview-action-btn">
              {buttonText || "Liberamento de Pedido"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
