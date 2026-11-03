# Lotevo

**Cada lote no seu tempo.**

Protótipo web desenvolvido para o **Grand Prix SENAI — Da ideia à startup: protótipo e pitch**, com foco no **Tema 2: Validade e desperdício no estoque**.

## Sobre o projeto

A Lotevo apresenta uma proposta de organização de estoques de alimentos, reunindo informações sobre produtos, lotes, validades, saídas e perdas.

O objetivo é facilitar a identificação dos itens que precisam de atenção e apoiar a redução do desperdício. A organização dos exemplos segue a regra **FEFO — First Expired, First Out: primeiro que vence, primeiro que sai**.

**Esta versão é um protótipo de interface navegável, com dados ilustrativos.** Os formulários possuem validações básicas, mas seus envios não criam registros nem alteram o estoque.

## Equipe

- Leandro Giovanelli
- Gabriel Pompermayer
- Davi Viçosi
- Gabriel Lopes

## Perfis de acesso

| Perfil | Proposta |
| --- | --- |
| Estoquista | Consultar produtos e lotes, identificar prioridades e acessar os formulários de cadastro e movimentação. |
| Gestor | Acompanhar o resumo do estoque, os vencimentos, os valores em risco e os relatórios de perdas. |

A seleção de perfil é simulada. Não há autenticação real nem controle de permissões.

## Páginas

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Apresentação da marca, do problema e da proposta da Lotevo. |
| `pratica.html` | Demonstração ampliada dos lotes, com detalhes expansíveis. |
| `entrada.html` | Escolha entre Estoquista e Gestor. |
| `estoquista.html` | Visão inicial do estoquista e prioridades do estoque. |
| `dashboard.html` | Resumo do gestor, vencimentos próximos e perdas. |
| `produtos.html` | Lista de produtos e formulário demonstrativo de cadastro. |
| `lotes.html` | Lotes organizados por validade, com localização, quantidade e status. |
| `cadastro-lote.html` | Formulário de produto, código, fabricação, validade, quantidade e localização. |
| `movimentacoes.html` | Formulário de saída ou perda e histórico ilustrativo. |
| `relatorios.html` | Perdas por motivo e categoria, desperdício e produtos com perdas por vencimento. |
| `exemplos.html` | Página complementar de exemplos de lotes. |

Existem também versões de páginas internas com o prefixo `gestor-` e a página `estoquista-relatorios.html`, utilizadas para manter a identificação do perfil durante a navegação.

## Requisitos contemplados nesta versão

A tabela diferencia as interações disponíveis das funcionalidades que ainda dependem de lógica de aplicação.

| Requisito do tema | Situação atual |
| --- | --- |
| RF01 — Seleção de perfil | Implementada por links, com telas específicas para Estoquista e Gestor. |
| RF02 — Cadastro de produtos | Formulário e validação básica disponíveis; não adiciona produtos à lista. |
| RF03 — Cadastro de lotes | Formulário e validação básica disponíveis; não cria lotes. |
| RF04 — Ordenação FEFO | Os exemplos estão previamente ordenados por validade; não há ordenação automática de novos registros. |
| RF05 — Classificação por validade | Status e cores demonstrados com datas de referência fixas; não são recalculados pela data atual. |
| RF06 — Filtros | Filtro por status implementado em CSS; filtros por produto, categoria e localização não implementados. |
| RF08 — Registro de saída | Interface demonstrativa; não reduz quantidades nem seleciona automaticamente o lote por FEFO. |
| RF10 — Registro de perda | Interface com quantidade e motivo; não registra perdas efetivamente. |
| RF11 — Valores em risco e perdidos | Valores ilustrativos exibidos; sem cálculo dinâmico. |
| RF14 — Alertas de vencimento | Lotes prioritários apresentados com base nos exemplos fixos. |
| RF15 — Dashboard e relatórios | Painéis e indicadores demonstrativos; sem atualização a partir dos formulários. |
| RF16 — Histórico de movimentações | Histórico ilustrativo, sem inclusão de novas movimentações. |

A busca específica por código de lote ainda não está implementada. A interface orienta o uso da busca do navegador, com **Ctrl + F**.

## Identidade visual

### Paleta de cores

