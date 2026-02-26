const list = document.getElementById('languageList');
const items = document.querySelectorAll('.notification-item');
const applyBtn = document.getElementById('applyBtn');
const storageKey = 'selectedLanguage';

let selectedBefore = localStorage.getItem(storageKey) || 'pt-BR';

function setActive(lang) {
  items.forEach(item => {
    item.classList.remove('active');
    if (item.dataset.lang === lang) {
      item.classList.add('active');
    }
  });
}

items.forEach(item => {
  item.addEventListener('click', () => {
    const selectedLang = item.dataset.lang;
    if (selectedLang !== selectedBefore) {
      applyBtn.style.display = 'inline-block';
      applyBtn.dataset.pendingLang = selectedLang;
      setActive(selectedLang);
    } else {
      applyBtn.style.display = 'none';
    }
  });
});

applyBtn.addEventListener('click', () => {
  const newLang = applyBtn.dataset.pendingLang;
  const selectedItem = [...items].find(i => i.dataset.lang === newLang);

  if (selectedItem) {
    selectedItem.classList.add('slide-up');
    setTimeout(() => {
      selectedItem.classList.remove('slide-up');
      list.prepend(selectedItem);
      localStorage.setItem(storageKey, newLang);
      selectedBefore = newLang;
      location.reload();
    }, 600);
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem(storageKey);
  if (savedLang) {
    const savedItem = [...items].find(i => i.dataset.lang === savedLang);
    if (savedItem) {
      setActive(savedLang);
      list.prepend(savedItem);
    }
  }
});

async function changeLanguage(lang) {
  selectedLanguage = lang;
  localStorage.setItem("selectedLanguage", selectedLanguage);
  applyTranslation(selectedLanguage);

  currentPage = 1;
  document.getElementById("movies-grid").innerHTML = "";
  await loadInitialMovies();
  await fetchGenres();
}

document.addEventListener("DOMContentLoaded", () => {
  const languageItems = document.querySelectorAll("#languageList .notification-item");
  const activeItem = document.querySelector(`#languageList .notification-item[data-lang="${selectedLanguage}"]`);
  if (activeItem) activeItem.classList.add("active");

  languageItems.forEach(item => {
    item.addEventListener("click", () => {
      languageItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      const lang = item.getAttribute("data-lang");
      changeLanguage(lang);
    });
  });

  const applyBtn = document.getElementById("applyBtn");
  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      const lang = document.querySelector("#languageList .notification-item.active")?.getAttribute("data-lang");
      if (lang) {
        changeLanguage(lang);
        document.getElementById("languageSidebar").classList.remove("active");
        document.getElementById("languageOverlay").style.display = "none";
      }
    });
  }
});

// Web Speech API - primeira instância
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'pt-BR';
  recognition.continuous = false;
  recognition.interimResults = false;

  const micAnimation = document.getElementById('central-mic-animation');
  const searchInput = document.getElementById('search-input');
  const voiceSearchBtnMobile = document.getElementById('voiceSearchBtnMobile');

  function startVoiceRecognition() {
    const userLang = navigator.language || 'pt-BR';
    recognition.lang = userLang;
    micAnimation.style.display = 'flex';
    recognition.start();
  }

  if (voiceSearchBtnMobile) {
    voiceSearchBtnMobile.addEventListener('click', startVoiceRecognition);
  }

  recognition.addEventListener('result', (event) => {
    const transcript = event.results[event.resultIndex][0].transcript.trim();
    if (transcript) {
      searchInput.value = transcript;
      searchInput.dispatchEvent(new Event('input'));
    }
    micAnimation.style.display = 'none';
  });

  recognition.addEventListener('end', () => micAnimation.style.display = 'none');
  recognition.addEventListener('error', (event) => {
    console.error("Erro no reconhecimento de voz:", event.error);
    micAnimation.style.display = 'none';
  });
} else {
  console.warn("Seu navegador não suporta reconhecimento de voz.");
  const voiceSearchBtnMobile = document.getElementById('voiceSearchBtnMobile');
  if (voiceSearchBtnMobile) voiceSearchBtnMobile.style.display = 'none';
}

// Web Speech API - segunda instância
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'pt-BR';
  recognition.continuous = true;
  recognition.interimResults = false;

  const micAnimation = document.getElementById('central-mic-animation');
  const searchInput = document.getElementById('search-input');
  const micBtnMobile = document.getElementById('voiceSearchBtn');
  const micBtnDesktop = document.getElementById('voiceSearchBtnpc');

  function startVoiceRecognition() {
    const userLang = navigator.language || 'pt-BR';
    recognition.lang = userLang;
    recognition.start();
    micAnimation.style.display = 'flex';
  }

  if (micBtnMobile) micBtnMobile.addEventListener('click', startVoiceRecognition);
  if (micBtnDesktop) micBtnDesktop.addEventListener('click', startVoiceRecognition);

  recognition.addEventListener('result', (event) => {
    const transcript = event.results[event.resultIndex][0].transcript.trim();
    if (transcript) {
      searchInput.value = transcript;
      searchInput.dispatchEvent(new Event('input'));
    }
    micAnimation.style.display = 'none';
  });

  recognition.addEventListener('end', () => micAnimation.style.display = 'none');
  recognition.addEventListener('error', (event) => {
    console.error("Erro no reconhecimento de voz:", event.error);
    micAnimation.style.display = 'none';
  });
} else {
  console.warn("Seu navegador não suporta reconhecimento de voz.");
  const micBtnMobile = document.getElementById('voiceSearchBtn');
  const micBtnDesktop = document.getElementById('voiceSearchBtnpc');
  if (micBtnMobile) micBtnMobile.style.display = 'none';
  if (micBtnDesktop) micBtnDesktop.style.display = 'none';
}

