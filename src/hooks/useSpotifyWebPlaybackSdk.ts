import { Ref, ref, watch } from 'vue'

interface Options {
  name: string
  getOAuthToken: () => Promise<string>
  accountError?: (e: unknown) => void
  onReady?: (deviceId: string) => void
  onPlayerStateChanged?: Spotify.PlaybackStateListener
}

interface ReturnValues {
  player: Ref<Spotify.SpotifyPlayer | null>
  deviceId: Ref<string>
  isReady: Ref<boolean>
}

declare global {
  interface Window {
    Spotify: typeof Spotify
  }
}

export const useSpotifyWebPlaybackSdk = ({
  name,
  getOAuthToken,
  accountError,
  onReady,
  onPlayerStateChanged,
}: Options): ReturnValues => {
  const isReady = ref(false)
  const deviceId = ref('')
  const playerRef = ref<Spotify.SpotifyPlayer | null>(null)

  if (window.Spotify) {
    playerRef.value = new Spotify.Player({
      name,
      getOAuthToken: async (cb) => {
        const token = await getOAuthToken()
        cb(token)
      },
    })
    isReady.value = true
  }

  window.onSpotifyWebPlaybackSDKReady = () => {
    playerRef.value = new Spotify.Player({
      name,
      getOAuthToken: async (cb) => {
        const token = await getOAuthToken()
        cb(token)
      },
    })
    playerRef.value.connect()
    isReady.value = true
  }

  if (!window.Spotify) {
    const scriptTag = document.createElement('script')
    scriptTag.src = 'https://sdk.scdn.co/spotify-player.js'

    document.head?.appendChild(scriptTag)
  }

  const handleReady: Spotify.PlaybackInstanceListener = ({
    device_id: readyDeviceId,
  }) => {
    deviceId.value = readyDeviceId

    if (onReady) {
      onReady(deviceId.value)
    }
  }

  watch(isReady, () => {
    if (isReady.value) {
      playerRef.value?.connect()
    }
  })

  watch([isReady], ([newIsReady], _, onInvalidate) => {
    const player = playerRef.value
    if (!player) return

    if (newIsReady) {
      player.addListener('ready', handleReady)
      onInvalidate(() => {
        player.removeListener('ready', handleReady)
      })

      if (accountError) {
        player.addListener('account_error', accountError)
        player.addListener('initialization_error', accountError)
        player.addListener('authentication_error', accountError)
        player.addListener('not_ready', accountError)

        onInvalidate(() => {
          player.removeListener('account_error', accountError)
          player.removeListener('initialization_error', accountError)
          player.removeListener('authentication_error', accountError)
          player.removeListener('not_ready', accountError)
        })
      }

      if (onPlayerStateChanged) {
        player.addListener('player_state_changed', onPlayerStateChanged)
        onInvalidate(() =>
          player.removeListener('player_state_changed', onPlayerStateChanged)
        )
      }
    }
  })

  return {
    player: playerRef,
    deviceId,
    isReady,
  }
}
