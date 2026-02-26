// === VARIÁVEIS GLOBAIS ===
let blogId = "";
let clientId = "";
let clientSecret = "";
let refreshToken = "";
let apiKey = "";
let apiUrl = "";
let licenseVerified = false; 
let ativo = "";

// === POPUPS ===
const loginPopup = document.getElementById("login-popup");
const apiPopup = document.getElementById("api-popup");
const profilePopup = document.getElementById("profile-popup");

// === ELEMENTOS ===
const loginBtn = document.getElementById("login-btn");
const loginApiKey = document.getElementById("login-apiKey");
const loginBlogId = document.getElementById("login-blogId");
const loginStatus = document.getElementById("login-status");

const apiForm = document.getElementById("api-form");
const cancelBtn = document.getElementById("cancel-btn");
const verifyStatus = document.getElementById("verify-status");

const blogIdInput = document.getElementById("blog-id");
const clientIdInput = document.getElementById("client-id");
const clientSecretInput = document.getElementById("client-secret");
const refreshTokenInput = document.getElementById("refresh-token");
const apiKeyInput = document.getElementById("api-key");
const apiUrlInput = document.getElementById("api-url");

const logoutBtn = document.getElementById("logout-btn");

// === AO CARREGAR A PÁGINA ===
document.addEventListener("DOMContentLoaded", () => {
  const savedCreds = localStorage.getItem("apiCredentials");
  if(savedCreds){
    const creds = JSON.parse(savedCreds);
    carregarCredenciais(creds);
  }
});

// === FUNÇÃO PARA VERIFICAR LICENÇA (GET) ===
async function checkLicense(apiKey){
  const sheetUrl = `https://script.google.com/macros/s/AKfycbwWIYWSxoaEo0HdHJlSQfNDkK_YJjhJyDSMksH7Sn9Z6oL_eWNaXPemg0L5vxi2VAh8ZQ/exec?action=checkLicense&apiKey=${apiKey}`;
  try {
    const response = await fetch(sheetUrl);
    return await response.json();
  } catch(err){
    console.error(err);
    return { valid:false, credentialsExist:false };
  }
}

// === FUNÇÃO PARA REGISTRAR CREDENCIAIS (POST) ===
async function registerCredentials(credentials){
  const sheetUrl = "https://script.google.com/macros/s/AKfycbwWIYWSxoaEo0HdHJlSQfNDkK_YJjhJyDSMksH7Sn9Z6oL_eWNaXPemg0L5vxi2VAh8ZQ/exec";
  try {
    const response = await fetch(sheetUrl, {
      method: "POST",
      body: JSON.stringify(credentials)
    });
    return await response.json();
  } catch(err){
    console.error(err);
    return {status:"error", message:"Erro ao registrar"};
  }
}

// === NOVA FUNÇÃO: LOGIN DIRETO DO SPREADSHEET ===
async function loginSpreadsheet(apiKey, blogId){
  const url = `https://script.google.com/macros/s/AKfycbwWIYWSxoaEo0HdHJlSQfNDkK_YJjhJyDSMksH7Sn9Z6oL_eWNaXPemg0L5vxi2VAh8ZQ/exec?action=login&apiKey=${apiKey}&blogId=${blogId}`;
  try {
    const res = await fetch(url);
    return await res.json();
  } catch(err){
    console.error("Erro ao buscar login:", err);
    return { found:false };
  }
}

// === LOGIN ===
loginBtn.addEventListener("click", async () => {
  const apiKeyValue = loginApiKey.value.trim();
  const blogIdValue = loginBlogId.value.trim();

  if(!apiKeyValue || !blogIdValue){
    loginStatus.innerText = "❌ Informe API Key e Blog ID!";
    loginStatus.style.color = "red";
    return;
  }

  loginStatus.innerText = "🔄 Verificando...";
  loginStatus.style.color = "gold";

  const loginData = await loginSpreadsheet(apiKeyValue, blogIdValue);

  if(!loginData.found){
    loginStatus.innerText = "❌ API Key ou Blog ID inválidos.";
    loginStatus.style.color = "red";
    return;
  }

  salvarELogar(loginData); 
  loginStatus.innerText = "✅ Login bem-sucedido!";
  loginStatus.style.color = "green";

  loginApiKey.value = "";
  loginBlogId.value = "";
});

