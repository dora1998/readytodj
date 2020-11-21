<template>
  <div class="flex flex-row p-4 space-x-4">
    <div class="max-w-lg w-2/3 flex-shrink-0">
      <player :state="playbackState" :device-id="deviceId" />
      <shortcut-list
        class="mt-4"
        :shortcuts="shortcuts"
        :on-add="handleAddShortcut"
        :on-remove="handleRemoveShortcut"
        :on-call="handleCallShortcut"
      />
    </div>
    <div class="flex-1">
      <search-input
        :value="searchQuery"
        :on-search="handleSearch"
        @input="handleSearchInput"
      />
      <track-list class="mt-4" :tracks="searchResult" :device-id="deviceId" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
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
    const searchQuery = ref('')
    const searchResult = ref<SpotifyApi.TrackObjectFull[]>([])
    const shortcuts = ref<(string | undefined)[]>([
      '早見沙織',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ])

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
    const handleSearchInput = (text: string) => (searchQuery.value = text)

    const handleRemoveShortcut = (idx: number) => {
      const newArr = [...shortcuts.value]
      newArr[idx] = undefined
      console.log('remove', newArr)
      shortcuts.value = newArr
    }
    const handleAddShortcut = (idx: number) => {
      const newArr = [...shortcuts.value]
      newArr[idx] = searchQuery.value
      console.log('add', newArr)
      shortcuts.value = newArr
    }
    const handleCallShortcut = (idx: number) => {
      if (!shortcuts.value[idx]) return
      const newText = shortcuts.value[idx] ?? ''
      searchQuery.value = newText
      handleSearch(newText)
    }

    return {
      playbackState,
      searchResult,
      shortcuts,
      deviceId,
      searchQuery,
      handleSearch,
      handleSearchInput,
      handleRemoveShortcut,
      handleAddShortcut,
      handleCallShortcut,
    }
  },
})
</script>
