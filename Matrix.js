(function() {
  const {
    insert,
    element,
  } = globalThis.utils;


  class Matrix extends Base {
    bemBlock = 'matrix';

    width = 1;
    height = 1;

    model = [];

    constructor(params = {}) {
      super(params);
      const {
        width = 1,
        height = 1,
      } = params;

      this.width = width;
      this.height = height;

      this.elRoot = element('div', {
        class: `${this.bemBlock} ${this.bemMixin}`,
        style: `grid-template-columns: repeat(${this.width}, 1rem); grid-template-rows: repeat(${this.height}, 1rem);`
      });
      this.#fill();
    }

    get #total() { return this.width * this.height; }

    #addRow() { this.model.push([]); }
    #addPixel(pixel) { this.model.at(-1).push(pixel); }


    #fill() {
      let [index, x, y] = [0, 0, 0];
      while (index < this.#total) {
        const pixel = new Pixel({ x, y, index, checked: false });
        insert(pixel.get(), this.elRoot);
        if (this.model.length === 0) this.#addRow();
        if (x > this.width - 2) {
          this.#addRow();
          x = 0;
          y++;
        } else {
          this.#addPixel(pixel);
          x++;
        }
        index++;
      }
    }

    #getMethod(val) {
      const [on, off] = ['on', 'off'];
      if ([true, false].some(b => b === val) === false) return off;
      const methods = [[true, on], [false, off]];
      return methods.find(([b, m]) => val === b && m)[1];
    }

    #guardX(val) {
      const [max, mix] = [this.width - 2, 0];
      if (val > max) return max;
      if (val < 0) return 0;
      return parseInt(val);
    }
    #guardY(val) {
      const [max, mix] = [this.height - 2, 0];
      if (val > max) return max;
      if (val < 0) return 0;
      return parseInt(val);
    }

    setPixel({ x: _x, y: _y }, value) {
      const x = this.#guardX(_x);
      const y = this.#guardY(_y);
      this.model[y][x][this.#getMethod(value)]();
    }
    getPixel({ x: _x, y: _y }) {
      const x = this.#guardX(_x);
      const y = this.#guardY(_y);
      return this.model[y][x].elRoot.checked;
    }
  }

  globalThis.Matrix = Matrix;
})();
