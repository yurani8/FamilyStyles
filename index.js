
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
/* Funciones del boton de ususario */

// Cargar el archivo botonUsuario.html en el contenedor
fetch("botonUsuario.html")
    .then(res => res.text())
    .then(html => {
      // Inserta el HTML del botón en el contenedor
      document.getElementById("botonUsuarioContainer").innerHTML = html;

      // obtiene el botón y verifica el estado de la sesión
      const botonUsuario = document.getElementById("botonUsuario");
      const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

      if (usuarioLogueado) {
        botonUsuario.title = "Cerrar sesión";
        botonUsuario.onclick = () => {
          if (confirm("¿Deseas cerrar sesión?")) {
            localStorage.removeItem("usuarioLogueado");
            window.location.href = "index.html";  //al cerrar la secion dirige al usuario a la pagina inicial de la tienda
          }
        };
      } else {
        botonUsuario.title = "Iniciar sesión";
        botonUsuario.onclick = () => {
          window.location.href = "prueba_login.html";  // dirige al usuario al login si el usuario no está logueado
        };
      }
    })
    .catch(error => {
      console.error("No se pudo cargar el archivo botonUsuario.html", error);
    });



