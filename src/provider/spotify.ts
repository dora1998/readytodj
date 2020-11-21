import { reactive, toRefs, InjectionKey } from 'vue'

interface State {
  deviceId: string
}

export const useSpotifyStore = () => {
  const globalState = reactive<State>({
    deviceId: '',
  })

  const setDeviceId = (newVal: string) => {
    globalState.deviceId = newVal
  }

  return {
    ...toRefs(globalState),
    setDeviceId,
  }
}

type SpotifyStoreType = ReturnType<typeof useSpotifyStore>
export const SpotifyStoreKey: InjectionKey<SpotifyStoreType> = Symbol(
  'SpotifyStore'
)
