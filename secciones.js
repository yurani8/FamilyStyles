

//FILTRO
document.addEventListener('DOMContentLoaded', function() {
    const filtroCategoria = document.getElementById('filtro-categoria');
    const resetBtn = document.getElementById('reset-filtros');
    const contador = document.getElementById('contador-productos');
    const productos = document.querySelectorAll('.producto');
    
    function aplicarFiltros() {
        const categoriaSeleccionada = filtroCategoria.value.toLowerCase();
        let visibles = 0;
        
        productos.forEach(producto => {
            const categoriaProducto = producto.dataset.categoria.toLowerCase();
            const mostrar = categoriaSeleccionada==''||categoriaProducto===categoriaSeleccionada;    
            
            if (mostrar) {
                producto.classList.remove('producto-oculto');
                visibles++;
            } else {
                producto.classList.add('producto-oculto');
            }
        });
        
        contador.textContent = `Mostrando ${visibles} ${visibles === 1 ? 'categoría' : 'categorías'}`;
    }
    
    // Event listeners
    filtroCategoria.addEventListener('change', aplicarFiltros);
    resetBtn.addEventListener('click', function() {
        filtroCategoria.value = '';
        aplicarFiltros();
    });
    
    // Inicializar
    aplicarFiltros();
});

//CHATBOT
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
    if (texto.includes('precio')) return 'Puedes ver todos los precios en cada producto.';
    if (texto.includes('recomendados')) return 'Nuestras ofertas, y nuetros productos de alta calidad';
    if (texto.includes('tienen tienda fisica')) return 'Por el momento tienda fisica no tenemos, solo nos encontramos en linea, pero pronto la tendremos y te lo haremos saber';
    if (texto.includes('tienen ofertas disponibles')) return '¡Claro! contamos con muchas ofertas te encantaran 😊';
    if (texto.includes('Cuáles son las tallas disponibles')) 
      return 'contamos con todas las tallas, desde la mas pequeña a la mas grande';
    if (texto.includes('realizan descuentos')) return '¡Si!. Al realizar una compra mayor a $200.000 se te realiza un descuento del 20% en el valor total';
    if (texto.includes('gracias')) return '¡Con gusto! 😊';
    return 'Lo siento, aún estoy aprendiendo 🧠';
    }