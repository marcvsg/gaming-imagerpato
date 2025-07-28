import React from "react";
import "./MobilePage.css";

export default function MobilePage() {
  console.log("MobilePage está sendo renderizada");
  return (
    <div
      className="mobile-page"
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        className="mobile-container"
        style={{
          width: "90%",
          maxWidth: "400px",
          backgroundColor: "#ffffff",
          border: "3px solid #000000",
          borderRadius: "15px",
          padding: "20px",
          textAlign: "center",
          boxShadow: "0 8px 0 #000000",
          margin: "20px",
        }}
      >
        <div className="mobile-logo">
          <img src="/img/logo.gif" alt="Logo" />
        </div>

        <div className="mobile-content">
          <h1 style={{ color: "red", fontSize: "24px" }}>Oops!</h1>

          <div className="mobile-icon">
            <img src="/img/aviso-mobile.png" alt="Alerta" />
          </div>

          <h2 className="mobile-title">Versão Desktop Apenas</h2>

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
              onClick={() => window.history.back()}
            >
              <a href="https://wwww.google.com">Voltar</a>
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
