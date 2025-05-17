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
      <div class="invalid-feedback">Este campo es obligatorio</div>
    </div>
    <div class="col-md-6 mb-3">
      <input type="text" id="telefono" class="form-control" placeholder="Teléfono" required>
      <div class="invalid-feedback">Este campo es obligatorio</div>
    </div>
    <div class="col-12 mb-3">
      <input type="text" id="direccion" class="form-control" placeholder="Dirección de envío" required>
      <div class="invalid-feedback">Este campo es obligatorio</div>
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
 * Valida los campos mientras el usuario escribe
 */
document.addEventListener('input', function (e) {
  const campo = e.target;
  if (!campo.closest('#formulario-metodo')) return;

  const placeholder = campo.getAttribute('placeholder')?.toLowerCase() || "";
  const valor = campo.value;

  // Solo números
  if (placeholder.includes("número") || placeholder.includes("cvv")) {
    campo.value = valor.replace(/\D/g, '');
    campo.maxLength = 16;
    if (!/^\d+$/.test(campo.value)) {
      mostrarError(campo, 'Solo se permiten números');
      return;
    }
  }

  // Fecha de vencimiento
  if (placeholder.includes("mm/aa") || placeholder.includes("mm/aaaa")) {
    campo.maxLength = 7;
    let limpio = valor.replace(/[^\d]/g, '');

    campo.value = limpio.length >= 3 ? limpio.slice(0, 2) + '/' + limpio.slice(2, 6) : limpio;

    const partes = campo.value.split('/');
    if (partes.length === 2) {
      const mes = parseInt(partes[0], 10);
      const año = parseInt(partes[1], 10);
      const añoActual = new Date().getFullYear();

      if (
        isNaN(mes) || isNaN(año) ||
        mes < 1 || mes > 12 ||
        partes[1].length !== 4 ||
        año > añoActual
      ) {
        mostrarError(campo, `Formato inválido. Usa MM/AAAA (hasta ${añoActual})`);
        return;
      }
    } else {
      mostrarError(campo, 'Formato inválido. Usa MM/AAAA');
      return;
    }
  }

  // Validación general
  if (campo.value.trim() === '') {
    mostrarError(campo, 'Este campo es obligatorio');
  } else {
    ocultarError(campo);
  }
});

/**
 * Bloquea la tecla espacio en formularios para evitar errores accidentales
 */
document.addEventListener('keydown', function (e) {
  if (e.target.closest('#formulario-metodo') && e.key === ' ') {
    e.preventDefault();
  }
});

function validarCampoEnvio(campo) {
  document.addEventListener('input', function (e) {
  const campo = e.target;
  if (!campo.closest('#formularioDireccion')) return;

  const placeholder = campo.getAttribute('placeholder')?.toLowerCase() || "";
  const valor = campo.value;

  // Solo números para campos que tienen "número", "cvv" o "teléfono"
  if (placeholder.includes("número") || placeholder.includes("cvv") || placeholder.includes("teléfono")) {
    campo.value = valor.replace(/\D/g, ''); // elimina todo menos números
    campo.maxLength = 16; // opcional, si quieres limitar
    if (!/^\d+$/.test(campo.value)) {
      mostrarError(campo, 'Solo se permiten números');
      return;
    }
    alert("✅ ¡Pago exitoso! Gracias por tu compra.");
    window.location.href = "gracias.html";
  }

  // Validación fecha de vencimiento
  if (placeholder.includes("mm/aa") || placeholder.includes("mm/aaaa")) {
    // lógica existente para fecha
  }

  // Validación general para no dejar vacío
  if (campo.value.trim() === '') {
    mostrarError(campo, 'Este campo es obligatorio');
  } else {
    ocultarError(campo);
  }
});

}
