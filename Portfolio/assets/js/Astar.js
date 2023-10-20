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
 
    constructor(x, y, obstacle = false) {
        this.id = `${x},${y}`;
        this.x = x;
        this.y = y;

        this.obstacle = obstacle;

        this.f = 0; // Estimated cost of the solution through n.
        this.g = 0; // Actual cost up to node n.
        this.h = 0; // Estimated cost to goal.
    }

    isObstacle() {
        return this.obstacle;
    }

    compare(o) { // PriorityQueue
        if (this.f < o.f) return -1;
        if (this.f > o.f) return 1;
        return this.h < o.h ? -1 : this.h === o.h ? 0 : 1;
    }

}

class Grid {
    
    constructor() {
        this.cols = 200;
        this.rows = Math.round(this.cols / (ASCanvas.width / ASCanvas.height));

        this.rowHeight = ASCanvas.height / this.rows;
        this.colWidth = ASCanvas.width / this.cols;

        this.nodes = [];
        this.clear();

    }
  
    getCols() {
        return this.cols;
    }
  
    getRows() {
        return this.rows;
    }
  
    getNode(x, y) {
        return this.nodes[x + y * this.cols];
    }
  
    clear() {
        for(let x = 0; x < this.cols; ++x) {
            for(let y = 0; y < this.rows; ++y) {
                this.nodes[x + y * this.cols] = new Node(x, y);
                this.nodes[x + y * this.cols].obstacle = Math.random() < 0.25
            }
        }
    }

}

const LATERAL_WEIGHT = 1;
const DIAGONAL_WEIGHT = Math.sqrt(2) * LATERAL_WEIGHT;

const BACKGROUND_COLOR = `rgb(${18}, ${5}, ${12})`;
const OBSTACLE_COLOR = `rgb(${61}, ${21}, ${12})`;
const OPENLIST_COLOR = `rgb(${255}, ${234}, ${31})`;
const CLOSEDLIST_COLOR = `rgb(${125}, ${61}, ${19})`;
const SOLUTION_COLOR = `rgb(${255}, ${255}, ${255})`;
const STARTCELL_COLOR = `rgb(${228}, ${219}, ${219})`;
const ENDCELL_COLOR = `rgb(${228}, ${219}, ${219})`;

class AStar {

    constructor() {

        this.grid = new Grid();

        this.openSet = new PriorityQueue();

        this.solution = null;
        this.closedList = [];

        this.timer = 0;

        this.chooseRandomPoints();

    }

    chooseRandomPoints() {
        do {
            let x1 = Math.round(Math.random() * this.grid.getCols());
            let y1 = Math.round(Math.random() * this.grid.getRows());

            let x2 = Math.round(Math.random() * this.grid.getCols());
            let y2 = Math.round(Math.random() * this.grid.getRows());

            this.start = this.grid.getNode(x1, y1);
            this.end = this.grid.getNode(x2, y2);

            if (!this.start || !this.end) continue;

            this.start.obstacle = false;
            this.end.obstacle = false;

            this.solution = this.route(this.start, this.end, true, 0);
        }
        while (this.solution == null);

        this.solution = null;
        this.openSet.clear();
        this.openSet.add(this.start)
        this.closedSet = []
        this.closedList = []

    }

    route(a, b, complete, deltaTime) {

        if (complete) {
            this.closedSet = [];
            this.openSet.clear();

            a.g = 0;
            a.h = this.heuristic(a, b);
            a.f = a.g + a.h;

            this.openSet.add(a);

            this.x1 = 0; this.x2 = 0;
            this.y1 = 0; this.y2 = 0;
            this.i = 0; this.j = 0;
            this.node = null;
            this.neighbor = null;
        }

        do {

            if (!complete) {
                this.timer += deltaTime;

                if (this.timer < 0.025)
                    break;    
                else 
                    this.timer = 0;
            }

            this.node = this.openSet.poll();

            if (!this.node) {
                this.chooseRandomPoints()
                break;
            }

            if (this.node === b) { // check target       
                return this.backTrace(a, b);
            }
      
            // Neighbor position ranges
            this.x1 = Math.max(0, this.node.x - 1);
            this.x2 = Math.min(this.node.x + 2, this.grid.getCols());
      
            this.y1 = Math.max(0, this.node.y - 1);
            this.y2 = Math.min(this.node.y + 2, this.grid.getRows());

            // Iterate neighbors
            for (this.i = this.x1; this.i < this.x2; ++this.i) {
                for (this.j = this.y1; this.j < this.y2; ++this.j) {

                    if (this.i !== this.node.x || this.j !== this.node.y) { // if not the same

                        this.neighbor = this.grid.getNode(this.i, this.j);
        
                        if (!this.neighbor.isObstacle() && !this.closedSet[this.neighbor.id] && !this.grid.getNode(this.node.x, this.j).isObstacle() 
                                                && !this.grid.getNode(this.i, this.node.y).isObstacle()) { // check if node it is visitable
                            
                                const weight = this.node.x === this.i || this.node.y === this.j ? LATERAL_WEIGHT : DIAGONAL_WEIGHT;
                                const g = this.node.g + weight;                     // Actual cost up to node n.
                                const h = this.heuristic(this.neighbor, b); // Estimated cost to goal.
                                const f = g + h;                               // Estimated cost of the solution through n.
                
                                if (this.neighbor.f > f) { // Update neighbor
                                    this.neighbor.g = g;
                                    this.neighbor.h = h;
                                    this.neighbor.f = f;
                                    this.neighbor.parent = this.node;  
                                    this.openSet.remove(this.neighbor); 
                                    this.openSet.add(this.neighbor);
                                } 
                                else if (!this.openSet.contains(this.neighbor)) { // Add neighbor
                                    this.neighbor.g = g;
                                    this.neighbor.h = h;
                                    this.neighbor.f = f;
                                    this.neighbor.parent = this.node;            
                                    this.openSet.add(this.neighbor);
                                }
                            }
                    
                    }
                
                }
            }

            this.closedSet[this.node.id] = this.node; // Add node to closedSet
            this.closedList.push(this.node)

          } while (this.openSet.size() > 0);
      
          return null;

    }

