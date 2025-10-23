const socket = io();

function renderProducts(products) {
    const ul = document.getElementById("productsList");
    ul.innerHTML = "";
    products.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
        <strong>${p.title}</strong> (ID: ${p.id}) - $${p.price}
        <button data-id="${p.id}" class="deleteBtn">Eliminar</button>
    `;
    ul.appendChild(li);
    });
    document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        socket.emit("deleteProduct", id, (resp) => {
        if(resp?.status === "error"){
            alert("Error: " + resp.message);
        }
        });
    });
    });
}

socket.on("productsUpdated", (products) => {
    renderProducts(products);
});

const form = document.getElementById("productForm");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const obj = {
    title: fd.get("title"),
    description: fd.get("description"),
    code: fd.get("code"),
    price: Number(fd.get("price")),
    status: fd.get("status") === "true",
    stock: Number(fd.get("stock")),
    category: fd.get("category"),
    thumbnails: fd.get("thumbnails") ? fd.get("thumbnails").split(",").map(s=>s.trim()) : []
    };
    socket.emit("newProduct", obj, (resp) => {
    const resDiv = document.getElementById("formResult");
    if(resp?.status === "ok"){
        resDiv.innerText = "Producto creado";
        form.reset();
    } else {
        resDiv.innerText = "Error: " + (resp?.message || "Desconocido");
    }
    });
});
