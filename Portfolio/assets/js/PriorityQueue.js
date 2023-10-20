class PriorityQueue {
 
    constructor() {
        this.data = [];
    }

    add(value) {
        let i = 0;
        for(i = 0; i < this.data.length; ++i) {
            if(this.data[i].compare(value) > 0) {
                break;
            }
        }
        this.data.splice(i, 0, value);
    }

    contains(value) {
        return this.indexOf(value) > -1;
    }

    indexOf(value) {
        for(let i = 0; i < this.data.length; ++i) {
            if(this.data[i] === value) return i;
        }
        return -1;
    }

    poll() {
        return this.data.splice(0, 1)[0];
    }

    remove(value) {
        let index = this.indexOf(value);
        if(index > -1) {
            this.data.splice(index, 1);
            return true;
        }
        return false;
    }

    clear() {
        this.data = [];
    }

    size() {
        return this.data.length;
    }

    get() {
        return this.data;
    }

}