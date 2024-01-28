(function() {
  const {
    insert,
    element,
    domReady,
  } = globalThis.utils;

  class Pixel extends Base {
    square = 18;
    bemBlock = 'pixel';

    constructor(params = {}) {
      super(params);
      const {
        x = 1,
        y = 1,
        index = 1,
        checked = true,
        square = 18,
      } = params;
      this.x = x;
      this.y = y;
      this.index = index;
      this.checked = checked;
      this.square = square;

      this.elRoot = element('input', {
        type: 'checkbox',
        class: `${this.bemBlock} ${this.bemMixin}`,
        checked: this.checked,
      });
    }

    on() {
      this.checked = true;
      this.#domReflect();
    }

    off() {
      this.checked = false;
      this.#domReflect();
    }

    #domReflect() {
      this.elRoot.checked = this.checked;
    }
  }

  globalThis.Pixel = Pixel;
})();
