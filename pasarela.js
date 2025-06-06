// Almacena el código CAPTCHA generado globalmente
let captchaCodigoGlobal = '';

// Plantillas HTML para los métodos de pago
const metodosPago = {
  nequi: `
    <h5>Pago con Nequi</h5>
    <input type="text" class="form-control mb-2" id="numero" placeholder="Número Nequi" required />
    <div class="invalid-feedback">Este campo es obligatorio</div>
    <input type="text" class="form-control mb-2" placeholder="Código de verificación (SMS)" required />
    <div class="invalid-feedback">Este campo es obligatorio</div>
  `,
  wompi: `
    <h5>Pago con Wompi</h5>
    <input type="email" class="form-control mb-2" placeholder="Correo asociado a Wompi" required />
    <div class="invalid-feedback">Este campo es obligatorio</div>
    <input type="password" class="form-control mb-2" placeholder="Contraseña" required />
    <div class="invalid-feedback">Este campo es obligatorio</div>
  `,
  pse: `
    <h5>Pago con PSE</h5>
    <select class="form-control mb-2" required>
      <option value="">Selecciona tu banco</option>
      <option>Bancolombia</option>
      <option>Davivienda</option>
      <option>Banco de Bogotá</option>
    </select>
    <div class="invalid-feedback">Selecciona un banco válido</div>
    <input type="text" class="form-control mb-2" id="numero" placeholder="Número de cuenta" required />
    <div class="invalid-feedback">Este campo es obligatorio</div>
  `,
  visa: `
    <h5>Pago con Tarjeta Visa</h5>
    <input type="text" class="form-control mb-2" id="numero" placeholder="Número de tarjeta" required />
    <div class="invalid-feedback">Este campo es obligatorio</div>
    <input type="text" class="form-control mb-2" placeholder="Nombre en la tarjeta" required />
    <div class="invalid-feedback">Este campo es obligatorio</div>
    <div class="row g-2">
      <div class="col">
        <input type="text" class="form-control" placeholder="MM/AAAA" required />
        <div class="invalid-feedback">Este campo es obligatorio</div>
      </div>
      <div class="col">
        <input type="text" class="form-control" placeholder="CVV" required />
        <div class="invalid-feedback">Este campo es obligatorio</div>
      </div>
    </div>
  `,
  bancolombia: `
    <h5>Pago con Bancolombia</h5>
    <input type="text" class="form-control mb-2" id="numero" placeholder="Número de cuenta" required />
    <div class="invalid-feedback">Este campo es obligatorio</div>
    <input type="password" class="form-control mb-2" placeholder="Clave dinámica" required />
    <div class="invalid-feedback">Este campo es obligatorio</div>
  `
};

/**
 * Genera un código CAPTCHA aleatorio de 6 caracteres
 * @returns {string}
 */
function generarCaptcha() {
  const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return captcha;
}

/**
 * Cambia el formulario según el método de pago seleccionado
 * @param {string} metodo - Clave del método en el objeto `metodosPago`
 */
function seleccionarMetodo(metodo) {
  document.querySelectorAll('.metodo-pago').forEach(el => el.classList.remove('active'));
  event.currentTarget.classList.add('active');

  const captcha = generarCaptcha();
  captchaCodigoGlobal = captcha;

  document.getElementById('formulario-metodo').innerHTML = `
    ${metodosPago[metodo] || ''}
    <div class="mt-4">
      <label class="form-label"><strong>Verificación:</strong> Escribe el código que ves a continuación:</label><br>
      <div class="captcha-box" id="codigo-captcha">${captcha}</div>
      <input type="text" id="entrada-captcha" class="form-control mt-2" placeholder="Ingresa el código" />
    </div>
  `;
}

/**
 * Procesa el pago: valida el formulario y el CAPTCHA
 */
function procesarPago() {
  const entradaCaptcha = document.getElementById('entrada-captcha');

  if (!entradaCaptcha) {
    alert("Selecciona un método de pago primero.");
    return;
  }

  const campos = document.querySelectorAll('#formulario-metodo input, #formulario-metodo select');
  let formularioValido = true;

  campos.forEach(campo => {
    const esSelectVacio = campo.tagName === "SELECT" && campo.value.trim() === "";
    const esInputVacio = campo.value.trim() === "";

    if (esSelectVacio || esInputVacio) {
      mostrarError(campo, 'Este campo es obligatorio');
      formularioValido = false;
    } else {
      ocultarError(campo);
    }
  });

  if (!formularioValido) return;

  const captchaIngresado = entradaCaptcha.value.trim().toUpperCase();
  if (captchaIngresado !== captchaCodigoGlobal) {
    alert("❌ Código de verificación incorrecto.");
    return;
  }

  // Ocultar botón Aceptar
   const botonAceptar = document.getElementById('botonAceptar');
  if (botonAceptar) botonAceptar.style.display = 'none';


  // Mostrar formulario de dirección
  const formularioDireccion = `
    <h4 class="text-center mt-4">Ingresa tus datos de envío</h4>
    <div class="row mt-3">
      <div class="col-md-6 mb-3">
        <input type="text" id="nombre" class="form-control" placeholder="Nombre completo" required>
      </div>
      <div class="col-md-6 mb-3">
        <input type="text" id="telefono" class="form-control" placeholder="Teléfono" required>
      </div>
      <div class="col-12 mb-3">
        <input type="text" id="direccion" class="form-control" placeholder="Dirección de envío" required>
      </div>
      <div class="col-12 text-center">
        <button class="btn btn-primary" onclick="confirmarPago()">Confirmar Pago</button>
      </div>
    </div>
  `;
  document.getElementById('formulario-metodo').insertAdjacentHTML('beforeend', formularioDireccion);

}
/**
 * Muestra un mensaje de error en un campo
 * @param {HTMLElement} campo
 * @param {string} mensaje
 */
