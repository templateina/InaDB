

// Apenas abre o sidebar de notificações
function initMobileNotificationButton() {
    const languageBtnMobile = document.getElementById("openLanguages");
    if (languageBtnMobile) {
        languageBtnMobile.addEventListener("click", () => {
            const sidebar = document.getElementById("notificationSidebar");
            const overlay = document.getElementById("notificationOverlay");
            if (sidebar && overlay) {
                sidebar.classList.add("active");
                overlay.style.display = "block";
                loadUpcomingMovies(); // Carrega filmes em breve
            }
        });
    }
}
// Seleciona somente os spans desejados
const copySpans = document.querySelectorAll('#profile-blogId, #profile-url, #profile-token, #profile-secret, #profile-clientId');

copySpans.forEach(span => {
  span.classList.add('copy-text'); // adiciona classe de estilo

  span.addEventListener('click', () => {
    const text = span.textContent;
    navigator.clipboard.writeText(text).then(() => {
      
      // Mostra aviso
      span.classList.add('copied');

      // Muda texto para verde por 1 segundo
      span.style.color = '#4CAF50';
      setTimeout(() => {
        span.style.color = '#007bff'; // volta para preto
        span.classList.remove('copied'); // remove aviso
      }, 2000);

    }).catch(err => {
      console.error('Erro ao copiar:', err);
    });
  });
});

// Função para adicionar toggle de visualização a qualquer input
function addPasswordToggle(inputId) {
  const input = document.getElementById(inputId);
  const container = input.parentElement;
  const icon = container.querySelector('.eye-icon');

  // Define estado inicial como oculto
  input.setAttribute('type', 'password');

  icon.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    // Atualiza visual
    if (isPassword) {
      container.classList.add('show-password');
      icon.setAttribute('aria-label', 'Ocultar');
    } else {
      container.classList.remove('show-password');
      icon.setAttribute('aria-label', 'Mostrar');
    }
  });

  // Acessibilidade
  icon.setAttribute('role', 'button');
  icon.setAttribute('tabindex', '0');
  icon.setAttribute('aria-label', 'Mostrar');

  icon.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      icon.click();
    }
  });
}

// Lista de todos os inputs que terão o olho
const allInputs = [
  'blog-id',
  'client-id',
  'client-secret',
  'refresh-token',
  'api-key',
  'api-url'
];

// Aplica a todos
allInputs.forEach(addPasswordToggle);
// Executa após carregar a página
window.addEventListener("DOMContentLoaded", () => {
    initMobileNotificationButton();
});
function showInput(radioElement, inputId) {
    const optionsDiv = document.getElementById('options');
    const allInputs = document.querySelectorAll('.input-number');

    optionsDiv.style.display = 'block';
    allInputs.forEach(input => input.style.display = 'none');

    const selectedInput = document.getElementById(inputId);
    if (radioElement.checked) {
        selectedInput.style.display = 'block';
    }
}

// Função para salvar automaticamente quando digitar número válido
function autoSave() {
   const selectedRadio = document.querySelector('input[name="language"]:checked');
   if (!selectedRadio) return;

   const lang = selectedRadio.id.split('-')[1]; // pt, en, es
   const inputId = `input-${lang}-custom`;
   const input = document.getElementById(inputId);
   if (!input) return;

   const value = input.value.trim();
   if (value && !isNaN(value) && value >= 1 && value <= 3) {
      localStorage.setItem('selectedLanguage', selectedRadio.id);
      localStorage.setItem('selectedNumber', value);
   }
}

// Restaura ao carregar
function loadSavedSettings() {
   const savedRadioId = localStorage.getItem('selectedLanguage');
   const savedNumber = localStorage.getItem('selectedNumber');

   if (savedRadioId) {
      const radio = document.getElementById(savedRadioId);
      if (radio) {
         radio.checked = true;

         const lang = savedRadioId.split('-')[1];
         const inputId = `input-${lang}-custom`;
         const input = document.getElementById(inputId);
         if (input) {
            input.style.display = 'inline-block';
            if (savedNumber) input.value = savedNumber;
         }
      }
   }
}

// Adiciona evento de digitação em todos os inputs
document.addEventListener('DOMContentLoaded', function() {
   loadSavedSettings();

   // Monitora digitação nos inputs
   document.querySelectorAll('.input-number').forEach(input => {
      input.addEventListener('input', function() {
         // Delay pequeno para não salvar a cada tecla (opcional)
         clearTimeout(this.delay);
         this.delay = setTimeout(autoSave, 300);
      });
   });

   // Também salva se mudar o rádio e o input já tiver valor válido
   document.querySelectorAll('input[name="language"]').forEach(radio => {
      radio.addEventListener('change', function() {
         autoSave();
      });
   });
});
  
  
 
  
  
  
  
  // Abre o sidebar de idiomas ao clicar no nav-item "IDIOMA"
document.querySelectorAll('.nav-item').forEach(item => {
  const label = item.querySelector('.nav-label');
  if (label && label.textContent.trim() === 'IDIOMA') {
    item.addEventListener('click', function () {
      document.getElementById('languageSidebar').classList.add('active');
      document.getElementById('languageOverlay').style.display = 'block';
    });
  }
});

// Fecha o sidebar de idiomas ao clicar no botão de fechar
document.getElementById('closeLanguages').addEventListener('click', function () {
  document.getElementById('languageSidebar').classList.remove('active');
  document.getElementById('languageOverlay').style.display = 'none';
});

// Fecha ao clicar fora (overlay)
document.getElementById('languageOverlay').addEventListener('click', function () {
  document.getElementById('languageSidebar').classList.remove('active');
  document.getElementById('languageOverlay').style.display = 'none';
});

// Abrir sidebar de autoplay ao clicar no nav-item "AUTOPLAY"
document.querySelectorAll('.nav-item').forEach(item => {
  const label = item.querySelector('.nav-label');
  if (label && label.textContent.trim() === 'AUTOPLAY') {
    item.addEventListener('click', function () {
      document.getElementById('autoplaySidebar').classList.add('active');
      document.getElementById('autoplayOverlay').style.display = 'block';
    });
  }
});

// Fechar sidebar de autoplay ao clicar no botão X
document.getElementById('closeAutoplay').addEventListener('click', function () {
  document.getElementById('autoplaySidebar').classList.remove('active');
  document.getElementById('autoplayOverlay').style.display = 'none';
});

// Fechar ao clicar fora (overlay)
document.getElementById('autoplayOverlay').addEventListener('click', function () {
  document.getElementById('autoplaySidebar').classList.remove('active');
  document.getElementById('autoplayOverlay').style.display = 'none';
});