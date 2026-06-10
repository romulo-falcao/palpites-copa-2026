// ============================================================
// Google Apps Script — API Palpites Copa do Mundo 2026
// ============================================================
// COMO USAR:
// 1. Abra a planilha no Google Sheets
// 2. Extensões → Apps Script
// 3. Cole este código inteiro
// 4. Salve (Ctrl+S) e clique em "Implantar" → "Nova implantação"
// 5. Tipo: "Web app", Executar como: "Eu", Quem tem acesso: "Qualquer pessoa"
// 6. Copie a URL gerada — é a URL da API
// ============================================================

// ============================================================
// CONFIGURAÇÃO
// ============================================================
// NÃO precisa alterar nada aqui. O script lê os dados das abas da planilha.

// ============================================================
// GET — Leitura de dados
// ============================================================
function doGet(e) {
  var action = e && e.parameter && e.parameter.action ? e.parameter.action : 'config';

  if (action === 'config') return getConfig();
  if (action === 'ranking') return getRanking();

  return respostaErro('Acao invalida');
}

// ============================================================
// POST — Salvar palpite
// ============================================================
function doPost(e) {
  try {
    var dados = JSON.parse(e.postData.contents);
    return salvarPalpite(dados);
  } catch (err) {
    return respostaErro('Erro ao processar: ' + err.message);
  }
}

// ============================================================
// Funcoes internas
// ============================================================

function getConfig() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // --- Aba Controles ---
  var ctrl = ss.getSheetByName('Controles');
  if (!ctrl) return respostaErro('Aba "Controles" nao encontrada');

  var fase = String(ctrl.getRange('B1').getValue()).trim() || 'fechado';

  // --- Aba Usuarios ---
  var usuariosSheet = ss.getSheetByName('Usuarios');
  var usuarios = [];
  if (usuariosSheet) {
    var dadosUsuarios = usuariosSheet.getDataRange().getValues();
    for (var i = 0; i < dadosUsuarios.length; i++) {
      var nome = dadosUsuarios[i][0];
      var token = dadosUsuarios[i][1];
      if (nome && token) {
        usuarios.push({ nome: String(nome).trim(), token: String(token).trim() });
      }
    }
  }

  // --- Aba Times ---
  var timesSheet = ss.getSheetByName('Times');
  var times = [];
  if (timesSheet) {
    var dadosTimes = timesSheet.getDataRange().getValues();
    for (var j = 0; j < dadosTimes.length; j++) {
      var grupo = dadosTimes[j][0];
      var codigo = dadosTimes[j][1];
      var nome = dadosTimes[j][2];
      if (grupo) {
        times.push({
          grupo: String(grupo).trim(),
          codigo: String(codigo).trim(),
          nome: String(nome).trim()
        });
      }
    }
  }

  return respostaJson({
    fase: fase,
    usuarios: usuarios,
    times: times
  });
}

function getRanking() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Palpites');

  if (!sheet) return respostaJson({ headers: [], linhas: [] });

  var data = sheet.getDataRange().getValues();
  if (data.length === 0) return respostaJson({ headers: [], linhas: [] });

  var headers = data[0];
  var linhas = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) {
      linhas.push(data[i]);
    }
  }

  return respostaJson({
    headers: headers,
    linhas: linhas
  });
}

function salvarPalpite(dados) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Validar dados obrigatorios
  if (!dados.usuario || !dados.token || !dados.fase || !dados.payload) {
    return respostaErro('Dados incompletos (usuario, token, fase, payload obrigatorios)');
  }

  // Validar usuario + token
  var usuariosSheet = ss.getSheetByName('Usuarios');
  if (!usuariosSheet) return respostaErro('Aba "Usuarios" nao encontrada');

  var dadosUsuarios = usuariosSheet.getDataRange().getValues();
  var autorizado = false;
  for (var i = 0; i < dadosUsuarios.length; i++) {
    if (String(dadosUsuarios[i][0]).trim() === String(dados.usuario).trim() &&
        String(dadosUsuarios[i][1]).trim() === String(dados.token).trim()) {
      autorizado = true;
      break;
    }
  }
  if (!autorizado) return respostaErro('Usuario ou token invalido');

  // Validar fase
  var ctrl = ss.getSheetByName('Controles');
  if (ctrl) {
    var faseAtiva = String(ctrl.getRange('B1').getValue()).trim() || 'fechado';
    if (String(faseAtiva).trim() !== String(dados.fase).trim()) {
      return respostaErro('Fase "' + dados.fase + '" nao esta ativa no momento');
    }
  }

  // Verificar duplicidade
  var palpitesSheet = ss.getSheetByName('Palpites');
  if (!palpitesSheet) {
    palpitesSheet = ss.insertSheet('Palpites');
    palpitesSheet.appendRow(['Usuario', 'Data', 'Fase', 'Payload']);
  }

  var palpitesExistentes = palpitesSheet.getDataRange().getValues();
  for (var j = 1; j < palpitesExistentes.length; j++) {
    if (String(palpitesExistentes[j][0]).trim() === String(dados.usuario).trim() &&
        String(palpitesExistentes[j][2]).trim() === String(dados.fase).trim()) {
      return respostaErro('Voce ja enviou seu palpite para a fase "' + dados.fase + '"');
    }
  }

  // Salvar
  palpitesSheet.appendRow([
    String(dados.usuario).trim(),
    new Date(),
    String(dados.fase).trim(),
    JSON.stringify(dados.payload)
  ]);

  return respostaJson({ success: true, message: 'Palpite salvo com sucesso!' });
}

// ============================================================
// Utilitarios
// ============================================================

function respostaJson(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function respostaErro(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ error: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}
