<template>
  <div>
    <q-spinner v-if="loading" size="40px" /> 
    <div v-else class="tw-text-stone-900">
      <div :class="['tw-grid text-center tw-gap-4', $q.screen.lt.sm ? 'tw-grid-cols-2' : 'tw-grid-cols-4']">
        <div class="tw-p-4 tw-bg-white tw-rounded-xl">
          <div class="tw-text-xl">Income</div>
          <div class="tw-text-xl tw-font-bold">{{ formatIDR(data.sale.totalIncome) }}</div>
        </div>
        <div class="tw-p-4 tw-bg-white tw-rounded-xl">
          <div class="tw-text-xl">Total Sales</div>
          <div class="tw-text-xl tw-font-bold">{{ data.sale.transactionCount }}</div>
        </div>
        <div class="tw-p-4 tw-bg-white tw-rounded-xl">
          <div class="tw-text-xl">Average Sales</div>
          <div class="tw-text-xl tw-font-bold">{{ formatIDR(data.sale.averageOrderPrice) }}</div>
        </div>
        <div class="tw-p-4 tw-bg-white tw-rounded-xl">
          <div class="tw-text-xl">Sales Today</div>
          <div class="tw-text-xl"><Icon :icon="icons[currentIndex]!" width="40px" :class="['tw-animate-bounce  tw-font-bold', data.compare.result == 'low' ? 'tw-text-red-800' : 'tw-text-blue-500']" /></div>
        </div>
      </div>
      <div :class="['tw-pt-4 tw-grid text-center tw-gap-4', $q.screen.lt.sm ? 'tw-grid-cols-1' : 'tw-grid-cols-2']">
        <div>
          <q-card style="border-radius: 20px;">
            <q-card-section class="tw-bg-sky-700 text-white">
              <div class="text-h6">Risk Product</div>
            </q-card-section>
            <q-card-section class="tw-bg-sky-700 tw-p-4">
              <ApexChart
                type="pie"
                :options="chartOptions"
                :series="chartSeries"
                height="280"
              />
            </q-card-section>
          </q-card>
        </div>
        <div>
          <q-card style="border-radius: 20px;">
            <q-card-section class="tw-bg-sky-700 text-white">
              <div class="text-h6">Risk Product</div>
            </q-card-section>
            <q-card-section class="tw-bg-sky-700 tw-p-4">
              <q-table
                flat
                bordered
                :rows="product"
                :columns="columns"
                row-key="name"
              ></q-table>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useQuasar } from 'quasar'
import type { QTableProps } from 'quasar'

const $q = useQuasar()

const endPoint = ref(import.meta.env.VITE_PUBLIC_GOLANG_URL)
const dumURL = ref('')


const currentIndex = ref(0)
const error = ref('')
const data = ref()
const loading = ref(true)

const icons = ['material-symbols:check-indeterminate-small']
const chartOptions = ref({
  labels: [] as string[],
  legend: {
    show: false
  }
})
const chartSeries = ref<number[]>([])

let interval: ReturnType<typeof setInterval> | null = null

const columns: QTableProps['columns'] = [
  {
    name: 'name',
    align: 'left',
    label: 'Product',
    field: 'name',
    sortable: true
  },
  {
    name: 'batch_code',
    align: 'center',
    label: 'Batch Code',
    field: 'batch_code',
    sortable: true
  },
  {
    name: 'result',
    align: 'center',
    label: 'Condition',
    field: 'result',
    sortable: true
  }
]
interface setProduct {
  name: string,
  batch_code: string,
  result: number,
}
const product = ref<setProduct[]>([])

const formatIDR = (value: number) => {
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(value)
}

const dummy = ref([])

const loadData = async () => {
  try {
    const resDum = await fetch('https://jsonplaceholder.typicode.com/posts')
    const catchDump = await resDum.json()
    dummy.value = catchDump

    dumURL.value = `${endPoint.value}sales/dashboard/mobile`
    const res = await fetch(dumURL.value)
    const catchData = await res.json()
    data.value = catchData
    icons.length = 0
    for(let x = 1; x < 4; x++) {
      if(data.value.compare.result == 'low') {
        icons.push('material-symbols:stat-minus-' + x.toString())
      } else {
        icons.push('material-symbols:stat-' + x.toString())
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chartOptions.value.labels = data.value.payment_method.map((d: any) => d.name)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chartSeries.value = data.value.payment_method.map((d: any) => d.percentage)
    for(let x = 0; x < data.value.list_product.length; x++) {
      product.value.push({
        name: data.value.list_product[x].name,
        batch_code: data.value.list_product[x].batch_code,
        result: data.value.list_product[x].result,
      })
    }

    // throw new Error('error !!!')
    loading.value = false
  } catch(e) {
    console.log(e)
    error.value = e instanceof Error ? e.toString() + " tes akhir " : String(e)
  } finally {
    console.log('done')
  }
}

onMounted(async () => {
  await loadData()
  interval = setInterval(() => {
    currentIndex.value =
      (currentIndex.value + 1) % icons.length
  }, 1000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>
