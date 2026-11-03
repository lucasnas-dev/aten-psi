# Instrucoes de Layout, Tipografia e Compatibilidade

Estas instrucoes valem para todo o projeto.

## Padrao Visual das Paginas Protegidas

- Usar a pagina de Pacientes (lista/tabela) e a pagina de Configuracoes como referencias visuais ao criar ou ajustar paginas, abas e formularios.
- O layout protegido ja define as margens externas no `main`: `px-4 py-3 sm:px-6 sm:py-4`. Respeitar esse alinhamento com o topo e a lateral esquerda.
- Nao duplicar o padding externo em paginas ou formularios internos, nem usar margens negativas para compensar o layout principal. Nao alterar o layout global para ajustar uma unica pagina.
- Preferir conteudo direto, sem cards ou containers decorativos aninhados. Separar grupos com titulos discretos, `border-t`/`border-b` e `pt-3`/`pb-2` quando necessario. Preservar alertas com significado funcional.
- Quando a aba ja identificar claramente o conteudo, nao repetir seu titulo nem adicionar uma linha separadora antes dos campos. Manter titulos apenas para subsecoes distintas, preservando a identificacao acessivel do painel pela aba.
- Usar `space-y-3` ou `space-y-4` entre blocos e `gap-3` em grids. Formularios de cadastro devem usar `w-full min-w-0 max-w-4xl`; configuracoes e formularios clinicos mais densos podem usar `max-w-5xl`. Manter o alinhamento a esquerda, sem `mx-auto` quando isso deslocar o conteudo em relacao as demais paginas.
- Para identificacao e formularios, preferir `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, conforme a quantidade e o tamanho dos campos, com `min-w-0` e quebra de textos longos.
- Usar `text-sm` para labels, valores e titulos internos; `font-semibold` para titulos e destaques; `text-muted-foreground` para labels e informacoes secundarias. Reservar fontes maiores para o titulo principal da pagina.
- Preferir componentes de UI existentes, botoes secundarios `variant="outline" size="sm"`, inputs compactos (`h-8 text-sm`) e icones `h-4 w-4`, conforme a funcao de cada acao.
- Usar tokens semanticos do tema (`text-foreground`, `text-muted-foreground`, `border-border`, `bg-card`) em vez de cores fixas para superficies e textos comuns.
- Manter dados, regras de negocio, acessibilidade e exclusoes de impressao ao fazer ajustes visuais. Usar `dl`/`dt`/`dd` em dados somente de leitura; reservar labels de formulario para controles associados.

## Densidade Compacta e Largura de Leitura

- Manter a raiz tipografica em `100%`, respeitando as preferencias do navegador. Aplicar `text-sm` ao body e aos campos; nao reduzir o `html` para compactar a interface. Com a base padrao de 16px, `text-sm` corresponde a 14px e `text-xs` a 12px.
- Usar `text-xs` em ajuda, descricoes, mensagens de validacao, metadados e badges. Labels e valores principais continuam em `text-sm`.
- Titulos de secao e abas nao devem ultrapassar `text-base` ou `text-lg`; evitar `text-xl`, `text-2xl` e `text-3xl` em formularios cotidianos. Nao alterar numeros de indicadores apenas por serem maiores que os textos do formulario.
- Inputs e Selects usam `h-8 text-sm` por padrao; `h-9` e permitido quando necessario. Textareas usam `text-sm`, altura minima confortavel e redimensionamento vertical; nao limitar notas clinicas a altura de um input.
- FormItem usa `gap-1`; secoes usam `space-y-3`/`space-y-4`; cards usam `gap-3 py-4` com `px-4` no cabecalho, conteudo e rodape. Evitar `p-6`, `p-8` e `gap-6` sem necessidade funcional.
- Limitar a largura dos formularios, nao de tabelas, agendas e dashboards: esses componentes podem aproveitar toda a largura disponivel com rolagem interna quando necessario. Na impressao do prontuario, liberar a largura com `print:max-w-none`.
- Preservar foco visivel, estados disabled/invalid, associacao entre labels e campos, contraste, zoom e navegacao por teclado. Permitir quebra de texto em botoes e grupos que precisem se adaptar ao mobile.

## Responsividade

- Sempre desenvolver com abordagem mobile-first.
- Evitar larguras e alturas fixas para containers principais.
- Preferir `min-w-0`, `max-w-full`, `flex-wrap` e `overflow-x-auto` em blocos largos.
- Em grids densos (tabelas, calendarios e timelines), permitir rolagem interna no componente em telas pequenas.

## Tipografia Responsiva

- Usar classes responsivas do Tailwind para texto e espacamento (`text-xs sm:text-sm`, `text-base sm:text-lg`, etc.).
- Evitar `text-[Npx]` sem breakpoint, exceto para badges ou micro-labels.
- Priorizar escala em `rem` para acompanhar a base tipografica global.
- Para textos de corpo, labels e conteudo principal, priorizar tamanho profissional e legivel (preferencia por `text-sm` no dia a dia), evitando fonte pequena demais.
- Manter hierarquia consistente: titulos > subtitulos > corpo > legenda.

## Compatibilidade Entre Navegadores

- Sempre incluir fallback para viewport height: `vh`, `-webkit-fill-available` e `dvh` quando aplicavel.
- Nao depender de um unico recurso moderno sem fallback.
- Garantir usabilidade em Chrome, Edge, Firefox e Safari (desktop e mobile).

## Checklist Antes de Concluir Alteracoes de UI

- Validar visual em largura pequena (mobile), media (tablet) e grande (desktop).
- Confirmar ausencia de corte lateral e scroll horizontal indevido na pagina.
- Confirmar legibilidade dos textos em todos os breakpoints.
