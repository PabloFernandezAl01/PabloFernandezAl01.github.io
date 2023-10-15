// Se crea el canvas

const canvas = document.getElementById("portfolio")
const context = canvas.getContext("2d")

const canvasContainer = document.getElementById("portfolio-container")

function resizeCanvas() {
    canvas.width = document.body.scrollWidth;
    canvas.height = canvasContainer.clientHeight;
}

// Se llama al principio para ajustar el tamaño inicial
resizeCanvas()

// Evento de reescalado de la ventana del navegador
window.addEventListener('resize', resizeCanvas);


// Clase Cover encargada de la logica del dibujado
class Cover {

    constructor() {

        

    }

    render() {



    }

    update() {



    }

}




