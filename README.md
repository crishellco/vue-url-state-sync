# Vue Skillet

[![Codeship Status for crishellco/vue-skillet](https://app.codeship.com/projects/04e77330-4d5e-0138-f30e-5228d651c9f6/status?branch=master)](https://app.codeship.com/projects/389650) ![](badges/badge-branches.svg) ![](badges/badge-functionss.svg) ![](badges/badge-lines.svg) ![](badges/badge-statements.svg) [![Maintainability](https://api.codeclimate.com/v1/badges/1cb0265d286a10d3a2c0/maintainability)](https://codeclimate.com/github/crishellco/vue-skillet/maintainability)

A Vue plugin to sync state with parsed URL hash value.

_This plugin requires that your project use Vue Router_

## Install

```bash
yarn add -D vue-skillet
# or
npm i -D vue-skillet
```

```javascript
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueSkillet from 'vue-skillet';

Vue.use(VueRouter);
Vue.use(VueSkillet);
```

## Hash Encoding and Decoding

- When a hash is set via a VueSkillet mixin method, it is first encoded using the [qs](https://www.npmjs.com/package/qs) library's `stringify` method.
- When a hash is privided by the global `$hash` computed property, it is decoded using the [qs](https://www.npmjs.com/package/qs) library's `parse` method.
  - String values `true` and `false` are coicerced to booleans.

## Examples

#### Basic sync

```javascript
export default {
  name: 'Users',

  data() {
    return {
      showModal: false
    };
  },

  beforeMount() {
    /**
     * showModal is the local state key
     * showAddUserModal is hash value
     */
    this.$hashSyncState('showModal', 'showAddUserModal');
  }
};
```

#### Vuex

```javascript
import { mapState } = 'vuex';

export default {
  name: 'Users',

  computed: {
    ...mapState('users', ['showModal'])
  },

  beforeMount() {
    this.$hashSyncState('showModal', 'showAddUserModal', (newVal) => {
      this.$store.commit('users/setShowModal', newVal);
    });
  }
};
```

## Global Mixin

A global mixin is installed by this plugin.

### Computed

#### vm.\$hash

Provides hash information

- Returns `{object}`

```
{
  parsed: { term: 'foobar' },
  raw: '#term=foobar'
}
```

### Methods

#### vm.\$hashClear()

Clears hash

- Returns `{void}`

#### vm.\$hashKeyExists(key)

Provides if hash key exists

- Arguments
  - `{string} key`
- Returns `{boolean}`

#### vm.\$hashRemoveValue(key)

Removes hash value by key

- Arguments
  - `{object} hash`
- Returns `{void}`

#### vm.\$hashReplace(hash)

Replaces hash with new value

- Arguments
  - `{object} hash`
- Returns `{void}`

#### vm.\$hashSetValue(key, value)

Sets hash value by key

- Arguments
  - `{string} key`
  - `{mixed} value`
- Returns `{void}`

#### vm.\$hashSyncState(key, watch, hashParsedWatchCallback)

Begins syncing a hash key with state.

- Arguments
  - `{string} key`
  - `{string} value`
  - `{function} hashParsedWatchCallback` optional
    - Called when Vue Router hash change detected
    - Invoked immediatey
    - Arguments
      - `{mixed} newVal`
- Returns `{void}`

## Scripts

```bash
yarn lint
```

```bash
yarn test
```

```bash
yarn build
```

## How to Contribute

### Pull Requests

1. Fork the repository
2. Create a new branch for each feature or improvement
3. Send a pull request from each feature branch to the **develop** branch

## License

[MIT](http://opensource.org/licenses/MIT)
