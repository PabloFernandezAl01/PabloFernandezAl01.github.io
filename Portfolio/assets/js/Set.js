class Set {
    constructor() {
      this.items = {};
    }

    // Agregar un elemento al conjunto
    add(value) {
        if (!this.has(value)) {
          this.items[value] = value;
          return true;
        }
        return false;
    }

    // Eliminar un elemento del conjunto
    delete(value) {
        if (this.has(value)) {
          delete this.items[value];
          return true;
        }
        return false;
    }

    // Verificar si un elemento está en el conjunto
    has(value) {
        return this.items.hasOwnProperty(value);
    }

    // Obtener todos los elementos del conjunto
    values() {
        return Object.values(this.items);
    }

    // Obtener el tamaño del conjunto
    size() {
        return Object.keys(this.items).length;
    }

    // Borrar todos los elementos del conjunto
    clear() {
        this.items = {};
    }
}
