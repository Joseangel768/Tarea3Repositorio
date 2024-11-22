const url = "https://localhost:7060/api/Especialidades/GetEspecialidades";
const urleliminar = "https://localhost:7060/api/Especialidades/EliminarEspecialidad";
const urlCrear = "https://localhost:7060/api/Especialidades/CrearEspecialidad";
const urlEditar = "https://localhost:7060/api/Especialidades/ActualizarEspecialidad/";
const contenedor = document.querySelector('tbody');
let resultados = '';

const ModalEspecialidades = new bootstrap.Modal(document.getElementById('ModalEspecialidades'));
const formEspecialidades = document.querySelector('#formEspecialidades');
const especialidades = document.getElementById('Especialidad');
let opcion = '';

document.getElementById('btnCrear').addEventListener('click', () => {
    especialidades.value = '';
    ModalEspecialidades.show();
    opcion = 'crear';
});

// Función para mostrar resultados
const mostrar = (especialidades) => {
     
    especialidades.forEach(especialidad => {
        resultados += `<tr>
                            <td>${especialidad.especialidadId}</td>
                            <td>${especialidad.nombre}</td>
                            <td class="text-center"><a class="btnEditar btn btn-primary">Editar</a></td>
                            <td class="text-center"><a class="btnBorrar btn btn-danger">Borrar</a></td>
                        </tr>`;
    });
    contenedor.innerHTML = resultados;
    
}

// Procedimiento
fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data); 
        mostrar(data);
    })
    .catch(error => console.log(error));

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e);
        }
    });
}

// Procedimiento borrar
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.parentNode.parentNode;
    const id = fila.firstElementChild.innerHTML;
    console.log(id);
    alertify.confirm("This is a confirm dialog.",
    function(){
        fetch(urleliminar+id, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => location.reload())
        .catch(error => console.log(error)); 
        location.reload();   
    },
    function(){
          alertify.error('Cancel');
    })
    
});

// Procedimiento editar
let idForm = 0;

on(document, 'click', '.btnEditar', e => {
    const fila = e.target.parentNode.parentNode;
    idForm = fila.children[0].innerHTML;

    const Especialidadesform = fila.children[1].innerHTML;
    especialidades.value = Especialidadesform;
    console.log(Especialidadesform)

    opcion = 'editar';
    ModalEspecialidades.show();
});

// Procedimiento para crear y editar
formEspecialidades.addEventListener('submit', (e)=>{
    e.preventDefault()
    if(opcion=='crear'){        
        console.log('OPCION CREAR')
        fetch(urlCrear, {
            method:'POST',
            headers: {
                "Accept": "application/json, text/plain, /",
               "Content-Type": "application/json"
            },
            body: JSON.stringify({
                
                nombre:especialidades.value
                
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevaEspecialidad = []
            nuevaEspecialidad.push(data)
            mostrar(nuevaEspecialidad)
        location.reload();
        })
    }
    if(opcion=='editar'){
        console.log('editar')
        fetch(`https://localhost:7060/api/Especialidades/ActualizarEspecialidad?id=${idForm}`,{
            method: 'PUT',
            headers: {
                "Accept": "application/json, text/plain, /",
               "Content-Type": "application/json"
             },
             body: JSON.stringify({
                 nombre:especialidades.value
             })
        })
        .then(Response => Response.json())
        .then(Response => location.reload())
        .catch(error => console.log(error))
        location.reload();

    }
    ModalEspecialidades.hide()
});

//https://localhost:7060/api/Especialidades/ActualizarEspecialidad?id=${idForm}
