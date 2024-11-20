// Definir datos de entrada y botón
const loginBtn = document.getElementById("loginBtn");
//Api URL
const url = 'http://127.0.0.1:5000/login'; // Cambia esto por la URL de tu API

// Agregar evento al botón
loginBtn.addEventListener('click', function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const supplier =  document.getElementById("proveedor").checked;

    console.log("Email:", email);
    console.log("Password:", password);

    if (email === "" || password === "") {
        console.log("No se ha podido iniciar sesión. Faltan datos.");
    } else {
        if(supplier==false){
            login_customer(email, password).then(resultado => {
                console.log("Respuesta de la API:", resultado);
                if (resultado.message === 'Inicio de sesión exitoso') {
                    // Guardar el estado de inicio de sesión en localStorage
                    localStorage.setItem("isLoggedIn", "true");
                    // redirigir al usuario
                    window.location.href = "./home.html";
                } else {
                    alert("Credenciales incorrectas. Inténtalo de nuevo.");
                }
            }).catch(error => {
                const mensaje = "Usuario o contraseña incorrectos";
                document.getElementById("error_login").textContent = mensaje;
            });
        }else{
            alert("El usuario es proveedor");
        }
        
    }
});


async function login_customer(mail, pw) {
    const datos = {
        email: mail,
        password: pw
    };

    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        // Verificar si la respuesta es exitosa (código de estado 200-299)
        if (!respuesta.ok) {
            throw new Error(` ${respuesta.status}`);
        }

        // Convertir la respuesta a JSON
        const resultado = await respuesta.json();
        return resultado; // Devolver el resultado
    } catch (error) {
        console.error(error);
        throw error; // Lanzar el error para manejarlo más arriba si es necesario
    }
}

// Verificar si el usuario ya ha iniciado sesión al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
        
        // Redirigir al usuario al home si ya está autenticado
        window.location.href = "./home.html";
    }
});