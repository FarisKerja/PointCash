<template>
  <q-page class="scanner-page">
    <div id="scan" class="camera-area"></div>
    <div class="app-area tw-h-lvh">
      <div class="row flex-center">
        <q-btn
          label="Start Scan"
          color="primary"
          class="scan-btn"
          @click="startScan"
        />
      </div>
      <div><strong>Hasil scan:</strong></div>
      <small class="text-black">Mentahan: {{ rawData }}</small><br />
      <small class="text-black">Result: {{ resultText }}</small><br />
      <small class="text-negative">Error: {{ error }}</small>
      
      <ul>
        <li v-for="(value, i) in errorLog" :key="i">{{ value }}</li>
      </ul>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onDeactivated } from 'vue'
import {
  BarcodeScanner,
  BarcodeFormat,
  LensFacing,
} from '@capacitor-mlkit/barcode-scanning'
import type { PluginListenerHandle } from '@capacitor/core'

let barcodeListener: PluginListenerHandle | null = null
let errorListener: PluginListenerHandle | null = null

const resultText = ref('')
const rawData = ref('')
const error = ref('')
const errorLog = ref<string[]>([])
const scanning = ref(false)

const startScan = async (): Promise<void> => {
  if (scanning.value) return

  try {
    scanning.value = true
    error.value = ''
    resultText.value = ''
    rawData.value = ''

    // 🔥 MAKE CAMERA VISIBLE
    // await BarcodeScanner.hideBackground()

    const permStatus = await BarcodeScanner.checkPermissions()
    if (permStatus.camera !== 'granted') {
      await BarcodeScanner.requestPermissions()
    }

    const supported = await BarcodeScanner.isSupported()
    if (!supported) {
      throw new Error('Barcode scanning not supported on this device')
    }

    barcodeListener = await BarcodeScanner.addListener(
      'barcodesScanned',
      (event) => {
        const [barcode] = event.barcodes
        if (!barcode?.rawValue) return

        resultText.value = barcode.rawValue
        rawData.value = JSON.stringify(barcode)

        void stopScan()
      },
    )

    errorListener = await BarcodeScanner.addListener(
      'scanError',
      (err) => {
        error.value = err.message
        errorLog.value.push(err.message)
        void stopScan()
      },
    )

    await BarcodeScanner.startScan({
      formats: [
        BarcodeFormat.Code128,
        BarcodeFormat.Code39,
        BarcodeFormat.Ean13,
        BarcodeFormat.Ean8,
        BarcodeFormat.UpcA,
        BarcodeFormat.UpcE,
      ],
      lensFacing: LensFacing.Back,
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    error.value = msg
    errorLog.value.push(msg)
    scanning.value = false
  }
}

const stopScan = async (): Promise<void> => {
  try {
    await BarcodeScanner.stopScan()
    // await BarcodeScanner.showBackground()

    await barcodeListener?.remove()
    await errorListener?.remove()

    barcodeListener = null
    errorListener = null
  } finally {
    scanning.value = false
  }
}

onUnmounted(() => {
  void stopScan()
})

onDeactivated(() => {
  void stopScan()
})
</script>

<style scoped>
/* ScannerPage.vue */

/* ONLY this page */
/* .scanner-page {
  background: transparent !important;
} */

/* Camera visible area */
.camera-area {
  height: 50vh;
  background: transparent;
}

/* App UI area */
.app-area {
  background: #c6e1ff;
  padding: 16px;
}

/* Tablet */
@media (min-width: 900px) {
  .camera-area {
    height: 20vh;
  }
}
</style>
