<template>
  <div class="flex flex-row p-4">
    <div class="max-w-lg w-2/3 flex-shrink-0">
      <player />
      <shortcut-list class="mt-4" />
    </div>
    <div class="flex-1">曲リスト</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Player from '../components/Player.vue'
import ShortcutList from '../components/ShortcutList.vue'

export default defineComponent({
  components: {
    Player,
    ShortcutList,
  },
})
</script>
