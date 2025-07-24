import React, { useState, useRef, useEffect } from "react";
import posicoesAcessorios from "./acessorios-posicoes.json";
import "./App.css";

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
  const [corAcessorio, setCorAcessorio] = useState("#4c5d58");
  const [editando, setEditando] = useState(false);
  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);
  const [selecionados, setSelecionados] = useState({});
  const [imagensColoridas, setImagensColoridas] = useState({});
  const [canSelectColor, setCanSelectColor] = useState(false);
  const areaRef = useRef(null);
  const [drag, setDrag] = useState({ ativo: false, offsetX: 0, offsetY: 0 });

  const roupasCategoria = filtrarPorCategoria(categoria);
  const roupaAtual = roupasCategoria[indiceRoupa] || "";

  const proximaRoupa = () => {
    const novaRoupa =
      roupasCategoria[(indiceRoupa + 1) % roupasCategoria.length];
    setCanSelectColor(posicoesAcessorios[novaRoupa]?.colorized || false);
    setIndiceRoupa((prev) => (prev + 1) % roupasCategoria.length);
    setSelecionados((prev) => ({ ...prev, [categoria]: novaRoupa }));
  };

  const roupaAnterior = () => {
    const novaRoupa =
      roupasCategoria[
        (indiceRoupa - 1 + roupasCategoria.length) % roupasCategoria.length
      ];
    setCanSelectColor(posicoesAcessorios[novaRoupa]?.colorized || false);
    setIndiceRoupa(
      (prev) => (prev - 1 + roupasCategoria.length) % roupasCategoria.length
    );
    setSelecionados((prev) => ({ ...prev, [categoria]: novaRoupa }));
  };

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

  const colorirImagem = async (src, cor) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const hex = cor.replace("#", "");
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha > 0) {
            const gray = data[i];
            const red = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];
            const isGray =
              Math.abs(red - green) <= 5 &&
              Math.abs(green - blue) <= 5 &&
              Math.abs(red - blue) <= 5;
            if (!isGray) continue;
            const intensity = gray / 255;
            data[i] = Math.round(r * intensity);
            data[i + 1] = Math.round(g * intensity);
            data[i + 2] = Math.round(b * intensity);
          }
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = src;
    });
  };

  const obterImagemColorida = async (src, cor) => {
    const chave = `${src}-${cor}`;
    if (imagensColoridas[chave]) return imagensColoridas[chave];
    const imagemColorida = await colorirImagem(src, cor);
    setImagensColoridas((cache) => ({ ...cache, [chave]: imagemColorida }));
    return imagemColorida;
  };

  const ImagemColorida = ({ src, cor, ...props }) => {
    const [imagemColorida, setImagemColorida] = useState(null);
    useEffect(() => {
      if (!canSelectColor) return;
      if (src && cor) obterImagemColorida(src, cor).then(setImagemColorida);
    }, [src, cor]);
    return <img src={imagemColorida || src} {...props} />;
  };

  const ordemRenderizacao = ["ch", "fa", "ea", "he", "ha", "hr"];

  return (
    <div className="app-root">
      <div className="logo">
        <img src="/img/logo.png" />
      </div>
      <div className="divider-categoria"></div>
      <div className="hero">
        <div className="categoria-container">
          <label htmlFor="categoria">Categoria: </label>
          <select id="categoria" value={categoria} onChange={handleCategoria}>
            {Object.entries(categorias).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="area-navegacao">
          <img
            src={hoverLeft ? "/img/left_hover.png" : "/img/leftt.png"}
            alt="Seta Esquerda"
            className="seta left"
            onClick={roupaAnterior}
            onMouseEnter={() => setHoverLeft(true)}
            onMouseLeave={() => setHoverLeft(false)}
          />
          <div
            className={`area-pato${editando ? " editando" : ""}`}
            ref={areaRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseDown={handleMouseDown}
          >
            <img src="/img/pt.png" alt="Pato base" className="pato-base" />
            {ordemRenderizacao.map((cat) => {
              const roupa = selecionados[cat];
              const zIndex =
                cat === "fa"
                  ? 4
                  : cat === "ea"
                  ? 3
                  : cat === "he"
                  ? 5
                  : cat === "ha"
                  ? 2
                  : 1;
              return roupa ? (
                <ImagemColorida
                  key={cat}
                  src={`/img/extra/${roupa}`}
                  cor={corAcessorio}
                  alt={`Acessório ${cat}`}
                  className="acessorio"
                  style={{
                    left: posicoesAcessorios[roupa]?.left ?? "50%",
                    top: posicoesAcessorios[roupa]?.top ?? "50%",
                    zIndex,
                  }}
                  draggable={false}
                />
              ) : null;
            })}
          </div>
          <img
            src={hoverRight ? "/img/right_hover.png" : "/img/rightt.png"}
            alt="Seta Direita"
            className="seta right"
            onClick={proximaRoupa}
            onMouseEnter={() => setHoverRight(true)}
            onMouseLeave={() => setHoverRight(false)}
          />
        </div>
        <div className="seletor-cor">
          {canSelectColor && (
            <>
              <label htmlFor="cor">Cor do acessório: </label>
              <input
                type="color"
                id="cor"
                value={corAcessorio}
                onChange={(e) => setCorAcessorio(e.target.value)}
              />
              <span>{corAcessorio}</span>
            </>
          )}
        </div>
        <p className="roupa-selecionada">
          Roupa selecionada ({categorias[categoria]}):{" "}
          {selecionados[categoria] || "Nenhuma"}
        </p>
        {editando && roupaAtual && (
          <div className="posicao-atual">
            <strong>Posição atual:</strong> left:{" "}
            {posicoes[roupaAtual]?.left ?? 100}px, top:{" "}
            {posicoes[roupaAtual]?.top ?? 100}px
            <br />
            <code>{`'${roupaAtual}': { left: ${
              posicoes[roupaAtual]?.left ?? 100
            }, top: ${posicoes[roupaAtual]?.top ?? 100} },`}</code>
          </div>
        )}
        <button className="botao-editar" onClick={() => setEditando((v) => !v)}>
          {editando ? "Sair do modo edição" : "Editar posição do acessório"}
        </button>
      </div>
    </div>
  );
}
