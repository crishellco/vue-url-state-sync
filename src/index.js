import mixin from './mixin';

const install = Vue => {
  Vue.mixin(mixin);
};

const plugin = {
  install
};

export default plugin;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}
