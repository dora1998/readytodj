<template>
  <div class="pt-2 relative mx-auto text-white w-full">
    <input
      class="border-2 border-gray-600 bg-gray-800 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none w-full"
      type="search"
      name="search"
      placeholder="Search"
    />
    <button type="submit" class="absolute right-0 top-0 mt-4 mr-4">
      <font-awesome-icon
        :icon="faSearch"
        class="text-gray-600 h-4 w-4 fill-current"
      />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export default defineComponent({
  components: {
    FontAwesomeIcon,
  },
  setup() {
    return { faSearch }
  },
})
</script>
