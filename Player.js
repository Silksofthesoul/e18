(function() {
  const {
    gx, gy,
    degGuard,
    rndMinMaxInt,
    rndCoinBool,
    pipe,
  } = globalThis.utils;
  class Player extends Base {
    #x = -10;
    #y = -10;

    #horMin = 1;
    #horMax = 0;
    #verMin = 1;
    #verMax = 0;

    matrix = [];

    #degree = 0;
    speed = 0.01;
    acceleration = 0;
    accelerationForward = true;
    isCleanOldCoords = true;

    isDead = false;

    constructor(params = {}) {
      super(params);
      const { x = 1, y = 1, degree = 0, matrix = 1 } = params;
      this.matrix = matrix;
      this.#horMax = this.matrix.width - 2;
      this.#verMax = this.matrix.height - 2;
      this.x = x;
      this.y = y;
      this.degree = degree || rndMinMaxInt(0, 360);
    }

    run() {
      this.go({
        beforeHooks: [
          this.speedMutate.bind(this),
        ],
        afterHooks: [
          this.accelerationMutate.bind(this),
          this.degreeMutate.bind(this),
        ],
        positionMutate: [
          this.collisionLuckyDie.bind(this),
        ]
      });
    }

    go(params = {}) {
      const {
        beforeHooks = [],
        afterHooks = [],
        positionMutate = [],
      } = params;

      pipe(...beforeHooks)();

      const _x = gx(this.speed, this.degree);
      const _y = gy(this.speed, this.degree);
      const x = this.x + _x;
      const y = this.y + _y;

      const { x: nx, y: ny } = pipe(...positionMutate)({ x, y });


      pipe(...afterHooks)();

      this.x = nx;
      this.y = ny;

    }

    collisionLuckyDie({ x, y }) {
      const _x = gx(this.speed, this.degree);
      const _y = gy(this.speed, this.degree);
      const isNotEmpty = this.lookAt(this.#guardX(x + _x), this.#guardY(y + _y));
      if (isNotEmpty) this.die();
      return { x, y };
    }

    die() {
      this.speed = 0;
      this.acceleration = 0;
      this.isDead = true;
    }

    lookAt(x, y) { return this.matrix.getPixel({ x, y }); }
    degreeMutate() {
      const [min, max, val] = [-20, 20];
      this.degree += rndMinMaxInt(min, max);
    }
    accelerationMutate() {
      const [min, max, val] = [-1, 1, 0.09];
      if (rndCoinBool() && this.accelerationForward) this.acceleration += val;
      if (rndCoinBool() && !this.accelerationForward) this.acceleration -= val;
      if (this.acceleration < min) {
        this.acceleration = min;
        this.accelerationForward = !this.accelerationForward;
      }
      if (this.acceleration > max) {
        this.acceleration = max;
        this.accelerationForward = !this.accelerationForward;
      }
    }

    speedMutate() {
      const [min, max, val] = [0.5, 4, this.acceleration];
      this.speed += val;
      if (this.speed < min) this.speed = min;
      if (this.speed > max) this.speed = max;
    }

    get x() { return this.#x; }
    get y() { return this.#y; }
    get degree() { return degGuard(this.#degree); }


    #guardX(val) {
      const [max, min] = [this.#horMax, this.#horMin];
      if (val > max) return max;
      if (val < min) return min;
      return val;
    }
    #guardY(val) {
      const [max, min] = [this.#verMax, this.#verMin];
      if (val > max) return max;
      if (val < min) return min;
      return val;
    }

    collisionX(val) {
      if (val === this.#horMax || val === this.#horMin) {
        //this.accelerationMutate();
        this.degree = 360 - this.degree;
      }
    }

    collisionY(val) {
      if (val === this.#verMax || val === this.#verMin) {
        //this.accelerationMutate();
        this.degree = 180 - this.degree;
      }
    }

    set degree(val) { this.#degree = degGuard(val); }

    set x(val) {
      const { matrix, isCleanOldCoords } = this;
      isCleanOldCoords && matrix.setPixel({ x: this.#x, y: this.#y }, false);
      this.#x = this.#guardX(val);

      this.collisionX(this.#x);

      matrix.setPixel({ x: this.#x, y: this.#y }, true);
    }
    set y(val) {
      const { matrix, isCleanOldCoords } = this;
      isCleanOldCoords && matrix.setPixel({ x: this.#x, y: this.#y }, false);
      this.#y = this.#guardY(val);
      this.collisionY(this.#y);
      matrix.setPixel({ x: this.#x, y: this.#y }, true);
    }

  }

  globalThis.Player = Player;
})();
