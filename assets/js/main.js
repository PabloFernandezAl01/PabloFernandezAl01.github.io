// Animations list
let animations = [];

/**
 * Initialize the main properties
 */
function init() {
    this.lastFrame = Date.now();
    this.deltaTime = 1 / 60;
}

/**
 * Create ShotFight animation
 */
function drawShotFight(canvasId, containerId) {
    this.anim = new ShotFight(canvasId, containerId);
    animations.push(this.anim);
    window.requestAnimationFrame(draw);
}

/**
 * Create ColorWave animation (para secciones)
 */
function drawColorWave(canvasId, containerId, rows, speed) {
    this.anim = new ColorWave(canvasId, containerId, rows, speed);
    animations.push(this.anim);
    window.requestAnimationFrame(draw);
}

/**
 * Create AStar animation
 */
function drawAStar(canvasId, containerId, cols, obstacleProbability) {
    this.anim = new AStar(canvasId, containerId, cols, obstacleProbability);
    animations.push(this.anim);
    window.requestAnimationFrame(draw);
}

/**
 * Animation loop
 */
function draw() {

    animations.forEach(function (value) {
        value.update(this.deltaTime * 0.001)
        value.render();
    })

    window.requestAnimationFrame(draw);

    let time = Date.now();
    this.deltaTime = time - this.lastFrame;
    this.lastFrame = time;

}


// Mantener resaltado en el navbar el apartado actual
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Elimina la clase activa de todos los enlaces
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        // Agrega la clase activa al enlace actual
        link.classList.add('active');
    });
});
