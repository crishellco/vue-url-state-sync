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

  methods: {
    $hashClear() {
      this.$hashReplace();
    },

    $hashKeyExists(key) {
      return has(this.$hash.parsed, key);
    },

    $hashRemoveValue(key) {
      const parsed = this.$hash.parsed;

      delete parsed[key];

      this.$hashReplace(parsed);
    },

    $hashReplace(hash = {}) {
      this.$router.push({ hash: query.stringify(hash) });
    },

    $hashSetValue(key, value = '') {
      const parsed = this.$hash.parsed;

      parsed[key] = value;

      this.$hashReplace(parsed);
    },

    $hashSyncState(key, watch, hashParsedWatchCallback) {
      hashParsedWatchCallback =
        hashParsedWatchCallback ||
        (value => {
          this[watch] = value;
        });

      hashParsedWatchCallback.bind(this);

      hashParsedWatchCallback(this.$hash.parsed[key]);

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

            newVal || newVal === 0 ? this.$hashSetValue(key, newVal) : this.$hashRemoveValue(key);
          },
          { deep: true }
        )
      );
    },

    /* istanbul ignore next */
    destroyed() {
      this.$hashUnwatchers.map(unwatcher => {
        unwatcher();
      });
    }
  }
};
