import isEqual from 'lodash.isequal';
import has from 'lodash.has';
import query from 'qs';

export const parseHash = (hash = '') => {
  return JSON.parse(JSON.stringify(query.parse(hash)), (key, value) => {
    return ['true', 'false'].includes(value) ? JSON.parse(value) : value;
  });
};

export default {
  beforeMount() {
    this.$hashUnwatchers = [];

    const replace = (hash = {}) => {
      const route = { hash: `${query.stringify(hash)}` };

      this.$router.push(
        route,
        () => {},
        () => {}
      );
    };

    const remove = key => {
      const parsed = Object.assign({}, this.$hash.parsed);

      delete parsed[key];

      replace(parsed);
    };

    const set = (key, value = '') => {
      const parsed = Object.assign({}, this.$hash.parsed);

      parsed[key] = value;

      replace(parsed);
    };

    this.$hasher = {
      clear: () => {
        replace();
      },

      exists: key => {
        return has(this.$hash.parsed, key);
      },

      remove,

      replace,

      set,

      sync: (key, watch, hashParsedWatchCallback) => {
        hashParsedWatchCallback =
          hashParsedWatchCallback ||
          (value => {
            this[watch] = value;
          });

        hashParsedWatchCallback.bind(this);

        hashParsedWatchCallback(
          this.$hash.parsed[key] || this.$hash.parsed[key] === 0
            ? this.$hash.parsed[key]
            : this[watch]
        );

        this.$hashUnwatchers.push(
          this.$watch('$hash.parsed', newVal => {
            if (typeof newVal[key] === 'undefined' || isEqual(newVal[key], this[watch])) {
              return;
            }

            hashParsedWatchCallback(newVal[key]);
          })
        );

        this.$hashUnwatchers.push(
          this.$watch(
            watch,
            newVal => {
              if (isEqual(newVal, this.$hash.parsed[key])) {
                return;
              }

              newVal || newVal === 0 ? set(key, newVal) : remove(key);
            },
            { deep: true }
          )
        );
      }
    };
  },

  computed: {
    $hash() {
      const hash = (this.$route ? this.$route.hash : '').substr(1);

      return {
        parsed: parseHash(hash),
        raw: hash
      };
    }
  },

  beforeDestroy() {
    this.$hashUnwatchers.map(unwatcher => {
      unwatcher();
    });
  }
};
