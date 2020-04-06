import { kebabCase } from 'lodash';

import { queue, stateSetterFactory, stringify } from './support';

export default {
  beforeMount() {
    const clear = () => {
      set();
    };

    const set = (hash, replaceHistory = false) => {
      queue.push(next => {
        const route = Object.assign(
          { query: stringify(this.$route.query) },
          { hash: hash ? `#${hash}` : '' }
        );

        this.$router[replaceHistory ? 'replace' : 'push'](
          route,
          () => next(),
          () => next()
        );
      });
    };

    const sync = (state, hash, onHashChange) => {
      hash = kebabCase(hash || state);

      onHashChange = onHashChange || stateSetterFactory(this, state, this.$set);

      const stateWatcherCallback = newVal => {
        newVal ? set(hash) : this.$hash === hash && clear();
      };

      // initialize
      if (this.$hash === hash) {
        onHashChange(true);
      } else if (this[state]) {
        set(hash, true);
      }

      this.$watch('$hash', newVal => onHashChange(newVal === hash));
      this.$watch(state, stateWatcherCallback);
    };

    this.$vuss = {
      h: {
        clear,
        set,
        sync
      }
    };
  },

  computed: {
    $hash() {
      return (this.$route ? this.$route.hash : '').substr(1);
    }
  }
};
