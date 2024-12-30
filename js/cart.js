// Desestrucion
const { 
    carritoVacio, 
    carritoProductos, 
    carritoAcciones, 
    carritoComprado, 
    carritoAccionesVaciar, 
    total, 
    carritoAccionesComprar 
  } = {
    carritoVacio: document.querySelector("#carritoVacio"),
    carritoProductos: document.querySelector("#carritoProductos"),
    carritoAcciones: document.querySelector("#carritoAcciones"),
    carritoComprado: document.querySelector("#carritoComprado"),
    carritoAccionesVaciar: document.querySelector("#carritoAccionesVaciar"),
    total: document.querySelector("#total"),
    carritoAccionesComprar: document.querySelector("#carritoAccionesComprar")
  };
  
  
  class CartManager {
    constructor() {
      this.productosEnCarrito = [];
    }
  
    cargarProductosCarrito() {
      this.productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
  
      if (this.productosEnCarrito.length > 0) {
        this.mostrarProductosEnCarrito();
      } else {
        this.mostrarCarritoVacio();
      }
    }
  
    mostrarProductosEnCarrito() {
      carritoVacio.classList.add("disabled");
      carritoProductos.classList.remove("disabled");
      carritoAcciones.classList.remove("disabled");
      carritoComprado.classList.add("disabled");
  
      carritoProductos.innerHTML = "";
  
      this.productosEnCarrito.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("carritoProducto");
        div.innerHTML = `
          <img class="carritoProductoImagen" src="${producto.img}" alt="${producto.nombre}">
          <div class="tituloProducto">
            <small>Título</small>
            <h3>${producto.nombre}</h3>
          </div>
          <div class="cantidadProducto">
            <small>Cantidad</small>
            <p>${producto.cantidad}</p>
          </div>
          <div class="precioProducto">
            <small>Precio</small>
            <p>$${producto.precio}</p>
          </div>
          <div class="subtotalProducto">
            <small>Subtotal</small>
            <p>$${producto.precio * producto.cantidad}</p>
          </div>
          <button class="trashRed" id="${producto.id}"><i class="bi bi-trash"></i></button>
        `;
  
        carritoProductos.append(div);
      });
  
      this.actualizarBotonesEliminar();
      this.actualizarTotal();
    }
  
    mostrarCarritoVacio() {
      carritoVacio.classList.remove("disabled");
      carritoProductos.classList.add("disabled");
      carritoAcciones.classList.add("disabled");
      carritoComprado.classList.add("disabled");
    }
  
    actualizarBotonesEliminar() {
      const botonesEliminar = document.querySelectorAll(".trashRed");
      botonesEliminar.forEach(boton => {
        boton.addEventListener("click", this.eliminarDelCarrito.bind(this));
      });
    }
  
    eliminarDelCarrito(e) {
      const idBoton = e.currentTarget.id;
      const index = this.productosEnCarrito.findIndex(producto => producto.id === parseInt(idBoton));
      
      this.productosEnCarrito.splice(index, 1);
      this.cargarProductosCarrito();
      this.guardarCarritoEnLocalStorage();
    }
  
    vaciarCarrito() {
      this.productosEnCarrito = [];
      this.guardarCarritoEnLocalStorage();
      this.cargarProductosCarrito();
    }
  
    actualizarTotal() {
      const totalCalculado = this.productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
      total.innerText = `$${totalCalculado}`;
    }
  
    comprarCarrito() {
      this.productosEnCarrito = [];
      this.guardarCarritoEnLocalStorage();
      
      carritoVacio.classList.add("disabled");
      carritoProductos.classList.add("disabled");
      carritoAcciones.classList.add("disabled");
      carritoComprado.classList.remove("disabled");
    }
  
    guardarCarritoEnLocalStorage() {
      localStorage.setItem("productos-en-carrito", JSON.stringify(this.productosEnCarrito));
    }
  }
  
  // Inicializar
  const cartManager = new CartManager();
  
  // Eventos
  document.addEventListener("DOMContentLoaded", () => cartManager.cargarProductosCarrito());
  carritoAccionesVaciar.addEventListener("click", () => cartManager.vaciarCarrito());
  carritoAccionesComprar.addEventListener("click", () => cartManager.comprarCarrito());
  


