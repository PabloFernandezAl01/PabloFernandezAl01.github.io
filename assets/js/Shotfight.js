class ShotFight {

    constructor(canvasId, containerId) {

        this.refreshColors();

        this.canvasWrapper = new CanvasWrapper(canvasId, containerId);
		this.canvas = this.canvasWrapper.getCanvas();
		this.ctx = this.canvasWrapper.getContext();

        this.x = 0;
        this.y = 0;

        this.score = 0.5;
        this.aWins = 0;
        this.bWins = 0;

        this.timer = 0;

        this.shots = [];
        this.availabeShots = [];
        this.maxShots = 100;

        for (let i = 0; i < this.maxShots; i++) {
            this.shots.push(new Shot(i, this));
            this.availabeShots.push(this.maxShots - 1 - i);
        }

    }

    refreshColors() {
        this.TEAMA_BACKGROUND = document.documentElement.style.getPropertyValue('--color-B');
        this.TEAMB_BACKGROUND = document.documentElement.style.getPropertyValue('--color-A');
        this.TEAMA_SHOT = document.documentElement.style.getPropertyValue('--color-C');
        this.TEAMB_SHOT = document.documentElement.style.getPropertyValue('--color-D');
    }

    availableShot() {

        if (this.availabeShots.length > 0)
            return this.availabeShots.pop();

        return -1;
    }

    createShot(side) {
        let a = this.availableShot();
        
        if (a >= 0)
            this.shots[a].init(side);
    }

    aShotScore() {
        this.score += 0.05;
    }

    bShotScore() {
        this.score -= 0.05;
    }

    render() {

        // Fondo (Campo de cada jugador)
        this.ctx.fillStyle = this.TEAMA_BACKGROUND;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.fillStyle = this.TEAMB_BACKGROUND;
        this.ctx.fillRect(0, 0, this.score * this.canvas.width, this.canvas.height)

        this.shots.forEach(function (value) {
            if (value.enabled) 
                value.render();
        })

    }

    update(deltaTime) {

        this.timer += deltaTime;
        if (this.timer >= 0.5) {
            this.timer = 0;
            
            // 80% de posibilidades de que dispare en el lado izquierdo
            let rnd = Math.random();
            if (rnd < 0.8)
                this.createShot(0);

            // 80% de posibilidades de que dispare en el lado derecho
            rnd = Math.random();
            if (rnd < 0.8)
                this.createShot(1);
        }

        this.shots.forEach(function (value) {
            if (value.enabled) 
                value.update(deltaTime);
        })

        // Victoria azul
        if (this.score >= 1) {
            this.bWins++;
            this.score = 0.5;
        }
        // Victoria roja
        else if (this.score <= 0) {
            this.aWins++;
            this.score = 0.5;
        }

    }

}

// Clase shot para representar a las particulas
class Shot {

    constructor(idx, shotfight) {
        this.enabled = false;
        this.idx = idx;

        this.shotfight = shotfight;
        this.canvas = this.shotfight.canvas;
        this.ctx = this.shotfight.ctx;

        this.side = 0;
        this.position = new Vector2D();
        this.vel = 0;
    }

    init(side) {

        this.enabled = true;
        this.side = side;

        let x = this.canvas.width * this.side;
        // La altura de spawn esta mas centrada
        let y = Math.random() * this.canvas.height * 0.6 + 0.2 * this.canvas.height;

        // Posición aleaotria
        this.position.x = x;
        this.position.y = y;


        // Velocidad aleatoria
        this.vel = Math.random() * 300 + 200;


        let anguloA = this.side ? 170 : -10;
        let anguloB = this.side ? 190 : 10;

        // Grados a radianes
        anguloA = anguloA * (Math.PI / 180);
        anguloB = anguloB * (Math.PI / 180);

        // Angulo de disparo aleatorio
        let angulo = Math.random() * (anguloA - anguloB) + anguloB;

        // Direccion del disparo
        this.dir = new Vector2D(Math.cos(angulo), Math.sin(angulo))


        // Color dependiendo del lado
        this.color = this.TEAMA_SHOT

        if (!this.side)
            this.color = this.TEAMB_SHOT


        // Tamaño
        this.size = 10;
        this.radius = this.size / 2;
        
    }

    render() {

        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2, true);
        this.ctx.fill();

    }

    update(deltaTime) {

        this.position.add(this.dir.mul(this.vel * deltaTime));
        this.disableOnBecameInvisible();
        this.disableOnCollision();

    }

    disableOnBecameInvisible() {

        if (this.position.x - this.radius > this.canvas.width || this.position.x + this.radius < 0 || 
                this.position.y - this.radius > this.canvas.height || this.position.y + this.radius < 0) 
        {
            this.enabled = false;
            this.shotfight.availabeShots.push(this.idx);

            if (this.position.x - this.radius > this.canvas.width) this.shotfight.aShotScore();
            else if (this.position.x + this.radius < 0) this.shotfight.bShotScore();

        }

    }

    disableOnCollision() {

        for (let i = 0; i < this.shotfight.maxShots; i++) {

            let shot = this.shotfight.shots[i];

            if (shot.side != this.side) {

                if (Vector2D.distance(this.position, shot.position) < this.size * 2) {
                    this.enabled = false; shot.enabled = false;

                    this.shotfight.availabeShots.push(this.idx);
                    this.shotfight.availabeShots.push(shot.idx);
                }

            }
        }

    }

}




