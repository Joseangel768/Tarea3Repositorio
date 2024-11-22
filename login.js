document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    
    if (registerForm) {
        registerForm.addEventListener("submit", (event) => {
            event.preventDefault();
            
            const NombreUsuario = document.getElementById("registrarNombre").value;
            const ApellidoUsuario = document.getElementById("registrarApellido").value;
            const CorreoUsuario = document.getElementById("registrarCorreo").value;
            const ClaveUsuario = document.getElementById("registrarContraseña").value;
            const Rol = "Paciente";

            fetch('https://localhost:7060/api/Usuario/Registro', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    Nombre: NombreUsuario, 
                    Apellido: ApellidoUsuario, 
                    Email: CorreoUsuario, 
                    Contraseña: ClaveUsuario, 
                    Rol: Rol  
                })
            })
            .then(response => {
                if (!response.ok) {
                   
                    return response.text().then(errorData => {
                        throw new Error(errorData || "Error desconocido");
                    });
                }
                return response.json();
            })
            .then(datos => {
                alert("Usuario registrado correctamente!");
                window.location.href = "login.html";
            })
            .catch(error => {
                console.error("Error al registrar usuario:", error);
                alert("El registro falló. " + error.message);
            });
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const CorreoUsuario = document.getElementById("loginCorreo").value;
            const ClaveUsuario = document.getElementById("loginContraseña").value;

            fetch("https://localhost:7060/api/Usuario/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    Email: CorreoUsuario, 
                    Contraseña: ClaveUsuario 
                })
            })
            .then(response => {
                if (!response.ok) {
                    
                    return response.text().then(errorData => {
                        throw new Error(errorData || "Error desconocido");
                    });
                }
                return response.json();
            })
            .then(datos => {
                console.log("Data: ", datos);
                if (!datos.rol) {
                    throw new Error("Rol no definido en los datos de usuario");
                }
                const userRole = datos.rol.toLowerCase();
                switch (userRole) {
                    case "administrador":
                        window.location.href = `admin.html?username=${encodeURIComponent(datos.nombre)}&usuarioID=${datos.usuarioId}`;
                        break;
                    case "doctor":
                        window.location.href = `doctor.html?username=${encodeURIComponent(datos.nombre)}&usuarioID=${datos.usuarioId}`;
                        break;

                    case "paciente":
                        window.location.href = `paciente.html?username=${encodeURIComponent(datos.nombre)}&usuarioID=${datos.usuarioId}`;
                        break;
                    default:
                        alert("Usuario o contraseña incorrecta");
                        break;
                }
            })
            .catch(error => {
                console.error("Error al iniciar sesión:", error);
                alert("Inicio de sesión fallido. " + error.message);
            });
        });
    }
});
