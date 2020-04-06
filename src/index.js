import hash from './hash-mixin';
import query from './query-mixin';

const install = Vue => {
  Vue.mixin(hash);
  Vue.mixin(query);
};

const plugin = {
  install
};

export default plugin;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}
