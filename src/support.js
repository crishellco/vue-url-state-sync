export class Queue {
  constructor() {
    this.stack = [];
  }

  next() {
    if (this.stack.length) {
      this.run(this.stack[0]);
    }
  }

  push(fn) {
    this.stack.push(fn);
    this.stack.length === 1 && this.next();
  }

  run(fn) {
    fn(() => {
      this.stack.shift();
      this.next();
    });
  }
}

export const parse = query => {
  Object.keys(query).map(key => {
    try {
      query[key] = JSON.parse(query[key]);
    } catch (e) {
      //
    }
  });

  return query;
};

export const queue = new Queue();

export const stateSetterFactory = (target, path, setter) => {
  const pieces = path.split('.');
  const last = pieces.pop();
  const root = pieces.reduce((result, prop) => {
    if (result[prop]) {
      return result[prop];
    }

    return (result[prop] = {});
  }, target);

  return value => {
    setter(root, last, value);
  };
};

export const stringify = query => {
  Object.keys(query).map(key => {
    query[key] = typeof query[key] === 'object' ? JSON.stringify(query[key]) : query[key];
  });

  return query;
};