    update(deltaTime) {

        this.grid.rowHeight = ASCanvas.height / this.grid.rows;
        this.grid.columnWidth = ASCanvas.width / this.grid.columns;

        if (this.solution == null)
            this.solution = this.route(this.start, this.end, false, deltaTime);
        else {

            this.timer += deltaTime;
            if (this.timer > 2) {
                this.chooseRandomPoints();
                this.timer = 0;
            }

        }

    }


    render() {
        this.renderMap();
        this.renderOpenList();
        this.renderClosedList();
        this.renderSolution();
        this.renderStartAndEnd();
    }

    renderMap() {
        // Dibuja el fondo
        let color = BACKGROUND_COLOR;

        ASContext.fillStyle = color;
        ASContext.fillRect(0, 0, ASCanvas.width, ASCanvas.height);

        // Dibuja el mapa
        for (let i = 0; i < this.grid.getCols(); i++) {
            for (let j = 0; j < this.grid.getRows(); j++) {

                color = BACKGROUND_COLOR;

                if (this.grid.getNode(i, j).obstacle) {
                    color = OBSTACLE_COLOR;
                }

                ASContext.fillStyle = color;
                ASContext.fillRect(this.grid.colWidth * i, this.grid.rowHeight * j, this.grid.colWidth, this.grid.rowHeight);

            }
        }
    }

    renderOpenList() {
        const oS = this.openSet.get();

        // Dibuja la lista abierta
        for (let i = 0; i < this.openSet.size(); i++) {

            let node = oS[i];

            ASContext.fillStyle = OPENLIST_COLOR;
            ASContext.fillRect(this.grid.colWidth * node.x, this.grid.rowHeight * node.y, this.grid.colWidth, this.grid.rowHeight);

        }
    }

    renderClosedList() {
        // Dibuja la lista cerrada
        for (const node of this.closedList) {

            ASContext.fillStyle = CLOSEDLIST_COLOR;
            ASContext.fillRect(this.grid.colWidth * node.x, this.grid.rowHeight * node.y, this.grid.colWidth, this.grid.rowHeight);

        }
    }

    renderSolution() {
        // Dibuja la solucion
        if(this.solution) {

            for(let i = 0; i < this.solution.length; ++i) {
                let node = this.solution[i];

                ASContext.fillStyle = SOLUTION_COLOR;
                ASContext.fillRect(this.grid.colWidth * node.x, this.grid.rowHeight * node.y, this.grid.colWidth, this.grid.rowHeight);

            }

        }
    }

    renderStartAndEnd() {
        // Dibuja celda inicial y final
        ASContext.fillStyle = STARTCELL_COLOR;
        ASContext.fillRect(this.grid.colWidth * this.start.x, this.grid.rowHeight * this.start.y, this.grid.colWidth, this.grid.rowHeight);
        ASContext.fillStyle = ENDCELL_COLOR;
        ASContext.fillRect(this.grid.colWidth * this.end.x, this.grid.rowHeight * this.end.y, this.grid.colWidth, this.grid.rowHeight);
    }

    // Distancia de Manhattan
    heuristic(node, end) {
        return Math.abs(node.x - end.x) + Math.abs(node.y - end.y);
    }

    backTrace(a, b) {
 
        let route = [];
        let lastNode; 
    
        while (b != a) {
            lastNode = b; // lastNode
            b = b.parent; // currentNode
            route.push(lastNode);
        }

        route.push(a);
        return route;
    }

}