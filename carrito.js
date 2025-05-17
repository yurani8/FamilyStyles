/*Funcion para  que los precios se muestren formateados en pesos colombianos*/
function formatearCOP(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  }).format(valor);
}

function mostrarCarrito() {
    const contenedor = document.getElementById('carrito-container');
    const totalCarrito = document.getElementById('total-carrito');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    contenedor.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
      contenedor.innerHTML = '<p class="text-center">El carrito está vacío.</p>';
      totalCarrito.textContent = 'Total: $0.000';
      return;
    }

    carrito.forEach((producto, index) => {
      const subtotal = producto.precio * producto.cantidad;
      total += subtotal;

      const col = document.createElement('div');
      col.className = 'col-md-3 mb-4';

      col.innerHTML = `
        <div class="card h-100">
          <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
          <div class="card-body text-center">
            <h5 class="card-title">${producto.nombre}</h5>
            <p>Precio: ${formatearCOP(producto.precio)}</p>
            <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
              <div>
              <label>Cantidad:</label><br>
              <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${index}, -1)">-</button>
              ${producto.cantidad}
              <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${index}, 1)">+</button>
              </div>
                 <div>
                 <label>Talla:</label><br>
                <select class="form-select form-select-sm" onchange="cambiarTalla(${index}, this.value)" style="width: auto;">
                ${obtenerOpcionesTalla(producto.tipoTalla, producto.talla)}
                </select>
               </div>
               </div>
               <div>
                <p><strong>Subtotal: ${formatearCOP(subtotal)}</strong></p>
                <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${index})">Eliminar</button>
               </div>
              </div>
      `;

      contenedor.appendChild(col);
    });

    //aplizar el descuento del 20% si es total supera los 200.000
    let totalConDescuento=total;
    if (total>200.000){
      totalConDescuento = total*0.8;
    }
    //mostrar el total (con o sin descuento)
    if(total !== totalConDescuento){
      totalCarrito.innerHTML = `
       <span style="text-decoration: line-through; color: red;">Total: ${formatearCOP(total)}</span><br>
       <span style="color: green; font-weight: bold;">Descuento aplicado: ${formatearCOP(totalConDescuento)}</span>
      `;

    }else{
     totalCarrito.textContent= `Total: ${formatearCOP(total)}`;
    }
    }

  function cambiarCantidad(index, cambio) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad < 1) carrito[index].cantidad = 1;
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
  }
  

  function obtenerOpcionesTalla(tipo, tallaSeleccionada) {
let tallas = [];

if (tipo === 'adulto') {
  tallas = ['XS','S', 'M', 'L', 'XL'];
} else if (tipo === 'niño') {
  tallas = ['2','4', '6', '8', '10', '12'];
} else if (tipo === 'bebé') {
  tallas = ['0-3M', '3-6M', '6-12M', '12-18M'];
}


return tallas.map(t => `<option value="${t}" ${t === tallaSeleccionada ? 'selected' : ''}>${t}</option>`).join('');
}

function cambiarTalla(index, nuevaTalla) {
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
carrito[index].talla = nuevaTalla;
localStorage.setItem('carrito', JSON.stringify(carrito));
}

  function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
  }

  function vaciarCarrito() {
    localStorage.removeItem('carrito');
    mostrarCarrito();
  }

  function irAPago() {
const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

if (carrito.length === 0) {
  alert("Tu carrito está vacío.");
  return;
}

const logueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

if (!logueado) {
  alert("Debes iniciar sesión para continuar con el pago.");
  window.location.href = "prueba_login.html";
  return;
}


// Si está logueado, mostrar resumen de pago
let resumen = "Resumen del pedido:\n\n";
let total = 0;

carrito.forEach(producto => {
  const subtotal = producto.precio * producto.cantidad;
  resumen += `${producto.nombre} x ${producto.cantidad} Talla: ${producto.talla} - ${formatearCOP(subtotal)}\n`;
  total += subtotal;
});

 // Aplicar descuento si corresponde
  let totalConDescuento = total;
  if (total > 200.000) {
    totalConDescuento = total * 0.8;
    resumen += `\n💰 Total sin descuento: ${formatearCOP(total)}\n🎉 Descuento aplicado (20%): -${formatearCOP(total - totalConDescuento)}\n✅ Total a pagar: ${formatearCOP(totalConDescuento)}`;
  } else {
    resumen += `\n✅ Total a pagar: ${formatearCOP(total)}`;
  }

  resumen += `\n\n¿Deseas confirmar el pago?`;

// Simulamos la pasarela de pago
if (confirm(resumen)) {
  // Aquí es donde simula el pago y muestra el mensaje de éxito
  alert("¿ Ir a pagar ?");
  localStorage.removeItem('carrito');
  window.location.href = "pasarela.html";  // Redirigir a una página de pasarela de pago
}
}

/* Funciones del boton de ususario */

// Cargar el archivo botonUsuario.html en el contenedor
fetch("usuarioCarrito.html")
    .then(res => res.text())
    .then(html => {
      // Inserta el HTML del botón en el contenedor
      document.getElementById("botonUsuario1Container").innerHTML = html;

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
      console.error("No se pudo cargar el archivo usuarioCarrito.html", error);
    });


  document.addEventListener('DOMContentLoaded', mostrarCarrito);
