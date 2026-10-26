<template>
  <div class="bg-blue text-white text-center q-pa-md flex flex-center">
      TEST NEW PRODUCT
  </div>
  <div>
    <video ref="videoRef" style="width: 100%" />

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-subtitle2">QR Result</div>
        <div>{{ result || 'No result yet' }}</div>
        <div class="text-red">{{ error }}</div>
      </q-card-section>
    </q-card>

    <q-btn
      class="q-mt-md"
      color="primary"
      label="Stop Camera"
      @click="stopCamera"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { BrowserMultiFormatReader } from '@zxing/browser'

const videoRef = ref<HTMLVideoElement | null>(null)
const result = ref<string>('')
const error = ref<string>('')

const codeReader = new BrowserMultiFormatReader()
let controls: { stop: () => void } | null = null

onMounted(async () => {
  if (!videoRef.value) return

  controls = await codeReader.decodeFromVideoDevice(
    undefined, // ✅ NOT null
    videoRef.value,
    (res, err) => {
      if (res) {
        result.value = res.getText()
      } else {
        error.value = err?.message || ''
      }
    }
  )
})

function stopCamera() {
  controls?.stop()
}

onBeforeUnmount(() => {
  controls?.stop()
})
</script>
