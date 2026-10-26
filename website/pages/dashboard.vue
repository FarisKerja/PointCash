<script setup>
import IndexWeb from '~/components/navigations/IndexWeb.vue'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import { useRuntimeConfig } from '#app';
import { ref } from 'vue';
import { defineAsyncComponent } from 'vue'

const ApexChart = defineAsyncComponent(() => 
  import('vue3-apexcharts').then(mod => mod.default || mod)
)

const config = useRuntimeConfig();
const series = ref([
  {
    name: "Sales",
    data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
  },
]);

const chartOptions = ref({
  chart: {
    type: 'bar',
    height: 350,
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
  },
});

const sidebarOpen = ref(true)
const data = ref({})
const loading = ref(false)
const error = ref(null)
const endPoint = config.public.golangREST;

//untuk sales trend
const dataTrend = ref([])
const titleTrend = ref({
  chart: {
    type: 'bar',
    height:350
  },
  xaxis: {
    categories: dataTrend
  },
  yaxis: {
    labels: {
      min: 0,
      tickAmount: 5,
      labels: {
        formatter: function (value) {
          return value.toFixed(0); // clean integer display
        }
      }
    }
  }
})
const resultTrend = ref([
  {
    name:"Total",
    data: dataTrend
  }
])

const headersExpired = [
  { text: 'Name', value: 'name', sortable: true, filterable: true },
  { text: 'Batch Code', value: 'batch_code', sortable: true, filterable: true },
  { text: 'Condition', value: 'result', sortable: true, filterable: false }
]
const dataExpired = ref([])
const searchExpired = ref('')

const headersCashier = [
  { text: 'Name', value: 'name', sortable: true, filterable: true },
  { text: 'Total', value: 'transaction_count', sortable: true, filterable: false }
]
const dataCashier = ref([])
const searchCashier = ref('')

const listExpired = ref([])

async function loadData() {
  const res = await fetch(endPoint + 'sales/dashboard/website', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${config.public.tempToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  const catchData = await res.json()
  data.value = catchData
  if(data.value.trend_chart !== undefined) {
    const loop = data.value.trend_chart
    for(let x = 0; x < loop.length; x++) {
      dataTrend.value.push({
        x: new Date(loop[x].sale_date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        y: loop[x].total_transaction
      })
    }
  }
  if(data.value.expired_product !== undefined) {
    dataExpired.value = data.value.expired_product
  }
  if(data.value.kpi_cashier !== undefined) {
    dataCashier.value = data.value.kpi_cashier
  }
  if(data.value.expired_product !== undefined) {
    const loopTrash = data.value.expired_product
    if(loopTrash !== undefined) {
      for(let x = 0; x < loopTrash.length; x++) {
        if(loopTrash[x].result == 'expired') {
          listExpired.value.push(loopTrash[x])
        }
      }
    }
  }
}

const convertIDR = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

onMounted(async () => {
  try {
    await loadData();
    loading.value = true
  } catch (err) {
    console.log(err)
    error.value = err
    loading.value = false
  } finally {
    console.log('done')
  }
})
</script>

<style>
/* Light Admin Table (matches screenshot style) */
.admin-table {
  --easy-table-border: 1px solid #e5e7eb;
  --easy-table-row-border: 1px solid #e5e7eb;

  --easy-table-header-background-color: #ffffff;
  --easy-table-header-font-color: #374151;
  --easy-table-header-font-size: 12px;
  --easy-table-header-height: 44px;
  --easy-table-header-item-padding: 8px 12px;

  --easy-table-body-row-font-color: #374151;
  --easy-table-body-row-background-color: #ffffff;
  --easy-table-body-even-row-background-color: #fafafa;
  --easy-table-body-row-height: 44px;
  --easy-table-body-row-font-size: 13px;

  --easy-table-body-row-hover-background-color: #f3f4f6;
  --easy-table-body-row-hover-font-color: #111827;

  --easy-table-body-item-padding: 8px 12px;

  --easy-table-footer-background-color: #ffffff;
  --easy-table-footer-font-color: #6b7280;
  --easy-table-footer-font-size: 12px;
  --easy-table-footer-height: 48px;

  --easy-table-rows-per-page-selector-width: 90px;
}
</style>

<template>
    <IndexWeb :openSidebar="sidebarOpen" @update:openSidebar="sidebarOpen = $event">
      <div v-if="!loading">
        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <!-- ... -->
        </svg>
      </div>
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          <div class="p-4 text-center bg-white rounded-lg shadow-sm">
            <div class="text-xl">Today</div>
            <div class="text-4xl font-semibold">{{ convertIDR(data.summarize_report?.todayProfit??0) }}</div>
          </div>
          <div class="p-4 text-center bg-white rounded-lg shadow-sm">
            <div class="text-xl">This Month</div>
            <div class="text-4xl font-semibold">{{ convertIDR(data.summarize_report?.monthProfit??0) }}</div>
          </div>
          <div class="p-4 text-center bg-white rounded-lg shadow-sm">
            <div class="text-xl">Comparison</div>
            <div class="text-4xl font-semibold grid grid-cols-4 content-center">
              <div>
                <Icon :name="(data.summarize_report?.compareBefore??0 > 0 ? 'material-symbols:arrow-shape-up' : 'material-symbols:arrow-shape-down')" :class="['w-10 h-10', (data.summarize_report?.compareBefore??0 > 0 ? 'text-green-500' : 'text-red-700')]" />
              </div>
              <div class="col-span-1">
                 {{ convertIDR(data.summarize_report?.compareBefore??0) }}
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <div class="p-4 bg-white rounded-lg">
            <div class="text-center text-xl font-semibold pb-4">
              Sale Graph
            </div>
            <div v-if="loading && resultTrend[0].data.length > 0">
              <ClientOnly>
                <ApexChart
                  type="line"
                  height="350"
                  :options="titleTrend"
                  :series="resultTrend"
                />
              </ClientOnly>
            </div>
            <div v-else class="flex justify-center items-center h-[350px]">
              <p>Loading chart data...</p>
            </div>
          </div>
          <div class="p-4 bg-white rounded-lg">
            <div class="text-center text-xl font-semibold pb-4">
              Low stock or Risk Product
            </div>
            <EasyDataTable
              table-class-name="admin-table"
              :headers="headersExpired"
              :items="dataExpired"
              :rows-per-page="10"
              :search-value="searchExpired"
              show-filter
              show-index
            />
          </div>
          <div class="p-4 bg-white rounded-lg">
            <div class="text-center text-xl font-semibold pb-4">
              Cashier Performance
            </div>
            <EasyDataTable
              table-class-name="admin-table"
              :headers="headersCashier"
              :items="dataCashier"
              :rows-per-page="10"
              :search-value="searchCashier"
              show-filter
              show-index
            />
          </div>
          <div v-if="listExpired.length == 0" class="p-4 bg-red-700 rounded-lg">
            <div class="text-center text-xl font-semibold pb-4">
              Everything under control
            </div>
          </div>
          <div v-else class="p-4 bg-red-700 rounded-lg text-white">
            <div class="text-center text-xl font-semibold pb-4">
              {{ listExpired.length == 1 ? "This" : "These" }} product{{ listExpired.length == 1 ? "" : "s" }} {{ listExpired.length == 1 ? "is" : "are" }} EXPIRED !!
            </div>
            <ul v-for="item in listExpired" :key="index" class="mx-4 list-disc text-lg">
              <li>
                {{ item.name }} with package code : <b>{{ item.batch_code }}</b>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </IndexWeb>
</template>