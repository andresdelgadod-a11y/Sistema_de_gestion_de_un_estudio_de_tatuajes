const CLAVE_STORAGE = 'disenos_tatuajes';

const form = document.getElementById('form-diseno');
const idInput = document.getElementById('id-diseno');
const nombreInput = document.getElementById('nombre');
const estiloInput = document.getElementById('estilo');
const tamanoInput = document.getElementById('tamano');
const precioInput = document.getElementById('precioBase');
const descripcionInput = document.getElementById('descripcion');
const listaDiv = document.getElementById('lista-disenos');
const tituloForm = document.getElementById('titulo-form');
const btnCancelar = document.getElementById('btn-cancelar');

document.addEventListener('DOMContentLoaded', cargarDisenos);

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const id = idInput.value;
    const diseno = {
        id: id || generarId(),
        nombre: nombreInput.value.trim(),
        estilo: estiloInput.value.trim(),
        tamano: tamanoInput.value.trim(),
        precioBase: parseFloat(precioInput.value),
        descripcion: descripcionInput.value.trim()
    };

    let disenos = leerDeLocalStorage(CLAVE_STORAGE);
    if (id) {
        disenos = disenos.map(d => d.id === id ? diseno : d);
    } else {
        disenos.push(diseno);
    }

    guardarEnLocalStorage(CLAVE_STORAGE, disenos);
    reiniciarFormulario();
    cargarDisenos();
});

btnCancelar.addEventListener('click', reiniciarFormulario);

function cargarDisenos() {
    const disenos = leerDeLocalStorage(CLAVE_STORAGE);
    listaDiv.innerHTML = '';
    if (disenos.length === 0) {
        listaDiv.innerHTML = '<p class="sin-datos">No hay diseños registrados.</p>';
        return;
    }
    disenos.forEach(d => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'item';
        tarjeta.innerHTML = `
            <h3>${d.nombre}</h3>
            <p><strong>Estilo:</strong> ${d.estilo}</p>
            <p><strong>Tamaño:</strong> ${d.tamano} cm</p>
            <p><strong>Precio Base:</strong> $${d.precioBase.toLocaleString()}</p>
            <p><strong>Descripción:</strong> ${d.descripcion || 'Sin descripción'}</p>
            <button class="boton boton-editar" onclick="editarDiseno('${d.id}')">✏️ Editar</button>
            <button class="boton boton-eliminar" onclick="eliminarDiseno('${d.id}')">🗑️ Eliminar</button>
        `;
        listaDiv.appendChild(tarjeta);
    });
}

window.editarDiseno = function(id) {
    const disenos = leerDeLocalStorage(CLAVE_STORAGE);
    const diseno = disenos.find(d => d.id === id);
    if (!diseno) return;
    idInput.value = diseno.id;
    nombreInput.value = diseno.nombre;
    estiloInput.value = diseno.estilo;
    tamanoInput.value = diseno.tamano;
    precioInput.value = diseno.precioBase;
    descripcionInput.value = diseno.descripcion || '';
    tituloForm.textContent = 'Editar Diseño';
    btnCancelar.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.eliminarDiseno = function(id) {
    if (!confirm('¿Seguro que deseas eliminar este diseño?')) return;
    let disenos = leerDeLocalStorage(CLAVE_STORAGE);
    disenos = disenos.filter(d => d.id !== id);
    guardarEnLocalStorage(CLAVE_STORAGE, disenos);
    cargarDisenos();
};

function reiniciarFormulario() {
    form.reset();
    idInput.value = '';
    tituloForm.textContent = 'Agregar Nuevo Diseño';
    btnCancelar.style.display = 'none';
}