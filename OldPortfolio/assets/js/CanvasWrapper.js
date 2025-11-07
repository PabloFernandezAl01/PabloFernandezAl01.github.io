class CanvasWrapper {

    constructor(canvasId, containerId) {
        
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.container = document.getElementById(containerId);

        // Se llama al principio para ajustar el tamaño inicial
        this.resize();

        // Evento de reescalado de la ventana del navegador
        window.addEventListener('resize', () => {
            this.resize();
        });

    }

    resize() {

        if (this.container) {
            this.canvas.width = this.container.clientWidth;
            this.canvas.height = this.container.clientHeight;
        }
    }

    getCanvas() {
        return this.canvas;
    }

    getContext() {
        return this.context;
    }

}