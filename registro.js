// Definir elementos del DOM
const registroBtn = document.getElementById("registroBtn");
const errorMessage = document.getElementById("error_registro");

// URL de la API
const url = 'http://127.0.0.1:5000/registro'; // Ajusta esto a tu endpoint de registro

// Función para validar el correo electrónico
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para validar la contraseña
function isValidPassword(password) {
    // Mínimo 8 caracteres, al menos una letra y un número
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
}

// Agregar evento al botón de registro
registroBtn.addEventListener('click', function(event) {
    event.preventDefault();
    
    // Obtener valores de los campos
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const isSupplier = document.getElementById("proveedor").checked;
    const acceptTerms = document.getElementById("terminos").checked;

    // Limpiar mensaje de error previo
    errorMessage.textContent = "";

    // Validaciones
    if (!nombre || !email || !username || !password || !confirmPassword) {
        errorMessage.textContent = "Por favor, completa todos los campos.";
        return;
    }

    if (!isValidEmail(email)) {
        errorMessage.textContent = "Por favor, ingresa un correo electrónico válido.";
        return;
    }

    if (!isValidPassword(password)) {
        errorMessage.textContent = "La contraseña debe tener al menos 8 caracteres, una letra y un número.";
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = "Las contraseñas no coinciden.";
        return;
    }

    if (!acceptTerms) {
        errorMessage.textContent = "Debes aceptar los términos y condiciones.";
        return;
    }

    // Si todas las validaciones pasan, intentar registro
    registrarUsuario({
        nombre,
        email,
        username,
        password,
        isSupplier
    });
});

async function registrarUsuario(datos) {
    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        if (!respuesta.ok) {
            throw new Error('Error al registrar el usuario');
        }

        const resultado = await respuesta.json();
        if (resultado.success) {
            alert("Registro exitoso. Por favor, inicia sesión.");
            window.location.href = "./login.html";
        }
    } catch (error) {
        console.error('Error en el registro:', error);
        errorMessage.textContent = "Error en el registro. Por favor, intenta nuevamente.";
    }
}

// Limpiar mensaje de error cuando el usuario comience a escribir
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        errorMessage.textContent = "";
    });
});
