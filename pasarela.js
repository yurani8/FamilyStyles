// Almacena el código CAPTCHA generado globalmente
let captchaCodigoGlobal = '';

// Plantillas HTML para los métodos de pago
const metodosPago = {
  nequi: `
    <h5>Pago con Nequi</h5>
    <input type="text" class="form-control mb-2" placeholder="Número Nequi" required />
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
    <input type="text" class="form-control mb-2" placeholder="Número de cuenta" required />
    <div class="invalid-feedback">Este campo es obligatorio</div>
  `,
  visa: `
    <h5>Pago con Tarjeta Visa</h5>
    <input type="text" class="form-control mb-2" placeholder="Número de tarjeta" required />
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
    <input type="text" class="form-control mb-2" placeholder="Número de cuenta" required />
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
  document.querySelector('.btn-success').style.display = 'none';

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
 * Muestra un mensaje de error en el campo especificado.
 * @param {HTMLElement} campo - Campo del formulario.
 * @param {string} mensaje - Mensaje de error a mostrar.
 */
function mostrarError(campo, mensaje) {
  campo.classList.add('El campo es invalido'); // mensaje de error de error
  campo.classList.remove('El campo es valido'); // Quita estilo de éxito (si lo tenía)

  const feedback = campo.nextElementSibling; // Busca el siguiente elemento (feedback del error)
  if (feedback && feedback.classList.contains('invalid-feedback')) {
    feedback.textContent = mensaje; // Muestra el mensaje
    feedback.classList.remove('d-none'); // Asegura que se vea
    feedback.classList.add('d-block'); // Aplica estilo visible
  }
}

/**
 * Oculta el mensaje de error en un campo cuando se valida correctamente.
 * @param {HTMLElement} campo - Campo del formulario.
 */
function ocultarError(campo) {
  campo.classList.remove('El campo es invalido'); // Quita estilo de error
  campo.classList.add('El campo es valido'); // Aplica estilo de éxito

  const feedback = campo.nextElementSibling;
  if (feedback && feedback.classList.contains('invalid-feedback')) {
    feedback.classList.add('d-none'); // Oculta el mensaje de error
    feedback.classList.remove('d-block');
  }
}

/**
 * Detecta la entrada del usuario en los formularios y valida cada campo en tiempo real.
 */
document.addEventListener('input', function (e) {
  const campo = e.target;

  // Aplica solo a formularios con ID formulario-metodo o formulario-envio
  if (!campo.closest('#formulario-metodo') && !campo.closest('#formulario-envio')) return;

  const id = campo.id;       // ID del campo que se está editando
  const valor = campo.value; // Valor actual del campo

  // Valida campos que deben tener solo números
  if (['numero', 'cvv', 'telefono'].includes(id)) {
    campo.value = valor.replace(/\D/g, ''); // Elimina todo lo que no sea número
    if (!/^\d+$/.test(campo.value)) {
      mostrarError(campo, 'Solo se permiten números');
      return;
    }
  }

  // Valida formato MM/AAAA para fecha de vencimiento
  if (id === 'fecha') {
    campo.maxLength = 7; // Máximo 7 caracteres (MM/AAAA)
    let limpio = valor.replace(/[^\d]/g, ''); // Quita caracteres que no son dígitos

    // Inserta la barra automáticamente al escribir
    campo.value = limpio.length >= 3 ? limpio.slice(0, 2) + '/' + limpio.slice(2, 6) : limpio;

    const partes = campo.value.split('/');
    const añoActual = new Date().getFullYear();

    // Verifica que el mes y el año sean válidos
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

  // Valida el campo de nombre (solo letras y espacios)
  if (id === 'nombre') {
    const regexNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
    if (!regexNombre.test(valor.trim())) {
      mostrarError(campo, 'El nombre solo puede contener letras y espacios');
      return;
    }
  }

  // Valida el campo de dirección (letras, números, espacios y símbolos válidos)
  if (id === 'direccion') {
    const regexDireccion = /^[A-Za-z0-9\s#\-\.,°]+$/;
    if (!regexDireccion.test(valor.trim())) {
      mostrarError(campo, 'La dirección contiene caracteres inválidos');
      return;
    }
  }

  // Validación general: campo vacío
  if (campo.value.trim() === '') {
    mostrarError(campo, 'Este campo es obligatorio');
  } else {
    ocultarError(campo); // Si pasa todas las validaciones, se oculta el error
  }
});

/**
 * Previene que se use la tecla espacio en campos donde no debe permitirse.
 */
document.addEventListener('keydown', function (e) {
  const campo = e.target;

  // Aplica solo a los formularios relevantes
  if (!campo.closest('#formulario-metodo') && !campo.closest('#formulario-envio')) return;

  const id = campo.id;

  // Solo se permite espacio en campos de nombre y dirección
  const permiteEspacio = id === 'nombre' || id === 'direccion';

  if (e.key === ' ' && !permiteEspacio) {
    e.preventDefault(); // Bloquea la tecla espacio
  }
});

/**
 * Función que se ejecuta al enviar el formulario de envío/pago
 * Realiza validaciones finales antes de enviar
 */
function confirmarPago() {
  const nombre = document.getElementById('nombre')?.value.trim();
  const telefono = document.getElementById('telefono')?.value.trim();
  const direccion = document.getElementById('direccion')?.value.trim();

  // Expresiones regulares para validar los valores ingresados
  const nombreValido = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
  const telefonoValido = /^\d{7,15}$/; // Entre 7 y 15 dígitos
  const direccionValida = /^[A-Za-z0-9\s#\-\.,°]+$/;

  // Validación de campos vacíos
  if (!nombre || !telefono || !direccion) {
    alert("Por favor, completa todos los campos de envío.");
    return;
  }

  // Validación individual de cada campo
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

  // Si todo es válido, muestra mensaje de éxito y redirige
  alert("✅ ¡Pago exitoso! Gracias por tu compra.");
  window.location.href = "gracias.html";
}
