<template>
  <div class="flex flex-row p-4 space-x-4">
    <div class="max-w-lg w-2/3 flex-shrink-0">
      <player :state="playbackState" :deviceId="deviceId" />
      <shortcut-list class="mt-4" />
    </div>
    <div class="flex-1">
      <search-input :onSearch="handleSearch" />
      <track-list class="mt-4" :tracks="searchResult" :deviceId="deviceId" />
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
import TrackList from '../components/TrackList.vue'

const spotifyApi = new SpotifyWebApi()
spotifyApi.setAccessToken(OAUTH_TOKEN)

export default defineComponent({
  components: {
    Player,
    ShortcutList,
    SearchInput,
    TrackList,
  },
  setup() {
    const playbackState = ref<Spotify.PlaybackState>()
    const searchResult = ref<SpotifyApi.TrackObjectFull[]>([])
    const { player, deviceId, isReady } = useSpotifyWebPlaybackSdk({
      name: 'ReadyToDJ',
      getOAuthToken: async () => OAUTH_TOKEN,
      onPlayerStateChanged: (state) => {
        playbackState.value = state
        console.log(state)
      },
      onReady: (deviceId) => {
        spotifyApi.play({
          device_id: deviceId,
          uris: ['spotify:track:3SAgoXsKEGMlIGNtOvs0vV'],
        })
      },
      accountError: () => console.error('accountError!'),
    })
    const handleSearch = async (text: string) => {
      const res = await spotifyApi.searchTracks(text)
      searchResult.value = res.tracks.items
    }
    return { playbackState, searchResult, deviceId, handleSearch }
  },
})
</script>
