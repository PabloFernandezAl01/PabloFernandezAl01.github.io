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

class AStar {

    constructor() {

        this.grid = new Grid();

        this.openSet = new PriorityQueue();

        this.solution = null;

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

        //this.solution = null;

    }

    route(a, b, complete, deltaTime) {

        if (a.isObstacle() || b.isObstacle()) return null;

        this.closedSet = [];
        this.openSet.clear();

        a.g = 0;
        a.h = this.heuristic(a, b);
        a.f = a.g + a.h;

        this.openSet.add(a);

        let x1, x2, y1, y2, i, j, node, neighbor;
        do {

            if (!complete) {
                this.timer += deltaTime;

                if (this.timer < 1)
                    return null;    
                else 
                    this.timer = 0;
            }

            node = this.openSet.poll();
      
            if (node === b) { // check target       
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

                    if (i !== node.x || j !== node.y) { // if not the same

                        neighbor = this.grid.getNode(i, j);
        
                        if (!neighbor.isObstacle() && !this.closedSet[neighbor.id] && !this.grid.getNode(node.x, j).isObstacle() 
                                                && !this.grid.getNode(i, node.y).isObstacle()) { // check if node it is visitable
                            
                                const weight = node.x === i || node.y === j ? LATERAL_WEIGHT : DIAGONAL_WEIGHT;
                                const g = node.g + weight;                     // Actual cost up to node n.
                                const h = this.heuristic(neighbor, b); // Estimated cost to goal.
                                const f = g + h;                               // Estimated cost of the solution through n.
                
                                if (neighbor.f > f) { // Update neighbor
                                    neighbor.g = g;
                                    neighbor.h = h;
                                    neighbor.f = f;
                                    neighbor.parent = node;  
                                    this.openSet.remove(neighbor); 
                                    this.openSet.add(neighbor);
                                } else if (!this.openSet.contains(neighbor)) { // Add neighbor
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

            this.closedSet[node.id] = node; // Add node to closedSet

          } while (this.openSet.size() > 0);
      
          return null;

    }


    render() {

        // Dibuja el fondo
        let color = `rgb(${185}, ${185}, ${185})`;

        ASContext.fillStyle = color;
        ASContext.fillRect(0, 0, ASCanvas.width, ASCanvas.height);

        // Dibuja el mapa
        for (let i = 0; i < this.grid.getCols(); i++) {
            for (let j = 0; j < this.grid.getRows(); j++) {

                color = `rgb(${185}, ${185}, ${185})`;

                if (this.grid.getNode(i, j).obstacle) {
                    color = `rgb(${74}, ${74}, ${74})`;
                }

                ASContext.fillStyle = color;
                ASContext.fillRect(this.grid.colWidth * i, this.grid.rowHeight * j, this.grid.colWidth, this.grid.rowHeight);

            }
        }

        const oS = this.openSet.get();

        // Dibuja la lista abierta
        for (let i = 0; i < this.openSet.size(); i++) {

            let node = oS[i];

            ASContext.fillStyle = `rgb(${0}, ${0}, ${255})`;
            ASContext.fillRect(this.grid.colWidth * node.x, this.grid.rowHeight * node.y, this.grid.colWidth, this.grid.rowHeight);

        }

        // Dibuja la lista cerrada
        for (node of this.closedSet) {

            ASContext.fillStyle = `rgb(${255}, ${0}, ${0})`;
            ASContext.fillRect(this.grid.colWidth * node.x, this.grid.rowHeight * node.y, this.grid.colWidth, this.grid.rowHeight);

        }

        // Dibuja la solucion
        if(this.solution) {

            for(let i = 0; i < this.solution.length; ++i) {
                let node = this.solution[i];

                ASContext.fillStyle = `rgb(${0}, ${255}, ${0})`;
                ASContext.fillRect(this.grid.colWidth * node.x, this.grid.rowHeight * node.y, this.grid.colWidth, this.grid.rowHeight);

            }

        }

        // Dibuja celda inicial y final
        ASContext.fillStyle = `rgb(${255}, ${255}, ${0})`;
        ASContext.fillRect(this.grid.colWidth * this.start.x, this.grid.rowHeight * this.start.y, this.grid.colWidth, this.grid.rowHeight);
        ASContext.fillStyle = `rgb(${0}, ${255}, ${255})`;
        ASContext.fillRect(this.grid.colWidth * this.end.x, this.grid.rowHeight * this.end.y, this.grid.colWidth, this.grid.rowHeight);

    }

    update(deltaTime) {

        this.grid.rowHeight = ASCanvas.height / this.grid.rows;
        this.grid.columnWidth = ASCanvas.width / this.grid.columns;

        if (this.solution == null)
            this.solution = this.route(this.start, this.end, false, deltaTime);

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