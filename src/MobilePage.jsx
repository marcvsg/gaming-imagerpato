import React from "react";
import "./MobilePage.css";

export default function MobilePage() {
  return (
    <div className="mobile-page">
      <div className="mobile-container">
        <div className="mobile-logo">
          <img src="/img/logo.gif" alt="Logo" />
        </div>

        <div className="mobile-content">
          <div className="mobile-icon">
            <img src="/img/icons/alerta.gif" alt="Alerta" />
          </div>

          <h1 className="mobile-title">Versão Desktop Apenas</h1>

          <p className="mobile-message">
            Este site foi desenvolvido para funcionar melhor em computadores
            desktop. Para uma experiência completa, acesse através de um
            navegador em seu computador.
          </p>

          <div className="mobile-features">
            <div className="feature-item">
              <div className="feature-icon">🖥️</div>
              <span>Melhor experiência em desktop</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎨</div>
              <span>Editor completo de personalização</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💾</div>
              <span>Salvamento de imagens</span>
            </div>
          </div>

          <div className="mobile-actions">
            <button
              className="mobile-button primary"
              onClick={() =>
                window.open("https://pato-personalizado.vercel.app", "_blank")
              }
            >
              Acessar no Desktop
            </button>

            <button
              className="mobile-button secondary"
              onClick={() => window.history.back()}
            >
              Voltar
            </button>
          </div>
        </div>

        <div className="mobile-footer">
          <p>© 2024 Pato Personalizado</p>
        </div>
      </div>
    </div>
  );
}
