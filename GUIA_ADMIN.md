# GUIA DO ADMIN — Palpites Copa do Mundo 2026

## Índice

1. [Criar a planilha](#1-criar-a-planilha)
2. [Adicionar o Apps Script](#2-adicionar-o-apps-script)
3. [Publicar o Web App](#3-publicar-o-web-app)
4. [Configurar a planilha](#4-configurar-a-planilha)
5. [Adicionar usuários](#5-adicionar-usuarios)
6. [Testar](#6-testar)
7. [Liberar a Fase 1](#7-liberar-a-fase-1)
8. [Acompanhar palpites](#8-acompanhar-palpites)
9. [Fechar a Fase 1](#9-fechar-a-fase-1)
10. [Fase 2 — Mata-mata](#10-fase-2--mata-mata)
11. [Solução de problemas](#11-solucao-de-problemas)

---

## 1. Criar a planilha

1. Acesse [sheets.google.com](https://sheets.google.com) e clique em **Novo** → **Planilha vazia**
2. Renomeie para `Palpites Copa 2026`
3. Crie **4 abas** com estes nomes exatos:
   - Clique em `+` no canto inferior esquerdo para adicionar abas

| Aba | Função |
|-----|--------|
| `Controles` | Liga/desliga fases |
| `Usuarios` | Lista de participantes autorizados |
| `Times` | Todas as 48 seleções (já preenchido) |
| `Palpites` | Onde os palpites são salvos (vazio) |

### Aba "Controles"

| | A | B |
|---|---|---|
| **1** | FASE_ATIVA | grupos |

- Na célula **A1**, escreva exatamente `FASE_ATIVA`
- Na célula **B1**, clique em **Dados** → **Validação de dados**
- Regra: **Lista de itens** → `grupos, mata-mata, fechado`
- Isso cria um dropdown. Selecione `grupos` nele.
- Pronto — o sistema lê direto o valor da célula B1.

### Aba "Usuarios"

| | A | B |
|---|---|---|
| **1** | Nome | Token |
| **2** | João | g7x2 |
| **3** | Maria | p9m4 |

- Coluna A: nome do amigo
- Coluna B: token de 4 caracteres (pode ser qualquer combinação de letras e números)
- **Importante:** só quem está nesta lista + token correto consegue salvar palpite
- Para gerar tokens, use: [bit.ly/gerar-token](https://bit.ly/gerar-token) (site com gerador) ou invente combinações simples tipo `joao` mesmo — é só pra evitar que alguém de fora se passe por outro usuário.

### Aba "Times" — copie e cole exatamente isto:

| Grupo | Codigo | Time |
|-------|--------|------|
| A | mx | México |
| A | za | África do Sul |
| A | kr | Coreia do Sul |
| A | cz | República Tcheca |
| B | ca | Canadá |
| B | ba | Bósnia e Herzegovina |
| B | qa | Catar |
| B | ch | Suíça |
| C | br | Brasil |
| C | ma | Marrocos |
| C | ht | Haiti |
| C | gb-sct | Escócia |
| D | us | Estados Unidos |
| D | py | Paraguai |
| D | au | Austrália |
| D | tr | Turquia |
| E | de | Alemanha |
| E | cw | Curaçao |
| E | ci | Costa do Marfim |
| E | ec | Equador |
| F | nl | Holanda |
| F | jp | Japão |
| F | se | Suécia |
| F | tn | Tunísia |
| G | be | Bélgica |
| G | eg | Egito |
| G | ir | Irã |
| G | nz | Nova Zelândia |
| H | es | Espanha |
| H | cv | Cabo Verde |
| H | sa | Arábia Saudita |
| H | uy | Uruguai |
| I | fr | França |
| I | sn | Senegal |
| I | iq | Iraque |
| I | no | Noruega |
| J | ar | Argentina |
| J | dz | Argélia |
| J | at | Áustria |
| J | jo | Jordânia |
| K | pt | Portugal |
| K | cd | RD Congo |
| K | uz | Uzbequistão |
| K | co | Colômbia |
| L | gb-eng | Inglaterra |
| L | hr | Croácia |
| L | gh | Gana |
| L | pa | Panamá |

### Aba "Palpites"

Deixe vazia. O sistema preenche automaticamente.

---

## 2. Adicionar o Apps Script

1. Na planilha, clique em **Extensões** → **Apps Script**
2. Uma nova aba abre. Apague o código padrão (`function myFunction()`)
3. Abra o arquivo **`Code.gs`** (que está na pasta do projeto)
4. Copie TODO o conteúdo de `Code.gs`
5. Cole no editor do Apps Script (substituindo tudo)
6. Clique no ícone de **Salvar** (disquete) ou `Ctrl+S`
7. Dê um nome ao projeto: `API Palpites Copa`

---

## 3. Publicar o Web App

1. Clique em **Implantar** → **Nova implantação**
2. Em **Tipo de implantação**, escolha **Web app**
3. Configure:
   - **Descrição:** `API Palpites Copa`
   - **Executar como:** `Eu` (seu email)
   - **Quem tem acesso:** `Qualquer pessoa`
4. Clique em **Implantar**
5. **Copie a URL do Web App** — você vai precisar dela

> ⚠️ **Importante:** Esta URL é sua API. Mantenha-a em local seguro, mas qualquer pessoa com o link pode chamá-la (só consegue salvar palpite quem tem usuário + token válidos).

---

## 4. Atualizar a URL no sistema

A URL copiada precisa ser informada ao desenvolvedor (eu) para que eu coloque no HTML. Ou, se você tiver acesso ao repositório, edite o arquivo `index.html` e procure por:

```javascript
const API_URL = '';
```

Substitua a string vazia pela URL do Web App.

---

## 5. Testar

Antes de liberar para geral, faça um teste:

1. Adicione você mesmo na aba **Usuarios** (seu nome + token)
2. Abra o link do site: `https://SEU_USUARIO.github.io/REPOSITORIO/`
3. Digite seu nome e token na tela de login
4. Preencha alguns grupos
5. Clique em **Salvar Palpite**
6. Verifique se apareceu uma linha na aba **Palpites** da planilha
7. Se apareceu ✅, está funcionando!
8. Se não, veja a [Solução de problemas](#11-solucao-de-problemas)

---

## 6. Liberar a Fase 1

1. Na aba **Controles**, selecione `grupos` no dropdown da célula B1
2. Envie **um único link** para o grupo:

```
https://SEU_USUARIO.github.io/REPOSITORIO/
```

> Cada amigo abre o link, digita o próprio nome + token e faz o palpite. Sem links individuais.

---

## 7. Acompanhar palpites

Abra a aba **Palpites** na planilha. Conforme as pessoas enviam, novas linhas aparecem:

| Usuario | Data | Fase | Payload |
|---------|------|------|---------|
| João | 10/06/2026 | grupos | {"A1":"México","A2":"Coreia do Sul",...} |
| Maria | 10/06/2026 | grupos | {"A1":"México","A2":"África do Sul",...} |

Você pode abrir o **`ranking.html`** para ver tudo de forma mais organizada:
`https://SEU_USUARIO.github.io/REPOSITORIO/ranking.html`

---

## 8. Fechar a Fase 1

Quando todos enviarem (ou no dia 11/jun — início da Copa):

1. Na aba **Controles**, mude B1 para `fechado`
2. Pronto. Ninguém mais consegue enviar palpite.

---

## 9. Fase 2 — Mata-mata

A Fase 2 só começa **depois que a fase de grupos terminar** (27/jun).

### Passo a passo

**a) Aguarde o fim dos grupos (27/jun)**

**b) Descubra os 32 times classificados**

Você pode consultar sites como:
- FIFA.com
- Globo Esporte
- CNN Esporte

**c) Preencha o `classificados.json`**

Abra o arquivo `classificados.json` (na pasta do projeto) e preencha:

```json
{
  "grupos": {
    "A": { "primeiro": "México", "segundo": "África do Sul", "terceiro": "Coreia do Sul" }
  }
}
```

- `primeiro` e `segundo`: os times que avançaram direto de cada grupo
- `terceiro`: o time que ficou em 3º no grupo (mesmo que não tenha se classificado entre os 8 melhores)
- `terceiros_classificados`: lista com os 8 times que realmente avançaram como melhores terceiros
- `mata_mata/32avos`: os 16 confrontos da Rodada de 32, com time1 e time2 de cada jogo

> Os nomes dos times devem ser escritos **exatamente como estão na aba Times** da planilha.

**d) Avise o desenvolvedor (eu)** que o arquivo foi atualizado. Eu atualizo o sistema e aviso quando estiver pronto.

**e) Mude a Controles para `mata-mata`**

Na aba **Controles**, selecione `mata-mata` no dropdown.

**f) Avise o grupo**

Compartilhe o mesmo link de sempre. Cada um faz login com nome + token e vê a chave do mata-mata.

```
https://SEU_USUARIO.github.io/REPOSITORIO/
```

**g) Feche quando todos enviarem**

Mude Controles para `fechado`.

---

## 10. Depois da Copa

Abra o ranking:

```
https://SEU_USUARIO.github.io/REPOSITORIO/ranking.html
```

Tabela com todos os palpites lado a lado. Cada um confere seus acertos.

---

## 11. Solução de problemas

| Problema | Causa | Solução |
|----------|-------|---------|
| Tela de login mostra "Nome ou token inválido" | Nome ou token errados | Verifique se o nome e token estão na aba Usuarios |
| Página mostra "Palpites encerrados" | Célula B1 = "fechado" | Mude para "grupos" ou "mata-mata" |
| Página em branco / não carrega | API_URL vazia ou URL errada | Verifique se a URL do Web App foi configurada corretamente no HTML |
| Erro "Usuário ou token inválido" ao salvar | Token não bate com a planilha | Confira se o token digitado é o mesmo da aba Usuarios |
| Erro "Fase não está ativa" | Fase no Controles não corresponde | Altere B1 no Controles ou aguarde o admin liberar |
| "Você já enviou seu palpite" | Pessoa já submeteu | Delete a linha dela na aba Palpites se quiser liberar reenvio |
| Bandeiras não aparecem | flagcdn.com temporariamente fora | Só o nome do time aparece, sem quebrar o funcionamento |
| Planilha não encontrada | O script perdeu referência | Reimplante o Web App |

---

## Checklist rápido para o dia da liberação

- [ ] Planilha criada com 4 abas
- [ ] Aba Times preenchida
- [ ] Aba Usuarios com nomes + tokens
- [ ] Apps Script colado e salvo
- [ ] Web App implantado (URL copiada)
- [ ] URL configurada no HTML
- [ ] B1 = "grupos" (ou "mata-mata")
- [ ] Link único compartilhado com o grupo
- [ ] Teste realizado com sucesso
