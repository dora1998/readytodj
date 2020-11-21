<template>
  <IndexPage />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import IndexPage from './pages/index.vue'
// import { useSpotifyWebPlaybackSdk } from './hooks/useSpotifyWebPlaybackSdk'

// const OAUTH_TOKEN = import.meta.env.VITE_OAUTH_TOKEN ?? ''

export default defineComponent({
  name: 'App',
  components: {
    IndexPage,
  },
  setup() {
    // const { player, deviceId, isReady } = useSpotifyWebPlaybackSdk({
    //   name: 'ReadyToDJ',
    //   getOAuthToken: async () => OAUTH_TOKEN,
    //   onReady: () => {
    //     fetch(
    //       `https://api.spotify.com/v1/me/player/play?device_id=${deviceId.value}`,
    //       {
    //         method: 'PUT',
    //         body: JSON.stringify({
    //           uris: ['spotify:track:1CFuvvD7OzO65MldvBdHEk'],
    //         }),
    //         headers: {
    //           'Content-Type': 'application/json',
    //           Authorization: `Bearer ${OAUTH_TOKEN}`,
    //         },
    //       }
    //     )
    //   },
    //   onPlayerStateChanged: (state) =>
    //     console.log('onPlayerStateChanged', state),
    //   accountError: () => console.error('accountError!'),
    // })
    // watch(isReady, (newValue) => console.log('isReady', newValue))
  },
})
</script>
