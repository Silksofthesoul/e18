(function() {
  const {
    insert,
    element,
    domReady,
    rndCoinBool,
    rndMinMaxInt,
    range,
    pipe,
  } = globalThis.utils;

  class Scene extends Base {

    elScene = null;
    bemBlock = 'scene';

    objects = [];
    actors = [];

    timer = null;
    msStep = 15;

    constructor() {
      super();
      this.initScene()
      this.initSceneObjects();
      this.initActors();
      this.loop();
      console.log(this);
    }

    initScene() {
      domReady(_ => {
        this.elRoot = document.body;
        this.elScene = element('div', { class: `${this.bemBlock} ${this.bemBlock}--blob` });
        insert(this.elScene, this.elRoot);
      });
    }

    initSceneObjects() {
      const [square, padding] = [18, 10];
      const { clientWidth, clientHeight } = this.elScene;
      const [width, height] = [parseInt(clientWidth / square) - padding, parseInt(clientHeight / square) - padding];
      const matrix = new Matrix({
        width,
        height,
        bemMixin: `${this.bemBlock}__matrix`,
      });
      this.addObject({ id: 'matrix', object: matrix });
    }

    initActors() {
      const matrix = this.getObject({ id: 'matrix' });
      const [x, y] = [rndMinMaxInt(1, matrix.width - 1), rndMinMaxInt(1, matrix.height)];
      const player = new Player({ x, y, degree: 45, matrix });
      this.addActor({ id: 'player' + rndMinMaxInt(1, 10000), type: 'player', actor: player });
    }

    loop() {
      const self = this;
      const fns = [
        this.lAddPlayers.bind(this),
        this.lRemPlayers.bind(this),
        this.lSurvive.bind(this),
        this.lDeadClean.bind(this),
        this.lPlay.bind(this),
      ];
      const process = _ => {
        pipe(...fns)();
        self.timer = setTimeout(process, self.msStep);
      };
      process();
    }

    lPlay() {
      this.getActor({ type: 'player' })
        .forEach(player => player.run());
    }

    lDeadClean() {
      this.actors = this.actors.filter(item => item.type === 'player' && item.actor.isDead === false);
    }

    lAddPlayers() {
      const [matrix] = [this.getObject({ id: 'matrix' })];
      const addFactor = range(rndMinMaxInt(1, 2)).map(_ => rndCoinBool()).every(item => item);
      if (addFactor) {
        const [x, y] = [rndMinMaxInt(1, matrix.width - 2), rndMinMaxInt(1, matrix.height - 2)];
        const player = new Player({ x, y, matrix });
        this.addActor({ id: 'player' + rndMinMaxInt(1, 10000), type: 'player', actor: player });
      }
    }
    lRemPlayers() {
      const remFactor = range(rndMinMaxInt(1, 10)).map(_ => rndCoinBool()).every(item => item);
      if (remFactor) {
        let index = this.actors.findIndex(item => item.type === 'player');
        if (index !== undefined) this.actors.splice(index, 1);
      }
    }
    lSurvive() {
      const [matrix] = [this.getObject({ id: 'matrix' })];
      if (this.actors.filter(item => item.type === 'player')?.length === 0) {
        const [x, y] = [rndMinMaxInt(1, matrix.width), rndMinMaxInt(1, matrix.height)];
        const player = new Player({ x, y, matrix });
        this.addActor({ id: 'player' + rndMinMaxInt(1, 10000), type: 'player', actor: player });
      }
    }

    addObject({ id, type, object }) {
      this.objects.push({ id, type, object });
      insert(object.get(), this.elScene);
    }

    addActor({ id, type, actor }) { this.actors.push({ id, type, actor }); }

    getObject({ id = null, type = null }) {
      if (id) return this.objects.find(item => item.id === id).object;
      if (type) return this.objects.filter(item => item.type === type).map(item => item.object);
    }
    getActor({ id = null, type = null }) {
      if (id) return this.actors.find(item => item.id === id).actor;
      if (type) return this.actors.filter(item => item.type === type).map(item => item.actor);
    }

    static init() { new this(); }
  }

  globalThis.Scene = Scene;
})();
