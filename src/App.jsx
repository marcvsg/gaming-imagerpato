import React, { useState } from "react";
import { useRef } from "react";
import posicoesAcessorios from "./acessorios-posicoes.json";
import './styles/style.css';

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

  //Cor atual do Seletor
  const [corAcessorio, setCorAcessorio] = useState("#4c5d58");

  const [editando, setEditando] = useState(false);
  const areaRef = useRef(null);
  const [drag, setDrag] = useState({ ativo: false, offsetX: 0, offsetY: 0 });
  // Estado para armazenar o acessório selecionado de cada categoria
  const [selecionados, setSelecionados] = useState({});

  //Array de Cache para Novas Imagens geradas
  const [imagensColoridas, setImagensColoridas] = useState({});

  // Estado de Seletor de Cores
  const [canSelectColor, setCanSelectColor] = useState(false);


  const roupasCategoria = filtrarPorCategoria(categoria);
  const roupaAtual = roupasCategoria[indiceRoupa] || "";

  // Atualizar o acessório selecionado ao navegar
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

  // Função para colorir imagem usando Canvas
  const colorirImagem = async (src, cor) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        // Desenhar a imagem original
        ctx.drawImage(img, 0, 0);

        // Obter dados dos pixels
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Converter cor HEX para RGB
        const hex = cor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // Aplicar cor aos pixels não transparentes
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3]; // Canal alpha

          if (alpha > 0) { // Se o pixel não é transparente
            
            const gray = data[i]; // Valor do grayscale (R=G=B em grayscale)
            const intensity = gray / 255; // Normalizar para 0-1

            const red = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];
            
            // Verificar se o pixel é cinza (R ≈ G ≈ B com tolerância)
            const isGray = Math.abs(red - green) <= 5 && 
                          Math.abs(green - blue) <= 5 && 
                          Math.abs(red - blue) <= 5;
            
            if (!isGray) continue; 
            // Aplicar a cor mantendo a intensidade do grayscale
            data[i] = Math.round(r * intensity);     // Red
            data[i + 1] = Math.round(g * intensity); // Green
            data[i + 2] = Math.round(b * intensity); // Blue
            // Alpha permanece o mesmo
          }
        }

        // Colocar os pixels coloridos de volta no canvas
        ctx.putImageData(imageData, 0, 0);

        // Converter para data URL
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };

      img.src = src;
    });
  };

  // Função para obter ou criar imagem colorida
  const obterImagemColorida = async (src, cor) => {

    //Criar chave unico com a Imagem - Cor por demanda
    const chave = `${src}-${cor}`;

    // Se ja existe uma imagem colorida no cache ele retorna a mesma
    if (imagensColoridas[chave]) {
      return imagensColoridas[chave];
    }

    // Função Assincrona para Colorir a Imagem (Retorna a Imagem Colorida)
    const imagemColorida = await colorirImagem(src, cor);


    //Chamada de função set para atualizar o Objeto de Cache de Imagens Coloridas
    setImagensColoridas(objetoCache => ({
      ...objetoCache,
      [chave]: imagemColorida
    }));

    return imagemColorida;
  };


  // Componente para imagem colorida
  const ImagemColorida = ({ src, cor, ...props }) => {
    const [imagemColorida, setImagemColorida] = useState(null);

    React.useEffect(() => {

      //Se nao pode selecionar cor, retornar a original
      if (!canSelectColor) {
        src;
        return;
      }

      if (src && cor) {
        obterImagemColorida(src, cor).then(setImagemColorida);
      }
    }, [src, cor]);

    return (
      <img
        src={imagemColorida || src}
        {...props}
      />
    );
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

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="cor">Cor do acessório: </label>

        {canSelectColor && (
          <input
            type="color"
            id="cor"
            value={corAcessorio}
            onChange={(e) => setCorAcessorio(e.target.value)}
            style={{ marginLeft: 10, width: 50, height: 30 }}
          />
        )}

        <span style={{ marginLeft: 10, fontFamily: 'monospace' }}>
          {corAcessorio}
        </span>
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
            className="pixelated"
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
            else if (cat === "hr") zIndex = 1; // Cabelo

            return roupa ? (
              <ImagemColorida
                key={cat}
                src={`/img/extra/${roupa}`}
                cor={corAcessorio}
                alt={`Acessório ${cat}`}
                className="pixelated"
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
          <code>{`'${roupaAtual}': { left: ${posicoes[roupaAtual]?.left ?? 100
            }, top: ${posicoes[roupaAtual]?.top ?? 100} },`}</code>
        </div>
      )}
      <button style={{ marginTop: 10 }} onClick={() => setEditando((v) => !v)}>
        {editando ? "Sair do modo edição" : "Editar posição do acessório"}
      </button>
    </div>
  );
}
