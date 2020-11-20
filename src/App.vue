<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3.0 + Vite" />
  {{ count }}
  <div class="max-w-sm mx-auto flex p-6 bg-white rounded-lg shadow-xl">
    <div class="flex-shrink-0">
      <img class="h-12 w-12" src="/img/logo.svg" alt="ChitChat Logo" />
    </div>
    <div class="ml-6 pt-1">
      <h4 class="text-xl text-gray-900 leading-tight">ChitChat</h4>
      <p class="text-base text-gray-600 leading-normal">
        You have a new message!
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import { useSpotifyWebPlaybackSdk } from './hooks/useSpotifyWebPlaybackSdk'

const OAUTH_TOKEN = import.meta.env.VITE_OAUTH_TOKEN ?? ''

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
  },
  setup() {
    const { player, deviceId, isReady } = useSpotifyWebPlaybackSdk({
      name: 'ReadyToDJ',
      getOAuthToken: async () => OAUTH_TOKEN,
      onReady: () => {
        fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId.value}`,
          {
            method: 'PUT',
            body: JSON.stringify({
              uris: ['spotify:track:1CFuvvD7OzO65MldvBdHEk'],
            }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${OAUTH_TOKEN}`,
            },
          }
        )
      },
      onPlayerStateChanged: (state) =>
        console.log('onPlayerStateChanged', state),
      accountError: () => console.error('accountError!'),
    })
    watch(isReady, (newValue) => console.log('isReady', newValue))
  },
})
</script>