// Objeto com as traduções (com todas as chaves, exceto "Conta")
const translations = {
  "pt-BR": {
    "MOVIES": "FILMES",
    "SERIES": "SÉRIES",
    "ANIMES": "ANIMES",
    "AUTOPLAY": "AUTOPLAY",
    "IDIOMA": "IDIOMA",
    "Ano:": "Ano:",
    "Todos os anos": "Todos os anos",
    "Público-Alvo:": "Público-Alvo:",
    "Todos": "Todos",
    "Crianças": "Crianças",
    "Adolescentes": "Adolescentes",
    "Família": "Família",
    "Adultos": "Adultos",
    "Público Geral": "Público Geral",
    "Gênero:": "Gênero:",
    "Todos os gêneros": "Todos os gêneros",
    "Descobrir": "Descobrir",
    "Novidades": "Novidades",
    "Aplicar": "Aplicar",
    "Reproduzir Automaticamente": "Reproduzir Automaticamente",
    "Ative ou desative o autoplay dos vídeos.": "Ative ou desative o autoplay dos vídeos.",
    "Autoplay": "Autoplay",
    "Settings": "Configurações",
    "← Back": "← Voltar",
    "Notifications": "Notificações",
    "Privacy": "Privacidade",
    "API": "API",
    "Help": "Ajuda",
    "Language": "Idioma",
    "Series Markers": "Marcadores (Séries)",
    "Episode Markers": "Marcadores (Episódios)",
    "Gerenciar Marcadores de Séries": "Gerenciar Marcadores de Séries",
    "Marcadores para Episódios": "Marcadores para Episódios",
    "+ Adicionar Marcador": "+ Adicionar Marcador",
    "Login": "Login",
    "Sua API Key": "Sua API Key",
    "Seu Blog ID": "Seu Blog ID",
    "Entrar": "Entrar",
    "Configurações de API": "Configurações de API",
    "Blog ID": "Blog ID",
    "Blog ID aqui...": "Blog ID aqui...",
    "Apenas números, mínimo 8 dígitos.": "Apenas números, mínimo 8 dígitos.",
    "Client ID": "Client ID",
    "Client ID aqui...": "Client ID aqui...",
    "Client Secret": "Client Secret",
    "Client Secret aqui...": "Client Secret aqui...",
    "Refresh Token": "Refresh Token",
    "Refresh Token aqui...": "Refresh Token aqui...",
    "API Key": "API Key",
    "API Key aqui...": "API Key aqui...",
    "URL Do Blogger": "URL Do Blogger",
    "https://www aqui...": "https://www aqui...",
    "Aguardando verificação...": "Aguardando verificação...",
    "Cancelar": "Cancelar",
    "Limpar Dados": "Limpar Dados",
    "Ativar": "Ativar",
    "Minha Conta": "Minha Conta",
    "Licença:": "Licença:",
    "Blog ID:": "Blog ID:",
    "Client ID:": "Client ID:",
    "Secret:": "Secret:",
    "Token:": "Token:",
    "URL:": "URL:",
    "Data:": "Data:",
    "Sair": "Sair",
    "Terminando Sessão...": "Terminando Sessão...",
    "SETTINGS": "CONFIGURAÇÕES",
    "Publicar Série?": "Publicar Série?",
    "Publicar": "Publicar",
    "Ver Episódios": "Ver Episódios",
    "Episódios": "Episódios",
    "Temporada:": "Temporada:",
    "Publicar Temporada": "Publicar Temporada",
    "Cancelar Publicação": "Cancelar Publicação",
    "Load More": "Carregar Mais",
    "Carregando...": "Carregando...",
    "inadb está ouvindo...": "inadb está ouvindo...",
    "Play": "Play",
    "Player dublados do Brasil<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "Player dublados do Brasil<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico",
    "Player em inglês<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "Player em inglês<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico",
    "Player em espanhol<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "Player em espanhol<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico",
    "Ex: 2 ou -2-": "Ex: 2 ou -2-",
    "❌ Escolha entre 1 e 3 servidores por idioma. Total máximo: 6.": "❌ Escolha entre 1 e 3 servidores por idioma. Total máximo: 6.",
    "Aplicar": "Aplicar",
    "Editar Players": "Editar Players",
    "Salvar": "Salvar",
    "Adicionar Player": "Adicionar Player",
    "Pesquisar": "Pesquisar",
    "⚠️ Publicação Bloqueada": "⚠️ Publicação Bloqueada",
    "Primeiro publique a série, depois publique os episódios.": "Primeiro publique a série, depois publique os episódios.",
    "Voltar para Publicar": "Voltar para Publicar",
    "Pesquisar Série": "Pesquisar Série",
    "Digite nome (2+ letras) ou ID (7+ dígitos)...": "Digite nome (2+ letras) ou ID (7+ dígitos)...",
    "Confirmar ID": "Confirmar ID"
  },
  "en-US": {
    "MOVIES": "MOVIES",
    "SERIES": "SERIES",
    "ANIMES": "ANIMES",
    "AUTOPLAY": "AUTOPLAY",
    "IDIOMA": "LANGUAGE",
    "Ano:": "Year:",
    "Todos os anos": "All years",
    "Público-Alvo:": "Audience:",
    "Todos": "All",
    "Crianças": "Children",
    "Adolescentes": "Teenagers",
    "Família": "Family",
    "Adultos": "Adults",
    "Público Geral": "General Public",
    "Gênero:": "Genre:",
    "Todos os gêneros": "All genres",
    "Descobrir": "Discover",
    "Novidades": "News",
    "Aplicar": "Apply",
    "Reproduzir Automaticamente": "Play Automatically",
    "Ative ou desative o autoplay dos vídeos.": "Enable or disable video autoplay.",
    "Autoplay": "Autoplay",
    "Settings": "Settings",
    "← Back": "← Back",
    "Notifications": "Notifications",
    "Privacy": "Privacy",
    "API": "API",
    "Help": "Help",
    "Language": "Language",
    "Series Markers": "Series Markers",
    "Episode Markers": "Episode Markers",
    "Gerenciar Marcadores de Séries": "Manage Series Markers",
    "Marcadores para Episódios": "Episode Markers",
    "+ Adicionar Marcador": "+ Add Marker",
    "Login": "Login",
    "Sua API Key": "Your API Key",
    "Seu Blog ID": "Your Blog ID",
    "Entrar": "Login",
    "Configurações de API": "API Settings",
    "Blog ID": "Blog ID",
    "Blog ID aqui...": "Blog ID here...",
    "Apenas números, mínimo 8 dígitos.": "Numbers only, minimum 8 digits.",
    "Client ID": "Client ID",
    "Client ID aqui...": "Client ID here...",
    "Client Secret": "Client Secret",
    "Client Secret aqui...": "Client Secret here...",
    "Refresh Token": "Refresh Token",
    "Refresh Token aqui...": "Refresh Token here...",
    "API Key": "API Key",
    "API Key aqui...": "API Key here...",
    "URL Do Blogger": "Blogger URL",
    "https://www aqui...": "https://www here...",
    "Aguardando verificação...": "Waiting for verification...",
    "Cancelar": "Cancel",
    "Limpar Dados": "Clear Data",
    "Ativar": "Activate",
    "Minha Conta": "My Account",
    "Licença:": "License:",
    "Blog ID:": "Blog ID:",
    "Client ID:": "Client ID:",
    "Secret:": "Secret:",
    "Token:": "Token:",
    "URL:": "URL:",
    "Data:": "Date:",
    "Sair": "Logout",
    "Terminando Sessão...": "Logging out...",
    "SETTINGS": "SETTINGS",
    "Publicar Série?": "Publish Series?",
    "Publicar": "Publish",
    "Ver Episódios": "View Episodes",
    "Episódios": "Episodes",
    "Temporada:": "Season:",
    "Publicar Temporada": "Publish Season",
    "Cancelar Publicação": "Cancel Publishing",
    "Load More": "Load More",
    "Carregando...": "Loading...",
    "inadb está ouvindo...": "inadb is listening...",
    "Play": "Play",
    "Player dublados do Brasil<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "Brazilian dubbed players<br>Use numbers (1-3) for quantity<br>Use -2- to select specific player",
    "Player em inglês<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "English players<br>Use numbers (1-3) for quantity<br>Use -2- to select specific player",
    "Player em espanhol<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "Spanish players<br>Use numbers (1-3) for quantity<br>Use -2- to select specific player",
    "Ex: 2 ou -2-": "Ex: 2 or -2-",
    "❌ Escolha entre 1 e 3 servidores por idioma. Total máximo: 6.": "❌ Choose 1–3 servers per language. Max total: 6.",
    "Aplicar": "Apply",
    "Editar Players": "Edit Players",
    "Salvar": "Save",
    "Adicionar Player": "Add Player",
    "Pesquisar": "Search",
    "⚠️ Publicação Bloqueada": "⚠️ Publishing Blocked",
    "Primeiro publique a série, depois publique os episódios.": "First publish the series, then publish the episodes.",
    "Voltar para Publicar": "Go Back to Publish",
    "Pesquisar Série": "Search Series",
    "Digite nome (2+ letras) ou ID (7+ dígitos)...": "Enter name (2+ letters) or ID (7+ digits)...",
    "Confirmar ID": "Confirm ID"
  },
  "es-ES": {
    "MOVIES": "PELÍCULAS",
    "SERIES": "SERIES",
    "ANIMES": "ANIMES",
    "AUTOPLAY": "AUTOPLAY",
    "IDIOMA": "IDIOMA",
    "Ano:": "Año:",
    "Todos os anos": "Todos los años",
    "Público-Alvo:": "Público objetivo:",
    "Todos": "Todos",
    "Crianças": "Niños",
    "Adolescentes": "Adolescentes",
    "Família": "Família",
    "Adultos": "Adultos",
    "Público Geral": "Público general",
    "Gênero:": "Género:",
    "Todos os gêneros": "Todos los géneros",
    "Descobrir": "Descubrir",
    "Novidades": "Novedades",
    "Aplicar": "Aplicar",
    "Reproduzir Automaticamente": "Reproducir automáticamente",
    "Ative ou desative o autoplay dos vídeos.": "Activa o desactiva la reproducción automática de los vídeos.",
    "Autoplay": "Reproducción automática",
    "Settings": "Ajustes",
    "← Back": "← Volver",
    "Notifications": "Notificaciones",
    "Privacy": "Privacidad",
    "API": "API",
    "Help": "Ayuda",
    "Language": "Idioma",
    "Series Markers": "Marcadores (Series)",
    "Episode Markers": "Marcadores (Episodios)",
    "Gerenciar Marcadores de Séries": "Gestionar marcadores de series",
    "Marcadores para Episódios": "Marcadores para episodios",
    "+ Adicionar Marcador": "+ Añadir marcador",
    "Login": "Iniciar sesión",
    "Sua API Key": "Tu clave API",
    "Seu Blog ID": "Tu ID de blog",
    "Entrar": "Entrar",
    "Configurações de API": "Configuración de API",
    "Blog ID": "ID del blog",
    "Blog ID aqui...": "ID del blog aquí...",
    "Apenas números, mínimo 8 dígitos.": "Solo números, mínimo 8 dígitos.",
    "Client ID": "ID de cliente",
    "Client ID aqui...": "ID de cliente aquí...",
    "Client Secret": "Secreto de cliente",
    "Client Secret aqui...": "Secreto de cliente aquí...",
    "Refresh Token": "Token de actualización",
    "Refresh Token aqui...": "Token de actualización aquí...",
    "API Key": "Clave API",
    "API Key aqui...": "Clave API aquí...",
    "URL Do Blogger": "URL de Blogger",
    "https://www aqui...": "https://www aquí...",
    "Aguardando verificação...": "Esperando verificación...",
    "Cancelar": "Cancelar",
    "Limpar Dados": "Borrar datos",
    "Ativar": "Activar",
    "Minha Conta": "Mi cuenta",
    "Licença:": "Licencia:",
    "Blog ID:": "ID del blog:",
    "Client ID:": "ID de cliente:",
    "Secret:": "Secreto:",
    "Token:": "Token:",
    "URL:": "URL:",
    "Data:": "Fecha:",
    "Sair": "Cerrar sesión",
    "Terminando Sessão...": "Cerrando sesión...",
    "SETTINGS": "AJUSTES",
    "Publicar Série?": "¿Publicar serie?",
    "Publicar": "Publicar",
    "Ver Episódios": "Ver episodios",
    "Episódios": "Episodios",
    "Temporada:": "Temporada:",
    "Publicar Temporada": "Publicar temporada",
    "Cancelar Publicação": "Cancelar publicación",
    "Load More": "Cargar más",
    "Carregando...": "Cargando...",
    "inadb está ouvindo...": "inadb está escuchando...",
    "Play": "Reproducir",
    "Player dublados do Brasil<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "Reproductores doblados en Brasil<br>Use números (1-3) para cantidad<br>Use -2- para seleccionar reproductor específico",
    "Player em inglês<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "Reproductores en inglés<br>Use números (1-3) para cantidad<br>Use -2- para seleccionar reproductor específico",
    "Player em espanhol<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "Reproductores en español<br>Use números (1-3) para cantidad<br>Use -2- para seleccionar reproductor específico",
    "Ex: 2 ou -2-": "Ej: 2 o -2-",
    "❌ Escolha entre 1 e 3 servidores por idioma. Total máximo: 6.": "❌ Elija entre 1 y 3 servidores por idioma. Máximo total: 6.",
    "Aplicar": "Aplicar",
    "Editar Players": "Editar reproductores",
    "Salvar": "Guardar",
    "Adicionar Player": "Añadir reproductor",
    "Pesquisar": "Buscar",
    "⚠️ Publicação Bloqueada": "⚠️ Publicación Bloqueada",
    "Primeiro publique a série, depois publique os episódios.": "Primero publique la serie, luego publique los episodios.",
    "Voltar para Publicar": "Volver a Publicar",
    "Pesquisar Série": "Buscar Serie",
    "Digite nome (2+ letras) ou ID (7+ dígitos)...": "Ingrese nombre (2+ letras) o ID (7+ dígitos)...",
    "Confirmar ID": "Confirmar ID"
  },
  "zh-CN": {
    "MOVIES": "电影",
    "SERIES": "剧集",
    "ANIMES": "动漫",
    "AUTOPLAY": "自动播放",
    "IDIOMA": "语言",
    "Ano:": "年份:",
    "Todos os anos": "所有年份",
    "Público-Alvo:": "受众:",
    "Todos": "全部",
    "Crianças": "儿童",
    "Adolescentes": "青少年",
    "Família": "家庭",
    "Adultos": "成人",
    "Público Geral": "大众",
    "Gênero:": "类型:",
    "Todos os gêneros": "所有类型",
    "Descobrir": "发现",
    "Novidades": "新闻",
    "Aplicar": "应用",
    "Reproduzir Automaticamente": "自动播放",
    "Ative ou desative o autoplay dos vídeos.": "启用或禁用视频自动播放。",
    "Autoplay": "自动播放",
    "Settings": "设置",
    "← Back": "← 返回",
    "Notifications": "通知",
    "Privacy": "隐私",
    "API": "API",
    "Help": "帮助",
    "Language": "语言",
    "Series Markers": "剧集标记",
    "Episode Markers": "剧集标记",
    "Gerenciar Marcadores de Séries": "管理剧集标记",
    "Marcadores para Episódios": "剧集标记",
    "+ Adicionar Marcador": "+ 添加标记",
    "Login": "登录",
    "Sua API Key": "您的 API 密钥",
    "Seu Blog ID": "您的博客 ID",
    "Entrar": "登录",
    "Configurações de API": "API 设置",
    "Blog ID": "博客 ID",
    "Blog ID aqui...": "在此输入博客 ID...",
    "Apenas números, mínimo 8 dígitos.": "仅限数字，最少 8 位。",
    "Client ID": "客户端 ID",
    "Client ID aqui...": "在此输入客户端 ID...",
    "Client Secret": "客户端密钥",
    "Client Secret aqui...": "在此输入客户端密钥...",
    "Refresh Token": "刷新令牌",
    "Refresh Token aqui...": "在此输入刷新令牌...",
    "API Key": "API 密钥",
    "API Key aqui...": "在此输入 API 密钥...",
    "URL Do Blogger": "Blogger 网址",
    "https://www aqui...": "https://www 在此...",
    "Aguardando verificação...": "等待验证...",
    "Cancelar": "取消",
    "Limpar Dados": "清除数据",
    "Ativar": "激活",
    "Minha Conta": "我的账户",
    "Licença:": "许可证：",
    "Blog ID:": "博客 ID：",
    "Client ID:": "客户端 ID：",
    "Secret:": "密钥：",
    "Token:": "令牌：",
    "URL:": "网址：",
    "Data:": "日期：",
    "Sair": "退出",
    "Terminando Sessão...": "正在退出...",
    "SETTINGS": "设置",
    "Publicar Série?": "发布剧集？",
    "Publicar": "发布",
    "Ver Episódios": "查看剧集",
    "Episódios": "剧集",
    "Temporada:": "季：",
    "Publicar Temporada": "发布整季",
    "Cancelar Publicação": "取消发布",
    "Load More": "加载更多",
    "Carregando...": "加载中...",
    "inadb está ouvindo...": "inadb 正在聆听...",
    "Play": "播放",
    "Player dublados do Brasil<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "巴西配音播放器<br>使用数字（1-3）选择数量<br>使用 -2- 选择特定播放器",
    "Player em inglês<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "英语播放器<br>使用数字（1-3）选择数量<br>使用 -2- 选择特定播放器",
    "Player em espanhol<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "西班牙语播放器<br>使用数字（1-3）选择数量<br>使用 -2- 选择特定播放器",
    "Ex: 2 ou -2-": "例如：2 或 -2-",
    "❌ Escolha entre 1 e 3 servidores por idioma. Total máximo: 6.": "❌ 每种语言选择 1-3 个服务器。最多 6 个。",
    "Aplicar": "应用",
    "Editar Players": "编辑播放器",
    "Salvar": "保存",
    "Adicionar Player": "添加播放器",
    "Pesquisar": "搜索",
    "⚠️ Publicação Bloqueada": "⚠️ 发布被阻止",
    "Primeiro publique a série, depois publique os episódios.": "请先发布剧集，再发布剧集中的剧集。",
    "Voltar para Publicar": "返回发布",
    "Pesquisar Série": "搜索剧集",
    "Digite nome (2+ letras) ou ID (7+ dígitos)...": "输入名称（2+ 字母）或 ID（7+ 位数）...",
    "Confirmar ID": "确认 ID"
  },
  "ja-JP": {
    "MOVIES": "映画",
    "SERIES": "シリーズ",
    "ANIMES": "アニメ",
    "AUTOPLAY": "自動再生",
    "IDIOMA": "言語",
    "Ano:": "年:",
    "Todos os anos": "すべての年",
    "Público-Alvo:": "対象:",
    "Todos": "すべて",
    "Crianças": "子供",
    "Adolescentes": "ティーンエイジャー",
    "Família": "家族",
    "Adultos": "大人",
    "Público Geral": "一般向け",
    "Gênero:": "ジャンル:",
    "Todos os gêneros": "すべてのジャンル",
    "Descobrir": "探す",
    "Novidades": "ニュース",
    "Aplicar": "適用",
    "Reproduzir Automaticamente": "自動再生",
    "Ative ou desative o autoplay dos vídeos.": "動画の自動再生を有効または無効にします。",
    "Autoplay": "自動再生",
    "Settings": "設定",
    "← Back": "← 戻る",
    "Notifications": "通知",
    "Privacy": "プライバシー",
    "API": "API",
    "Help": "ヘルプ",
    "Language": "言語",
    "Series Markers": "シリーズマーカー",
    "Episode Markers": "エピソードマーカー",
    "Gerenciar Marcadores de Séries": "シリーズマーカーを管理",
    "Marcadores para Episódios": "エピソードマーカー",
    "+ Adicionar Marcador": "+ マーカーを追加",
    "Login": "ログイン",
    "Sua API Key": "あなたの API キー",
    "Seu Blog ID": "あなたのブログ ID",
    "Entrar": "ログイン",
    "Configurações de API": "API 設定",
    "Blog ID": "ブログ ID",
    "Blog ID aqui...": "ブログ ID をここに入力...",
    "Apenas números, mínimo 8 dígitos.": "数字のみ、8 桁以上。",
    "Client ID": "クライアント ID",
    "Client ID aqui...": "クライアント ID をここに入力...",
    "Client Secret": "クライアントシークレット",
    "Client Secret aqui...": "クライアントシークレットをここに入力...",
    "Refresh Token": "リフレッシュトークン",
    "Refresh Token aqui...": "リフレッシュトークンをここに入力...",
    "API Key": "API キー",
    "API Key aqui...": "API キーをここに入力...",
    "URL Do Blogger": "Blogger URL",
    "https://www aqui...": "https://www をここに入力...",
    "Aguardando verificação...": "検証を待っています...",
    "Cancelar": "キャンセル",
    "Limpar Dados": "データをクリア",
    "Ativar": "有効化",
    "Minha Conta": "マイアカウント",
    "Licença:": "ライセンス：",
    "Blog ID:": "ブログ ID：",
    "Client ID:": "クライアント ID：",
    "Secret:": "シークレット：",
    "Token:": "トークン：",
    "URL:": "URL：",
    "Data:": "日付：",
    "Sair": "ログアウト",
    "Terminando Sessão...": "ログアウト中...",
    "SETTINGS": "設定",
    "Publicar Série?": "シリーズを公開しますか？",
    "Publicar": "公開",
    "Ver Episódios": "エピソードを表示",
    "Episódios": "エピソード",
    "Temporada:": "シーズン：",
    "Publicar Temporada": "シーズンを公開",
    "Cancelar Publicação": "公開をキャンセル",
    "Load More": "さらに読み込む",
    "Carregando...": "読み込み中...",
    "inadb está ouvindo...": "inadb がリスニング中...",
    "Play": "再生",
    "Player dublados do Brasil<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "ブラジル語吹き替えプレーヤー<br>数値（1-3）で数量を指定<br>-2- で特定プレーヤーを選択",
    "Player em inglês<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "英語プレーヤー<br>数値（1-3）で数量を指定<br>-2- で特定プレーヤーを選択",
    "Player em espanhol<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "スペイン語プレーヤー<br>数値（1-3）で数量を指定<br>-2- で特定プレーヤーを選択",
    "Ex: 2 ou -2-": "例: 2 または -2-",
    "❌ Escolha entre 1 e 3 servidores por idioma. Total máximo: 6.": "❌ 言語ごとに1〜3サーバーを選択。最大6個。",
    "Aplicar": "適用",
    "Editar Players": "プレーヤーを編集",
    "Salvar": "保存",
    "Adicionar Player": "プレーヤーを追加",
    "Pesquisar": "検索",
    "⚠️ Publicação Bloqueada": "⚠️ 公開がブロックされました",
    "Primeiro publique a série, depois publique os episódios.": "まずシリーズを公開し、その後エピソードを公開してください。",
    "Voltar para Publicar": "公開に戻る",
    "Pesquisar Série": "シリーズを検索",
    "Digite nome (2+ letras) ou ID (7+ dígitos)...": "名前（2文字以上）またはID（7桁以上）を入力...",
    "Confirmar ID": "IDを確認"
  },
  "de-DE": {
    "MOVIES": "FILME",
    "SERIES": "SERIEN",
    "ANIMES": "ANIME",
    "AUTOPLAY": "AUTOABSPIELEN",
    "IDIOMA": "SPRACHE",
    "Ano:": "Jahr:",
    "Todos os anos": "Alle Jahre",
    "Público-Alvo:": "Zielgruppe:",
    "Todos": "Alle",
    "Crianças": "Kinder",
    "Adolescentes": "Jugendliche",
    "Família": "Familie",
    "Adultos": "Erwachsene",
    "Público Geral": "Öffentlichkeit",
    "Gênero:": "Genre:",
    "Todos os gêneros": "Alle Genres",
    "Descobrir": "Entdecken",
    "Novidades": "Neuigkeiten",
    "Aplicar": "Anwenden",
    "Reproduzir Automaticamente": "Automatisch abspielen",
    "Ative ou desative o autoplay dos vídeos.": "Aktivieren oder deaktivieren Sie die automatische Wiedergabe der Videos.",
    "Autoplay": "Autoplay",
    "Settings": "Einstellungen",
    "← Back": "← Zurück",
    "Notifications": "Benachrichtigungen",
    "Privacy": "Datenschutz",
    "API": "API",
    "Help": "Hilfe",
    "Language": "Sprache",
    "Series Markers": "Serien-Marker",
    "Episode Markers": "Episoden-Marker",
    "Gerenciar Marcadores de Séries": "Serien-Marker verwalten",
    "Marcadores para Episódios": "Episoden-Marker",
    "+ Adicionar Marcador": "+ Marker hinzufügen",
    "Login": "Anmelden",
    "Sua API Key": "Ihr API-Schlüssel",
    "Seu Blog ID": "Ihre Blog-ID",
    "Entrar": "Anmelden",
    "Configurações de API": "API-Einstellungen",
    "Blog ID": "Blog-ID",
    "Blog ID aqui...": "Blog-ID hier eingeben...",
    "Apenas números, mínimo 8 dígitos.": "Nur Zahlen, mindestens 8 Stellen.",
    "Client ID": "Client-ID",
    "Client ID aqui...": "Client-ID hier eingeben...",
    "Client Secret": "Client-Secret",
    "Client Secret aqui...": "Client-Secret hier eingeben...",
    "Refresh Token": "Refresh-Token",
    "Refresh Token aqui...": "Refresh-Token hier eingeben...",
    "API Key": "API-Schlüssel",
    "API Key aqui...": "API-Schlüssel hier eingeben...",
    "URL Do Blogger": "Blogger-URL",
    "https://www aqui...": "https://www hier eingeben...",
    "Aguardando verificação...": "Warten auf Verifizierung...",
    "Cancelar": "Abbrechen",
    "Limpar Dados": "Daten löschen",
    "Ativar": "Aktivieren",
    "Minha Conta": "Mein Konto",
    "Licença:": "Lizenz:",
    "Blog ID:": "Blog-ID:",
    "Client ID:": "Client-ID:",
    "Secret:": "Secret:",
    "Token:": "Token:",
    "URL:": "URL:",
    "Data:": "Datum:",
    "Sair": "Abmelden",
    "Terminando Sessão...": "Abmeldung läuft...",
    "SETTINGS": "EINSTELLUNGEN",
    "Publicar Série?": "Serie veröffentlichen?",
    "Publicar": "Veröffentlichen",
    "Ver Episódios": "Episoden anzeigen",
    "Episódios": "Episoden",
    "Temporada:": "Staffel:",
    "Publicar Temporada": "Staffel veröffentlichen",
    "Cancelar Publicação": "Veröffentlichung abbrechen",
    "Load More": "Mehr laden",
    "Carregando...": "Wird geladen...",
    "inadb está ouvindo...": "inadb hört zu...",
    "Play": "Abspielen",
    "Player dublados do Brasil<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "Brasilianische Synchron-Player<br>Zahlen (1-3) für Anzahl verwenden<br>-2- für spezifischen Player",
    "Player em inglês<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "Englische Player<br>Zahlen (1-3) für Anzahl verwenden<br>-2- für spezifischen Player",
    "Player em espanhol<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "Spanische Player<br>Zahlen (1-3) für Anzahl verwenden<br>-2- für spezifischen Player",
    "Ex: 2 ou -2-": "Bsp.: 2 oder -2-",
    "❌ Escolha entre 1 e 3 servidores por idioma. Total máximo: 6.": "❌ Wählen Sie 1–3 Server pro Sprache. Max. 6 insgesamt.",
    "Aplicar": "Anwenden",
    "Editar Players": "Player bearbeiten",
    "Salvar": "Speichern",
    "Adicionar Player": "Player hinzufügen",
    "Pesquisar": "Suchen",
    "⚠️ Publicação Bloqueada": "⚠️ Veröffentlichung blockiert",
    "Primeiro publique a série, depois publique os episódios.": "Veröffentlichen Sie zuerst die Serie, dann die Episoden.",
    "Voltar para Publicar": "Zurück zur Veröffentlichung",
    "Pesquisar Série": "Serie suchen",
    "Digite nome (2+ letras) ou ID (7+ dígitos)...": "Name (2+ Buchstaben) oder ID (7+ Ziffern) eingeben...",
    "Confirmar ID": "ID bestätigen"
  },
  "fr-FR": {
    "MOVIES": "FILMS",
    "SERIES": "SÉRIES",
    "ANIMES": "ANIMÉS",
    "AUTOPLAY": "LECTURE AUTOMATIQUE",
    "IDIOMA": "LANGUE",
    "Ano:": "Année:",
    "Todos os anos": "Toutes les années",
    "Público-Alvo:": "Public cible:",
    "Todos": "Tous",
    "Crianças": "Enfants",
    "Adolescentes": "Adolescents",
    "Família": "Famille",
    "Adultos": "Adultes",
    "Público Geral": "Grand public",
    "Gênero:": "Genre:",
    "Todos os gêneros": "Tous les genres",
    "Descobrir": "Découvrir",
    "Novidades": "Actualités",
    "Aplicar": "Appliquer",
    "Reproduzir Automaticamente": "Lecture automatique",
    "Ative ou desative o autoplay dos vídeos.": "Activez ou désactivez la lecture automatique des vidéos.",
    "Autoplay": "Lecture automatique",
    "Settings": "Paramètres",
    "← Back": "← Retour",
    "Notifications": "Notifications",
    "Privacy": "Confidentialité",
    "API": "API",
    "Help": "Aide",
    "Language": "Langue",
    "Series Markers": "Marqueurs (Séries)",
    "Episode Markers": "Marqueurs (Épisodes)",
    "Gerenciar Marcadores de Séries": "Gérer les marqueurs de séries",
    "Marcadores para Episódios": "Marqueurs pour épisodes",
    "+ Adicionar Marcador": "+ Ajouter un marqueur",
    "Login": "Connexion",
    "Sua API Key": "Votre clé API",
    "Seu Blog ID": "Votre ID de blog",
    "Entrar": "Se connecter",
    "Configurações de API": "Paramètres API",
    "Blog ID": "ID du blog",
    "Blog ID aqui...": "ID du blog ici...",
    "Apenas números, mínimo 8 dígitos.": "Chiffres uniquement, minimum 8 chiffres.",
    "Client ID": "ID client",
    "Client ID aqui...": "ID client ici...",
    "Client Secret": "Secret client",
    "Client Secret aqui...": "Secret client ici...",
    "Refresh Token": "Jeton de rafraîchissement",
    "Refresh Token aqui...": "Jeton de rafraîchissement ici...",
    "API Key": "Clé API",
    "API Key aqui...": "Clé API ici...",
    "URL Do Blogger": "URL Blogger",
    "https://www aqui...": "https://www ici...",
    "Aguardando verificação...": "En attente de vérification...",
    "Cancelar": "Annuler",
    "Limpar Dados": "Effacer les données",
    "Ativar": "Activer",
    "Minha Conta": "Mon compte",
    "Licença:": "Licence :",
    "Blog ID:": "ID du blog :",
    "Client ID:": "ID client :",
    "Secret:": "Secret :",
    "Token:": "Jeton :",
    "URL:": "URL :",
    "Data:": "Date :",
    "Sair": "Déconnexion",
    "Terminando Sessão...": "Déconnexion en cours...",
    "SETTINGS": "PARAMÈTRES",
    "Publicar Série?": "Publier la série ?",
    "Publicar": "Publier",
    "Ver Episódios": "Voir les épisodes",
    "Episódios": "Épisodes",
    "Temporada:": "Saison :",
    "Publicar Temporada": "Publier la saison",
    "Cancelar Publicação": "Annuler la publication",
    "Load More": "Charger plus",
    "Carregando...": "Chargement...",
    "inadb está ouvindo...": "inadb écoute...",
    "Play": "Lire",
    "Player dublados do Brasil<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "Lecteurs doublés brésiliens<br>Utilisez des chiffres (1-3) pour la quantité<br>Utilisez -2- pour sélectionner un lecteur spécifique",
    "Player em inglês<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "Lecteurs en anglais<br>Utilisez des chiffres (1-3) pour la quantité<br>Utilisez -2- pour sélectionner un lecteur spécifique",
    "Player em espanhol<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico": "Lecteurs en espagnol<br>Utilisez des chiffres (1-3) pour la quantité<br>Utilisez -2- pour sélectionner un lecteur spécifique",
    "Ex: 2 ou -2-": "Ex : 2 ou -2-",
    "❌ Escolha entre 1 e 3 servidores por idioma. Total máximo: 6.": "❌ Choisissez 1 à 3 serveurs par langue. Maximum total : 6.",
    "Aplicar": "Appliquer",
    "Editar Players": "Modifier les lecteurs",
    "Salvar": "Enregistrer",
    "Adicionar Player": "Ajouter un lecteur",
    "Pesquisar": "Rechercher",
    "⚠️ Publicação Bloqueada": "⚠️ Publication bloquée",
    "Primeiro publique a série, depois publique os episódios.": "Publiez d'abord la série, puis les épisodes.",
    "Voltar para Publicar": "Retour à la publication",
    "Pesquisar Série": "Rechercher une série",
    "Digite nome (2+ letras) ou ID (7+ dígitos)...": "Saisissez un nom (2+ lettres) ou un ID (7+ chiffres)...",
    "Confirmar ID": "Confirmer l'ID"
  }
};

