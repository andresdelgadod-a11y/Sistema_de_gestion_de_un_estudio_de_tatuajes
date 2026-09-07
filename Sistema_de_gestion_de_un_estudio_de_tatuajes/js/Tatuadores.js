const CLAVE_STORAGE_TATUADORES = 'tatuadores_estudio';

const formTatuador = document.getElementById('form-tatuador');
const idTatuadorInput = document.getElementById('id-tatuador');
const nombreTatuadorInput = document.getElementById('nombre');
const especialidadInput = document.getElementById('especialidad');
const experienciaInput = document.getElementById('experienciaAnios');
const horarioInput = document.getElementById('horarioDisponible');
const listaTatuadoresDiv = document.getElementById('lista-tatuadores');
const tituloFormTatuador = document.getElementById('titulo-form-tatuador');
const btnCancelarTatuador = document.getElementById('btn-cancelar-tatuador');

document.addEventListener('DOMContentLoaded', cargarTatuadores);

formTatuador.addEventListener('submit', function(e) {
    e.preventDefault();
    const id = idTatuadorInput.value;
    const tatuador = {
        id: id || generarId(),
        nombre: nombreTatuadorInput.value.trim(),
        especialidad: especialidadInput.value.trim(),
        experienciaAnios: parseInt(experienciaInput.value),
        horarioDisponible: horarioInput.value.trim()
    };

    let tatuadores = leerDeLocalStorage(CLAVE_STORAGE_TATUADORES);
    if (id) {
        tatuadores = tatuadores.map(t => t.id === id ? tatuador : t);
    } else {
        tatuadores.push(tatuador);
    }

    guardarEnLocalStorage(CLAVE_STORAGE_TATUADORES, tatuadores);
    reiniciarFormularioTatuador();
    cargarTatuadores();
});

btnCancelarTatuador.addEventListener('click', reiniciarFormularioTatuador);

function cargarTatuadores() {
    const tatuadores = leerDeLocalStorage(CLAVE_STORAGE_TATUADORES);
    listaTatuadoresDiv.innerHTML = '';
    if (tatuadores.length === 0) {
        listaTatuadoresDiv.innerHTML = '<p class="sin-datos">No hay tatuadores registrados.</p>';
        return;
    }
    tatuadores.forEach(t => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'item';
        tarjeta.innerHTML = `
            <h3>${t.nombre}</h3>
            <p><strong>Especialidad:</strong> ${t.especialidad}</p>
            <p><strong>Experiencia:</strong> ${t.experienciaAnios} años</p>
            <p><strong>Horario:</strong> ${t.horarioDisponible}</p>
            <button class="boton boton-editar" onclick="editarTatuador('${t.id}')">✏️ Editar</button>
            <button class="boton boton-eliminar" onclick="eliminarTatuador('${t.id}')">🗑️ Eliminar</button>
        `;
        listaTatuadoresDiv.appendChild(tarjeta);
    });
}

window.editarTatuador = function(id) {
    const tatuadores = leerDeLocalStorage(CLAVE_STORAGE_TATUADORES);
    const tatuador = tatuadores.find(t => t.id === id);
    if (!tatuador) return;
    idTatuadorInput.value = tatuador.id;
    nombreTatuadorInput.value = tatuador.nombre;
    especialidadInput.value = tatuador.especialidad;
    experienciaInput.value = tatuador.experienciaAnios;
    horarioInput.value = tatuador.horarioDisponible;
    tituloFormTatuador.textContent = 'Editar Tatuador';
    btnCancelarTatuador.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.eliminarTatuador = function(id) {
    if (!confirm('¿Seguro que deseas eliminar este tatuador?')) return;
    let tatuadores = leerDeLocalStorage(CLAVE_STORAGE_TATUADORES);
    tatuadores = tatuadores.filter(t => t.id !== id);
    guardarEnLocalStorage(CLAVE_STORAGE_TATUADORES, tatuadores);
    cargarTatuadores();
};

function reiniciarFormularioTatuador() {
    formTatuador.reset();
    idTatuadorInput.value = '';
    tituloFormTatuador.textContent = 'Agregar Nuevo Tatuador';
    btnCancelarTatuador.style.display = 'none';
}