// === REGISTRO ===
if(apiForm){
  apiForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const credentials = {
      apiKey: apiKeyInput.value.trim(),
      blogId: blogIdInput.value.trim(),
      clientId: clientIdInput.value.trim(),
      secret: clientSecretInput.value.trim(),
      token: refreshTokenInput.value.trim(),
      url: apiUrlInput.value.trim()
    };

    verifyStatus.style.display = "block";
    verifyStatus.innerText = "🔄 Registrando...";
    verifyStatus.style.color = "gold";

    const licenseData = await checkLicense(credentials.apiKey);
    if(!licenseData.valid){
      verifyStatus.innerText = "❌ Licença inválida";
      verifyStatus.style.color = "red";
      return;
    }

    // Se já existe registro do mesmo Blog ID, avisa e permite login
    const registrosExistentes = licenseData.registros || [];
    const registroMesmaChave = registrosExistentes.find(r => r.blogId === credentials.blogId);
    if(registroMesmaChave){
      verifyStatus.innerHTML = `⚠️ Este blog já está registrado. Você pode apenas fazer login. <br>Data do registro: ${registroMesmaChave.date}`;
      verifyStatus.style.color = "orange";
      return;
    }

    const result = await registerCredentials(credentials);
    if(result.status==="ok"){
      // Atualiza restante-usadas já correto
      const licenseAtualizada = await checkLicense(credentials.apiKey);
      if(licenseAtualizada.valid){
        credentials.ativo = licenseAtualizada.ativo; // pega valor correto já atualizado
      }
      salvarELogar(credentials);
      verifyStatus.innerText = "✅ Registro concluído!";
      verifyStatus.style.color = "green";
    } else {
      verifyStatus.innerText = "❌ "+result.message;
      verifyStatus.style.color = "red";
    }
  });
}

// === FUNÇÃO SALVAR E LOGAR ===
function salvarELogar(credentials){
  licenseVerified = true;
  blogId = credentials.blogId;
  clientId = credentials.clientId;
  clientSecret = credentials.secret;
  refreshToken = credentials.token;
  apiKey = credentials.apiKey;
  apiUrl = credentials.url;
  ativo = credentials.ativo || "1-0";

  localStorage.setItem("apiCredentials", JSON.stringify(credentials));

  preencherFormularioAPI(credentials);
  loginPopup.style.display = "none";
  apiPopup.style.display = "none";
  abrirPerfil();
}

// === FUNÇÃO LOGOUT COM TOAST E CANCELAR ===
let logoutTimeout;
let logoutInProgress = false;

logoutBtn.addEventListener("click", () => {
  const toast = document.getElementById("logout-toast");
  const progress = toast.querySelector("#logout-progress div");
  toast.style.display = "block";
  progress.style.width = "0%";
  logoutInProgress = true;

  setTimeout(() => {
    progress.style.width = "100%";
  }, 50);

  logoutTimeout = setTimeout(() => {
    if(logoutInProgress){
      efetivarLogout();
      toast.style.display = "none";
    }
  }, 8000);
});

document.getElementById("cancel-logout").addEventListener("click", () => {
  if(logoutInProgress){
    clearTimeout(logoutTimeout);
    logoutInProgress = false;
    document.getElementById("logout-toast").style.display = "none";
  }
});

