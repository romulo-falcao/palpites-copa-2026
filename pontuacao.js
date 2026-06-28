// ============================================================
// pontuacao.js — Lógica de pontuação do bolão
// Regra: 1 ponto por acerto (time classificado no grupo / vencedor no mata-mata)
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
    if (!this.resultados?.grupos || !payload) return { pts: 0, acertos: 0, total: 24 };
    let pts = 0;
    let acertos = 0;
    for (const g of 'ABCDEFGHIJKL') {
      const real = this.resultados.grupos[g];
      if (!real) continue;
      const classificados = [real.primeiro, real.segundo];
      const p1 = payload[g + '_1'];
      const p2 = payload[g + '_2'];
      if (p1 && classificados.includes(p1)) { pts++; acertos++; }
      if (p2 && classificados.includes(p2)) { pts++; acertos++; }
    }
    return { pts, acertos, total: 24 };
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
