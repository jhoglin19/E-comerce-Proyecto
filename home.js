const btnlogin = document.getElementById("btnlogin");
const url_products = "http://127.0.0.1:5000/products";
document.addEventListener("DOMContentLoaded", function(){
    cargar_productos(); //cargar productos
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if(isLoggedIn === "true"){
        btnlogin.textContent = "Cerrar Sesión";
    }else{
        btnlogin.textContent = "Iniciar Sesión";
    }
});
btnlogin.addEventListener("click", function(){
    if(btnlogin.textContent === "Cerrar Sesión"){
        localStorage.removeItem("isLoggedIn");
        localStorage.setItem("isLoggedIn", "false");
        btnlogin.textContent = "Iniciar Sesión";
    }
});
async function cargar_productos() {
    try {
        const respuesta = await fetch(url_products, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (respuesta.ok) {
            const productos = await respuesta.json();
            const ultimosProductos = productos.slice(-5).reverse();
            const productList = document.getElementById("product-list");
            // Limpiar productos previamente listados
            productList.innerHTML = "";
            // Recorrer cada producto y agregarlo al HTML
            ultimosProductos.forEach(producto => {
                // Crear el contenedor de cada producto
                const productItem = document.createElement("div");
                productItem.classList.add("product-item");
                // Crear y añadir la imagen
                const img = document.createElement("img");
                img.src = producto.image;"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.mercadolibre.com.co%2Faudifonos-gamer-auriculares-gaming-rgb-xtrike-me-gh-711-color-negro%2Fp%2FMCO26583073&psig=AOvVaw3nQ9BkKc1Q-Oa80_V0Tylr&ust=1732161181517000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJCYqrGB6okDFQAAAAAdAAAAABAE" // Usar directamente el enlace completo
                img.alt = producto.name;
                productItem.appendChild(img);
                // Crear y añadir el nombre del producto
                const productName = document.createElement("h3");
                productName.textContent = producto.name;
                productItem.appendChild(productName);
                // Crear y añadir el precio
                const price = document.createElement("p");
                price.textContent = `$${producto.price}`;
                productItem.appendChild(price);
                // Crear y añadir el botón de compra
                const button = document.createElement("button");
                button.classList.add("btn-primary");
                button.textContent = "Comprar";
                productItem.appendChild(button);
                // Agregar el producto a la lista
                productList.appendChild(productItem);
            });
        } else {
            console.error("Error al cargar los productos:", respuesta.statusText);
        }
    } catch (error) {
        console.error("Error al realizar la petición:", error);
    }
}