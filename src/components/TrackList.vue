<template>
  <div class="text-white">
    <button
      v-for="(t, idx) in tracks"
      :key="t.id"
      class="flex flex-row items-center text-left w-full space-x-2 hover:bg-gray-700"
      :class="idx === selectedIdx && 'bg-gray-600'"
    >
      <img
        :src="t.album.images[0].url"
        :width="t.album.images[0].width"
        :height="t.album.images[0].height"
        class="w-16 h-16"
      />
      <div>
        <div v-text="t.name" />
        <div class="text-gray-400 text-sm" v-text="t.artists[0].name" />
      </div>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, toRefs } from 'vue'
import SpotifyWebApi from 'spotify-web-api-js'
import WebMidi from 'webmidi'
import { spotifyApi } from '../utils/env'

export const useDjController = (
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs,
  handleMoveSelector: (direction: -1 | 1) => void,
  handlePlay: () => void
) => {
  const prePosition = ref(-1)

  WebMidi.enable((err) => {
    if (err) return

    const inputFromPhysical = WebMidi.getInputByName('DDJ-400')
    const outputToPhysical = WebMidi.getOutputByName('DDJ-400')
    if (!(inputFromPhysical && outputToPhysical)) {
      return
    }

    inputFromPhysical.addListener('controlchange', 'all', (event) => {
      const data = Array.from(event.data)
      // セレクターの左右回転
      if (data[0] === 182 && data[1] === 64) {
        handleMoveSelector(data[2] === 1 ? 1 : -1)
      }
    })
    inputFromPhysical.addListener('noteon', 'all', (event) => {
      const data = Array.from(event.data)
      // セレクターの押し込み
      if (data[0] === 150 && data[1] === 65) {
        handlePlay()
      }
    })
  })

  return { prePosition }
}

export default defineComponent({
  props: {
    tracks: {
      type: Array as PropType<SpotifyApi.TrackObjectFull[]>,
      default: [],
    },
    deviceId: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const selectedIdx = ref<number | null>(null)
    watch(props.tracks, () => (selectedIdx.value = null))

    const handleMoveSelector = (direction: -1 | 1) => {
      const newIndex =
        selectedIdx.value !== null ? selectedIdx.value + direction : 0
      if (newIndex < 0 || newIndex > toRefs(props).tracks.value.length - 1)
        return
      selectedIdx.value = newIndex
      console.log(newIndex)
    }
    const handlePlayByDjCon = () => {
      console.log(selectedIdx.value, props.deviceId)
      if (!(selectedIdx.value !== null && toRefs(props).deviceId?.value)) return
      spotifyApi.play({
        uris: [toRefs(props).tracks.value[selectedIdx.value].uri],
        device_id: toRefs(props).deviceId?.value,
      })
    }
    useDjController(spotifyApi, handleMoveSelector, handlePlayByDjCon)

    const handlePlayByClick = (uri: string) => {
      spotifyApi.play({
        uris: [uri],
        device_id: toRefs(props).deviceId?.value,
      })
    }

    return { selectedIdx, handlePlayByClick }
  },
})
</script>
