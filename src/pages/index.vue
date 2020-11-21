<template>
  <div class="flex flex-row p-4 space-x-4">
    <div class="max-w-lg w-2/3 flex-shrink-0">
      <player :state="playbackState" :deviceId="deviceId" />
      <shortcut-list class="mt-4" />
    </div>
    <div class="flex-1">
      <search-input />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide, inject } from 'vue'
import SpotifyWebApi from 'spotify-web-api-js'
import { useSpotifyWebPlaybackSdk } from '../hooks/useSpotifyWebPlaybackSdk'
import { OAUTH_TOKEN } from '../utils/env'
import Player from '../components/Player.vue'
import ShortcutList from '../components/ShortcutList.vue'
import SearchInput from '../components/SearchInput.vue'

export default defineComponent({
  components: {
    Player,
    ShortcutList,
    SearchInput,
  },
  setup() {
    const playbackState = ref<Spotify.PlaybackState>()
    const { player, deviceId, isReady } = useSpotifyWebPlaybackSdk({
      name: 'ReadyToDJ',
      getOAuthToken: async () => OAUTH_TOKEN,
      onPlayerStateChanged: (state) => {
        playbackState.value = state
        console.log(state)
      },
      onReady: (deviceId) => {
        const spotifyApi = new SpotifyWebApi()
        spotifyApi.setAccessToken(OAUTH_TOKEN)
        spotifyApi.play({
          device_id: deviceId,
          uris: ['spotify:track:2Wgy7nY7GPUIEyP8nDyFeI'],
        })
      },
      accountError: () => console.error('accountError!'),
    })
    return { playbackState, deviceId }
  },
})
</script>
