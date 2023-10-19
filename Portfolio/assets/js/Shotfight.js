// Se crea el canvas
const SFCanvas = document.getElementById("shotfight");
const SFContext = SFCanvas.getContext("2d");

const SFContainer = document.getElementById("shotfight-container");

function resizeCanvas() {
    SFCanvas.width = document.body.scrollWidth;
    SFCanvas.height = SFContainer.clientHeight;
}

// Se llama al principio para ajustar el tamaño inicial
resizeCanvas();

// Evento de reescalado de la ventana del navegador
window.addEventListener('resize', resizeCanvas);


// Clase Shotfight encargada de la logica del dibujado
class ShotFight {

    constructor() {

        this.x = 0;
        this.y = 0;

        this.score = 0.5;
        this.redwins = 0;
        this.bluewins = 0;

        this.timer = 0;

        this.shots = [];
        this.availabeShots = [];
        this.maxShots = 100;

        for (let i = 0; i < this.maxShots; i++) {
            this.shots.push(new Shot(i, this));
            this.availabeShots.push(this.maxShots - 1 - i);
        }


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

    blueShotScore() {
        this.score += 0.05;
    }

    redShotScore() {
        this.score -= 0.05;
    }

    render() {

        // Fondo (Campo de cada jugador)
        SFContext.fillStyle = `rgb(217, 97, 83, 255)`;
        SFContext.fillRect(0, 0, SFCanvas.width, SFCanvas.height)

        SFContext.fillStyle = `rgb(132, 191, 195, 255)`;
        SFContext.fillRect(0, 0, this.score * SFCanvas.width, SFCanvas.height)

        this.shots.forEach(function (value) {
            if (value.enabled) 
                value.render();
        })

    }

    update(deltaTime) {

        this.timer += deltaTime;
        if (this.timer >= 0.2) {
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
                value.update();
        })

        // Victoria azul
        if (this.score >= 1) {
            this.bluewins++;
            this.score = 0.5;
        }
        // Victoria roja
        else if (this.score <= 0) {
            this.redwins++;
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
        this.side = 0;
        this.position = new Vector2D();
    }

    init(side) {

        this.enabled = true;
        this.side = side;

        let x = SFCanvas.width * this.side;
        // La altura de spawn esta mas centrada
        let y = Math.random() * SFCanvas.height * 0.6 + 0.2 * SFCanvas.height;

        // Posición aleaotria
        this.position.x = x;
        this.position.y = y;


        // Velocidad aleatoria
        let vel = Math.random() * 5 + 3;


        let anguloA = this.side ? 170 : -10;
        let anguloB = this.side ? 190 : 10;

        // Grados a radianes
        anguloA = anguloA * (Math.PI / 180);
        anguloB = anguloB * (Math.PI / 180);

        // Angulo de disparo aleatorio
        let angulo = Math.random() * (anguloA - anguloB) + anguloB;

        // Direccion del disparo
        this.dir = new Vector2D(Math.cos(angulo) * vel, Math.sin(angulo) * vel)


        // Color dependiendo del lado
        this.color = `rgb(229, 132, 113, 255)`

        if (!this.side)
            this.color = `rgb(185, 235, 241, 255)`


        // Tamaño
        this.size = 10;
        this.radius = this.size / 2;
        
    }

    render() {

        SFContext.beginPath();
        SFContext.fillStyle = this.color;
        SFContext.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2, true);
        SFContext.fill();

    }

    update() {

        this.position.add(this.dir);
        this.disableOnBecameInvisible();
        this.disableOnCollision();

    }

    disableOnBecameInvisible() {

        if (this.position.x - this.radius > SFCanvas.width || this.position.x + this.radius < 0 || 
                this.position.y - this.radius > SFCanvas.height || this.position.y + this.radius < 0) 
        {
            this.enabled = false;
            this.shotfight.availabeShots.push(this.idx);

            if (this.position.x - this.radius > SFCanvas.width) this.shotfight.blueShotScore();
            else if (this.position.x + this.radius < 0) this.shotfight.redShotScore();

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




