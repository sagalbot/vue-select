<template>
  <div class="flex">
    <div class="airport-select default">
      <table>
        <tr>
          <th colspan="2">Without Optimization 😬</th>
        </tr>
        <tr>
          <td>Dropdown Render</td>
          <td :class="{ slow: !! timing.default }">{{ timing.default }}ms</td>
        </tr>
      </table>
      <observed-select
        data-type="default"
        placeholder="Search for a destination..."
        :options="options"
        :get-option-label="({icao, name}) => `${icao} - ${name}`"
      ></observed-select>
    </div>

    <div class="airport-select optimized">
      <table>
        <tr>
          <th colspan="2">With Optimization 🤓</th>
        </tr>
        <tr>
          <td>Dropdown Render</td>
          <td :class="{ fast: !! timing.optimized }">{{ timing.optimized }}ms</td>
        </tr>
      </table>
      <observed-select
        data-type="optimized"
        placeholder="Search for a destination..."
        :options="options"
        :filter="filter"
        :loading="loading"
        :get-option-label="({icao, name}) => `${icao} - ${name}`"
      ></observed-select>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import airports from 'airport-data';
import vSelect from '../../../src/components/Select'

const timings = Vue.observable({
  optimized: 0,
  default: 0
});

const ObservedSelect = {...vSelect};

ObservedSelect.watch.dropdownOpen = function (open) {
  if (open) {
    const start = performance.now();
    this.$nextTick(() => {
      timings[this.$el.dataset.type] = performance.now() - start;
    })
  }
};

export default {
  name: "AirportCodes",
  components: {ObservedSelect},
  data: () => ({loading: false}),
  methods: {
    filter (airports, search) {
      if (search.length === 0) {
        return airports.slice(0, 50);
      }
      return airports.filter(airport => {
        const keys = ['name', 'city', 'country', 'iata', 'icao'];
        return keys.some(key => String(airport[key]).toLowerCase().includes(search.toLowerCase()))
      }).slice(0, 50);
    }
  },
  computed: {
    options: () => airports,
    timing: () => timings,
  }
}
</script>

<style scoped>
  table {
    display: table;
    width: 100%;
  }

  .flex {
    display: flex;
  }

  .airport-select {
    width: 50%;
  }

  .airport-select + .airport-select {
    margin-left: 1rem;
  }

  .fast,
  .slow {
    font-weight: bold;
  }

  .slow {
    color: red;
  }

  .fast {
    color: #3eaf7c;
  }
</style>
