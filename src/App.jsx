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
  ha: "",
  he: "",
  hr: "",
  ch: "",
  fa: "",
  ea: "",
};

const iconesCategoria = {
  ha: "/img/icons/chapeus.png", // Chapéus
  hr: "/img/icons/hair.gif", // Cabelo
  ch: "/img/icons/shirt.gif", // Roupa
  fa: "/img/icons/accrosto.gif", // Acessório de Rosto
  ea: "/img/icons/glasses.gif", // Óculos
  he: "/img/icons/acccabeca.gif", // Acessório de Cabeça (ajuste se quiser outro)
};

function filtrarPorCategoria(prefixo) {
  return [""].concat(roupas.filter((r) => r.startsWith(prefixo + "-")));
}

export default function App() {
  const [categoria, setCategoria] = useState("ha");
  const [indiceRoupa, setIndiceRoupa] = useState(0);
  const [posicoes, setPosicoes] = useState({ ...posicoesAcessorios });
  // Trocar o estado único de cor por um objeto de cores por categoria
  const [coresAcessorios, setCoresAcessorios] = useState({});
  const [editando, setEditando] = useState(false);
  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);
  const [selecionados, setSelecionados] = useState({});
  const [imagensColoridas, setImagensColoridas] = useState({});
  const [canSelectColor, setCanSelectColor] = useState(false);
  const areaRef = useRef(null);
  // Estado para armazenar o tamanho real da área do pato
  const [areaPatoSize, setAreaPatoSize] = useState({ width: 200, height: 220 });

  // Atualiza o tamanho da área do pato ao montar e ao redimensionar
  useEffect(() => {
    function updateAreaSize() {
      if (areaRef.current) {
        setAreaPatoSize({
          width: areaRef.current.offsetWidth,
          height: areaRef.current.offsetHeight,
        });
      }
    }
    updateAreaSize();
    window.addEventListener("resize", updateAreaSize);
    return () => window.removeEventListener("resize", updateAreaSize);
  }, []);

  const [drag, setDrag] = useState({ ativo: false, offsetX: 0, offsetY: 0 });

  // Adiciona as cores do JSON
  const hexColors = posicoesAcessorios.hexColors || [];
  // Paginação da paleta de cores
  const CORES_POR_PAGINA = 24;
  const [paginaCor, setPaginaCor] = useState(0);
  const totalPaginasCor = Math.ceil(hexColors.length / CORES_POR_PAGINA);
  const coresPagina = hexColors.slice(
    paginaCor * CORES_POR_PAGINA,
    (paginaCor + 1) * CORES_POR_PAGINA
  );
  const avancarPaginaCor = () => setPaginaCor((p) => (p + 1) % totalPaginasCor);
  const voltarPaginaCor = () =>
    setPaginaCor((p) => (p - 1 + totalPaginasCor) % totalPaginasCor);

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

  // Dimensões padrão da área do pato
  const areaPatoDesktop = { width: 200, height: 220 };
  const areaPatoMobile = { width: 90, height: 100 };
  // Detecta se está em mobile
  const isMobile = window.innerWidth <= 600;
  const areaPato = isMobile ? areaPatoMobile : areaPatoDesktop;

  // Função para salvar imagem do pato
  const salvarImagem = async () => {
    // Tamanho da área do pato
    const width = areaPatoSize.width;
    const height = areaPatoSize.height;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // Desenhar base
    const baseImg = new window.Image();
    baseImg.src = "/img/pt.png";
    await new Promise((res) => {
      baseImg.onload = res;
    });
    ctx.drawImage(baseImg, 0, 0, width, height);

    // Desenhar acessórios na ordem correta
    for (const cat of ordemRenderizacao) {
      const roupa = selecionados[cat];
      if (roupa) {
        const img = new window.Image();
        img.src = `/img/extra/${roupa}`;
        await new Promise((res) => {
          img.onload = res;
        });
        // Tamanho exibido dos acessórios (igual ao canvas)
        const w = width;
        const h = height;
        // Calcular posição exata em pixels igual ao CSS
        const left = ((posicoesAcessorios[roupa]?.left ?? 100) / 200) * width;
        const top = ((posicoesAcessorios[roupa]?.top ?? 100) / 220) * height;
        if (posicoesAcessorios[roupa]?.colorized && coresAcessorios[cat]) {
          // Canvas temporário do tamanho do canvas
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = w;
          tempCanvas.height = h;
          const tempCtx = tempCanvas.getContext("2d");
          tempCtx.drawImage(img, 0, 0, w, h);
          tempCtx.globalCompositeOperation = "source-atop";
          tempCtx.fillStyle = coresAcessorios[cat];
          tempCtx.fillRect(0, 0, w, h);
          tempCtx.globalCompositeOperation = "source-over";
          ctx.drawImage(tempCanvas, left - w / 2, top - h / 2, w, h);
        } else {
          ctx.drawImage(img, left - w / 2, top - h / 2, w, h);
        }
      }
    }

    // Baixar imagem
    const link = document.createElement("a");
    link.download = "pato-personalizado.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="app-root">
      <div className="logo">
        <img src="/img/logo.gif" />
      </div>
      <div className="balao-alerta">
        <img src="/img/icons/alerta.gif" />
        <p>Ainda estamos em versão BETA, por favor, não compartilhe ainda.</p>
        <img src="/img/icons/alerta.gif" />
      </div>

      <div className="hero">
        <div className="categoria-container">
          <div className="categorias-lista">
            {Object.entries(categorias).map(([key, label]) => (
              <button
                key={key}
                className={`categoria-botao${
                  categoria === key ? " selecionada" : ""
                }`}
                onClick={() => handleCategoria({ target: { value: key } })}
                type="button"
              >
                <img
                  src={iconesCategoria[key]}
                  alt={label}
                  className="icone-categoria"
                />
                <span>{label}</span>
              </button>
            ))}
          </div>
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
            <img src="/img/base.png" className="base-do-pato" />
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
                  cor={coresAcessorios[cat] || "#4c5d58"}
                  alt={`Acessório ${cat}`}
                  className="acessorio"
                  style={{
                    left:
                      ((posicoesAcessorios[roupa]?.left ?? 100) /
                        areaPatoSize.width) *
                        100 +
                      "%",
                    top:
                      ((posicoesAcessorios[roupa]?.top ?? 100) /
                        areaPatoSize.height) *
                        100 +
                      "%",
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
              <div className="paleta-cores-paginada">
                <img
                  src={"/img/leftt.png"}
                  alt="Anterior"
                  className="seta-paleta"
                  onClick={voltarPaginaCor}
                  style={{
                    visibility: totalPaginasCor > 1 ? "visible" : "hidden",
                  }}
                />
                <div className="paleta-cores">
                  {coresPagina.map((hex, idx) => (
                    <button
                      key={hex + idx + paginaCor}
                      className={`cor-quadrado${
                        coresAcessorios[categoria]?.toLowerCase() ===
                        hex.toLowerCase()
                          ? " selecionada"
                          : ""
                      }`}
                      style={{ background: hex }}
                      onClick={() =>
                        setCoresAcessorios((prev) => ({
                          ...prev,
                          [categoria]: hex,
                        }))
                      }
                      aria-label={hex}
                      type="button"
                    />
                  ))}
                </div>
                <img
                  src={"/img/rightt.png"}
                  alt="Próxima"
                  className="seta-paleta"
                  onClick={avancarPaginaCor}
                  style={{
                    visibility: totalPaginasCor > 1 ? "visible" : "hidden",
                  }}
                />
              </div>
            </>
          )}
        </div>
        <button className="botao-salvar" onClick={salvarImagem}>
          <img src="/img/botao-salvar.png" alt="Salvar" />
        </button>
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
      </div>
    </div>
  );
}
