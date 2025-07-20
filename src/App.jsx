import React, { useState } from "react";
import { useRef } from "react";
import posicoesAcessorios from "./acessorios-posicoes.json";

const roupas = [
  "ha-1.png",
  "ha-2.png",
  "ha-3.png",
  "ha-4.png",
  "ha-5.png",
  "ha-6.png",
  "ha-7.png",
  "ha-8.png",
  "ha-9.png",
  "ha-10.png",
  "ha-11.png",
  "ha-12.png",
  "hr-1.png",
  "hr-2.png",
  "hr-3.png",
  "hr-4.png",
  "hr-5.png",
  "hr-6.png",
  "hr-7.png",
  "ch-1.png",
  "ch-2.png",
  "he-1.png",
  "he-2.png",
  "he-4.png",
  "fa-1.png",
  "fa-2.png",
  "fa-3.png",
  "fa-4.png",
  "ea-1.png",
  "ea-2.png",
  "ea-3.png",
  "ea-4.png",
];

const categorias = {
  ha: "Chapéus",
  hr: "Cabelo",
  ch: "Roupa",
  fa: "Acessório de Rosto",
  ea: "Óculos",
  he: "Acessório de Cabeça",
};

function filtrarPorCategoria(prefixo) {
  return [""].concat(roupas.filter((r) => r.startsWith(prefixo + "-")));
}

export default function App() {
  const [categoria, setCategoria] = useState("ha");
  const [indiceRoupa, setIndiceRoupa] = useState(0);
  const [posicoes, setPosicoes] = useState({ ...posicoesAcessorios });
  const [editando, setEditando] = useState(false);
  const areaRef = useRef(null);
  const [drag, setDrag] = useState({ ativo: false, offsetX: 0, offsetY: 0 });
  // Estado para armazenar o acessório selecionado de cada categoria
  const [selecionados, setSelecionados] = useState({});

  const roupasCategoria = filtrarPorCategoria(categoria);
  const roupaAtual = roupasCategoria[indiceRoupa] || "";

  // Atualizar o acessório selecionado ao navegar
  const proximaRoupa = () => {
    const novaRoupa =
      roupasCategoria[(indiceRoupa + 1) % roupasCategoria.length];
    setIndiceRoupa((prev) => (prev + 1) % roupasCategoria.length);
    setSelecionados((prev) => ({ ...prev, [categoria]: novaRoupa }));
  };
  const roupaAnterior = () => {
    const novaRoupa =
      roupasCategoria[
        (indiceRoupa - 1 + roupasCategoria.length) % roupasCategoria.length
      ];
    setIndiceRoupa(
      (prev) => (prev - 1 + roupasCategoria.length) % roupasCategoria.length
    );
    setSelecionados((prev) => ({ ...prev, [categoria]: novaRoupa }));
  };

  // Ao trocar de categoria, mostrar o acessório já selecionado (se houver)
  const handleCategoria = (e) => {
    const novaCategoria = e.target.value;
    setCategoria(novaCategoria);
    const idx = roupas
      .filter((r) => r.startsWith(novaCategoria + "-"))
      .indexOf(selecionados[novaCategoria] || "");
    setIndiceRoupa(idx >= 0 ? idx : 0);
  };

  const handleMouseDown = (e) => {
    if (!editando) return;
    const area = areaRef.current.getBoundingClientRect();
    const left = posicoes[roupaAtual]?.left ?? 100;
    const top = posicoes[roupaAtual]?.top ?? 100;
    setDrag({
      ativo: true,
      offsetX: e.clientX - (area.left + left),
      offsetY: e.clientY - (area.top + top),
    });
  };

  const handleMouseMove = (e) => {
    if (!editando || !drag.ativo) return;
    const area = areaRef.current.getBoundingClientRect();
    const left = e.clientX - area.left - drag.offsetX;
    const top = e.clientY - area.top - drag.offsetY;
    setPosicoes((prev) => ({
      ...prev,
      [roupaAtual]: { left: Math.round(left), top: Math.round(top) },
    }));
  };

  const handleMouseUp = () => {
    if (!editando) return;
    setDrag((d) => ({ ...d, ativo: false }));
  };

  const ordemRenderizacao = ["ch", "fa", "ea", "he", "ha", "hr"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 40,
      }}
    >
      <h2>Habbo Imager do Pato</h2>
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="categoria">Categoria: </label>
        <select id="categoria" value={categoria} onChange={handleCategoria}>
          {Object.entries(categorias).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 300,
          width: "100%",
        }}
      >
        <img
          src="/img/left.png"
          alt="Seta Esquerda"
          style={{ width: 46, height: 46, cursor: "pointer", marginRight: 10 }}
          onClick={roupaAnterior}
        />
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 200,
            height: 220,
            position: "relative",
            background: editando ? "#f0f0f0" : "none",
          }}
          ref={areaRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            src="/img/pt.png"
            alt="Pato base"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
          {/* Renderizar todos os acessórios selecionados na ordem correta */}
          {ordemRenderizacao.map((cat) => {
            const roupa = selecionados[cat];
            // Definir zIndex por categoria
            let zIndex = 1;
            if (cat === "ch") zIndex = 1; // Roupa
            else if (cat === "ea") zIndex = 3; // Óculos
            else if (cat === "fa")
              zIndex = 4; // Acessório de rosto (acima dos óculos)
            else if (cat === "he") zIndex = 5; // Acessório de cabeça
            else if (cat === "ha") zIndex = 2; // Chapéu
            else if (cat === "hr") zIndex = 2; // Cabelo
            return roupa ? (
              <img
                key={cat}
                src={`/img/extra/${roupa}`}
                alt={`Acessório ${cat}`}
                style={{
                  position: "absolute",
                  left:
                    posicoesAcessorios[roupa]?.left !== undefined
                      ? posicoesAcessorios[roupa].left
                      : "50%",
                  top:
                    posicoesAcessorios[roupa]?.top !== undefined
                      ? posicoesAcessorios[roupa].top
                      : "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex,
                }}
                draggable={false}
              />
            ) : null;
          })}
        </div>
        <img
          src="/img/right.png"
          alt="Seta Direita"
          style={{ width: 46, height: 46, cursor: "pointer", marginLeft: 10 }}
          onClick={proximaRoupa}
        />
      </div>
      <p style={{ marginTop: 20 }}>
        Roupa selecionada ({categorias[categoria]}):{" "}
        {selecionados[categoria] || "Nenhuma"}
      </p>
      {editando && roupaAtual && (
        <div style={{ marginTop: 10 }}>
          <strong>Posição atual:</strong> left:{" "}
          {posicoes[roupaAtual]?.left ?? 100}px, top:{" "}
          {posicoes[roupaAtual]?.top ?? 100}px
          <br />
          <code>{`'${roupaAtual}': { left: ${
            posicoes[roupaAtual]?.left ?? 100
          }, top: ${posicoes[roupaAtual]?.top ?? 100} },`}</code>
        </div>
      )}
      <button style={{ marginTop: 10 }} onClick={() => setEditando((v) => !v)}>
        {editando ? "Sair do modo edição" : "Editar posição do acessório"}
      </button>
    </div>
  );
}
