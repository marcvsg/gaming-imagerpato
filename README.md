# Pato Personalizado

Um editor de personalização de patos desenvolvido em React.

## Funcionalidades

- Editor completo de personalização de patos
- Seleção de cores para acessórios
- Escolha de fundos
- Salvamento de imagens personalizadas
- Interface otimizada para desktop

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

## Como Funciona

1. **Detecção de Dispositivo**: O componente principal detecta se o usuário está em um dispositivo móvel
2. **Renderização Condicional**: Se for mobile, exibe `MobilePage`, senão exibe o editor completo
3. **Experiência Desktop**: Mantém todas as funcionalidades originais para desktop
4. **Experiência Mobile**: Página informativa com design responsivo

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

## Características da Página Mobile

- Design responsivo e atraente
- Mantém a identidade visual do projeto
- Animações suaves
- Botões interativos
- Informações claras sobre a versão desktop
