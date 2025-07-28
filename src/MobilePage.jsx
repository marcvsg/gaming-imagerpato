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
            <img src="/img/aviso-mobile.png" alt="Alerta" />
          </div>

          <h1 className="mobile-title">Versão Desktop Apenas</h1>

          <p className="mobile-message">
            Este site foi desenvolvido para funcionar melhor em computadores.
            Para uma experiência completa, acesse através de um navegador em seu
            computador.
          </p>

          <div className="mobile-actions">
            <button
              className="mobile-button primary"
              onClick={() =>
                window.open("https://pato-imager.vercel.app/", "_blank")
              }
            >
              Acessar no Desktop
            </button>

            <button
              className="mobile-button secondary"
              onClick={() => window.open("https://google.com/", "_blank")}
            >
              Voltar
            </button>
          </div>
        </div>

        <div className="mobile-footer">
          <p>© 2025 - Quackrator</p>
        </div>
      </div>
    </div>
  );
}
