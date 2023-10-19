class PriorityQueue {
    constructor() {
        this.items = [];
    }
  
    enqueue(item, priority) {
        this.items.push({ item, priority });
        this.items.sort((a, b) => a.priority - b.priority);
    }
  
    dequeue() {
        if (this.isEmpty()) {
          return null;
        }
        return this.items.shift().item;
    }
  
    isEmpty() {
        return this.items.length === 0;
    }
  
    contains(item) {
        return this.items.some((element) => element.item === item);
    }

  }
  