import { ref } from 'vue'
import WebMidi from 'webmidi'

export const useDjController = () => {
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
}
