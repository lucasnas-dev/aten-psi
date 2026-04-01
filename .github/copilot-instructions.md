# Instrucoes de Layout, Tipografia e Compatibilidade

Estas instrucoes valem para todo o projeto.

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
