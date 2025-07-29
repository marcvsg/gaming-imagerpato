
Quackrator 🦆

Um editor de personagens interativo em desenvolvimento com React que permite criar e personalizar avatares com diversos acessórios, roupas e cores.

✨ Funcionalidades
- Editor de Personagens: Interface intuitiva para criar avatares personalizados
- Categorias de Acessórios: Chapéus, cabelos, roupas, acessórios de rosto, óculos e acessórios de cabeça
- Sistema de Cores: Personalização de cores para diferentes tipos de acessórios
- Fundos Personalizáveis: Múltiplas opções de fundo para o personagem
- Tons de Pele: Diversas opções de cor de pele
- Posicionamento Dinâmico: Sistema de posicionamento e redimensionamento de acessórios
- Responsivo: Interface adaptada SOMENTE para desktop e com aviso para dispositivos móveis
- Exportação: Funcionalidade para salvar o personagem criado

Tecnologias

- React 19.1.0 - Framework principal
- Vite - Build tool e servidor de desenvolvimento
- CSS - Estilização personalizada
- Python - Script para processamento de imagens

🎨 Sistema de Acessórios
O projeto inclui um sistema completo de categorização em .json

- ha: Chapéus (12 opções)
- hr: Cabelos (7 opções)
- ch: Roupas (2 opções)
- fa: Acessórios de Rosto (4 opções)
- ea: Óculos (4 opções)
- he: Acessórios de Cabeça (3 opções)
- skin: Tons de Pele (6 opções)

## Versão Mobile

O site agora possui uma página específica para dispositivos móveis que:

- Detecta automaticamente dispositivos móveis (largura <= 768px)
- Exibe uma página informativa explicando que o site funciona melhor em desktop
- Oferece botões para acessar no desktop ou voltar
- Mantém a identidade visual do projeto

## Estrutura do Projeto

```
src/
├── App.jsx              # Componente principal (versão desktop)
├── MobilePage.jsx       # Página específica para mobile
├── App.css              # Estilos da versão desktop
├── MobilePage.css       # Estilos da página mobile
└── styles/
    └── style.css        # Estilos globais
```

## Tecnologias

- React
- Vite
- CSS3
- JavaScript ES6+

## Instalação

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