| Função | Cor | HEX |
| --- | --- | --- |
| Primária | Verde escuro | `#173F35` |
| Secundária | Verde sálvia | `#B8D9A8` |
| Destaque e ação | Laranja | `#F5A35B` |
| Fundo claro | Marfim | `#F7F5EE` |
| Texto escuro | Grafite | `#202B28` |

### Tipografia e ilustrações

- **Alte Haas Grotesk:** títulos principais.
- **Quicksand:** textos, elementos de interface e nome da marca.
- **Madimi One:** pequenas chamadas decorativas.
- Ilustrações de alimentos, caixas e prateleiras com estilo desenhado.
- Logotipo inspirado em um relógio, relacionado ao acompanhamento dos prazos.

As fontes e imagens utilizadas estão incluídas na pasta `assets/`. As ilustrações exibidas nas páginas usam WebP para reduzir o tamanho dos arquivos.

## Tecnologias

- **HTML5:** estrutura, hyperlinks, formulários e detalhes expansíveis.
- **CSS3:** identidade visual, responsividade, filtros por status e efeitos visuais.
- **JavaScript puro:** animações, transições e controle do movimento entre páginas.

O projeto utiliza páginas HTML independentes. Não exige frameworks, servidor de aplicação ou banco de dados.

## Animações e navegação

- Zoom de aproximadamente **1,8 segundo** ao rolar para baixo no topo da página inicial, em telas de computador.
- Ampliação proporcional da cena em direção ao tablet, com desfoque do entorno.
- Abertura de `pratica.html` ao concluir a animação.
- Movimento inverso ao rolar para cima no topo dessa página.
- Cancelamento da transição com a tecla **Esc**.
- Carregamento animado com a marca ao acessar a escolha de perfil e os painéis.
- Giro do ponteiro da logo ao passar o mouse ou receber foco.
- Efeitos em botões, ícones, ilustrações e entradas de seções.

A preferência de movimento reduzido do dispositivo é respeitada. Em telas pequenas, o acesso à demonstração é feito por link, sem o zoom de rolagem.

## Como executar

1. Baixe os arquivos do repositório e extraia a pasta, caso estejam em ZIP.
2. Mantenha `index.html`, os demais arquivos HTML e as pastas `css/`, `js/` e `assets/` juntos.
3. Abra `index.html` em um navegador atualizado.
4. Utilize os menus e botões para navegar.

Não é necessário instalar dependências. As fontes e imagens locais permitem abrir o protótipo sem conexão com a internet.

## Organização dos arquivos

| Pasta ou arquivo | Função |
| --- | --- |
| `*.html` | Páginas do protótipo. |
| `css/` | Estilos, componentes, responsividade e animações CSS. |
| `js/` | Scripts das animações e transições. |
| `assets/fonts/` | Fontes utilizadas na interface. |
| `assets/illustrated/` | Ilustrações do projeto. |
| `assets/favicon.svg` | Ícone da aba do navegador. |
| `README.md` | Documentação do projeto. |

## Limitações atuais

- Os cadastros e as movimentações não armazenam nem atualizam dados.
- As datas, quantidades, classificações e métricas são exemplos fixos.
- A apresentação usa referência em **13/10/2026**; as telas operacionais usam referência em **20/10/2026**.
- As validações HTML verificam campos obrigatórios e alguns formatos e limites; não substituem regras completas de negócio.
- O JavaScript utiliza um marcador temporário em `sessionStorage` apenas para coordenar o retorno da animação. Dados de estoque não são armazenados nele.

## Próximos passos

- Implementar criação e atualização de produtos e lotes em memória.
- Automatizar a ordenação FEFO e a classificação por dias restantes.
- Validar saídas conforme a quantidade disponível.
- Registrar movimentações e recalcular indicadores.
- Ampliar os filtros e implementar a busca por código.
- Realizar testes com usuários e documentar os ajustes necessários.

## Créditos

Projeto acadêmico desenvolvido no contexto do Grand Prix SENAI.

A concepção do protótipo, a elaboração do código, dos textos e dos recursos visuais contaram com apoio de inteligência artificial. As decisões de apresentação e os refinamentos foram orientados pelas solicitações da equipe.

As fontes Quicksand e Madimi One acompanham os respectivos arquivos de licença na pasta de fontes.
