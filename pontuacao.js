// ============================================================
// pontuacao.js — Lógica de pontuação do bolão
// Regra:
//   Grupos: 1 pt por time classificado + 1 pt bônus se acertou a posição (1º/2º)
//   Mata-mata: 1 pt por vencedor acertado
// ============================================================

const PONTUACAO = {
  resultados: null,

  async carregarResultados() {
    const r = await fetch('classificados.json?' + Date.now());
    if (!r.ok) throw new Error('classificados.json nao encontrado');
    this.resultados = await r.json();
    return this.resultados;
  },

  grupos(payload) {
    if (!this.resultados?.grupos || !payload) return { pts: 0, acertos: 0, total: 48 };
    let pts = 0;
    let acertos = 0;
    for (const g of 'ABCDEFGHIJKL') {
      const real = this.resultados.grupos[g];
      if (!real) continue;
      const p1 = payload[g + '_1'];
      const p2 = payload[g + '_2'];
      // p1 = user's 1º pick
      if (p1 === real.primeiro) { pts += 2; acertos++; }
      else if (p1 === real.segundo) { pts += 1; acertos++; }
      // p2 = user's 2º pick
      if (p2 === real.segundo) { pts += 2; acertos++; }
      else if (p2 === real.primeiro) { pts += 1; acertos++; }
    }
    return { pts, acertos, total: 48 };
  },

  mataMata(payload) {
    if (!this.resultados?.mata_mata || !payload) return { pts: 0, acertos: 0, total: 0, pendentes: 0 };
    let pts = 0;
    let acertos = 0;
    let total = 0;
    let pendentes = 0;
    for (const [fase, jogos] of Object.entries(this.resultados.mata_mata)) {
      for (const jogo of jogos) {
        total++;
        const palpite = payload[fase + '_' + jogo.jogo];
        if (jogo.vencedor) {
          if (palpite === jogo.vencedor) { pts++; acertos++; }
        } else {
          pendentes++;
        }
      }
    }
    return { pts, acertos, total, pendentes };
  },

  calcular(usuarioPalpites) {
    const g = this.grupos(usuarioPalpites.grupos);
    const m = this.mataMata(usuarioPalpites['mata-mata']);
    return {
      total: g.pts + m.pts,
      grupos: g,
      mataMata: m
    };
  }
};
