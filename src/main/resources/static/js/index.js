const apiUrl = '/productos'; // relativo al mismo servidor

// Función para mostrar productos en la tabla
async function cargarProductos() {
    try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Error al cargar productos");
        const productos = await res.json();
        const tbody = document.querySelector("#tablaProductos tbody");
        tbody.innerHTML = "";
        productos.forEach(p => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${p.id}</td>
                <td>${p.codigo}</td>
                <td>${p.nombre}</td>
                <td>${p.descripcion}</td>
                <td>${p.marca}</td>
                <td>${p.categoria}</td>
                <td>${p.precio}</td>
                <td>
                    <button onclick="eliminarProducto(${p.id})">Eliminar</button>
                    <button onclick="editarProducto(${p.id})">Editar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        alert(err.message);
    }
}

// Crear producto
document.getElementById("crear").addEventListener("click", async () => {
    const producto = obtenerProductoForm();
    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        });
        if (!res.ok) {
            const error = await res.text();
            alert(error);
            return;
        }
        cargarProductos();
    } catch (err) {
        alert(err.message);
    }
});

// Editar producto
async function editarProducto(id) {
    const producto = obtenerProductoForm();
    try {
        const res = await fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        });
        if (!res.ok) {
            const error = await res.text();
            alert(error);
            return;
        }
        cargarProductos();
    } catch (err) {
        alert(err.message);
    }
}

// Eliminar producto
async function eliminarProducto(id) {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
        const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        if (!res.ok) {
            const error = await res.text();
            alert(error);
            return;
        }
        cargarProductos();
    } catch (err) {
        alert(err.message);
    }
}

// Obtener datos del formulario
function obtenerProductoForm() {
    return {
        codigo: document.getElementById("codigo").value,
        nombre: document.getElementById("nombre").value,
        descripcion: document.getElementById("descripcion").value,
        marca: document.getElementById("marca").value,
        categoria: document.getElementById("categoria").value,
        precio: parseFloat(document.getElementById("precio").value)
    };
}

// Cargar productos al iniciar
cargarProductos();
