import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import VueUrlStateSync from '../../src';
import Demo from './Demo';

Vue.config.productionTip = false;

Vue.use(VueUrlStateSync);
Vue.use(VueRouter);

new Vue({
  render: h => h(App),
  router: new VueRouter({
    mode: 'history',
    routes: [
      {
        component: Demo,
        path: '/'
      }
    ]
  })
}).$mount('#app');
