function mostrarCarrito() {
    const contenedor = document.getElementById('carrito-container');
    const totalCarrito = document.getElementById('total-carrito');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    contenedor.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
      contenedor.innerHTML = '<p class="text-center">El carrito está vacío.</p>';
      totalCarrito.textContent = 'Total: $0.00';
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
            <p>Precio: $${producto.precio.toFixed(2)}</p>
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
                <p><strong>Subtotal: $${subtotal.toFixed(2)}</strong></p>
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
        <span style="text-decoration: line-through; color: red;">Total: $${total.toFixed(2)}</span><br>
        <span style="color: green; font-weight: bold;">Descuento aplicado: $${totalConDescuento.toFixed(2)}</span>
      `;

    }else{
      totalCarrito.textContent= `Total: $${total.toFixed(2)}`;
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
}else if (tipo === 'cadena') {
  tallas = ['40-45 CM', '45-50CM', '50-55CM', '55-60CM', '60-65CM'];
}else if (tipo === 'anillo') {
  tallas = ['14MM', '15MM', '16MM', '17MM', '18MM','19MM','20MM','21MM'];
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
  resumen += `${producto.nombre} x ${producto.cantidad} Talla: ${producto.talla} - $${subtotal.toFixed(2)}\n`;
  total += subtotal;
});

resumen += `\nTotal: $${total.toFixed(2)}
\n\n¿Deseas confirmar el pago?`;


// Simulamos la pasarela de pago
if (confirm(resumen)) {
  // Aquí es donde simula el pago y muestra el mensaje de éxito
  alert("✅ ¡Pago realizado con éxito! Tu pedido ha sido procesado.");
  localStorage.removeItem('carrito');
  window.location.href = "gracias.html";  // Redirigir a una página de "Gracias por tu compra"
}
}


  document.addEventListener('DOMContentLoaded', mostrarCarrito);