function efetivarLogout(){
  blogId = "";
  clientId = "";
  clientSecret = "";
  refreshToken = "";
  apiKey = "";
  apiUrl = "";
  licenseVerified = false;
  ativo = "";

  localStorage.removeItem("apiCredentials");
  profilePopup.style.display = "none";
  apiPopup.style.display = "flex"; 
  logoutInProgress = false;

  limparFormularioAPI();   
  limparFormularioLogin(); 
}

// === CARREGAR CREDENCIAIS ===
function carregarCredenciais(creds){
  blogId = creds.blogId;
  clientId = creds.clientId;
  clientSecret = creds.secret;
  refreshToken = creds.token;
  apiKey = creds.apiKey;
  apiUrl = creds.url;
  ativo = creds.ativo || "1-0";

  preencherFormularioAPI(creds);
}

// === FUNÇÃO: PREENCHER FORMULÁRIO DE API ===
function preencherFormularioAPI(creds){
  blogIdInput.value = creds.blogId || "";
  clientIdInput.value = creds.clientId || "";
  clientSecretInput.value = creds.secret || "";
  refreshTokenInput.value = creds.token || "";
  apiKeyInput.value = creds.apiKey || "";
  apiUrlInput.value = creds.url || "";

  document.querySelectorAll(".form-field input").forEach(input => {
    if(input.value.trim() !== ""){
      input.style.border = "1px solid green";
    } else {
      input.style.border = "1px solid #ddd";
    }
  });
}

// === FUNÇÃO: LIMPAR FORMULÁRIO DE API ===
function limparFormularioAPI(){
  document.querySelectorAll(".form-field input").forEach(input => {
    input.value = "";
    input.style.border = "1px solid #ddd";
  });
}

// === FUNÇÃO: LIMPAR FORMULÁRIO DE LOGIN ===
function limparFormularioLogin(){
  loginApiKey.value = "";
  loginBlogId.value = "";
  loginStatus.innerText = "";
}

function abrirPerfil() {
  const partes = ativo.split("-"); // Ex: "3-5"
  const restante = parseInt(partes[0]) || 0;
  const usados = parseInt(partes[1]) || 0;

  const profileAtivoEl = document.getElementById("profile-ativo");
  profileAtivoEl.innerHTML = `Usadas: <span style="color: gray;">${usados}</span> | Restante: <span style="color: ${restante>0 ? "green":"red"};">${restante}</span>`;

  // Preenche a Data usando a credencial atual
  const savedCreds = JSON.parse(localStorage.getItem("apiCredentials") || "{}");
  const ultimaData = savedCreds.date || "";

  if(ultimaData){
    profileAtivoEl.innerHTML += "<br><small>Último registro: "+ultimaData+"</small>";
  }

  document.getElementById("profile-date").innerText = ultimaData;
  document.getElementById("profile-blogId").innerText = blogId;
  document.getElementById("profile-clientId").innerText = clientId;
  document.getElementById("profile-secret").innerText = clientSecret;
  document.getElementById("profile-token").innerText = refreshToken;
  document.getElementById("profile-url").innerText = apiUrl;

  profilePopup.style.display = "flex";
}




// === FECHAR POPUP AO CLICAR FORA ===
[loginPopup, apiPopup, profilePopup].forEach(popup => {
  popup.addEventListener("click", (e) => {
    if(e.target === popup){ 
      popup.style.display = "none";
    }
  });
});

// === BOTÃO "CONTA" DO MENU DE CONFIGURAÇÕES ===
document.querySelectorAll(".setting-item").forEach(item => {
  item.addEventListener("click", () => {
    if(item.innerText.includes("Conta")){
      const savedCreds = localStorage.getItem("apiCredentials");
      if(savedCreds){
        abrirPerfil();
      } else {
        loginPopup.style.display = "flex";
      }
    }
  });
});


// NOVOS

// ============= FUNÇÃO COMUM =============
function escapeHtml(text) {
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}



// ============= MARCADORES SÉRIES =============
let markersSeries = JSON.parse(localStorage.getItem('customMarkersSeries')) || ["Séries"];