// Função para aplicar a tradução
function applyTranslation(lang) {
  const trans = translations[lang] || translations["pt-BR"];
  const map = {};
  Object.entries(trans).forEach(([key, value]) => {
    map[key.trim()] = value;
  });

  function translateElement(el) {
    if (!el) return;
    const key = el.textContent?.trim();
    if (map[key]) el.textContent = map[key];
  }

  // === Traduções principais ===
  document.querySelectorAll(".nav-label").forEach(el => {
    // EXCEÇÃO: não traduzir "Conta"
    if (el.textContent.trim() !== "Conta") {
      translateElement(el);
    }
  });

  // Placeholder do campo de busca principal
  const searchInput = document.getElementById('search-input');
  if (searchInput && map["Pesquisar"]) {
    searchInput.placeholder = map["Pesquisar"];
  }

  // Filtros
  const yearLabel = document.querySelector('label[for="yearFilter"]');
  translateElement(yearLabel);
  const yearOption = document.querySelector("#yearFilter option[value='']");
  if (yearOption && map["Todos os anos"]) yearOption.textContent = map["Todos os anos"];

  const audienceLabel = document.querySelector('label[for="audienceFilter"]');
  translateElement(audienceLabel);
  document.querySelectorAll('#audienceFilter option').forEach(opt => {
    const val = opt.textContent.trim();
    const mapped = {
      "Todos": "Todos",
      "Crianças": "Crianças",
      "Adolescentes": "Adolescentes",
      "Família": "Família",
      "Adultos": "Adultos",
      "Público Geral": "Público Geral"
    }[val];
    if (mapped && map[mapped]) opt.textContent = map[mapped];
  });

  const genreLabel = document.querySelector('label[for="genreFilter"]');
  translateElement(genreLabel);
  const genreOption = document.querySelector("#genreFilter option[value='']");
  if (genreOption && map["Todos os gêneros"]) genreOption.textContent = map["Todos os gêneros"];

  const discoverBtn = document.getElementById("discoverButton");
  if (discoverBtn) translateElement(discoverBtn);

  const newsHeader = document.querySelector('#notificationSidebar .notification-header h3');
  if (newsHeader && map["Novidades"]) newsHeader.textContent = map["Novidades"];

  document.querySelectorAll('.notification-item h4').forEach(translateElement);

  const applyBtn = document.getElementById("applyBtn");
  if (applyBtn && map["Aplicar"]) applyBtn.textContent = map["Aplicar"];

  const autoPlayH4 = document.querySelector('h4');
  if (autoPlayH4 && autoPlayH4.textContent.trim() === "Reproduzir Automaticamente") {
    translateElement(autoPlayH4);
  }

  const autoPlayP = document.querySelector('p');
  if (autoPlayP && autoPlayP.textContent.trim() === "Ative ou desative o autoplay dos vídeos.") {
    translateElement(autoPlayP);
  }

  const autoPlayH3 = document.querySelector('h3');
  if (autoPlayH3 && autoPlayH3.textContent.trim() === "Autoplay") {
    translateElement(autoPlayH3);
  }

  // === Configurações ===
  const settingsHeader = document.querySelector('#settings-screen .settings-header h2');
  if (settingsHeader && map["Settings"]) settingsHeader.textContent = map["Settings"];

  const closeSettingsBtn = document.querySelector('#close-settings');
  if (closeSettingsBtn && map["← Back"]) closeSettingsBtn.textContent = map["← Back"];

  // TRADUZIR ITENS DE CONFIGURAÇÃO, MAS NÃO "Conta"
  document.querySelectorAll('.setting-item span').forEach(span => {
    const currentText = span.textContent.trim();
    if (currentText === "Conta") {
      // Mantém "Conta" em todos os idiomas
      return;
    }
    const configTextMap = {
      "Notificações": "Notifications",
      "Privacidade": "Privacy",
      "API": "API",
      "Ajuda": "Help",
      "Idioma": "Language",
      "Marcadores (Séries)": "Series Markers",
      "Marcadores (Episódios)": "Episode Markers"
    };
    let key = configTextMap[currentText] || currentText;
    if (map[key]) span.textContent = map[key];
  });

  // Modais de marcadores
  const seriesMarkersHeader = document.querySelector('#markers-modal-series .modal-header h3');
  if (seriesMarkersHeader && map["Gerenciar Marcadores de Séries"]) {
    seriesMarkersHeader.textContent = map["Gerenciar Marcadores de Séries"];
  }

  const episodeMarkersHeader = document.querySelector('#episode-markers-modal .modal-header h3');
  if (episodeMarkersHeader && map["Marcadores para Episódios"]) {
    episodeMarkersHeader.textContent = map["Marcadores para Episódios"];
  }

  const addSeriesMarkerBtn = document.querySelector('#addMarkerBtnSeries');
  if (addSeriesMarkerBtn && map["+ Adicionar Marcador"]) {
    addSeriesMarkerBtn.textContent = map["+ Adicionar Marcador"];
  }

  const addEpisodeMarkerBtn = document.querySelector('#addEpisodeMarkerBtn');
  if (addEpisodeMarkerBtn && map["+ Adicionar Marcador"]) {
    addEpisodeMarkerBtn.textContent = map["+ Adicionar Marcador"];
  }

  // === Login / API / Perfil ===
  const loginPopupTitle = document.querySelector('#login-popup h2');
  if (loginPopupTitle && map["Login"]) loginPopupTitle.textContent = map["Login"];

  const apiKeyPlaceholder = document.querySelector('#login-apiKey');
  if (apiKeyPlaceholder && map["Sua API Key"]) apiKeyPlaceholder.placeholder = map["Sua API Key"];

  const blogIdPlaceholder = document.querySelector('#login-blogId');
  if (blogIdPlaceholder && map["Seu Blog ID"]) blogIdPlaceholder.placeholder = map["Seu Blog ID"];

  const loginBtn = document.querySelector('#login-btn');
  if (loginBtn && map["Entrar"]) loginBtn.textContent = map["Entrar"];

  const apiPopupTitle = document.querySelector('#api-popup h3');
  if (apiPopupTitle && map["Configurações de API"]) apiPopupTitle.textContent = map["Configurações de API"];

  const apiLabels = {
    'blog-id': "Blog ID",
    'client-id': "Client ID",
    'client-secret': "Client Secret",
    'refresh-token': "Refresh Token",
    'api-key': "API Key",
    'api-url': "URL Do Blogger"
  };

  Object.entries(apiLabels).forEach(([id, labelKey]) => {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label && map[labelKey]) label.textContent = map[labelKey];

    const input = document.getElementById(id);
    if (input && map[`${labelKey} aqui...`]) {
      input.placeholder = map[`${labelKey} aqui...`];
    }
  });

  const blogIdError = document.getElementById('blog-id-error');
  if (blogIdError && map["Apenas números, mínimo 8 dígitos."]) {
    blogIdError.textContent = map["Apenas números, mínimo 8 dígitos."];
  }

  const verifyStatus = document.getElementById('verify-status');
  if (verifyStatus && map["Aguardando verificação..."]) {
    verifyStatus.textContent = map["Aguardando verificação..."];
  }

  const cancelBtn = document.getElementById('cancel-btn');
  if (cancelBtn && map["Cancelar"]) cancelBtn.textContent = map["Cancelar"];

  const clearBtn = document.getElementById('clear-btn');
  if (clearBtn && map["Limpar Dados"]) clearBtn.textContent = map["Limpar Dados"];

  const activateBtn = document.getElementById('activate-btn');
  if (activateBtn && map["Ativar"]) activateBtn.textContent = map["Ativar"];

  const profilePopupTitle = document.querySelector('#profile-popup h2');
  if (profilePopupTitle && map["Minha Conta"]) profilePopupTitle.textContent = map["Minha Conta"];

  const profileLabels = ["Licença:", "Blog ID:", "Client ID:", "Secret:", "Token:", "URL:", "Data:"];
  profileLabels.forEach(labelText => {
    document.querySelectorAll(`.profile-item p`).forEach(p => {
      if (p.innerHTML.includes(`<strong>${labelText}</strong>`)) {
        const translatedLabel = map[labelText];
        if (translatedLabel) {
          p.innerHTML = p.innerHTML.replace(`<strong>${labelText}</strong>`, `<strong>${translatedLabel}</strong>`);
        }
      }
    });
  });

  const logoutBtn = document.querySelector('#logout-btn');
  if (logoutBtn && map["Sair"]) logoutBtn.textContent = map["Sair"];

  const logoutToastText = document.querySelector('#logout-toast span');
  if (logoutToastText && map["Terminando Sessão..."]) {
    logoutToastText.textContent = map["Terminando Sessão..."];
  }

  const cancelLogoutBtn = document.getElementById('cancel-logout');
  if (cancelLogoutBtn && map["Cancelar"]) {
    cancelLogoutBtn.textContent = map["Cancelar"];
  }

  // === Novas traduções ===

  // Botão SETTINGS na navegação
  const settingsNavLabel = document.querySelector('#api-button .nav-label');
  if (settingsNavLabel && map["SETTINGS"]) {
    settingsNavLabel.textContent = map["SETTINGS"];
  }

  // Popup de Confirmação de Publicação
  const confirmPopupTitle = document.getElementById('confirmPopupTitle');
  if (confirmPopupTitle && map["Publicar Série?"]) {
    confirmPopupTitle.textContent = map["Publicar Série?"];
  }

  const confirmPublishBtn = document.getElementById('confirmPublishBtn');
  if (confirmPublishBtn && map["Publicar"]) {
    confirmPublishBtn.textContent = map["Publicar"];
  }

  const cancelPublishBtn = document.getElementById('cancelPublishBtn');
  if (cancelPublishBtn && map["Cancelar"]) {
    cancelPublishBtn.textContent = map["Cancelar"];
  }

  const viewEpisodesBtn = document.getElementById('viewEpisodesBtn');
  if (viewEpisodesBtn && map["Ver Episódios"]) {
    viewEpisodesBtn.title = map["Ver Episódios"];
  }

  // Popup de Episódios
  const episodesPopupTitle = document.getElementById('episodesPopupTitle');
  if (episodesPopupTitle && map["Episódios"]) {
    episodesPopupTitle.textContent = map["Episódios"];
  }

  const seasonLabel = document.querySelector('label[for="seasonSelector"]');
  if (seasonLabel && map["Temporada:"]) {
    seasonLabel.textContent = map["Temporada:"];
  }

  const publishSeasonBtn = document.getElementById('publishSeasonBtn');
  if (publishSeasonBtn && map["Publicar Temporada"]) {
    publishSeasonBtn.textContent = map["Publicar Temporada"];
  }

  const cancelSeasonPublishBtn = document.getElementById('cancelSeasonPublishBtn');
  if (cancelSeasonPublishBtn && map["Cancelar Publicação"]) {
    cancelSeasonPublishBtn.textContent = map["Cancelar Publicação"];
  }

  // Botão "Load More"
  const loadMoreBtn = document.getElementById('inadb-loadmore');
  if (loadMoreBtn && map["Load More"]) {
    loadMoreBtn.textContent = map["Load More"];
  }

  // Textos de loading e mic
  document.querySelectorAll('.notif-loader-text').forEach(el => {
    if (map["Carregando..."]) el.textContent = map["Carregando..."];
  });

  document.querySelectorAll('.mic-text').forEach(el => {
    if (map["inadb está ouvindo..."]) el.textContent = map["inadb está ouvindo..."];
  });

  // Players personalizados
  document.querySelectorAll('.play-text').forEach(el => {
    if (map["Play"]) el.textContent = map["Play"];
  });

  // Tooltips
  const tooltips = document.querySelectorAll('.tooltiptext');
  if (tooltips[0] && map["Player dublados do Brasil<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico"]) {
    tooltips[0].innerHTML = map["Player dublados do Brasil<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico"];
  }
  if (tooltips[1] && map["Player em inglês<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico"]) {
    tooltips[1].innerHTML = map["Player em inglês<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico"];
  }
  if (tooltips[2] && map["Player em espanhol<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico"]) {
    tooltips[2].innerHTML = map["Player em espanhol<br>Use números (1-3) para quantidade<br>Use -2- para selecionar player específico"];
  }

  // Placeholders dos inputs
  const inputPlaceholders = {
    'input-pt-custom': "Ex: 2 ou -2-",
    'input-en-custom': "Ex: 2 ou -2-",
    'input-es-custom': "Ex: 2 ou -2-"
  };
  Object.entries(inputPlaceholders).forEach(([id, key]) => {
    const input = document.getElementById(id);
    if (input && map[key]) input.placeholder = map[key];
  });

  // Mensagem de erro
  const errorSeries = document.getElementById('error-series');
  if (errorSeries && map["❌ Escolha entre 1 e 3 servidores por idioma. Total máximo: 6."]) {
    errorSeries.innerHTML = map["❌ Escolha entre 1 e 3 servidores por idioma. Total máximo: 6."];
  }

  // Botões de aplicação e edição
  const applyButtonSeries = document.getElementById('applyButtonSeries');
  if (applyButtonSeries && map["Aplicar"]) applyButtonSeries.textContent = map["Aplicar"];

  const editSeriesBtn = document.getElementById('editSeriesBtn');
  if (editSeriesBtn && map["Editar Players"]) editSeriesBtn.textContent = map["Editar Players"];

  // Botões no wrapper custom
  const saveBtn = document.querySelector('#customSeriesWrapper .button[onclick*="saveCustomSeriesInputs"]');
  if (saveBtn && map["Salvar"]) saveBtn.textContent = map["Salvar"];

  const addPlayerBtn = document.querySelector('#customSeriesWrapper .button[onclick*="addCustomSeriesInputField"]');
  if (addPlayerBtn && map["Adicionar Player"]) addPlayerBtn.textContent = map["Adicionar Player"];

  const cancelEditBtn = document.querySelector('#customSeriesWrapper .button[onclick*="cancelEditSeries"]');
  if (cancelEditBtn && map["Cancelar"]) cancelEditBtn.textContent = map["Cancelar"];

  // === NOVO: Popup de Publicação Bloqueada ===
  const blockedTitle = document.querySelector('.popup-content h3');
  if (blockedTitle && blockedTitle.textContent.includes("Publicação Bloqueada")) {
    if (map["⚠️ Publicação Bloqueada"]) {
      blockedTitle.textContent = map["⚠️ Publicação Bloqueada"];
    }
  }

  const blockedMessage = document.querySelector('.popup-content p');
  if (blockedMessage && blockedMessage.textContent.trim() === "Primeiro publique a série, depois publique os episódios.") {
    if (map["Primeiro publique a série, depois publique os episódios."]) {
      blockedMessage.textContent = map["Primeiro publique a série, depois publique os episódios."];
    }
  }

  const btnGoToPublish = document.getElementById('btnGoToPublish');
  if (btnGoToPublish && map["Voltar para Publicar"]) {
    btnGoToPublish.textContent = map["Voltar para Publicar"];
  }

  const btnSearchSeries = document.getElementById('btnSearchSeries');
  if (btnSearchSeries && map["Pesquisar Série"]) {
    btnSearchSeries.textContent = map["Pesquisar Série"];
  }

  const seriesSearchInput = document.getElementById('seriesSearchInput');
  if (seriesSearchInput && map["Digite nome (2+ letras) ou ID (7+ dígitos)..."]) {
    seriesSearchInput.placeholder = map["Digite nome (2+ letras) ou ID (7+ dígitos)..."];
  }

  const btnConfirmId = document.getElementById('btnConfirmId');
  if (btnConfirmId && map["Confirmar ID"]) {
    btnConfirmId.textContent = map["Confirmar ID"];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("selectedLanguage") || "pt-BR";
  applyTranslation(savedLang);

  const applyBtn = document.getElementById("applyBtn");
  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      const newLang = applyBtn.dataset.pendingLang;
      if (newLang) {
        localStorage.setItem("selectedLanguage", newLang);
        applyTranslation(newLang);
        document.getElementById("languageSidebar").classList.remove("active");
        document.getElementById("languageOverlay").style.display = "none";
      }
    });
  }
});

function getPlayerLinksHTML() {
  const inputs = JSON.parse(localStorage.getItem('customInputs')) || [];
  if (inputs.length === 0) return '';

  return inputs.map(input => `
        <div class="link">
            <a data-lity="" href="${input.url}" rel="nofollow">${input.tipo}</a>
        </div>
    `).join('');
}