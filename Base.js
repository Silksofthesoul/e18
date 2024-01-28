(function() {
  class Base {
    elRoot = null;
    bemBlock = '';
    bemMixin = '';

    constructor(params = {}) {
      const { bemMixin = '' } = params;
      this.bemMixin = bemMixin;
    }

    get() { return this.elRoot; }
  }

  globalThis.Base = Base;
})();