function renderMarkersSeries() {
  const container = document.getElementById('markers-list-series');
  container.innerHTML = '';
  markersSeries.forEach((marker, index) => {
    const div = document.createElement('div');
    div.className = 'marker-item';
    div.innerHTML = `
      <input type="text" value="${escapeHtml(marker)}" placeholder="Nome do marcador" />
      <button class="btn-remove" data-index="${index}">−</button>
    `;
    container.appendChild(div);
  });
}

function saveMarkersSeries() {
  const inputs = document.querySelectorAll('#markers-list-series input');
  markersSeries = Array.from(inputs).map(i => i.value.trim()).filter(v => v);
  localStorage.setItem('customMarkersSeries', JSON.stringify(markersSeries));
}

document.getElementById('openMarkersSeries')?.addEventListener('click', () => {
  document.getElementById('markers-modal-series').style.display = 'flex';
  renderMarkersSeries();
});
document.getElementById('closeMarkersModalSeries')?.addEventListener('click', () => {
  document.getElementById('markers-modal-series').style.display = 'none';
});
document.getElementById('addMarkerBtnSeries')?.addEventListener('click', () => {
  markersSeries.push('');
  renderMarkersSeries();
});
document.getElementById('markers-list-series')?.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-remove')) {
    const i = parseInt(e.target.dataset.index);
    markersSeries.splice(i, 1);
    renderMarkersSeries();
    saveMarkersSeries();
  }
});
document.getElementById('markers-list-series')?.addEventListener('input', () => saveMarkersSeries());
document.getElementById('markers-modal-series')?.addEventListener('click', (e) => {
  if (e.target.id === 'markers-modal-series') {
    document.getElementById('markers-modal-series').style.display = 'none';
  }
});
// ============= MARCADORES PARA EPISÓDIOS =============
let episodeMarkers = JSON.parse(localStorage.getItem('episodeMarkers')) || ["Episódios"];

function renderEpisodeMarkers() {
    const container = document.getElementById('episode-markers-list');
    container.innerHTML = '';
    episodeMarkers.forEach((marker, index) => {
        const div = document.createElement('div');
        div.className = 'marker-item';
        div.innerHTML = `
            <input type="text" value="${escapeHtml(marker)}" placeholder="Nome do marcador" />
            <button class="btn-remove" data-index="${index}">−</button>
        `;
        container.appendChild(div);
    });
}

function saveEpisodeMarkers() {
    const inputs = document.querySelectorAll('#episode-markers-list input');
    episodeMarkers = Array.from(inputs).map(input => input.value.trim()).filter(v => v);
    localStorage.setItem('episodeMarkers', JSON.stringify(episodeMarkers));
}

// Abrir modal
document.getElementById('openEpisodeMarkers')?.addEventListener('click', () => {
    document.getElementById('episode-markers-modal').style.display = 'flex';
    renderEpisodeMarkers();
});

// Fechar modal
document.getElementById('closeEpisodeMarkersModal')?.addEventListener('click', () => {
    document.getElementById('episode-markers-modal').style.display = 'none';
});

// Adicionar novo marcador
document.getElementById('addEpisodeMarkerBtn')?.addEventListener('click', () => {
    episodeMarkers.push('');
    renderEpisodeMarkers();
});

// Delegação de eventos para remover e salvar ao digitar
document.getElementById('episode-markers-list')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-remove')) {
        const index = parseInt(e.target.dataset.index);
        episodeMarkers.splice(index, 1);
        renderEpisodeMarkers();
        saveEpisodeMarkers();
    }
});

document.getElementById('episode-markers-list')?.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT') {
        saveEpisodeMarkers();
    }
});

// Fechar modal ao clicar fora
document.getElementById('episode-markers-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'episode-markers-modal') {
        document.getElementById('episode-markers-modal').style.display = 'none';
    }
});