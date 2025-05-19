let correoTemporal = ""; //guarda el correo temporalmente que el usuario registro, debe quedar fuera de cualquier funcion

        function getUsuarios() {
        return JSON.parse(localStorage.getItem("usuarios")) || [];
        }

        function guardarUsuario(usuario) {
        const usuarios = getUsuarios();
        usuarios.push(usuario);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        }
        function validarCampo(valor, tipo = "texto") {
        const maxCaracteres = 30;
        const regexTexto = /^[a-zA-Z0-9]{1,30}$/; // Letras y números sin espacios
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // Validación básica de correo

        if (valor.length > maxCaracteres) return false;
 
        if (tipo === "texto") return regexTexto.test(valor);
        if (tipo === "correo") return regexCorreo.test(valor) && valor.length <= maxCaracteres;

        return false;
         }

        function iniciarSesion(e) {
            e.preventDefault();
            const usuario = document.getElementById("usuario").value.trim();
            const password = document.getElementById("password").value;
          
            const usuarios = getUsuarios();
            const encontrado = usuarios.find(u =>
              (u.usuario === usuario || u.correo === usuario) && u.password === password
            );
          
            if (encontrado) {
              localStorage.setItem("usuarioLogueado", JSON.stringify(encontrado)); // ✅ Guarda el objeto completo
              alert("✅ Sesión iniciada");
              window.location.href = "carrito.html";
            } else {
              alert("❌ Usuario o contraseña incorrectos");
            }
          }
          

        function registrarUsuario(e) {
        e.preventDefault();
        const nuevoUsuario = document.getElementById("nuevoUsuario").value.trim();
        const nuevoCorreo = document.getElementById("nuevoCorreo").value.trim();
        const nuevaPassword = document.getElementById("nuevaPassword").value;

        const usuarios = getUsuarios();
        const yaExiste = usuarios.find(u => u.usuario === nuevoUsuario || u.correo === nuevoCorreo);

        if (yaExiste) {
            alert("⚠️ El usuario o correo ya está registrado.");
            return;
        }

        const nuevo = {
            usuario: nuevoUsuario,
            correo: nuevoCorreo,
            password: nuevaPassword
        };

        guardarUsuario(nuevo);
        alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
        localStorage.setItem("usuarioLogueado", "true");

        // Limpiar campos
        document.getElementById("nuevoUsuario").value = '';
        document.getElementById("nuevoCorreo").value = '';
        document.getElementById("nuevaPassword").value = '';

        // Volver al login
        const loginCollapse = new bootstrap.Collapse(document.getElementById('loginForm'), { show: true });

    
    }
        function mostrarRecuperacion() {
            document.querySelector("form[onsubmit='iniciarSesion(event)']").classList.add("d-none");
            document.getElementById("formRecuperar").classList.remove("d-none");
            document.getElementById("formNuevaPassword").classList.add("d-none");
        }


        function recuperarClave(e) {
        e.preventDefault();
        const correo = document.getElementById("correoRecuperar").value.trim();
        const usuarios = getUsuarios();

        const usuario = usuarios.find(u => u.correo === correo);
        if (usuario) {
            correoTemporal = correo;
            document.getElementById("formRecuperar").classList.add("d-none");
            document.getElementById("formNuevaPassword").classList.remove("d-none");
        } else {
            alert("❌ Correo no encontrado.");
        }
        }

        function cambiarPassword(e) {
        e.preventDefault();
        const nuevaPassword = document.getElementById("nuevaPasswordRecuperar").value.trim();
        const confirmarPassword = document.getElementById("confirmarPasswordRecuperar").value.trim();

        if (nuevaPassword.length < 6) {
            alert("⚠️ La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        if (nuevaPassword !== confirmarPassword) {
            alert("⚠️ Las contraseñas no coinciden.");
            return;
        }

        let usuarios = getUsuarios();
        usuarios = usuarios.map(u => 
            u.correo === correoTemporal ? { ...u, password: nuevaPassword } : u
        );

        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        alert("🔐 Contraseña actualizada correctamente.");

        // Limpiar y volver al login
        document.getElementById("formNuevaPassword").classList.add("d-none");
        document.querySelector("form[onsubmit='iniciarSesion(event)']").classList.remove("d-none");

        document.getElementById("correoRecuperar").value = '';
        document.getElementById("nuevaPasswordRecuperar").value = '';
        document.getElementById("confirmarPasswordRecuperar").value = '';
        }

        function volverAlLogin() {
        document.getElementById("formRecuperar").classList.add("d-none");
        document.getElementById("formNuevaPassword").classList.add("d-none");
        document.querySelector("form[onsubmit='iniciarSesion(event)']").classList.remove("d-none");

        // Limpiar campos
        document.getElementById("correoRecuperar").value = '';
        document.getElementById("nuevaPasswordRecuperar").value = '';
        document.getElementById("confirmarPasswordRecuperar").value = '';
        }
