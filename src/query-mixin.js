import { cloneDeep, get, has, isEqual, snakeCase } from 'lodash';

import { parse, queue, stateSetterFactory, stringify } from './support';

export default {
  beforeMount() {
    const clear = () => {
      push();
    };

    const exists = key => {
      return has(this.$query, key);
    };

    const push = (query = {}, next = () => {}, replaceHistory = false) => {
      const route = Object.assign({}, { hash: this.$route.hash }, { query: stringify(query) });

      this.$router[replaceHistory ? 'replace' : 'push'](
        route,
        () => next(),
        () => next()
      );
    };

    const remove = key => {
      queue.push(next => {
        const parsed = Object.assign({}, this.$query);

        delete parsed[key];

        push(parsed, next);
      });
    };

    const set = (key, value = '', replaceHistory = false) => {
      queue.push(next => {
        const parsed = Object.assign({}, this.$query);

        parsed[key] = value;

        push(parsed, next, replaceHistory);
      });
    };

    const sync = (state, key, onQueryChange) => {
      key = snakeCase(key || state);

      onQueryChange = onQueryChange || stateSetterFactory(this, state, this.$set);

      const queryWatcherCallback = newVal => {
        if (isEqual(newVal, get(this, state))) {
          return;
        }

        onQueryChange(cloneDeep(newVal));
      };

      const stateWatcherCallback = (newVal, replaceHistory = false) => {
        if (isEqual(newVal, this.$query[key])) {
          return;
        }

        set(key, cloneDeep(newVal), replaceHistory);
      };

      // initialize
      exists(key) ? onQueryChange(this.$query[key]) : stateWatcherCallback(get(this, state), true);

      this.$watch(`$query.${key}`, queryWatcherCallback);
      this.$watch(state, stateWatcherCallback);
    };

    this.$vuss.q = {
      clear,
      exists,
      remove,
      push,
      set,
      sync
    };
  },

  computed: {
    $query() {
      return this.$route ? parse(this.$route.query) : {};
    }
  }
};
