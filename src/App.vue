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
import { defineComponent, ref } from 'vue'
import WebMidi from 'webmidi'
import HelloWorld from './components/HelloWorld.vue'

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
  },
  setup() {
    const count = ref(0)
    let blinkFlag = true
    const firstBlinkButtons = [48, 50, 53, 55]
    const secondBlinkButtons = [49, 51, 52, 54]
    const midiEventNames = ['noteoff', 'noteon', 'controlchange'] as const

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

      midiEventNames.forEach((eventName) => {
        inputFromPhysical.addListener(eventName, 'all', (event) => {
          const data = Array.from(event.data)
          console.log(eventName, data)

          if (data[0] === 176) {
            count.value += data[2] === 65 ? 1 : -1
          }
        })
      })

      const blink = () => {
        if (blinkFlag) {
          firstBlinkButtons.forEach((button) =>
            outputToPhysical.send(151, [button, 127])
          )
          secondBlinkButtons.forEach((button) =>
            outputToPhysical.send(151, [button, 0])
          )
        } else {
          firstBlinkButtons.forEach((button) =>
            outputToPhysical.send(151, [button, 0])
          )
          secondBlinkButtons.forEach((button) =>
            outputToPhysical.send(151, [button, 127])
          )
        }
        blinkFlag = !blinkFlag
      }

      setInterval(blink, 250)
    })

    return { count }
  },
})
</script>
