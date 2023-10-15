/**
 * Initialize the main properties
 */
function init() {
    const frameRate = 60;
    this.frameInterval = 1000 / frameRate;
    this.lastFrame = 0;
}

/**
 * Create dots animation
 */
function drawCover() {
    this.anim = new Cover();
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

        this.anim.update();
        this.anim.render();
    }

    window.requestAnimationFrame(draw);
}