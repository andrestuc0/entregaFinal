// Fetch productos del archivo json
async function fetchProducts() {
  try {
    const response = await fetch('/products.json');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}


const DOMElements = {
  contenedorProductos: document.querySelector("#contenedorProductos"),
  botonesCategorias: document.querySelectorAll(".botonCategoria"),
  tituloPrincipal: document.querySelector("#tituloPrincipal"),
  numerito: document.querySelector("#cantidad")
};


class ProductRenderer {
  render(producto) {
    const div = document.createElement("div");
    div.classList.add("productos");
    div.innerHTML = `
      <img class="productoImg" src="${producto.img}" alt="${producto.nombre}">
      <div class="productoDescript">
        <h3 class="productoTitulo">${producto.nombre}</h3>
        <p class="productoPrecio">$${producto.precio}</p>
        <button class="productoAgregar" id="${producto.id}">Agregar</button>
      </div>
    `;
    return div;
  }
}


class ProductManager {
  constructor(renderer) {
    this.renderer = renderer;
  }

  cargarProductos(productos) {
    DOMElements.contenedorProductos.innerHTML = "";
    productos.forEach(producto => {
      const productoElement = this.renderer.render(producto);
      DOMElements.contenedorProductos.append(productoElement);
    });
    this.actualizarBotonesAgregar();
  }

  actualizarBotonesAgregar() {
    const botonesAgregar = document.querySelectorAll(".productoAgregar");
    botonesAgregar.forEach(boton => {
      boton.addEventListener("click", this.agregarAlCarrito.bind(this));
    });
  }

  agregarAlCarrito(e) {
    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === parseInt(idBoton));

    if (productosEnCarrito.some(producto => producto.id === parseInt(idBoton))) {
      const index = productosEnCarrito.findIndex(producto => producto.id === parseInt(idBoton));
      productosEnCarrito[index].cantidad++;
      Swal.fire({
        title: 'Producto agregado',
        text: `Se agregó otra unidad de ${productoAgregado.nombre} al carrito`,
        icon: 'success',
        confirmButtonText: 'Ok'
      });
    } else {
      productoAgregado.cantidad = 1;
      productosEnCarrito.push(productoAgregado);
      Swal.fire({
        title: 'Producto agregado',
        text: `Se agregó ${productoAgregado.nombre} al carrito`,
        icon: 'success',
        confirmButtonText: 'Ok'
      });
    }

    this.actualizarNumerito();
    this.guardarCarritoEnLocalStorage();
  }

  actualizarNumerito() {
    const nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    DOMElements.numerito.innerText = nuevoNumerito;
  }

  guardarCarritoEnLocalStorage() {
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
  }

  cargarCarritoDesdeLocalStorage() {
    const productosEnCarritoLS = localStorage.getItem("productos-en-carrito");
    if (productosEnCarritoLS) {
      productosEnCarrito = JSON.parse(productosEnCarritoLS);
      this.actualizarNumerito();
    } else {
      productosEnCarrito = [];
    }
  }
}

// Inicializar
let productos = [];
let productosEnCarrito = [];

const productRenderer = new ProductRenderer();
const productManager = new ProductManager(productRenderer);

// Función Async para inicializar la aplicación
async function initApp() {
  try {
    productos = await fetchProducts();
    productManager.cargarCarritoDesdeLocalStorage();
    productManager.cargarProductos(productos);

    DOMElements.botonesCategorias.forEach(boton => {
      boton.addEventListener("click", (e) => {
        DOMElements.botonesCategorias.forEach(btn => btn.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id !== "todos") {
          const productoCategoria = productos.find(producto => producto.categoria === e.currentTarget.id);
          DOMElements.tituloPrincipal.innerText = productoCategoria.categoria;
          const productosBoton = productos.filter(producto => producto.categoria === e.currentTarget.id);
          productManager.cargarProductos(productosBoton);
        } else {
          DOMElements.tituloPrincipal.innerText = "Todos los productos";
          productManager.cargarProductos(productos);
        }
      });
    });
  } catch (error) {
    console.error('Error initializing app:', error);
    Swal.fire({
      title: 'Error',
      text: 'Hubo un problema al cargar los productos. Por favor, intenta de nuevo más tarde.',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }
}

// Iniciar
initApp();
  
  