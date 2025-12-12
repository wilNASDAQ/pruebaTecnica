
function formatearNumero(numero) {
    return numero.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

async function cargarEstadisticas() {
    try {
        const res = await fetch('/productos'); // tu endpoint
        const productos = await res.json();

        if (!productos.length) {
            console.log("NO HAY PRODUCTOS");
            return;
        }

        // Cantidad total de productos
        const totalProductos = productos.length;

        const sumaPrecios = productos.reduce((acc, p) => acc + p.precio, 0);
        const precioPromedio = sumaPrecios / totalProductos;

        const productoMasCaro = productos.reduce((prev, curr) => (curr.precio > prev.precio ? curr : prev));
        const productoMasBarato = productos.reduce((prev, curr) => (curr.precio < prev.precio ? curr : prev));

        const categorias = {};
        productos.forEach(p => {
            const cat = p.categoria?.nombre || "Sin categoría";
            if (!categorias[cat]) categorias[cat] = { cantidad: 0, sumaPrecios: 0 };
            categorias[cat].cantidad += 1;
            categorias[cat].sumaPrecios += p.precio;
        });

        let categoriaMasProductos = { nombre: "", cantidad: 0 };
        for (const [nombre, datos] of Object.entries(categorias)) {
            if (datos.cantidad > categoriaMasProductos.cantidad) {
                categoriaMasProductos = { nombre, cantidad: datos.cantidad };
            }
        }

        for (const [nombre, datos] of Object.entries(categorias)) {
            datos.precioPromedio = datos.sumaPrecios / datos.cantidad;
        }

        const sumaTotalInventario = sumaPrecios;

        document.getElementById("totalProductos").textContent = totalProductos;
        document.getElementById("precioPromedio").textContent = `$${formatearNumero(precioPromedio)}`;
        document.getElementById("productoMasCaro").textContent = `$${formatearNumero(productoMasCaro.precio)}`;
        document.getElementById("productoMasBarato").textContent = `$${formatearNumero(productoMasBarato.precio)}`;
        document.getElementById("sumaTotalInventario").textContent = `$${formatearNumero(sumaTotalInventario)}`;

        const contenedorCategorias = document.getElementById("categorias");
        contenedorCategorias.innerHTML = "";

        for (const [nombre, datos] of Object.entries(categorias)) {
            const porcentaje = (datos.cantidad / totalProductos) * 100;

            const li = document.createElement("li");
            li.className = "categoria-item";
            li.innerHTML = `
                <div class="categoria-header">
                    <span class="categoria-name">${nombre}</span>
                    <span class="categoria-count">${datos.cantidad} producto${datos.cantidad !== 1 ? 's' : ''}</span>
                </div>
                <div class="categoria-bar-container">
                    <div class="categoria-bar-fill" style="width: ${porcentaje}%">
                        ${porcentaje.toFixed(0)}%
                    </div>
                </div>
                <div class="categoria-promedio">
                    Precio promedio: $${formatearNumero(datos.precioPromedio)}
                </div>
            `;
            contenedorCategorias.appendChild(li);
        }

        document.getElementById("categoriaMasProductos").textContent =
            `🏆 La categoría con más productos es: ${categoriaMasProductos.nombre} (${categoriaMasProductos.cantidad} productos)`;

    } catch (error) {
        console.error("ERROR:", error);
    }
}

window.addEventListener("DOMContentLoaded", cargarEstadisticas);