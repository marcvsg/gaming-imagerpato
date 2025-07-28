import React, { useState, useRef, useEffect } from "react";
import posicoesAcessorios from "./acessorios-posicoes.json";
import "./App.css";
import "./styles/style.css";
import MobilePage from "./MobilePage";

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

const coresPele = [
  "pt-0.png",
  "pt-1.png",
  "pt-2.png",
  "pt-3.png",
  "pt-4.png",
  "pt-5.png",
];

const fundos = [
  "sem-fundo.png",
  "Layer 0.png",
  "Layer 1.png",
  "Layer 2.png",
  "Layer 3.png",
  "Layer 4.png",
  "Layer 5.png",
  "Layer 6.png",
  "Layer 7.png",
  "Layer 8.png",
  "Layer 9.png",
];

const categorias = {
  skin: "",
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
  skin: "/img/icons/pele.png", // Cor de Pele (usando ícone temporário)
};

function filtrarPorCategoria(prefixo) {
  if (prefixo === "skin") {
    return [""].concat(coresPele);
  }
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
  const [fundoSelecionado, setFundoSelecionado] = useState("sem-fundo.png");
  const [paginaFundo, setPaginaFundo] = useState(0);

  // Inicializar pt-0.png como cor de pele padrão e cores padrão para categorias
  useEffect(() => {
    setSelecionados((prev) => ({
      ...prev,
      skin: "pt-0.png",
    }));

    // Inicializar cores padrão para cada categoria
    setCoresAcessorios((prev) => ({
      ...prev,
      ha: "#4c5d58", // Chapéus
      hr: "#4c5d58", // Cabelo
      ch: "#4c5d58", // Roupa
      fa: "#4c5d58", // Acessório de Rosto
      ea: "#4c5d58", // Óculos
      he: "#4c5d58", // Acessório de Cabeça
    }));
  }, []);
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

  // Estado para detectar se está em mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Se estiver em mobile, mostrar a página mobile
  if (isMobile) {
    return <MobilePage />;
  }

  const [drag, setDrag] = useState({ ativo: false, offsetX: 0, offsetY: 0 });

  // Adiciona as cores do JSON
  const hexColors = posicoesAcessorios.hexColors || [];
  // Paginação da paleta de cores
  const CORES_POR_PAGINA = 21;
  const [paginaCor, setPaginaCor] = useState(0);
  const totalPaginasCor = Math.ceil(hexColors.length / CORES_POR_PAGINA);
  const coresPagina = hexColors.slice(
    paginaCor * CORES_POR_PAGINA,
    (paginaCor + 1) * CORES_POR_PAGINA
  );
  const avancarPaginaCor = () => setPaginaCor((p) => (p + 1) % totalPaginasCor);
  const voltarPaginaCor = () =>
    setPaginaCor((p) => (p - 1 + totalPaginasCor) % totalPaginasCor);

  // Paginação dos fundos
  const FUNDOS_POR_PAGINA = 3;
  const totalPaginasFundo = Math.ceil(fundos.length / FUNDOS_POR_PAGINA);
  const fundosPagina = fundos.slice(
    paginaFundo * FUNDOS_POR_PAGINA,
    (paginaFundo + 1) * FUNDOS_POR_PAGINA
  );
  const avancarPaginaFundo = () =>
    setPaginaFundo((p) => (p + 1) % totalPaginasFundo);
  const voltarPaginaFundo = () =>
    setPaginaFundo((p) => (p - 1 + totalPaginasFundo) % totalPaginasFundo);

  const roupasCategoria = filtrarPorCategoria(categoria);
  const roupaAtual = roupasCategoria[indiceRoupa] || "";

  // Atualizar canSelectColor quando a categoria muda (apenas para categorias que não são skin)
  useEffect(() => {
    if (categoria !== "skin") {
      setCanSelectColor(posicoesAcessorios[roupaAtual]?.colorized || false);
    }
  }, [categoria, roupaAtual]);

  const proximaRoupa = () => {
    const novaRoupa =
      roupasCategoria[(indiceRoupa + 1) % roupasCategoria.length];
    if (categoria !== "skin") {
      setCanSelectColor(posicoesAcessorios[novaRoupa]?.colorized || false);
    }
    setIndiceRoupa((prev) => (prev + 1) % roupasCategoria.length);
    setSelecionados((prev) => ({ ...prev, [categoria]: novaRoupa }));
  };

  const roupaAnterior = () => {
    const novaRoupa =
      roupasCategoria[
        (indiceRoupa - 1 + roupasCategoria.length) % roupasCategoria.length
      ];
    if (categoria !== "skin") {
      setCanSelectColor(posicoesAcessorios[novaRoupa]?.colorized || false);
    }
    setIndiceRoupa(
      (prev) => (prev - 1 + roupasCategoria.length) % roupasCategoria.length
    );
    setSelecionados((prev) => ({ ...prev, [categoria]: novaRoupa }));
  };

  const handleCategoria = (e) => {
    const novaCategoria = e.target.value;
    setCategoria(novaCategoria);

    if (novaCategoria === "skin") {
      const idx = coresPele.indexOf(selecionados[novaCategoria] || "");
      setIndiceRoupa(idx >= 0 ? idx : 0);
    } else {
      const idx = roupas
        .filter((r) => r.startsWith(novaCategoria + "-"))
        .indexOf(selecionados[novaCategoria] || "");
      setIndiceRoupa(idx >= 0 ? idx : 0);
    }
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
      if (src && cor) {
        obterImagemColorida(src, cor).then(setImagemColorida);
      } else {
        setImagemColorida(null);
      }
    }, [src, cor]);
    return <img src={imagemColorida || src} {...props} />;
  };

  const ordemRenderizacao = ["ch", "fa", "ea", "he", "ha", "hr"];

  // Dimensões padrão da área do pato
  const areaPato = { width: 200, height: 220 };

  // Função para salvar imagem do pato
  const salvarImagem = async () => {
    // Fazer uma cópia local das cores para evitar problemas de estado
    const coresLocais = { ...coresAcessorios };

    // Tamanho da área do pato
    const width = areaPatoSize.width;
    const height = areaPatoSize.height;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // Desenhar fundo se não for "sem-fundo.png"
    if (fundoSelecionado !== "sem-fundo.png") {
      const fundoImg = new window.Image();
      fundoImg.src = `/img/fundos/${fundoSelecionado}`;
      await new Promise((res) => {
        fundoImg.onload = res;
      });
      // Desenhar o fundo cobrindo toda a área
      ctx.drawImage(fundoImg, 0, 0, width, height);
    }

    // Desenhar base
    const baseImg = new window.Image();
    const baseSrc =
      selecionados.skin && selecionados.skin !== ""
        ? `/img/${selecionados.skin}`
        : "/img/pt.png";
    baseImg.src = baseSrc;
    await new Promise((res) => {
      baseImg.onload = res;
    });
    // Desenhar a base com o tamanho correto do canvas
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
        // Tamanho exibido dos acessórios (proporcional ao tamanho natural)
        const scale = Math.min(width / 200, height / 220) * 2.0; // Escala aumentada em 100%
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;

        // Seleciona as coordenadas corretas (sempre usar desktop para salvar)
        const posicao = posicoesAcessorios[roupa];
        console.log(`JSON ${roupa}:`, posicao);

        // Calcular posição exata em pixels igual ao CSS
        const left = ((posicao?.left ?? 100) / 212) * width; // Usar 200 como referência desktop
        const top = ((posicao?.top ?? 100) / 358) * height; // Usar 220 como referência desktop

        if (posicao?.colorized && coresLocais[cat]) {
          // Usar a mesma lógica de colorização do site
          const imagemColorida = await colorirImagem(
            `/img/extra/${roupa}`,
            coresLocais[cat]
          );
          const imgColorida = new window.Image();
          imgColorida.src = imagemColorida;
          await new Promise((res) => {
            imgColorida.onload = res;
          });
          ctx.drawImage(imgColorida, left - w / 2, top - h / 2, w, h);
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

      <div>
        <div className="hero-flex-layout">
          <div className="categoria-container"></div>

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

          <div className="hero">
            <div className="area-navegacao">
              <div className="editor-pato">
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
                  {fundoSelecionado !== "sem-fundo.png" && (
                    <img
                      src={`/img/fundos/${fundoSelecionado}`}
                      className="fundo-pato"
                    />
                  )}
                  <img src="/img/base.png" className="base-do-pato" />
                  <img
                    src={
                      selecionados.skin && selecionados.skin !== ""
                        ? `/img/${selecionados.skin}`
                        : "/img/pt.png"
                    }
                    alt=""
                    className="pato-base"
                  />
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
                    // Seleciona as coordenadas corretas
                    const posicao = posicoesAcessorios[roupa];
                    return roupa ? (
                      <ImagemColorida
                        key={cat}
                        src={`/img/extra/${roupa}`}
                        cor={
                          posicao?.colorized
                            ? coresAcessorios[cat] || "#4c5d58"
                            : null
                        }
                        alt={`Acessório ${cat}`}
                        className="acessorio"
                        style={{
                          left:
                            ((posicao?.left ?? 100) / areaPatoSize.width) *
                              100 +
                            "%",
                          top:
                            ((posicao?.top ?? 100) / areaPatoSize.height) *
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

              <div className="paletas-container">
                <div className="seletor-cor">
                  <div className="paleta-cores-paginada">
                    <img
                      src={"/img/leftt.png"}
                      alt="Anterior"
                      className="seta-paleta"
                      onClick={canSelectColor ? voltarPaginaCor : undefined}
                      style={{
                        visibility: totalPaginasCor > 1 ? "visible" : "hidden",
                        cursor: canSelectColor ? "pointer" : "default",
                        opacity: canSelectColor ? 1 : 0.5,
                      }}
                    />
                    <div
                      className={`paleta-cores ${
                        !canSelectColor ? "desabilitada" : ""
                      }`}
                    >
                      {coresPagina.map((hex, idx) => (
                        <button
                          key={hex + idx + paginaCor}
                          className={`cor-quadrado${
                            coresAcessorios[categoria]?.toLowerCase() ===
                            hex.toLowerCase()
                              ? " selecionada"
                              : ""
                          }${!canSelectColor ? " nao-colorizavel" : ""}`}
                          style={{ background: hex }}
                          onClick={
                            canSelectColor
                              ? () =>
                                  setCoresAcessorios((prev) => ({
                                    ...prev,
                                    [categoria]: hex,
                                  }))
                              : undefined
                          }
                          aria-label={hex}
                          type="button"
                          disabled={!canSelectColor}
                        />
                      ))}
                    </div>
                    <img
                      src={"/img/rightt.png"}
                      alt="Próxima"
                      className="seta-paleta"
                      onClick={canSelectColor ? avancarPaginaCor : undefined}
                      style={{
                        visibility: totalPaginasCor > 1 ? "visible" : "hidden",
                        cursor: canSelectColor ? "pointer" : "default",
                        opacity: canSelectColor ? 1 : 0.5,
                      }}
                    />
                  </div>
                </div>

                <div className="seletor-fundos">
                  <h4>Fundos</h4>
                  <div className="paleta-fundos-paginada">
                    <img
                      src={"/img/leftt.png"}
                      alt="Anterior"
                      className="seta-paleta"
                      onClick={voltarPaginaFundo}
                      style={{
                        visibility:
                          totalPaginasFundo > 1 ? "visible" : "hidden",
                        cursor: "pointer",
                        opacity: 1,
                      }}
                    />
                    <div className="paleta-fundos">
                      {fundosPagina.map((fundo, idx) => (
                        <button
                          key={fundo + idx + paginaFundo}
                          className={`fundo-quadrado${
                            fundoSelecionado === fundo ? " selecionada" : ""
                          }`}
                          onClick={() => setFundoSelecionado(fundo)}
                          aria-label={fundo}
                          type="button"
                        >
                          <img src={`/img/fundos/${fundo}`} alt={fundo} />
                        </button>
                      ))}
                    </div>
                    <img
                      src={"/img/rightt.png"}
                      alt="Próxima"
                      className="seta-paleta"
                      onClick={avancarPaginaFundo}
                      style={{
                        visibility:
                          totalPaginasFundo > 1 ? "visible" : "hidden",
                        cursor: "pointer",
                        opacity: 1,
                      }}
                    />
                  </div>
                </div>
                <button className="botao-salvar" onClick={salvarImagem}>
                  Salvar
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
          </div>
        </div>
      </div>
    </div>
  );
}
