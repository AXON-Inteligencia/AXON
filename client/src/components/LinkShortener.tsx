interface LinkShortenerProps {
  onClose: () => void;
}

export default function LinkShortener({ onClose }: LinkShortenerProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content shortener-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">Encurtador de Links</h2>
        <p className="modal-description">
          Para encurtar links rapidamente. Clique no botao abaixo.
        </p>
        <a
          href="https://bitly.com"
          target="_blank"
          rel="noopener noreferrer"
          className="shortener-btn"
        >
          Abrir Encurtador
        </a>
      </div>
    </div>
  );
}
