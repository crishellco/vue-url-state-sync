import { createLocalVue, mount } from '@vue/test-utils';
import VueRouter from 'vue-router';

import VueHasher from '../src/';
import { parseHash } from '../src/mixin';

const component = {
  template: '<div/>'
};

let localVue;
let router;
let wrapper;

describe('mixin.js', () => {
  beforeEach(() => {
    localVue = createLocalVue();
    router = new VueRouter();
    localVue.use(VueRouter);
    localVue.use(VueHasher);

    wrapper = mount(component, {
      data() {
        return {
          modal: false
        };
      },
      localVue,
      router
    });
  });
  it('should correctly parse the hash', () => {
    expect(parseHash(false)).toEqual({});
    expect(parseHash()).toEqual({});
    expect(parseHash('term=foobar')).toEqual({ term: 'foobar' });
    expect(parseHash('filters[0][name]=ric flair')).toEqual({ filters: [{ name: 'ric flair' }] });
    expect(parseHash('boolean=true')).toEqual({ boolean: true });
  });

  it('should correctly set the hash', () => {
    wrapper.vm.$hasher.replace({ term: 'foobar' });
    expect(wrapper.vm.$route.hash).toBe('#term=foobar');

    wrapper.vm.$hasher.replace({ term: '' });
    expect(wrapper.vm.$route.hash).toBe('#term=');

    wrapper.vm.$hasher.replace({ filters: [{ name: 'ric flair' }] });
    expect(wrapper.vm.$route.hash).toBe('#filters%5B0%5D%5Bname%5D=ric%20flair');

    wrapper.vm.$hasher.replace();
    expect(wrapper.vm.$route.hash).toBe('');
  });

  it('should correctly return if a key exists', () => {
    wrapper.vm.$router.push({ hash: 'term=foobar' });
    expect(wrapper.vm.$hasher.exists('term')).toBe(true);
    expect(wrapper.vm.$hasher.exists('reeeee')).toBe(false);

    wrapper.vm.$hasher.remove('term');
    expect(wrapper.vm.$hasher.exists('term')).toBe(false);
  });

  it('should correctly clear the hash', () => {
    wrapper.vm.$hasher.clear();

    expect(wrapper.vm.$route.hash).toBe('');
  });

  it('should correctly set a hash value', () => {
    wrapper.vm.$hasher.set('ric', 'flair');
    expect(wrapper.vm.$route.hash).toBe('#ric=flair');

    wrapper.vm.$hasher.set('ricflair');
    expect(wrapper.vm.$route.hash).toBe('#ric=flair&ricflair=');
  });

  it('should correctly replace the hash', () => {
    wrapper.vm.$hasher.replace({ ric: 'flair' });
    expect(wrapper.vm.$route.hash).toBe('#ric=flair');

    wrapper.vm.$hasher.replace();
    expect(wrapper.vm.$route.hash).toBe('');
  });

  it('should correctly sync state to hash', done => {
    wrapper.vm.$hasher.sync('showModal', 'modal');

    wrapper.setData({ modal: true });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.$route.hash).toBe('#showModal=true');
      done();
    });
  });

  it('should correctly bail on sync state to hash', done => {
    wrapper.vm.$hasher.sync('showModal', 'modal');

    const $set = (wrapper.vm.$hasher.set = jest.fn());
    const $remove = (wrapper.vm.$hasher.remove = jest.fn());

    wrapper.setData({ modal: false });
    wrapper.vm.$nextTick(() => {
      expect($set).not.toHaveBeenCalledWith();
      expect($remove).not.toHaveBeenCalledWith();
      done();
    });
  });

  it('should correctly bail sync state to hash if values match', done => {
    wrapper = mount(component, {
      data() {
        return {
          modal: true
        };
      },
      localVue,
      router
    });

    wrapper.vm.$hasher.sync('showModal', 'modal');

    wrapper.vm.$router.push({ hash: 'showModal=true' });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.$route.hash).toBe('#showModal=true');
      done();
    });
  });

  it('should correctly sync state as blank to hash', done => {
    wrapper = mount(component, {
      data() {
        return {
          modal: false
        };
      },
      localVue,
      router
    });

    wrapper.vm.$hasher.sync('showModal', 'modal');

    wrapper.setData({ modal: true });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.$route.hash).toBe('#showModal=true');
      done();
    });
  });

  it('should correctly sync hash to state', done => {
    wrapper.vm.$hasher.sync('showModal', 'modal');

    wrapper.vm.$router.push({ hash: 'showModal=true' });
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.modal).toBe(true);
      done();
    });
  });

  it('should correctly envoke callback from hash change', done => {
    const callback = jest.fn();

    wrapper.vm.$hasher.sync('showModal', 'modal', callback);
    callback.mockReset();

    wrapper.vm.$router.push({ hash: '' });
    wrapper.vm.$router.push({ hash: 'showModal=true' });

    wrapper.vm.$nextTick(() => {
      expect(callback).toHaveBeenCalledWith(true);
      done();
    });
  });

  it('should correctly bail callback from hash change', done => {
    const callback = jest.fn();

    wrapper.vm.$hasher.sync('showModal', 'modal', callback);
    callback.mockReset();

    wrapper.vm.$router.push({ hash: 'showModal=false' });

    wrapper.vm.$nextTick(() => {
      expect(callback).not.toHaveBeenCalledWith();
      done();
    });
  });

  it('should correctly bail callback from hash change to undefined', done => {
    const callback = jest.fn();

    wrapper.vm.$hasher.sync('showModal', 'modal', callback);
    callback.mockReset();

    wrapper.vm.$router.push({ hash: 'showModal=undefined' });

    wrapper.vm.$nextTick(() => {
      expect(callback).not.toHaveBeenCalledWith();
      done();
    });
  });

  it('should fail silently without $route', () => {
    wrapper = mount(component, {
      data() {
        return {
          modal: false
        };
      },
      localVue
    });

    expect(wrapper.vm.$hash).toEqual({
      parsed: {},
      raw: ''
    });
  });
});
