<template>
  <div id="app" class="m-0 p-0 border-box">
    <div class="absolute inset-0 w-full h-full bg-gray-900"></div>
    <div class="absolute inset-0 w-full h-full bg-trans"></div>
    <canvas class="absolute hidden z-10"></canvas>
    <div class="absolute text-white text-xs bg-darken px-1 py-2 rounded hidden z-20"></div>
    <div class="absolute text-gray-700 bg-gray-100 px-1 py-2 rounded shadow hidden align-center z-20">
      <button class="appearance-none focus:outline-none flex items-center justify-center p-2 rounded hover:bg-gray-200">
        <save-icon size="1.5x" class="text-gray-600 hover:text-blue-400"></save-icon>
      </button>
      <button class="appearance-none focus:outline-none flex items-center justify-center p-2 rounded hover:bg-gray-200">
        <x-icon size="1.5x" class="text-gray-600 hover:text-blue-400"></x-icon>
      </button>
      <button class="appearance-none focus:outline-none flex items-center justify-center p-2 rounded hover:bg-gray-200">
        <check-icon size="1.5x" class="text-gray-600 hover:text-blue-400"></check-icon>
      </button>
    </div>
  </div>
</template>

<script>
import {
  XIcon, SaveIcon, CheckIcon
} from 'vue-feather-icons'
import {
  ipcRenderer,
  clipboard,
  nativeImage,
  remote,
  desktopCapturer,
  screen
} from 'electron'
import Event from 'events'
import fs from 'fs'

export default {
  name: "App",
  components: {
    SaveIcon,
    XIcon,
    CheckIcon,
  },
  created() {
    const { bounds: { width, height }, scaleFactor } = screen.getPrimaryDisplay()
    desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: {
        width: width * scaleFactor,
        height: height * scaleFactor,
      }
    }, (error, sources) => {
      let img = sources[0].thumbnail.toDataURL()
      let capture = new Cap
    })
  },
  methods: {}
}
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

.bg-trans {
  background: rgba(0, 0, 0, 0.6);
}

.bg-darken {
  background: rgba(40, 40, 40, 0.8);
}
</style>
