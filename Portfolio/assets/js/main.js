// Animations list
// new ShotFight(), new ColorWave()

const animations = [];

/**
 * Initialize the main properties
 */
function init() {
    const frameRate = 60;
    this.frameInterval = 1000 / frameRate;
    this.lastFrame = 0;
    this.deltaTime = this.frameInterval * 0.001;
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

    let time = Date.now();

    let dif = time - this.lastFrame;

    if (dif > this.frameInterval) {
        this.lastFrame = time;

        animations.forEach(function (value) {
            value.update(this.deltaTime)
            value.render();
        })

    }

    window.requestAnimationFrame(draw);

}