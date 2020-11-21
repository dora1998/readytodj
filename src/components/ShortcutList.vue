<template>
  <div class="grid grid-cols-4 gap-4">
    <button
      v-for="(s, idx) in shortcuts"
      :key="idx"
      class="shortcut border-4 text-white text-sm rounded-md h-24 p-2 whitespace-pre-wrap relative"
      :class="s ? 'border-green-700 bg-gray-800' : 'border-gray-800 bg-black'"
      @click="handleClick(idx)"
    >
      <span v-if="s">{{ s ?? '' }}</span>
      <button
        v-if="s"
        class="removeButton rounded-full p-2 bg-red-600 hover:bg-red-800 absolute right-0 top-0 mt-2 mr-2 hidden"
        @click.stop="onRemove(idx)"
      >
        <font-awesome-icon :icon="faTrashAlt" fixed-width />
      </button>
      <font-awesome-icon
        v-else
        class="text-gray-700"
        :icon="faPlus"
        size="2x"
      />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import WebMidi from 'webmidi'

export const useDjController = (handleClick: (idx: number) => void) => {
  const inputFromPhysical = WebMidi.getInputByName('DDJ-400')
  const outputToPhysical = WebMidi.getOutputByName('DDJ-400')
  if (!(inputFromPhysical && outputToPhysical)) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return { updateAvaliableLamp: () => {} }
  }

  inputFromPhysical.addListener('noteon', 'all', (event) => {
    const data = Array.from(event.data)
    // 左側のHOT CUEモードでの下8つボタンの押し込み
    if (data[0] === 151) {
      handleClick(data[1])
    }
  })

  const updateAvaliableLamp = (shortcuts: (string | undefined)[]) => {
    shortcuts.forEach((s, i) => outputToPhysical.send(151, [i, s ? 127 : 0]))
  }
  return { updateAvaliableLamp }
}

export default defineComponent({
  components: {
    FontAwesomeIcon,
  },
  props: {
    shortcuts: {
      type: Array as PropType<(string | undefined)[]>,
      default: new Array(8).fill(undefined),
    },
    onAdd: {
      type: Function as PropType<(idx: number) => void>,
      required: true,
    },
    onRemove: {
      type: Function as PropType<(idx: number) => void>,
      required: true,
    },
    onCall: {
      type: Function as PropType<(idx: number) => void>,
      required: true,
    },
  },
  setup(props) {
    const handleClick = (idx: number) => {
      const shortcut = toRefs(props).shortcuts.value[idx]
      if (shortcut) {
        props.onCall(idx)
      } else {
        props.onAdd(idx)
      }
    }
    const { updateAvaliableLamp } = useDjController(handleClick)
    watch(toRefs(props).shortcuts, updateAvaliableLamp, { immediate: true })
    return { handleClick, faTrashAlt, faPlus }
  },
})
</script>

<style scoped>
.shortcut:hover .removeButton {
  @apply block;
}
</style>
