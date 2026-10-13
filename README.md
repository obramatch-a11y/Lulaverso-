# LULAVERSO — A Saga dos Guardiões

Jogo de cartas estratégico e humor ficcional, para um jogador, 100% estático e instalável como PWA.

**Site:** https://obramatch-a11y.github.io/Lulaverso-/

## Versão 2.1 (correção de usabilidade)

- Corrigida a sobreposição decorativa que bloqueava os botões na tela inicial.
- **Começar a jogar** agora abre diretamente o duelo.
- Cartas com custo, poder, explicação, ataque e vida visíveis; ficha detalhada ao tocar na coleção.
- Arena com comandos de ataque e habilidade nomeados, instruções contextuais, feedback de energia e registro do combate.
- Layout responsivo para celular; expansão de cartas e filtros por categoria.
- Dados salvos na mesma chave `lulaverso-save-v1`, preservando o progresso anterior.
- Novo Service Worker com cache atualizado e prioridade para conteúdo da rede.

## Como jogar

No primeiro turno, use energia (EN) para invocar um Guardião. Ele pode agir a partir do turno seguinte. Pressione **ATACAR** ou **ESPECIAL (2 EN)** e toque no alvo. Armadilhas reagem automaticamente a ataques. Magias produzem efeitos imediatos. Reduza a Paciência da base rival a zero para ganhar. A IA responde ao encerrar o turno.

## Estrutura

- `index.html` — página principal
- `styles.css` — interface responsiva
- `game.js` — catálogo de cartas, motor de jogo, campanha, interface e armazenamento local
- `sw.js` — suporte básico a uso offline
- `manifest.webmanifest` e `icon.svg` — ícone e configuração PWA
- `.github/workflows/pages.yml` — publicação automática em GitHub Pages

Para testar localmente use um servidor HTTP simples. Não há segredos, API nem dependências externas.

## Limitações

Protótipo funcional com **ilustrações provisórias** (emojis e arte CSS), sem as animações ou vozes definitivas de anime. A pontuação de conquistas é fictícia, não equivale a voto real. Políticas públicas são descritas de modo resumido, sem associação de elegibilidade ou benefício a preferências eleitorais.

Licença do código: MIT (as marcas e símbolos de terceiros não são cobertos pela licença).