
const toggleBtn = document.getElementById('chatbot-toggle');
const chatbotBox = document.getElementById('chatbot-box');
const input = document.getElementById('chatbot-input');
const messages = document.getElementById('chatbot-messages');

// Ocultar el chatbot al iniciar
window.addEventListener('load', () => {
  chatbotBox.style.display = 'none';
});

// Mostrar/ocultar al hacer clic
toggleBtn.addEventListener('click', () => {
  chatbotBox.style.display = chatbotBox.style.display === 'none' ? 'flex' : 'none';
});

// Capturar mensaje del usuario
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && input.value.trim() !== '') {
    const userMsg = input.value.trim();
    addMessage('👤', userMsg);
    input.value = '';
    setTimeout(() => {
      const reply = responderSimulado(userMsg);
      addMessage('🤖', reply);
    }, 600);
  }
});

// Mostrar mensaje en pantalla
function addMessage(sender, text) {
  const msg = document.createElement('div');
  msg.innerHTML = `<strong>${sender}</strong>: ${text}`;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

// Respuestas simuladas básicas
function responderSimulado(texto) {
  texto = texto.toLowerCase();
  if (texto.includes('hola')) return '¡Hola! ¿En qué puedo ayudarte?';
  if (texto.includes('precio')) return 'Puedes ver todos los precios en la tienda.';
  if (texto.includes('recomendados')) return 'Nuestras ofertas';
  if (texto.includes('ofertas')) return '¡Claro! contamos con muchas ofertas te encantaran 😊';
  if (texto.includes('talla')) return 'Tenemos tallas para adultos, niños y bebés.';
  if (texto.includes('gracias')) return '¡Con gusto! 😊';
  return 'Lo siento, aún estoy aprendiendo 🧠';
}

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>

