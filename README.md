# Vue Url State Sync (vuss)

![Actions Status](https://github.com/crishellco/vue-url-state-sync/workflows/Build/badge.svg) ![Actions Status](https://github.com/crishellco/vue-url-state-sync/workflows/Deploy/badge.svg) ![](badges/badge-branches.svg) ![](badges/badge-functionss.svg) ![](badges/badge-lines.svg) ![](badges/badge-statements.svg) [![Maintainability](https://api.codeclimate.com/v1/badges/1cb0265d286a10d3a2c0/maintainability)](https://codeclimate.com/github/crishellco/vue-url-state-sync/maintainability)

A Vue plugin to sync router queries and hash with state.

_This plugin requires that your project use Vue Router in history mode_

Check out the [demo](https://vue-url-state-sync.netlify.com/)

- [Why?](#why-)
- [Install](#install)
- [Examples](#examples)
  - [Basic sync](#basic-sync)
  - [Vuex mapState](#vuex-mapstate)
  - [Vuex computed with setter](#vuex-computed-with-setter)
  - [Nested State](#nested-state)
- [Hashes vs Queries](#hashes-vs-queries)
  - [Hashes](#hashes)
  - [Queries](#queries)
- [Global Mixins](#global-mixins)
  - [Computed](#computed)
    - [`vm.$hash`](#-vm-hash-)
    - [`vm.$query`](#-vm-query-)
  - [Methods](#methods)
    - [`vm.$vuss.h.clear()`](#-vm-vusshclear---)
    - [`vm.$vuss.h.set(hash, replaceHistory)`](#-vm-vusshset-hash--replacehistory--)
    - [`vm.$vuss.h.sync(state, hash, onHashChange)`](#-vm-vusshsync-state--hash--onhashchange--)
    - [`vm.$vuss.q.clear()`](#-vm-vussqclear---)
    - [`vm.$vuss.q.exists(key)`](#-vm-vussqexists-key--)
    - [`vm.$vuss.q.push(hash)`](#-vm-vussqpush-hash--)
    - [`vm.$vuss.q.remove(key)`](#-vm-vussqremove-key--)
    - [`vm.$vuss.q.set(key, value, replaceHistory)`](#-vm-vussqset-key--value--replacehistory--)
    - [`vm.$vuss.q.sync(state, key, onQueryChange)`](#-vm-vussqsync-state--key--onquerychange--)
- [Scripts](#scripts)
- [How to Contribute](#how-to-contribute)
  - [Pull Requests](#pull-requests)
- [License](#license)

## Why?

**Allow users to deep link (bookmark) to state outside of normal routing such as:**

- filtered lists
- searched lists
- modal states
- tabs
- etc.

## Install

```bash
yarn add -D vue-url-state-sync
# or
npm i -D vue-url-state-sync
```

```javascript
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueUrlStateSync from 'vue-url-state-sync';

Vue.use(VueRouter);
Vue.use(VueUrlStateSync);

const router = new Router({
  mode: 'history', // must be in history mode for hashes to work!
  routes: [...]
});

const app = new Vue({
  router
}).$mount('#app')
```

## Examples

### Basic sync

```html
<template>
  <input v-model="term" type="text" placeholder="Search term" />
</template>

<script>
  export default {
    name: 'Users',

    data() {
      return {
        showModal: false,
        searchTerm: 'foobar'
      };
    },

    beforeMount() {
      this.$vuss.h.sync('showModal');
      this.$vuss.q.sync('searchTerm');

      /**
       * Resulting URL
       * ?search_term=foobar#show-modal
       */
    }
  };
</script>
```

### Vuex mapState

```javascript
import { mapState } = 'vuex';

export default {
  name: 'Users',

  computed: {
    ...mapState('users', ['showModal'])
  },

  beforeMount() {
    // define a callback for when the hash changes
    this.$vuss.h.sync('showModal', 'showAddUserModal', (newVal) => {
      this.$store.commit('users/setShowModal', newVal);
    });
  }
};
```

### Vuex computed with setter

```javascript
export default {
  name: 'Users',

  computed: {
    showModal: {
      get() {
        return this.$store.state.users.showModal;
      },

      set(newVal) {
        this.$store.commit('users/setShowModal', newVal);
      }
    }
  },

  beforeMount() {
    this.$vuss.h.sync('showModal', 'showAddUserModal');
  }
};
```

### Nested State

```javascript
export default {
  name: 'Users',

  data() {
    return {
      list: {
        filters: {
          animal: 'dog',
          color: 'red',
          gender: 'male'
        }
      }
    };
  },

  beforeMount() {
    this.$vuss.q.sync('list.filters');
    /**
     * Resulting URL
     * ?list_filters=%7B"animal"%3A"dog","color"%3A"red","gender"%3A"male"%7D
     */

    this.$vuss.q.sync('list.filters', 'filters');
    /**
     * Resulting URL
     * ?filters=%7B"animal"%3A"dog","color"%3A"red","gender"%3A"male"%7D
     */
  }
};
```

## Hashes vs Queries

### Hashes

Hashes is intended to be used for simple boolean state, such as whether or not to show a modal. It is always converted to `kebab-case`.

```javascript
export default {
  // data
  data() {
    return {
      modal: true
    };
  },

  // sync
  beforeMount() {
    // you can define both the state key and the hash value if you wish
    this.$vuss.h.sync('modal', 'showModal');

    // optional - define a callback for when the hash changes
    this.$vuss.h.sync('modal', 'showModal', newVal => {
      this.modal = newVal;
    });
  }
};

// result
('https://mysite.com#show-modal');
```

### Queries

Queries is intended for data such as search terms, filters, current tab, etc. It is stringified on write, and parsed on read. Keys are always converted to `snake_case`.

```javascript
export default {
  // data
  data() {
    return {
      filters: {
        animal: 'dog',
        color: 'red',
        gender: 'male'
      }
    };
  },

  // sync
  beforeMount() {
    // you can define both the state key and the query key if you wish
    this.$vuss.q.sync('filters', 'f');

    // optional - define a callback for when the query changes
    this.$vuss.h.sync('filters', 'f', newVal => {
      this.filters = { ...newVal };
    });
  }
};

// result
('https://mysite.com?f=%7B"animal"%3A"dog","color"%3A"red","gender"%3A"male"%7D');
```

## Global Mixins

Two global mixins are installed by this plugin - one for syncing hash and one for syncing query queries.

### Computed

#### `vm.$hash`

Provides hash

- Returns `{string}`

```
vm.$hash = 'show-modal'
```

#### `vm.$query`

Provides query

- Returns `{object}`

```
{
  term: 'foobar'
}
```

### Methods

#### `vm.$vuss.h.clear()`

Clears hash

- Returns `{void}`

---

#### `vm.$vuss.h.set(hash, replaceHistory)`

Sets hash

- Arguments
  - `{string} hash`
  - `{boolean} [replaceHistory=false]` -- if true, a new history entry will not be added to the navigation stack
- Returns `{void}`

---

#### `vm.$vuss.h.sync(state, hash, onHashChange)`

Syncs the hash with specific component state.

When first called, it will sync the current hash to the state OR state to hash, in that order. It then sets up two watchers -- one for hash changes and one for state changes.

- Arguments
  - `{string} state`
  - `{string} [hash]` -- if not passed, is set to the value of `state`
  - `{function} [onHashChange]`
    - Called when Vue Router hash change detected
    - Arguments
      - `{*} newVal`
- Returns `{void}`

---

#### `vm.$vuss.q.clear()`

Clears query

- Returns `{void}`

---

#### `vm.$vuss.q.exists(key)`

Provides if query key exists

- Arguments
  - `{string} key`
- Returns `{boolean}`

---

#### `vm.$vuss.q.push(hash)`

Updates query query object.

- Arguments
  - `{object} query`
  - `{function} [next=() => {}]`
  - `{boolean} [replaceHistory=false]` -- if true, a new history entry will not be added to the navigation stack
- Returns `{void}`

---

#### `vm.$vuss.q.remove(key)`

Removes query value by key

- Arguments
  - `{object} query`
- Returns `{void}`

---

#### `vm.$vuss.q.set(key, value, replaceHistory)`

Sets query value by key

- Arguments
  - `{string} key`
  - `{*} value`
  - `{boolean} [replaceHistory=false]` -- if true, a new history entry will not be added to the navigation stack
- Returns `{void}`

---

#### `vm.$vuss.q.sync(state, key, onQueryChange)`

Syncs a query key with specific component state.

When first called, it will sync the current query to the state OR state to query, in that order. It then sets up two watchers -- one for query changes and one for state changes.

- Arguments
  - `{string} state`
  - `{string} [key]` -- if not passed, is set to the value of `state`
  - `{function} [onQueryChange]`
    - Called when Vue Router query change detected
    - Arguments
      - `{*} newVal`
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
