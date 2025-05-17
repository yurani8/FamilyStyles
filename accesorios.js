//muestra cuando agregamos al carrito
function agregarAlCarrito(nombre, imagen, precio, tipoTalla = 'adulto') {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Buscar si ya existe el producto
    const productoExistente = carrito.find(p => p.nombre === nombre);

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {

      carrito.push({
        nombre: nombre,
        imagen: imagen,
        precio: precio,
        cantidad: 1,
        tipoTalla: tipoTalla,
        talla: tipoTalla === 'adulto' ? 'M' : tipoTalla === 'niño' ? '6' : '3-6M' // talla por defecto según tipo
        
      });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert(`"${nombre}" agregado al carrito`);
  }


//FILTRO
document.addEventListener('DOMContentLoaded', function() {
// Elementos del DOM (corregido el ID)
const buscarInput = document.getElementById('buscar-conjuntos');
const filtroPrecio = document.getElementById('filtro-precio'); // ID corregido
const limpiarBtn = document.getElementById('limpiar-filtros');
const contador = document.getElementById('cantidad-productos');
const productos = document.querySelectorAll('[data-nombre]');

// Función para normalizar precios (convertir "50.000-100.000" a 50-100)
function normalizarRango(rango) {
return rango.replace(/\./g, '').replace(/\$/g, '').replace(/ /g, '').replace(/000/g, '');
}

function filtrarProductos() {
const terminoBusqueda = buscarInput.value.toLowerCase();
const rangoPrecioSeleccionado = filtroPrecio.value;
let productosVisibles = 0;

productos.forEach(producto => {
const nombre = producto.getAttribute('data-nombre').toLowerCase();
const precioProducto = normalizarRango(producto.getAttribute('data-precio'));

// Verificar coincidencias
const coincideNombre = nombre.includes(terminoBusqueda) || terminoBusqueda === '';
const coincidePrecio = rangoPrecioSeleccionado === '' || 
                  (rangoPrecioSeleccionado === precioProducto);

if (coincideNombre && coincidePrecio) {
producto.style.display = 'block';
productosVisibles++;
} else {
producto.style.display = 'none';
}
});

contador.textContent = productosVisibles;
}

// Event listeners
buscarInput.addEventListener('input', filtrarProductos);
filtroPrecio.addEventListener('change', filtrarProductos);

limpiarBtn.addEventListener('click', function() {
buscarInput.value = '';
filtroPrecio.value = '';
filtrarProductos();
});

// Inicializar
filtrarProductos();
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

//CALIFICACION
document.addEventListener("DOMContentLoaded", function() {
// Seleccionamos todos los productos
const productos = document.querySelectorAll(".col-md-3.mb-4");

// Usas productoId como clave única
productos.forEach((producto) => {
const productoId = producto.getAttribute("data-producto-id");


// Creamos el HTML para calificación y comentarios
const ratingHTML = `
<button class="btn btn-outline-primary btn-sm mt-2" onclick="toggleRating('${productoId}')">
  Calificar este producto
</button>
<div id="rating-section-${productoId}" style="display: none;">
  <select class="form-select" id="rating-${productoId}">
    <option value="5">Califica Este Producto</option>
    <option value="5">⭐⭐⭐⭐⭐</option>
    <option value="4">⭐⭐⭐⭐</option>
    <option value="3">⭐⭐⭐</option>
    <option value="2">⭐⭐</option>
    <option value="1">⭐</option>
  </select>
  <textarea class="form-control mt-2" id="comment-${productoId}" placeholder="Escribe tu comentario..."></textarea>
  <button class="btn btn-primary btn-sm mt-2" onclick="enviarComentario('${productoId}')">Enviar comentario</button>
 <button class="btn btn-secondary btn-sm mt-2" id="toggle-btn-${productoId}" style="display: none;" onclick="toggleComentarios('${productoId}')">Ver/Ocultar Comentarios</button>
  <div class="comentarios mt-3" id="comentarios-${productoId}" style="display: none;"></div>
</div>
`;

// Insertar el HTML en cada producto
const cardBody = producto.querySelector(".card-body");
cardBody.insertAdjacentHTML('beforeend', ratingHTML);

// Cargar comentarios guardados
cargarComentarios(productoId);
});
});

// Función para enviar comentario
function enviarComentario(productoId) {
const rating = document.getElementById(`rating-${productoId}`).value;
const comment = document.getElementById(`comment-${productoId}`).value.trim();
const comentariosDiv = document.getElementById(`comentarios-${productoId}`);

if (comment === "") {
alert("Por favor, escribe un comentario antes de enviarlo.");
return;
}

// Crear nuevo comentario
const nuevoComentario = {
rating: rating,
text: comment,
};

// Obtener comentarios existentes de localStorage
let comentarios = JSON.parse(localStorage.getItem(`comentarios-${productoId}`)) || [];
comentarios.push(nuevoComentario);

// Guardar comentarios actualizados
localStorage.setItem(`comentarios-${productoId}`, JSON.stringify(comentarios));

// Mostrar nuevo comentario en la pantalla
mostrarComentario(comentariosDiv, nuevoComentario);

// Mostrar botón si aún no estaba visible
const toggleBtn = document.getElementById(`toggle-btn-${productoId}`);
if (toggleBtn.style.display === "none") {
toggleBtn.style.display = "inline-block";
}

// Limpiar inputs
document.getElementById(`comment-${productoId}`).value = "";
document.getElementById(`rating-${productoId}`).value = "5";
}

// Función para mostrar un comentario individual
function mostrarComentario(contenedor, comentario, index, productoId) {
const divComentario = document.createElement("div");
divComentario.classList.add("comentario", "border", "rounded", "p-2", "mb-2");
divComentario.innerHTML = `
<div><strong>Calificación:</strong> ${"⭐".repeat(comentario.rating)}</div>
<div><strong>Comentario:</strong> ${comentario.text}</div>
<button class="btn btn-danger btn-sm mt-2" onclick="eliminarComentario('${productoId}', ${index}, this)">Eliminar</button>
`;
contenedor.appendChild(divComentario);
}

// Función para cargar comentarios desde localStorage
function cargarComentarios(productoId) {
const comentariosDiv = document.getElementById(`comentarios-${productoId}`);
const toggleBtn = document.getElementById(`toggle-btn-${productoId}`);
const comentarios = JSON.parse(localStorage.getItem(`comentarios-${productoId}`)) || [];

comentarios.forEach((comentario, index) => {
mostrarComentario(comentariosDiv, comentario, index, productoId);
});

// Mostrar el botón solo si hay comentarios
if (comentarios.length > 0) {
toggleBtn.style.display = "inline-block";
}
}

// Función para ocultar/desplegar comentarios
function toggleComentarios(productoId) {
const comentariosDiv = document.getElementById(`comentarios-${productoId}`);
if (comentariosDiv.style.display === "none") {
comentariosDiv.style.display = "block";
} else {
comentariosDiv.style.display = "none";
}
}
function eliminarComentario(productoId, index, boton) {
// Obtener comentarios
let comentarios = JSON.parse(localStorage.getItem(`comentarios-${productoId}`)) || [];

// Eliminar el comentario del array
comentarios.splice(index, 1);

// Actualizar localStorage
localStorage.setItem(`comentarios-${productoId}`, JSON.stringify(comentarios));

// Eliminar el comentario del DOM
const comentarioDiv = boton.closest(".comentario");
comentarioDiv.remove();

// Ocultar el botón si ya no hay comentarios
if (comentarios.length === 0) {
document.getElementById(`toggle-btn-${productoId}`).style.display = "none";
document.getElementById(`comentarios-${productoId}`).style.display = "none";
}
}
function toggleRating(productoId) {
  const section = document.getElementById(`rating-section-${productoId}`);
  if (section) {
    // Alternar entre mostrar/ocultar
    if (section.style.display === "none" || section.style.display === "") {
      section.style.display = "block";
    } else {
      section.style.display = "none";
    }
  }
}

//tabla de tallas y boton
function abrirModal() {
document.getElementById("modalTallas").style.display = "block";
}

function cerrarModal() {
document.getElementById("modalTallas").style.display = "none";
}

window.onclick = function(event) {
const modal = document.getElementById("modalTallas");
if (event.target === modal) {
modal.style.display = "none";
}
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
