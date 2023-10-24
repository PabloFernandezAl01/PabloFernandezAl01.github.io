// Se crea el canvas
const CWCanvas = document.getElementById("colorwave");
const CWContext = CWCanvas.getContext("2d");

const CWContainer = document.getElementById("projects-container");

function resizeCanvas() {
    CWCanvas.width = document.body.scrollWidth;
    CWCanvas.height = CWContainer.clientHeight;
}

// Se llama al principio para ajustar el tamaño inicial
resizeCanvas();

// Evento de reescalado de la ventana del navegador
window.addEventListener('resize', resizeCanvas);


const COLORS = ['4b1139', '3b4058', '2a6e78', '7a907c', 'c9b180']

class ColorWave {

    constructor() {
        
        this.rows = 180;
        this.rowHeight = CWCanvas.height / this.rows;

        this.columns = 360;
        this.columnWidth = CWCanvas.width / this.columns;

        this.hue = 0;
        this.offset = 0;
        this.direction = 1;
        this.timer = 0;
        this.speed = 50;

        this.sourceColors = [];
        this.destinationColors = [];

        for (let color of COLORS)
            this.sourceColors.push(hexToHSV(color));

        for (let i = 0; i < COLORS.length - 1; i++)
            this.destinationColors = this.destinationColors.concat(interpolateHSV(this.sourceColors[i], this.sourceColors[i + 1], this.rows / (COLORS.length - 1)))

        // for (let i = 0; i < COLORS.length - 1; i++)
        // this.destinationColors = this.destinationColors.concat(interpolateHSV(this.sourceColors[i], this.sourceColors[i + 1], this.rows / COLORS.length))

        // this.destinationColors = this.destinationColors.concat(interpolateHSV(this.sourceColors[COLORS.length - 1], this.sourceColors[0], this.rows / COLORS.length))

    }

    render () {

      // Vertical
      for (let i = 0; i < this.rows; i++) {

          let paint = (i + this.offset) % this.rows;

          let hsvColor = this.destinationColors[paint];

          let rgb = hsvToRgb(hsvColor.h, hsvColor.s, hsvColor.v);

          CWContext.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
          CWContext.fillRect(0, this.rowHeight * i, CWCanvas.width, this.rowHeight);

      }

  }

    renderRGBCicle() {

        // Vertical
        for (let i = 0; i < this.rows; i++) {

            this.hue = 360 / this.rows * i + 360 / this.rows * this.offset;

            let rgb = hsvToRgb(this.hue, 0.8, 0.6);

            CWContext.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            CWContext.fillRect(0, this.rowHeight * i, CWCanvas.width, this.rowHeight);

        }

        // Horizontal
        // for (let i = 0; i < this.columns; i++) {

        //   this.hue = 360 / this.columns * i + 360 / this.columns * this.offset;

        //   let rgb = hsvToRgb(this.hue, 1, 0.7);

        //   CWContext.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        //   CWContext.fillRect(this.columnWidth * i, 0, this.columnWidth, CWCanvas.height);

        // }

    }

    update (deltaTime) {

        this.rowHeight = CWCanvas.height / this.rows;
        this.columnWidth = CWCanvas.width / this.columns;

        this.offset += Math.round(this.direction * this.speed * deltaTime);

        if (this.offset >= this.rows)
                this.offset = 0;
        
    }

}


function interpolateHSV(hsvColorA, hsvColorB, steps) {

    const colors = [];

    const { h: h1, s: s1, v: v1 } = hsvColorA;
    const { h: h2, s: s2, v: v2 } = hsvColorB;

    // Calculate the step size for each component
    const hStep = (h2 - h1) / (steps + 1);
    const sStep = (s2 - s1) / (steps + 1);
    const vStep = (v2 - v1) / (steps + 1);

    // Interpolate colors
    for (let i = 1; i <= steps; i++) {
        const h = h1 + hStep * i;
        const s = s1 + sStep * i;
        const v = v1 + vStep * i;
        
        colors.push({ h, s, v });
    }

    return colors;

}

function hexToHSV(hexColor) {

    // Parse the hexadecimal color into its RGB components
    const r = parseInt(hexColor.slice(0, 2), 16) / 255;
    const g = parseInt(hexColor.slice(2, 4), 16) / 255;
    const b = parseInt(hexColor.slice(4, 6), 16) / 255;

    // Find the minimum and maximum values of the RGB components
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    // Calculate the value (brightness)
    const v = max;

    // Calculate the saturation
    let s = 0;
    if (max !== 0) {
        s = (max - min) / max;
    }

    // Calculate the hue
    let h = 0;
    if (s !== 0) {
        if (max === r) {
          h = (g - b) / (max - min);
        } else if (max === g) {
          h = 2 + (b - r) / (max - min);
        } else {
          h = 4 + (r - g) / (max - min);
        }
    }

    h *= 60;
    if (h < 0) {
        h += 360;
    }

    return {
        h,
        s,
        v
    };

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

