import { createLocalVue, shallowMount } from '@vue/test-utils';
import VueRouter from 'vue-router';

const component = {
  template: '<div/>'
};

let localVue;
let router;
let wrapper;

describe('query-mixin.js', () => {
  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(VueRouter);
    localVue.use(require('../src').default);
    router = new VueRouter({ mode: 'history' });

    wrapper = shallowMount(component, {
      data() {
        return {
          foo: 'bar',
          term: '',
          nested: {}
        };
      },
      localVue,
      router
    });

    router.replace({});
  });

  it('should correctly set the queries', () => {
    wrapper.vm.$vuss.q.push({ term: 'foobar' });
    expect(wrapper.vm.$route.query).toEqual({ term: 'foobar' });

    wrapper.vm.$vuss.q.push({ term: '' });
    expect(wrapper.vm.$route.query).toEqual({ term: '' });

    wrapper.vm.$vuss.q.push({ filters: [{ name: 'ric flair' }] });
    expect(wrapper.vm.$route.query).toEqual({ filters: '[{"name":"ric flair"}]' });

    wrapper.vm.$vuss.q.push();
    expect(wrapper.vm.$route.query).toEqual({});
  });

  it('should correctly set a nested state from a query', async () => {
    wrapper.vm.$vuss.q.sync('nested.tab', 'tab');
    expect(wrapper.vm.$route.query).toEqual({});

    await wrapper.vm.$router.push({ query: { tab: 'tab2' } });
    expect(wrapper.vm.nested).toEqual({ tab: 'tab2' });
  });

  it('should correctly return if a key exists', () => {
    wrapper.vm.$router.push({ query: { term: 'foobar' } });
    expect(wrapper.vm.$vuss.q.exists('term')).toEqual(true);
    expect(wrapper.vm.$vuss.q.exists('reeeee')).toEqual(false);

    wrapper.vm.$vuss.q.remove('term');
    expect(wrapper.vm.$vuss.q.exists('term')).toEqual(false);
  });

  it('should correctly clear the queries', () => {
    wrapper.vm.$vuss.q.clear();

    expect(wrapper.vm.$route.query).toEqual({});
  });

  it('should correctly set a queries value', () => {
    wrapper.vm.$vuss.q.set('ric', 'flair');
    expect(wrapper.vm.$route.query).toEqual({ ric: 'flair' });

    wrapper.vm.$vuss.q.set('ricflair');
    expect(wrapper.vm.$route.query).toEqual({ ric: 'flair', ricflair: '' });
  });

  it('should correctly replace the queries', () => {
    wrapper.vm.$vuss.q.push({ ric: 'flair' });
    expect(wrapper.vm.$route.query).toEqual({ ric: 'flair' });

    wrapper.vm.$vuss.q.push();
    expect(wrapper.vm.$route.query).toEqual({});
  });

  it('should correctly sync state to queries', async () => {
    wrapper.vm.$vuss.q.sync('term');

    await wrapper.setData({ term: 'foo' });
    expect(wrapper.vm.$route.query).toEqual({ term: 'foo' });
  });

  it('should correctly sync queries to state', async () => {
    wrapper.vm.$router.push({ query: { term: 'foo' } });

    await wrapper.vm.$vuss.q.sync('term');
    expect(wrapper.vm.term).toEqual('foo');
  });

  it('should handle vue-router not installed', () => {
    localVue = createLocalVue();
    localVue.use(require('../src').default);
    wrapper = shallowMount(component, {
      data() {
        return {
          modal: false
        };
      },
      localVue
    });

    expect(wrapper.vm.$query).toEqual({});
  });
});
