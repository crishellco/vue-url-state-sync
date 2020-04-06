<template>
  <div class="flex flex-col items-center mt-32">
    <div class="flex flex-col mb-10">
      <button class="bg-indigo-800 px-4 py-2 rounded text-white" @click="showModal = true">
        Show Modal
      </button>
    </div>
    <div class="flex flex-col mb-10" style="width: 40rem;">
      <div class="flex border-b-2 border-gray-400">
        <div
          class="flex-1 text-center cursor-pointer py-2 hover:bg-gray-200 rounded-t"
          :class="{ 'bg-gray-400 hover:bg-gray-400': nested.tab === 'Tab 1' }"
          @click="nested.tab = 'Tab 1'"
        >
          Tab 1
        </div>
        <div
          class="flex-1 text-center cursor-pointer py-2 hover:bg-gray-200 rounded-t"
          :class="{ 'bg-gray-400 hover:bg-gray-400': nested.tab === 'Tab 2' }"
          @click="nested.tab = 'Tab 2'"
        >
          Tab 2
        </div>
        <div
          class="flex-1 text-center cursor-pointer py-2 hover:bg-gray-200 rounded-t"
          :class="{ 'bg-gray-400 hover:bg-gray-400': nested.tab === 'Tab 3' }"
          @click="nested.tab = 'Tab 3'"
        >
          Tab 3
        </div>
        <div
          class="flex-1 text-center cursor-pointer py-2 hover:bg-gray-200 rounded-t"
          :class="{ 'bg-gray-400 hover:bg-gray-400': nested.tab === 'Tab 4' }"
          @click="nested.tab = 'Tab 4'"
        >
          Tab 4
        </div>
      </div>
      <div v-if="nested.tab === 'Tab 1'" class="p-4">
        Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative
        approaches to corporate strategy foster collaborative thinking to further the overall value
        proposition. Organically grow the holistic world view of disruptive innovation via workplace
        diversity and empowerment.
      </div>
      <div v-if="nested.tab === 'Tab 2'" class="p-4">
        Bring to the table win-win survival strategies to ensure proactive domination. At the end of
        the day, going forward, a new normal that has evolved from generation X is on the runway
        heading towards a streamlined cloud solution. User generated content in real-time will have
        multiple touchpoints for offshoring.
      </div>
      <div v-if="nested.tab === 'Tab 3'" class="p-4">
        Capitalize on low hanging fruit to identify a ballpark value added activity to beta test.
        Override the digital divide with additional clickthroughs from DevOps. Nanotechnology
        immersion along the information highway will close the loop on focusing solely on the bottom
        line.
      </div>
      <div v-if="nested.tab === 'Tab 4'" class="p-4">
        Podcasting operational change management inside of workflows to establish a framework.
        Taking seamless key performance indicators offline to maximise the long tail. Keeping your
        eye on the ball while performing a deep dive on the start-up mentality to derive convergence
        on cross-platform integration.
      </div>
    </div>
    <div class="flex justify-center items-center w-2/3">
      <div class="flex-1">
        <div class="font-semibold text-gray-800">
          Search by Name
        </div>
        <input
          :value="term"
          type="text"
          class="border-2 px-2 py-1 w-full"
          @input="handleSearchInput"
        />
      </div>
      <div class="flex-1 ml-4">
        <div class="font-semibold text-gray-800">
          Filter by Favorite Color
        </div>
        <select v-model="filters.color" class="border-2 px-2 py-1 appearance-none w-full">
          <option />
          <option value="red">
            Red
          </option>
          <option value="green">
            Green
          </option>
          <option value="blue">
            Blue
          </option>
        </select>
      </div>
      <div class="flex-1 ml-4">
        <div class="font-semibold text-gray-800">
          Filter by Favorite Animal
        </div>
        <select v-model="filters.animal" class="border-2 px-2 py-1 appearance-none w-full">
          <option />
          <option value="dog">
            Dog
          </option>
          <option value="cat">
            Cat
          </option>
          <option value="alpaca">
            Alpaca
          </option>
        </select>
      </div>
      <div class="flex-none flex items-center ml-4 justify-end pt-4">
        <div class="flex items-center flex-1">
          <div class="font-semibold text-gray-800 ml-4">
            Male
          </div>
          <input v-model="filters.gender" type="radio" value="male" class="ml-2" />
        </div>
        <div class="flex items-center flex-1">
          <div class="font-semibold text-gray-800 ml-4">
            Female
          </div>
          <input v-model="filters.gender" type="radio" value="female" class="ml-2" />
        </div>
        <div class="flex items-center flex-1">
          <div class="font-semibold text-gray-800 ml-4">
            All
          </div>
          <input v-model="filters.gender" type="radio" value="" class="ml-2" />
        </div>
      </div>
    </div>
    <div class="w-2/3">
      <pre class="whitespace-pre">
        <code class="block border-2 border-gray-800 rounded p-2 text-sm font-mono bg-gray-700 text-white">// vm.$query
{{ $query | pretty }}

// vm.$hash
{{ $hash | pretty }}

// vm.$data
{{ $data | pretty }}
        </code>
      </pre>
    </div>
    <div class="w-2/3">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="px-2">
              Name
            </th>
            <th class="px-2">
              Gender
            </th>
            <th class="px-2">
              Favorite Color
            </th>
            <th class="px-2">
              Favorite Amimal
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user._id">
            <td class="px-2">
              {{ user.name }}
            </td>
            <td class="px-2">
              {{ user.gender }}
            </td>
            <td class="px-2">
              {{ user.favoriteColor }}
            </td>
            <td class="px-2">
              {{ user.favoriteAnimal }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-if="showModal"
      class="fixed w-full h-full flex top-0 left-0 items-center justify-center"
      style="background: rgba(0,0,0,.5)"
    >
      <div
        class="flex-none bg-white shadow-lg rounded flex flex-col"
        style="height: 500px; width: 500px;"
      >
        <div class="p-8 bg-red-500 text-white font-bold text-2xl flex-none">Modal</div>
        <div class="flex-1 flex items-center justify-center">
          <button class="bg-indigo-800 px-4 py-2 rounded text-white" @click="showModal = false">
            Close Modal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';

import users from './users';

export default {
  filters: {
    pretty: function(value) {
      return JSON.stringify(value, null, 2);
    }
  },

  data() {
    return {
      filters: {
        animal: '',
        color: '',
        gender: ''
      },
      nested: {
        tab: 'Tab 1'
      },
      showModal: false,
      term: ''
    };
  },

  computed: {
    filteredUsers() {
      return users.filter(({ name, favoriteAnimal, favoriteColor, gender }) => {
        return (
          (this.term ? name.toLowerCase().indexOf(this.term.toLowerCase()) > -1 : true) &&
          (this.filters.animal ? this.filters.animal === favoriteAnimal : true) &&
          (this.filters.color ? this.filters.color === favoriteColor : true) &&
          (this.filters.gender ? this.filters.gender === gender : true)
        );
      });
    }
  },

  beforeMount() {
    this.$vuss.h.sync('showModal');
    this.$vuss.q.sync('nested.tab');
    this.$vuss.q.sync('term');
    this.$vuss.q.sync('filters');
  },

  methods: {
    handleSearchInput: debounce(function({ target: { value } }) {
      this.term = value;
    }, 300)
  }
};
</script>
