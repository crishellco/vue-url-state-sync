import { stateSetterFactory } from '../src/support';

describe('utils.js', () => {
  describe('stateSetterFactory', () => {
    it('should correctly set', () => {
      const target = {
        foo: 'bar',
        nested: {
          isNull: null,
          foo: 'bar',
          nested: {
            foo: 'bar'
          }
        }
      };
      const setter = (root, last, value) => (root[last] = value);

      let set = stateSetterFactory(target, 'foo', setter);
      set('ric flair');
      expect(target.foo).toEqual('ric flair');

      set = stateSetterFactory(target, 'nested.foo', setter);
      set('ric flair');
      expect(target.nested.foo).toEqual('ric flair');

      set = stateSetterFactory(target, 'nested.nested.foo', setter);
      set('ric flair');
      expect(target.nested.nested.foo).toEqual('ric flair');

      set = stateSetterFactory(target, 'nested.isNull', setter);
      set('ric flair');
      expect(target.nested.isNull).toEqual('ric flair');

      set = stateSetterFactory(target, 'nested.isMissing.isMissing', setter);
      set('ric flair');
      expect(target.nested.isMissing.isMissing).toEqual('ric flair');
    });
  });
});