function mostrarError(campo, mensaje) {
  campo.classList.add('is-invalid');
  campo.classList.remove('is-valid');
  const feedback = campo.nextElementSibling;
  if (feedback && feedback.classList.contains('invalid-feedback')) {
    feedback.textContent = mensaje;
    feedback.classList.remove('d-none');
    feedback.classList.add('d-block');
  }
}

/**
 * Oculta el mensaje de error en un campo
 * @param {HTMLElement} campo
 */
function ocultarError(campo) {
  campo.classList.remove('is-invalid');
  campo.classList.add('is-valid');
  const feedback = campo.nextElementSibling;
  if (feedback && feedback.classList.contains('invalid-feedback')) {
    feedback.classList.add('d-none');
    feedback.classList.remove('d-block');
  }
}

/**
 * Validaciones en tiempo real para ambos formularios
 */
document.addEventListener('input', function (e) {
  const campo = e.target;
  if (!campo.closest('#formulario-metodo') && !campo.closest('#formulario-envio')) return;

  const id = campo.id;
  const valor = campo.value;
  const placeholder = campo.placeholder?.toLowerCase();

  const soloNumeros = (
    ['numero', 'cvv', 'telefono'].includes(id) ||
    placeholder.includes('número nequi') ||
    placeholder.includes('número de cuenta') ||
    placeholder.includes('número de tarjeta') ||
    placeholder.includes('cvv') ||
    id === 'telefono'
  );

  if (soloNumeros) {
    campo.value = valor.replace(/\D/g, '');
    if (!/^\d+$/.test(campo.value)) {
      mostrarError(campo, 'Solo se permiten números');
      return;
    }
  }

  if (id === 'fecha') {
    campo.maxLength = 7;
    let limpio = valor.replace(/[^\d]/g, '');
    campo.value = limpio.length >= 3 ? limpio.slice(0, 2) + '/' + limpio.slice(2, 6) : limpio;

    const partes = campo.value.split('/');
    const añoActual = new Date().getFullYear();

    if (
      partes.length !== 2 ||
      isNaN(parseInt(partes[0])) ||
      isNaN(parseInt(partes[1])) ||
      parseInt(partes[0]) < 1 ||
      parseInt(partes[0]) > 12 ||
      partes[1].length !== 4 ||
      parseInt(partes[1]) > añoActual
    ) {
      mostrarError(campo, `Formato inválido. Usa MM/AAAA (hasta ${añoActual})`);
      return;
    }
  }

  if (id === 'nombre') {
    const regexNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
    if (!regexNombre.test(valor.trim())) {
      mostrarError(campo, 'El nombre solo puede contener letras y espacios');
      return;
    }
  }

  if (id === 'direccion') {
    const regexDireccion = /^[A-Za-z0-9\s#\-\.,°]+$/;
    if (!regexDireccion.test(valor.trim())) {
      mostrarError(campo, 'La dirección contiene caracteres inválidos');
      return;
    }
  }

  if (campo.value.trim() === '') {
    mostrarError(campo, 'Este campo es obligatorio');
  } else {
    ocultarError(campo);
  }
});


/**
 * Bloquea el espacio en campos que no deberían permitirlo
 */
document.addEventListener('keydown', function (e) {
  const campo = e.target;
  if (!campo.closest('#formulario-metodo') && !campo.closest('#formulario-envio')) return;

  const id = campo.id;
  const permiteEspacio = id === 'nombre' || id === 'direccion';

  if (e.key === ' ' && !permiteEspacio) {
    e.preventDefault();
  }
});

/**
 * Confirmación final del formulario de envío
 */
function confirmarPago() {
  const nombre = document.getElementById('nombre')?.value.trim();
  const telefono = document.getElementById('telefono')?.value.trim();
  const direccion = document.getElementById('direccion')?.value.trim();

  const nombreValido = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
  const telefonoValido = /^\d{7,15}$/;
  const direccionValida = /^[A-Za-z0-9\s#\-\.,°]+$/;

  if (!nombre || !telefono || !direccion) {
    alert("Por favor, completa todos los campos de envío.");
    return;
  }

  if (!nombreValido.test(nombre)) {
    alert("El nombre solo puede contener letras y espacios.");
    return;
  }

  if (!telefonoValido.test(telefono)) {
    alert("El teléfono debe tener entre 7 y 15 dígitos numéricos.");
    return;
  }

  if (!direccionValida.test(direccion)) {
    alert("La dirección contiene caracteres inválidos.");
    return;
  }

  // Éxito
  alert("✅ ¡Pago exitoso! Gracias por tu compra.");
  window.location.href = "gracias.html";
}
