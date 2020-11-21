<template>
  <div>
    <div
      class="bg-gray-800 rounded-tl-xl sm:rounded-t-xl p-4 pb-6 sm:p-8 lg:p-4 lg:pb-6 xl:p-8 space-y-6 sm:space-y-8 lg:space-y-6 xl:space-y-8"
    >
      <img
        src="https://i.scdn.co/image/ab67616d0000b273d8d5a96a9da2aad02694d459"
        alt=""
        width="160"
        height="160"
        class="w-full rounded-lg"
      />
      <div>
        <h2
          class="text-white text-base sm:text-xl lg:text-base xl:text-xl font-semibold truncate"
        >
          キミのとなりで
        </h2>
        <p
          class="text-gray-400 text-base sm:text-lg lg:text-base xl:text-lg font-medium"
        >
          鬼頭明里
        </p>
      </div>
      <div class="space-y-2">
        <div class="bg-black rounded-full overflow-hidden">
          <div
            class="bg-green-400 w-1/2 h-2"
            role="progressbar"
            aria-valuenow="1456"
            aria-valuemin="0"
            aria-valuemax="4550"
          ></div>
        </div>
        <div
          class="text-gray-400 flex justify-between text-sm font-medium tabular-nums"
        >
          <div>24:16</div>
          <div>75:50</div>
        </div>
      </div>
    </div>
    <div
      class="bg-gray-900 text-white lg:rounded-b-xl py-4 px-1 sm:px-3 lg:px-1 xl:px-3 grid grid-cols-5 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 items-center"
    >
      <button type="button" class="mx-auto">
        <font-awesome-icon :icon="faHeart" fixed-width size="lg" />
      </button>
      <button type="button" class="mx-auto">
        <svg width="50" height="50" fill="none">
          <circle
            class="text-gray-500"
            cx="25"
            cy="25"
            r="24"
            stroke="currentColor"
            stroke-width="1.5"
          />
          <path d="M18 16h4v18h-4V16zM28 16h4v18h-4z" fill="currentColor" />
        </svg>
      </button>
      <button type="button" class="mx-auto">
        <font-awesome-icon :icon="faStepForward" fixed-width size="lg" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHeart, faStepForward } from '@fortawesome/free-solid-svg-icons'

export default defineComponent({
  components: {
    FontAwesomeIcon,
  },
  setup() {
    return { faHeart, faStepForward }
  },
})
</script>
