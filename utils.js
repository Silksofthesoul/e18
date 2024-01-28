(function() {
  let utils = {};
  const { parse, stringify } = JSON;
  const { min, max, atan, atan2, abs, sin, cos, PI } = Math;
  const p = str => parse(str);
  const s = obj => stringify(obj);
  const co = obj => p(s(obj));
  const floor = val => Math.floor(val);
  const int = val => parseInt(val);

  const random = _ => Math.random();
  const rndMinMaxInt = (min, max) => floor(random() * (max - min + 1)) + min;
  const rndCoinBool = _ => (~~floor(random() * 2) === 0);
  const removeProperty = prop => ({ [prop]: undefined, ...object }) => object;

  const range = (...args) => {
    // data example
    //    like python function
    // with 1 argument: 10
    //    from 0 to 10
    // with 2 argument: 1995 2005
    //    from 1995 to 2005
    // with 3 argument: 1 10 3
    //    from 1 to 10 with step 3
    let start = 0;
    let end = 0;
    let step = 0;
    if (args.length === 0) {
      return [];
    } if (args.length === 1) {
      start = 0;
      end = args[0];
      step = 1;
    } else if (args.length === 2) {
      start = args[0];
      end = args[1];
      step = 1;
    } else if (args.length === 3) {
      start = args[0];
      end = args[1];
      step = args[2];
    } else {
      start = args[0];
      end = args[1];
      step = args[2];
    }
    const result = [];
    let isRun = true;
    let current = start;
    while (isRun) {
      result.push(current);
      current += step;
      if (current > end) {
        isRun = false;
        break;
      }
    }
    return result;
  };

  const element = (tag, params = {}) => {
    const {
      id,
      class: cls = null,
      style,
      text,
      title,
      event,
      href,
      src,
      alt,
      type,
      checked = false,
    } = params;

    const newElement = document.createElement(tag);
    if (id) newElement.setAttribute('id', id);
    if (cls) newElement.setAttribute('class', cls);
    if (style) newElement.setAttribute('style', style);
    if (text) newElement.innerText = text;
    if (title) newElement.title = title;
    if (event) newElement.addEventListener(event.type, () => { event.handler({ element: newElement }); });
    if (tag === 'a' && href) newElement.setAttribute('href', href);
    if (tag === 'a' && target) newElement.setAttribute('target', target);
    if ((tag === 'img' || tag === 'script') && src) newElement.setAttribute('src', src);
    if (tag === 'img' && alt) newElement.setAttribute('src', alt);
    if (tag === 'input' && type) newElement.setAttribute('type', type);
    if (tag === 'input' && type === 'checkbox') newElement.checked = checked;
    return newElement;
  };
  const clss = ({
    element, has, add, remove,
  }) => {
    const cnts = (e, c) => e.classList.contains(c);
    const dd = (e, c) => e.classList.add(c);
    const rem = (e, c) => e.classList.remove(c);
    if (!element && !isNode(element)) return false;
    if (has) return cnts(element, has);
    if (add && !cnts(element, add)) dd(element, add);
    if (remove && cnts(element, remove)) rem(element, remove);
  }

  const domReady = fn => {
    let isRun = false;
    document.addEventListener('DOMContentLoaded', () => {
      if (!isRun) {
        isRun = true;
        fn();
      }
    });
    if (!isRun && (document.readyState === 'interactive' || document.readyState === 'complete')) {
      isRun = true;
      fn();
    }
  };
  const insert = (child, root = document.body) => {
    if (!child) return false;
    root.appendChild(child);
  };

  const lenGuard = val => val === 0 ? 1 : val;
  const gx = (len, deg) => (len * sin((-deg + 180) * PI / 180) / lenGuard(len)) * len;
  const gy = (len, deg) => (len * cos((deg + 180) * PI / 180) / lenGuard(len)) * len;

  // Converts from degrees to radians.
  const deg2rad = deg => deg * PI / 180;

  // Converts from radians to degrees.
  const rad2deg = rad => rad * 180 / PI;

  const getDegByPoints = (x1, y1, x2, y2) => {
    let v = y2 - y1;
    let h = x2 - x1;
    return rad2deg(atan2(v, h));
  };


  const degGuard = (deg = 0) => {
    const r = 360;
    let res = deg % r;
    //if (res < 0) res = r + res;
    return res;
  }

  const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

  utils = {
    insert,
    domReady,
    clss,
    element,

    range,

    gx,
    gy,

    deg2rad,
    rad2deg,
    degGuard,

    rndMinMaxInt,
    rndCoinBool,

    pipe,
  }

  globalThis.utils = utils;

})();
