<template>
  <div class="grid grid-cols-4 gap-4">
    <div
      v-for="(s, idx) in shortcuts"
      :key="idx"
      class="border-4 text-white text-sm rounded-md h-24 p-2 whitespace-pre-wrap"
      :class="s ? 'border-green-700 bg-gray-800' : 'border-gray-800 bg-black'"
      v-text="s?.text ?? ''"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface ShortcutData {
  buttonId: number
  text: string
}

export default defineComponent({
  setup() {
    const shortcuts: (ShortcutData | undefined)[] = [
      {
        buttonId: 0,
        text: 'garden\n早見沙織',
      },
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ]
    return { shortcuts }
  },
})
</script>
