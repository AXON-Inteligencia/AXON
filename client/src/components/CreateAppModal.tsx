import { useState } from "react";
import { trpc } from "../lib/trpc";
import { Camera } from "lucide-react";

interface CreateAppModalProps {
  onClose: () => void;
}

export default function CreateAppModal({ onClose }: CreateAppModalProps) {
  const [logoUrl, setLogoUrl] = useState("");
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [apkLink, setApkLink] = useState("");
  const [aboutApp, setAboutApp] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [notification, setNotification] = useState("");

  const utils = trpc.useUtils();
  const createMutation = trpc.apps.create.useMutation({
    onSuccess: () => {
      utils.apps.list.invalidate();
      setNotification("Criando novo app...");
      setTimeout(() => {
        onClose();
      }, 1000);
    },
    onError: (err) => {
      setNotification(`Erro: ${err.message}`);
    },
  });

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      setNotification("Nome do app e obrigatorio");
      return;
    }
    createMutation.mutate({
      name,
      logoUrl,
      shortDescription,
      apkLink,
      aboutApp,
      images,
      siteUrl: apkLink,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content playstore-modal" onClick={(e) => e.stopPropagation()}>
        {notification && (
          <div className="modal-notification">{notification}</div>
        )}

        <div className="playstore-grid">
          <div className="playstore-left">
            <h2 className="modal-title">Informacoes da Tela Play Store:</h2>

            <div className="logo-upload-section">
              <div className="logo-preview">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="preview-img" />
                ) : (
                  <Camera size={32} className="preview-placeholder" />
                )}
              </div>
              <div className="logo-fields">
                <label className="field-label">Logotipo (URL)</label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="Cole a URL do logotipo"
                  className="field-input"
                />
              </div>
            </div>

            <div className="form-field">
              <label className="field-label">Nome do App</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field-input"
              />
            </div>

            <div className="form-field">
              <label className="field-label">Descricao curta</label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Ex: APP de medicina"
                className="field-input"
              />
            </div>

            <div className="form-field">
              <label className="field-label">Link do APK</label>
              <input
                type="text"
                value={apkLink}
                onChange={(e) => setApkLink(e.target.value)}
                placeholder="Cole o link direto do APK"
                className="field-input"
              />
            </div>
          </div>

          <div className="playstore-right">
            <h3 className="carousel-title">Carrossel de Imagens</h3>

            <div className="image-carousel">
              {images.map((img, i) => (
                <div key={i} className="carousel-image">
                  <img src={img} alt={`Image ${i + 1}`} />
                  <button
                    className="remove-image"
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className="add-image-section">
              <label className="field-label">Adicionar Imagem (URL)</label>
              <div className="add-image-row">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Cole a URL da imagem"
                  className="field-input"
                />
                <button className="add-image-btn" onClick={handleAddImage}>
                  Adicionar
                </button>
              </div>
            </div>

            <div className="form-field">
              <label className="field-label">Sobre o App</label>
              <textarea
                value={aboutApp}
                onChange={(e) => setAboutApp(e.target.value)}
                className="field-textarea"
                rows={5}
              />
            </div>

            <button className="save-btn" onClick={handleSave}>
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
