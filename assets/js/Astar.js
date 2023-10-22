// Se crea el canvas
const ASCanvas = document.getElementById("astar");
const ASContext = ASCanvas.getContext("2d");

const ASContainer = document.getElementById("astar-container");

function resizeCanvas() {
    ASCanvas.width = ASContainer.clientWidth;
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
        this.cols = 150;
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

const BACKGROUND_COLOR = `rgb(${71}, ${13}, ${59})`;
const OBSTACLE_COLOR = `rgb(${126}, ${47}, ${86})`;
const OPENLIST_COLOR = `rgb(${228}, ${134}, ${121})`;
const CLOSEDLIST_COLOR = `rgb(${192}, ${87}, ${111})`;
const SOLUTION_COLOR = `rgb(${254}, ${189}, ${132})`;
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
            let x1 = Math.floor(Math.random() * this.grid.getCols());
            let y1 = Math.floor(Math.random() * this.grid.getRows());

            let x2 = Math.floor(Math.random() * this.grid.getCols());
            let y2 = Math.floor(Math.random() * this.grid.getRows());

            this.start = this.grid.getNode(x1, y1);
            this.end = this.grid.getNode(x2, y2);

            // Los nodos elegidos son validos
            if (!this.start || !this.end) continue;

            this.start.obstacle = false;
            this.end.obstacle = false;

            this.prepareRoute(this.start, this.end);
            this.solution = this.routeA(this.start, this.end, this.x1, this.x2, this.y1, 
                                    this.y2, this.i, this.j, this.node, this.neighbor);

        }
        while (this.solution == null);

        this.prepareRoute(this.start, this.end);

    }

    prepareRoute(a, b) {
        this.solution = null;
        this.closedSet = [];
        this.closedList = [];
        this.openSet.clear();

        a.g = 0;
        a.h = this.heuristic(a, b);
        a.f = a.g + a.h;

        this.openSet.add(a);

        this.x1 = 0; this.x2 = 0; 
        this.y1 = 0; this.y2 = 0; 
        this.i = 0; this.j = 0; 
        this.neighbor = null;
        this.node = null; 
    }

    algorithm(a, b, x1, x2, y1, y2, i, j, node, neighbor) {

        node = this.openSet.poll();

        if (node === b) {      
            return this.backTrace(a, b);
        }
    
        // Neighbor position ranges
        x1 = Math.max(0, node.x - 1);
        x2 = Math.min(node.x + 2, this.grid.getCols());
    
        y1 = Math.max(0, node.y - 1);
        y2 = Math.min(node.y + 2, this.grid.getRows());

        // Iterate neighbors
        for (i = x1; i < x2; ++i) {
            for (j = y1; j < y2; ++j) {

                if (i !== node.x || j !== node.y) {

                    neighbor = this.grid.getNode(i, j);
    
                    if (!neighbor.isObstacle() && !this.closedSet[neighbor.id] && !this.grid.getNode(node.x, j).isObstacle() 
                                            && !this.grid.getNode(i, node.y).isObstacle()) {
                        
                        const weight = node.x === i || node.y === j ? LATERAL_WEIGHT : DIAGONAL_WEIGHT;
                        const g = node.g + weight;                     
                        const h = this.heuristic(neighbor, b); 
                        const f = g + h;                               
        
                        if (neighbor.f > f) { 
                            neighbor.g = g;
                            neighbor.h = h;
                            neighbor.f = f;
                            neighbor.parent = node;  
                            this.openSet.remove(neighbor); 
                            this.openSet.add(neighbor);
                        } 
                        else if (!this.openSet.contains(neighbor)) { 
                            neighbor.g = g;
                            neighbor.h = h;
                            neighbor.f = f;
                            neighbor.parent = node;            
                            this.openSet.add(neighbor);
                        }
                    }
                }
            }
        }

        this.closedSet[node.id] = node; 
        this.closedList.push(node)

    }

    routeA(a, b, x1, x2, y1, y2, i, j, node, neighbor) {

        let sol = null;

        while(this.openSet.size() > 0 && sol == null) {
            sol = this.algorithm(a, b, x1, x2, y1, y2, i, j, node, neighbor)
        }

        return sol;

    }

    routeB(a, b, x1, x2, y1, y2, i, j, node, neighbor) {

        let sol = null;

        if (this.openSet.size() > 0 && sol == null) {
            sol = this.algorithm(a, b, x1, x2, y1, y2, i, j, node, neighbor)
        }

        return sol;

    }

    update(deltaTime) {

        // this.grid.rowHeight = ASCanvas.height / this.grid.rows;
        // this.grid.columnWidth = ASCanvas.width / this.grid.columns;

        if (this.solution == null) {

            this.solution = this.routeB(this.start, this.end, this.x1, this.x2, this.y1, 
                                    this.y2, this.i, this.j, this.node, this.neighbor);

        }
        else {
            this.timer += deltaTime;
            if (this.timer > 1) {
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

        // Dibuja el mapa
        for (let i = 0; i < this.grid.getCols(); i++) {
            for (let j = 0; j < this.grid.getRows(); j++) {

                color = BACKGROUND_COLOR;

                if (this.grid.getNode(i, j).obstacle)
                    color = OBSTACLE_COLOR;
                else 
                    color = BACKGROUND_COLOR;

                ASContext.fillStyle = color;
                ASContext.fillRect(this.grid.colWidth * i, this.grid.rowHeight * j, this.grid.colWidth, this.grid.rowHeight);

            }
        }
    }

    renderOpenList() {

        if (!this.openSet) return;

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
        if (!this.closedList) return;

        for (const node of this.closedList) {

            ASContext.fillStyle = CLOSEDLIST_COLOR;
            ASContext.fillRect(this.grid.colWidth * node.x, this.grid.rowHeight * node.y, this.grid.colWidth, this.grid.rowHeight);

        }
    }

    renderSolution() {

        // Dibuja la solucion
        if (!this.solution) return;

        for(let i = 0; i < this.solution.length; ++i) {
            let node = this.solution[i];

            ASContext.fillStyle = SOLUTION_COLOR;
            ASContext.fillRect(this.grid.colWidth * node.x, this.grid.rowHeight * node.y, this.grid.colWidth, this.grid.rowHeight);

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