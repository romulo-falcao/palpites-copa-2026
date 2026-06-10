# AGENTS.md — Palpites Copa do Mundo 2026

## Contexto da sessão anterior

### ✅ Concluído

| O quê | Arquivos |
|-------|----------|
| Controles lê B1 direto (sem varrer linhas) | `Code.gs` — `getConfig()` e `salvarPalpite()` |
| Controles simplificado para 1 linha | `GUIA_ADMIN.md`, `template/Controles.csv` |
| Tela de login (único link para todos) | `index.html` — `#screen-login`, `fazerLogin()` |
| Shift-up ao desmarcar time nos grupos | `index.html` — `clicarTimeGrupo()` |
| Bug do loading infinito corrigido | `index.html` — `mostrarApenas()` |
| Reacesso mostra preview em vez de bloquear | `index.html` — `carregarPalpiteExistente()`, `init()` |
| `classificados.json` preenchido com dados de teste | `classificados.json` |
| CORS fix (apiPost sem Content-Type) | `index.html` — `apiPost()` |
| Feedback visual grupos (contador + ⚠️) | `index.html` — `atualizarGruposUI()` |

### 🔄 Pendente

| # | Item | Detalhe |
|---|------|---------|
| 1 | **Testar Fase 2** | Usuário não testou o mata-mata ainda |
| 2 | **Testar salvamento** | Após CORS fix, verificar POST |
| 3 | **Commit + push** | Subir pro GitHub Pages |

### ✅ Concluído nesta sessão

| Item | Detalhe |
|------|---------|
| Remover 3º lugar da Fase 1 | Grupos agora só seleciona 1º e 2º. Tela de terceiros removida. Fluxo: Grupos → Preview → Salvar |

### Comandos

```bash
# Servidor local para testes
python3 -m http.server 8080 --bind 0.0.0.0

# Acessar
# http://localhost:8080/ (login)
# http://localhost:8080/ranking.html (ranking)
```
