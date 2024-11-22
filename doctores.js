
const urlDoctores = "https://localhost:7060/api/Doctor/ObtenerTodosLosDoctores";
const urlCrearDoctor = "https://localhost:7060/api/Doctor/CrearDoctor";
const urlEditarDoctor = "https://localhost:7060/api/Doctor/Editar/";
const urlEliminarDoctor = "https://localhost:7060/api/Doctor/EliminarDoctor/";
const urlEspecialidades = "https://localhost:7060/api/Especialidades/GetEspecialidades";


const contenedorDoctores = document.querySelector('#Doctores tbody');
const especialidadSelect = document.getElementById('EspecialidadDoctor');

const ModalDoctores = new bootstrap.Modal(document.getElementById('ModalDoctores'));
const formDoctores = document.querySelector('#formDoctores');
const nombreDoctor = document.getElementById('NombreDoctor');
const apellidoDoctor = document.getElementById('ApellidoDoctor');
const correoDoctor = document.getElementById('CorreoDoctor');
const especialidadDoctor = document.getElementById('EspecialidadDoctor');
const btnGuardarDoctor = document.getElementById('guardarDoctor');

let resultadosDoctores = '';
let opcionDoctor = '';



document.getElementById('btnCrearDoctor').addEventListener('click', () => {
    nombreDoctor.value = '';
    apellidoDoctor.value = '';
    correoDoctor.value = '';
    especialidadDoctor.value = '';
    ModalDoctores.show();
    opcionDoctor = 'crear';
});
// Función para mostrar doctores
const mostrarDoctores = (doctores) => {
    resultadosDoctores = '';
    doctores.forEach(doctor => {
        resultadosDoctores += `<tr>
            <td>${doctor.doctorId}</td>
            <td>${doctor.nombre}</td>
            <td>${doctor.apellido}</td>
            <td>${doctor.correo}</td>
            <td>${doctor.especialidad}</td>
            <td class="text-center">
                <a class="btnEditarDoctor btn btn-primary">Editar</a>
                <a class="btnBorrarDoctor btn btn-danger">Borrar</a>
            </td>
        </tr>`;
    });
    contenedorDoctores.innerHTML = resultadosDoctores;
}

// Obtener todos los doctores al cargar la página
fetch(urlDoctores)
    .then(response => response.json())
    .then(data => mostrarDoctores(data))
    .catch(error => console.log(error));

// Procedimiento para manejar eventos delegados
const handleEvent = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e);
        }
    });
}

// Procedimiento para borrar doctor
handleEvent(document, 'click', '.btnBorrarDoctor', e => {
    const fila = e.target.parentNode.parentNode;
    const id = fila.firstElementChild.innerHTML; 
    console.log(id);
    alertify.confirm("This is a confirm dialog.",
    function(){
        fetch(`https://localhost:7060/api/Doctor/Eliminar`+id, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => location.reload())
        .catch(error => console.log(error)); 
        
          
    },
    function(){
          alertify.error('Cancel');
    })
    
});
let idDoctor = 0;

// Procedimiento para editar doctor
handleEvent(document, 'click', '.btnEditarDoctor', e => {
    const fila = e.target.parentNode.parentNode;
    idDoctor = fila.children[0].innerHTML;

    nombreDoctor.value = fila.children[1].innerHTML;
    apellidoDoctor.value = fila.children[2].innerHTML;
    correoDoctor.value = fila.children[3].innerHTML;
    especialidadDoctor.value = fila.children[4].innerHTML;
    console.log(especialidadDoctor)
    opcionDoctor = 'editar';
    ModalDoctores.show();
});

// Llenar el select de especialidades
const llenarEspecialidades = () => {
    fetch(urlEspecialidades)
        .then(response => response.json())
        .then(data => {
            let options = '';
            data.forEach(especialidad => {
                options += `<option value="${especialidad.nombre}">${especialidad.nombre}</option>`;
            });
            especialidadSelect.innerHTML = options;
        })
        .catch(error => console.log('Error fetching specialties:', error));
};

llenarEspecialidades();

// Procedimiento para crear o editar doctor
btnGuardarDoctor.addEventListener('submit', (e) => {
    e.preventDefault();
    

    if (opcionDoctor === 'crear') {
        fetch(urlCrearDoctor, {
            method: 'POST',
            headers: {
                "Accept": "application/json, text/plain, /",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombreDoctor.value,
                apellido: apellidoDoctor.value,
                correo: correoDoctor.value,
                especialidad: especialidadDoctor.value
            })
        })
        .then(response => response.json())
        .then(data => {
            const nuevoDoctor = []
            nuevoDoctor.push(data)
            mostrarDoctores(nuevoDoctor)
        location.reload()
        })
    }
    if (opcionDoctor == 'editar'){
        console.log('editar')
        fetch(`https://localhost:7060/api/Doctor/Editar?doctorId=${idDoctor}`,{
            method: 'PUT',
            headers: {
                "Accept": "application/json, text/plain, /",
               "Content-Type": "application/json"
             },
             body: JSON.stringify({
                nombre: nombreDoctor.value,
                apellido: apellidoDoctor.value,
                correo: correoDoctor.value,
                especialidad: especialidadDoctor.value
             })
        })
        .then(Response => Response.json())
        //.then(Response => location.reload())
        .catch(error => console.log(error))
        
    }
    ModalDoctores.hide()
});
