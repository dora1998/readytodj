<template>
  <div>
    <div
      class="bg-gray-800 rounded-tl-xl sm:rounded-t-xl p-4 pb-6 sm:p-8 lg:p-4 lg:pb-6 xl:p-8 space-y-6 sm:space-y-8 lg:space-y-6 xl:space-y-8"
    >
      <img :src="albumImg" width="640" height="640" class="w-full rounded-lg" />
      <div>
        <h2
          class="text-white text-base sm:text-xl lg:text-base xl:text-xl font-semibold truncate"
        >
          {{ state?.track_window.current_track?.name }}
        </h2>
        <p
          class="text-gray-400 text-base sm:text-lg lg:text-base xl:text-lg font-medium"
        >
          {{ state?.track_window.current_track?.artists[0]?.name }}
        </p>
      </div>
      <div class="space-y-2">
        <div class="bg-black rounded-full overflow-hidden">
          <div
            class="h-2"
            :class="isSeeking ? 'bg-orange-400' : 'bg-green-400'"
            :style="`width: ${
              ((progressPosition ?? 0) / (state?.duration ?? 1)) * 100
            }%`"
            role="progressbar"
            :aria-valuenow="progressPosition ?? 0"
            aria-valuemin="0"
            :aria-valuemax="state?.duration ?? 1"
          ></div>
        </div>
        <div
          class="text-gray-400 flex justify-between text-sm font-medium tabular-nums"
        >
          <div>{{ positionStr }}</div>
          <div>{{ durationStr }}</div>
        </div>
      </div>
    </div>
    <div
      class="bg-gray-900 text-white lg:rounded-b-xl py-4 px-1 sm:px-3 lg:px-1 xl:px-3 grid grid-cols-5 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 items-center"
    >
      <button type="button" class="mx-auto">
        <font-awesome-icon :icon="faHeart" fixed-width size="lg" />
      </button>
      <button type="button" class="mx-auto" @click="handlePlayButton">
        <font-awesome-icon
          v-if="state?.paused"
          :icon="faPlayCircle"
          fixed-width
          size="3x"
        />
        <font-awesome-icon v-else :icon="faPauseCircle" fixed-width size="3x" />
      </button>
      <button type="button" class="mx-auto">
        <font-awesome-icon :icon="faStepForward" fixed-width size="lg" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  Ref,
  ref,
  watch,
  toRefs,
  computed,
  inject,
} from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHeart, faStepForward } from '@fortawesome/free-solid-svg-icons'
import {
  faPlayCircle,
  faPauseCircle,
} from '@fortawesome/free-regular-svg-icons'
import SpotifyApi from 'spotify-web-api-js'
import WebMidi from 'webmidi'
import { OAUTH_TOKEN } from '../utils/env'
import SpotifyWebApi from 'spotify-web-api-js'

function formatWithZeroPadding(num: number, len: number): string {
  return ('0'.repeat(len) + String(num)).slice(-len)
}
function formatTimeStr(ms: number): string {
  return `${Math.floor(ms / 1000 / 60)}:${formatWithZeroPadding(
    Math.floor(ms / 1000) % 60,
    2
  )}`
}

export const useDjController = (
  spotifyApi: SpotifyApi.SpotifyWebApiJs,
  realtimePosition: Ref<number>,
  handlePlayButton: () => void
) => {
  const prePosition = ref(-1)
  const timer = ref()

  WebMidi.enable((err) => {
    if (err) {
      console.error(err)
      return
    }

    console.log(WebMidi.outputs)
    const inputFromPhysical = WebMidi.getInputByName('DDJ-400')
    const outputToPhysical = WebMidi.getOutputByName('DDJ-400')
    if (!(inputFromPhysical && outputToPhysical)) {
      console.error('failed to get output!')
      return
    }

    const midiEventNames = ['noteoff', 'noteon', 'controlchange'] as const
    midiEventNames.forEach((eventName) => {
      inputFromPhysical.addListener(eventName, 'all', (event) => {
        const data = Array.from(event.data)
        console.log(eventName, data)
      })
    })

    inputFromPhysical.addListener('noteon', 'all', (event) => {
      const data = Array.from(event.data)
      if (data[0] === 144 && data[1] === 11) {
        handlePlayButton()
      }
    })
    inputFromPhysical.addListener('controlchange', 'all', (event) => {
      const data = Array.from(event.data)

      if (data[0] === 176) {
        if (prePosition.value === -1) prePosition.value = realtimePosition.value
        prePosition.value += data[2] === 65 ? 100 : -100

        if (timer.value !== -1) clearTimeout(timer.value)
        timer.value = setTimeout(() => {
          spotifyApi.seek(prePosition.value)
          prePosition.value = -1
        }, 1000)
      }
    })
  })

  return { prePosition }
}

export default defineComponent({
  components: {
    FontAwesomeIcon,
  },
  props: {
    deviceId: {
      type: String,
    },
    state: {
      type: Object as PropType<Spotify.PlaybackState | undefined>,
      required: true,
    },
  },
  setup(props) {
    const realtimePosition = ref(0)
    watch(toRefs(props).state, (newValue, _, onInvalidate) => {
      realtimePosition.value = newValue?.position ?? 0
      if (!newValue || newValue.paused) return

      const timer = setInterval(() => (realtimePosition.value += 1000), 1000)
      onInvalidate(() => clearInterval(timer))
    })
    const albumImg = computed(() => {
      const imgs = props.state?.track_window.current_track.album.images ?? []
      imgs.sort((a, b) => (b.width ?? 0) - (a.width ?? 0))
      return imgs[0]?.url ?? ''
    })

    const spotifyApi = new SpotifyWebApi()
    spotifyApi.setAccessToken(OAUTH_TOKEN)
    const handlePlayButton = () => {
      const paused = toRefs(props).state.value?.paused
      if (paused) {
        spotifyApi.play()
      } else {
        spotifyApi.pause()
      }
    }

    const { prePosition } = useDjController(
      spotifyApi,
      realtimePosition,
      handlePlayButton
    )
    const isSeeking = computed(() => prePosition.value !== -1)
    const progressPosition = computed(() =>
      prePosition.value === -1 ? realtimePosition.value : prePosition.value
    )
    const positionStr = computed(() => formatTimeStr(progressPosition.value))
    const durationStr = computed(() =>
      formatTimeStr(props.state?.duration ?? 0)
    )

    return {
      ...toRefs(props),
      faHeart,
      faStepForward,
      faPlayCircle,
      faPauseCircle,
      isSeeking,
      progressPosition,
      positionStr,
      durationStr,
      albumImg,
      handlePlayButton,
    }
  },
})
</script>
