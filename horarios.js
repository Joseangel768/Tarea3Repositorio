document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const usuarioID = params.get('usuarioID');

    console.log('ID de usuario obtenido:', usuarioID);

    if (! usuarioID) {
        console.error("No se encontró el ID del doctor en la URL");
        return;
    }

    const ModalHorarios = new bootstrap.Modal(document.getElementById('ModalHorarios'));
    const formHorarios = document.querySelector('#formHorarios');
    const nombreDoctor = document.getElementById('NombreDoctor');
    const apellidoDoctor = document.getElementById('ApellidoDoctor');
    const correoDoctor = document.getElementById('CorreoDoctor');
    const especialidadDoctor = document.getElementById('EspecialidadDoctor');
    const btnGuardarDoctor = document.getElementById('guardarDoctor');

    const urlBaseHorarios = `https://localhost:7060/api/Horario/Horarios?id=${usuarioID}`;
    const contenedorHorarios = document.querySelector('#horarios tbody');
    let resultadosHorarios = '';

    let opcionHorarioDoctor ='';

    // Función para mostrar resultados
    const mostrarHorarios = (horarios) => {
        resultadosHorarios = ''; 
        if (horarios.length === 0) {
            resultadosHorarios = '<tr><td colspan="7" class="text-center">No hay horarios disponibles</td></tr>';
        } else {
            horarios.forEach(horario => {
                resultadosHorarios += `<tr>
                                    <td>${horario.horarioId}</td>
                                    <td>${horario.diaSemana}</td>
                                    <td>${horario.horaInicio}</td>
                                    <td>${horario.horaFin}</td>
                                    <td>${horario.maxPacientesPorDia}</td>
                                    <td class="text-center"><a class="btnEditarHorario btn btn-primary">Editar</a></td>
                                    <td class="text-center"><a class="btnBorrarHorario btn btn-danger">Borrar</a></td>
                                </tr>`;
            });
        }
        contenedorHorarios.innerHTML = resultadosHorarios;
    }

    // Función para obtener los horarios por doctorId
    const obtenerHorariosPorDoctor = () => {
        fetch(`https://localhost:7060/api/Horario/Horarios?doctorId=${usuarioID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta de la API: " + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log("Datos recibidos:", data); 
                mostrarHorarios(data);
            })
            .catch(error => console.error("Error:", error));
    }

    // Llamada inicial para cargar los horarios del doctor específico
    obtenerHorariosPorDoctor(usuarioID);

    const on = (element, event, selector, handler) => {
        element.addEventListener(event, e => {
            if (e.target.closest(selector)) {
                handler(e);
            }
        });
    }

    // Procedimiento borrar
    on(document, 'click', '.btnBorrarHorario', e => {
        const fila = e.target.parentNode.parentNode;
        const id = fila.firstElementChild.innerHTML; 
        console.log(id);
        alertify.confirm("¿Estás seguro de que deseas eliminar este horario?",
        function(){
            fetch(`https://localhost:7060/api/Horario/EliminarHorario?horarioId=${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(() => location.reload())
            .catch(error => console.log(error)); 
            location.reload();
        },
        function(){
            alertify.error('Cancelado');
        })
    });

    // Procedimiento editar
    let idFormHorario = 0;

    on(document, 'click', '.btnEditarHorario', e => {
        const fila = e.target.parentNode.parentNode;
        idFormHorario = fila.children[0].innerHTML;
        const dia = fila.children[1].innerHTML;
        const horaInicioHorario = fila.children[2].innerHTML;
        const horaFinHorario = fila.children[3].innerHTML;
        const pacientes = fila.children[4].innerHTML;

        diaHorario.value = dia;
        horaInicio.value = horaInicioHorario;
        horaFin.value = horaFinHorario;
        pacientesPorJornada.value = pacientes;

        opcionHorarioDoctor = 'editar';
        ModalHorarios.show();
    });

    // Procedimiento para crear y editar
    formHorarios.addEventListener('submit', (e) => {
        e.preventDefault();
       
        if (opcionHorarioDoctor == 'crear') {        
            console.log('OPCION CREAR');
            fetch(`https://localhost:7060/api/Horario/AgregarHorario?doctorId=${usuarioID}`, {
                method: 'POST',
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    doctorId: doctorId,
                    diaSemana: diaHorario.value,
                    horaInicio: horaInicio.value,
                    horaFin: horaFin.value,
                    maxPacientesPorDia: pacientesPorJornada.value
                })
            })
            .then(response => response.json())
            .then(data => {
                const nuevoHorario = [data];
                mostrarHorarios(nuevoHorario);
            })
            .catch(error => console.log(error));
        } else if (opcionHorarioDoctor === 'editar') {
            console.log('editar');
            fetch(`https://localhost:7060/api/Horario/EditarHorario?horarioId=${idFormHorario}`, {
                method: 'PUT',
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    doctorId: doctorId,
                    diaSemana: diaHorario.value,
                    horaInicio: horaInicio.value,
                    horaFin: horaFin.value,
                    maxPacientesPorDia: pacientesPorJornada.value
                })
            })
            .then(response => response.json())
            .then(response => location.reload())
            .catch(error => console.log(error));
        }
        ModalHorarios.hide();
    });
});
