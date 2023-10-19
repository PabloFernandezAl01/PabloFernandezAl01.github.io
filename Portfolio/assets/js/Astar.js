// Se crea el canvas
const ASCanvas = document.getElementById("astar");
const ASContext = ASCanvas.getContext("2d");

const ASContainer = document.getElementById("astar-container");

function resizeCanvas() {
    ASCanvas.width = document.body.scrollWidth;
    ASCanvas.height = ASContainer.clientHeight;
}

// Se llama al principio para ajustar el tamaño inicial
resizeCanvas();

// Evento de reescalado de la ventana del navegador
window.addEventListener('resize', resizeCanvas);



class Node {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.g = 0; // Coste del camino desde el inicio hasta este nodo
      this.h = 0; // Heurística: estimación del coste hasta el destino
      this.f = 0; // F = G + H
      this.parent = null;
    }
}


class AStar {

    constructor() {

        this.cols = 50;
        this.rows = Math.round(this.cols / (ASCanvas.width / ASCanvas.height));

        this.rowHeight = ASCanvas.height / this.rows;
        this.colWidth = ASCanvas.width / this.cols;

        this.timer = 0;

        // Mapa con obstaculos
        this.map = [];
        this.createMap();

        // Atributos para el algoritmo A*
        this.openList = new PriorityQueue();
        this.closedList = new Set();
        this.solution = [];

        // Nodos inicial y final
        this.start = new Node(0, 0);
        this.end = new Node(this.cols - 1, this.rows - 1);
        this.map[0][0] = 0;
        this.map[this.cols - 1][this.rows - 1] = 0;
        this.openList.enqueue(this.start, 0);



        while (!this.openList.isEmpty()) {

            const currentNode = this.openList.dequeue();
            this.closedList.add(currentNode);

            // Comprueba si estamos en el nodo final
            if (currentNode.x === this.end.x && currentNode.y === this.end.y) {

                let current = currentNode;
                while (current) {
                    this.solution.unshift({ x: current.x, y: current.y });
                    current = current.parent;
                }

            }

            const neighbors = this.getNeighbors(currentNode);

            for (const neighbor of neighbors) {

                const tentativeG = currentNode.g + 1;
          
                if (!this.openList.contains(neighbor) || tentativeG < neighbor.g) {
                    neighbor.g = tentativeG;
                    neighbor.h = this.heuristic(neighbor, this.end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = currentNode;
            
                    if (!this.openList.contains(neighbor)) {
                        this.openList.enqueue(neighbor, neighbor.f);
                    }
                }
            }

        }

    }

    createMap() {

        for (let c = 0; c < this.cols; c++) {
            this.map[c] = [];
            for (let r = 0; r < this.rows; r++) {
                // 25% de posibilidad de ser obstaculo
                this.map[c][r] = Math.random() < 0.25;
            }
        }

    }

    render() {

        let color = `rgb(${185}, ${185}, ${185})`;

        // Dibuja el mapa
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {

                color = `rgb(${185}, ${185}, ${185})`;

                if (this.map[i][j])
                    color = `rgb(${74}, ${74}, ${74})`;

                ASContext.fillStyle = color;
                ASContext.fillRect(this.colWidth * i, this.rowHeight * j, this.colWidth, this.rowHeight);

            }
        }

        // this.renderOpenList();
        // this.renderClosedList();
        this.renderSolution();

    }

    renderOpenList() {

        const list = [];
  
        while (!this.openList.isEmpty()) {
            const node = this.openList.dequeue();
            list.push(node);
        }

        // Restaurar la cola de prioridad
        for (const node of list) {
            this.openList.enqueue(node, node.f);
        }

        // Dibuja la lista abierta
        for (const node of list) {
            ASContext.fillStyle = `rgb(${0}, ${0}, ${255})`;
            ASContext.fillRect(this.colWidth * node.x, this.rowHeight * node.y, this.colWidth, this.rowHeight);
        }
    }

    renderClosedList() {

        const list = this.closedList.values();

        // Dibuja la lista cerrada
        for (const l of list) {
            ASContext.fillStyle = `rgb(${255}, ${0}, ${0})`;
            ASContext.fillRect(this.colWidth * l.x, this.rowHeight * l.y, this.colWidth, this.rowHeight);
        }

    }

    renderSolution() {
        // Dibuja la solucion
        for (let i = 0; i < this.solution.length; i++) {

            let node = this.solution[i];

            ASContext.fillStyle = `rgb(${0}, ${255}, ${0})`;
            ASContext.fillRect(this.colWidth * node.x, this.rowHeight * node.y, this.colWidth, this.rowHeight);
        }
    }

    update(deltaTime) {

        this.rowHeight = ASCanvas.height / this.rows;
        this.colWidth = ASCanvas.width / this.cols;

    }

    getNeighbors(node) {

        const neighbors = [];
        const { x, y } = node;
        const moves = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }];
        
        for (const move of moves) {

            const newX = x + move.x;
            const newY = y + move.y;
            if (newX >= 0 && newX < this.cols && newY >= 0 && newY < this.rows && !this.map[newX][newY]) {
                neighbors.push(new Node(newX, newY));
            }
        }

        return neighbors;

    }

    // Distancia de Manhattan
    heuristic(node, end) {
        return Math.abs(node.x - end.x) + Math.abs(node.y - end.y);
    }
      
}