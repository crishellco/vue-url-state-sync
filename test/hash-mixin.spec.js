import { createLocalVue, mount } from '@vue/test-utils';
import VueRouter from 'vue-router';

const component = {
  template: '<div/>'
};

let localVue;
let router;
let wrapper;

describe('hash-mixin.js', () => {
  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(VueRouter);
    localVue.use(require('../src').default);
    router = new VueRouter({ mode: 'history' });

    wrapper = mount(component, {
      data() {
        return {
          modal: false,
          nested: {
            modal: false
          }
        };
      },
      localVue,
      router
    });

    router.replace({});
  });

  it('should correctly set the hash', () => {
    wrapper.vm.$vuss.h.set('show-modal');
    expect(wrapper.vm.$route.hash).toBe('#show-modal');

    wrapper.vm.$vuss.h.set();
    expect(wrapper.vm.$route.hash).toBe('');
  });

  it('should correctly set a nested state from hash', async () => {
    wrapper.vm.$vuss.h.sync('nested.modal', 'modal');
    expect(wrapper.vm.$route.hash).toBe('');

    await wrapper.vm.$router.push({ hash: 'modal' });
    expect(wrapper.vm.nested).toEqual({ modal: true });
  });

  it('should correctly clear the hash', () => {
    wrapper.vm.$vuss.h.clear();

    expect(wrapper.vm.$route.hash).toBe('');
  });

  it('should correctly sync state to hash', async () => {
    wrapper.setData({ modal: true });

    await wrapper.vm.$vuss.h.sync('modal');
    expect(wrapper.vm.$route.hash).toBe('#modal');
  });

  it('should correctly sync state as blank to hash', async () => {
    wrapper = mount(component, {
      data() {
        return {
          modal: false
        };
      },
      localVue,
      router
    });

    wrapper.vm.$vuss.h.sync('modal', 'showModal');

    await wrapper.setData({ modal: false });
    await wrapper.setData({ modal: true });
    expect(wrapper.vm.$route.hash).toBe('#show-modal');
  });

  it('should correctly sync hash to state', async () => {
    wrapper.vm.$router.push({ hash: 'show-modal' });
    wrapper.vm.$vuss.h.sync('modal', 'showModal');
    expect(wrapper.vm.modal).toBe(true);

    await wrapper.vm.$vuss.h.set('asdf');
    expect(wrapper.vm.modal).toBe(false);
  });

  it('should correctly update hash from state', async () => {
    wrapper.vm.$router.replace({ hash: '' });

    wrapper.vm.$vuss.h.sync('modal', 'showModal');
    expect(wrapper.vm.$route.hash).toBe('');
    expect(wrapper.vm.$hash).toBe('');

    await wrapper.setData({ modal: true });
    expect(wrapper.vm.$route.hash).toBe('#show-modal');

    await wrapper.setData({ modal: false });
    expect(wrapper.vm.$hash).toBe('');
  });

  it('should correctly fire the callback', async () => {
    const callback = jest.fn();

    wrapper.vm.$vuss.h.sync('modal', 'modal', callback);

    await wrapper.vm.$router.replace({ hash: 'modal' });
    expect(callback).toHaveBeenCalledWith(true);
  });

  it('should handle vue-router not installed', () => {
    localVue = createLocalVue();
    localVue.use(VueRouter);
    localVue.use(require('../src').default);
    wrapper = mount(component, {
      data() {
        return {
          modal: false
        };
      },
      localVue
    });

    expect(wrapper.vm.$hash).toEqual('');
  });
});
