// Se crea el canvas
const CWCanvas = document.getElementById("colorwave");
const CWContext = CWCanvas.getContext("2d");

const CWContainer = document.getElementById("colorwave-container");

function resizeCanvas() {
    CWCanvas.width = document.body.scrollWidth;
    CWCanvas.height = CWContainer.clientHeight;
}

// Se llama al principio para ajustar el tamaño inicial
resizeCanvas();

// Evento de reescalado de la ventana del navegador
window.addEventListener('resize', resizeCanvas);



class ColorWave {

    constructor() {
        
        this.rows = 360;
        this.rowHeight = CWCanvas.height / this.rows;

        this.columns = 1080;
        this.columnWidth = CWCanvas.width / this.columns;

        this.hue = 0;
        this.offset = 0;
        this.direction = 1;
        this.timer = 0;
        this.speed = 2;

    }

    render () {

        // Vertical
        // for (let i = 0; i < this.rows; i++) {

        //     this.hue = 360 / this.rows * i + 360 / this.rows * this.offset;

        //     let rgb = hsvToRgb(this.hue, 0.8, 0.6);

        //     CWContext.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        //     CWContext.fillRect(0, this.rowHeight * i, CWCanvas.width, this.rowHeight);

        // }

        // Horizontal
        for (let i = 0; i < this.columns; i++) {

          this.hue = 360 / this.columns * i + 360 / this.columns * this.offset;

          let rgb = hsvToRgb(this.hue, 1, 0.7);

          CWContext.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
          CWContext.fillRect(this.columnWidth * i, 0, this.columnWidth, CWCanvas.height);

        }

    }

    update (deltaTime) {

        this.timer += deltaTime;
        if (this.timer > 0.01) {
            this.timer = 0;
            this.offset += this.direction * this.speed;

            if (this.offset >= this.columns)
                this.offset = 0;

        }

    }

}

function hsvToRgb(h, s, v) {

    let r, g, b;
    h = (h % 360 + 360) % 360; // Asegurarse de que h esté en el rango [0, 360)
    s = Math.max(0, Math.min(1, s));
    v = Math.max(0, Math.min(1, v));
  
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
  
    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } 
    else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } 
    else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } 
    else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } 
    else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } 
    else {
      r = c;
      g = 0;
      b = x;
    }
  
    r = (r + m) * 255;
    g = (g + m) * 255;
    b = (b + m) * 255;
  
    return { r, g, b };
}

