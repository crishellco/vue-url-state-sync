<template>
  <div class="flex flex-col items-center mt-32">
    <div class="flex justify-center items-center w-2/3">
      <div class="flex-1">
        <div class="font-semibold text-gray-800">
          Search by Name
        </div>
        <input v-model="term" type="text" class="border-2 px-2 py-1 w-full" />
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
        <code class="block border-2 border-gray-800 rounded p-2 text-sm font-mono bg-gray-700 text-white">{{ this.$hash | pretty }}</code>
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
  </div>
</template>

<script>
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
      term: '',
      users
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(({ name, favoriteAnimal, favoriteColor, gender }) => {
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
    this.$hasher.sync('term', 'term');
    this.$hasher.sync('filters', 'filters', (filters = { animal: '', color: '', gender: '' }) => {
      this.$set(this, 'filters', { ...filters });
    });
  }
};
</script>

<style scoped></style>
