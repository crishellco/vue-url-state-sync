import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import VueHasher from '../../dist';
import Demo from './Demo';

Vue.config.productionTip = false;

Vue.use(VueHasher);
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
