// Animations list
const animations = [];

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
function drawShotFight() {
    this.anim = new ShotFight();
    animations.push(this.anim);
    window.requestAnimationFrame(draw);
}

/**
 * Create ColorWave animation
 */
function drawColorWave() {
    this.anim = new ColorWave();
    animations.push(this.anim);
    window.requestAnimationFrame(draw);
}

/**
 * Create AStar animation
 */
function drawAStar() {
    this.anim = new AStar();
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