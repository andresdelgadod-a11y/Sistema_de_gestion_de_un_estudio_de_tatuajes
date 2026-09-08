function guardarEnLocalStorage(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}

function leerDeLocalStorage(clave) {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : [];
}

function generarId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}