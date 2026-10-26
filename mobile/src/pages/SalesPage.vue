<template>
  <q-page class="scanner-page">
    <div id="scan" :class="setCamera">
      <div class="centered text-center tw-font-bold tw-text-lg">
        {{ scanning == true ? "" : 'Click "START SCAN" for barcode preview' }}
      </div>
    </div>
    <div class="app-area tw-h-100">
      <div class="tw-h-full">
        <div v-if="showNotFound" class="q-pa-md tw-rounded-lg text-center tw-bg-red-700 text-white tw-text-lg">
          Product not found!!
        </div>
        <div class="row justify-between">
          <div>
            <q-btn
              label="Start Scan"
              class="q-pa-sm q-ma-sm q-w-md bg-warning"
              @click="startScan"
            />
          </div> 
          <div>
            <q-btn
              label="Pay Order"
              :class="['q-pa-sm q-ma-sm q-w-md ', select.disabled_pay == true ? 'tw-text-white tw-bg-red-800' : 'tw-bg-green-500 tw-text-white']"
              @click="payPrice"
              :disabled="select.disabled_pay"
            />
          </div> 
        </div>
      <!--<div><strong>Hasil scan:</strong></div>
      <small class="text-black">Mentahan: {{ rawData }}</small><br />
      <small class="text-black">Result: {{ resultText }}</small><br />
      <small class="text-negative">Error: {{ error }}</small>
      -->
        <q-form class="q-gutter-md">
            <q-card style="border-radius: 20px;">
              <q-card-section class="bg-white text-black">
              <div class="text-h5">Sale Date</div>
              <div class="text-subtitle2">
                <q-input
                  type="datetime-local"
                  v-model="form.sale_date"
                  readonly
                />
              </div>
              <br>
              <div class="text-h5">Payment Method</div>
              <div class="text-subtitle2">
                <q-select 
                  v-model="form.payment_method" 
                  :options="listPayment"
                  behavior="menu"
                  :menu-props="selectList"
                />
              </div>
              <br>
              <div class="text-h5">Customer</div>
              <div class="text-subtitle2">
                <q-select
                  v-model="form.customer_id"
                  use-input
                  input-debounce="1000"
                  :options="listCust"
                  emit-value
                  map-options
                  @filter="filterCust"
                  behavior="menu"
                  :menu-props="selectList"
                  @virtual-scroll="(event) => onScroll(event, 'customer')"
                />
              </div>
              <br>
              <div class="text-h5">Total Amount</div>
              <div class="text-subtitle2">
                <q-input
                  type="text"
                  v-model="select.show_total"
                  readonly
                />
              </div>
              <br>
              <div class="text-h5">Product</div>
              <div class="text-subtitle2">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-select
                      v-model="select.choose_product"
                      use-input
                      input-debounce="300"
                      :options="select.list_product"
                      @filter="filterProduct"
                      behavior="menu"
                      :option-label="(item) => item ? `${item.name} - ${item.barcode}` : ''"
                      option-value="id"
                      :menu-props="selectList"
                      @virtual-scroll="(event) => onScroll(event, 'product')"
                      style="white-space: nowrap;"
                    />
                    <!-- bikin filter baru -->
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="select.total_product"
                      type="number"
                      min="1"
                      :max="maxStock"
                      @update:model-value="addToCart"
                    />
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
          <q-card :class="[$q.screen.lt.sm ? 'tw-mb-32' : 'tw-mb-20']" style="border-radius: 20px;">
            <q-card-section class="bg-white text-black">
              <div class="text-h6">Cart</div>
            </q-card-section>
            <q-card-section class="tw-p-4">
              <q-table
                flat
                bordered
                :rows="carts"
                :columns="columns"
                row-key="name"
              >
                <!-- Custom action column -->
                <template v-slot:body-cell-action="props">
                  <q-td :props="props">
                    <q-btn flat icon="delete" color="negative" size="sm" @click="deleteItem(props.row.id)"/>
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </q-form>
        <ul>
          <li v-for="(value, i) in errorLog" :key="i">{{ value }}</li>
        </ul>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onDeactivated, reactive, computed } from 'vue'
import {
  BarcodeScanner,
  BarcodeFormat,
  LensFacing,
} from '@capacitor-mlkit/barcode-scanning'
import type { PluginListenerHandle } from '@capacitor/core'
import { useQuasar, type QTableProps } from 'quasar'
import { useRouter } from 'vue-router';

const $q = useQuasar()
const router = useRouter();

const endPoint = ref(import.meta.env.VITE_PUBLIC_GOLANG_URL)

let barcodeListener: PluginListenerHandle | null = null
let errorListener: PluginListenerHandle | null = null

const resultText = ref('')
const rawData = ref('')
const error = ref('')
const errorLog = ref<string[]>([])
const scanning = ref(false)
const setCamera = ref('camera-area-steady')
const showNotFound = ref(false)
const maxStock = ref(1)

const newdate = new Date();
const plus = new Date(newdate.setHours(newdate.getHours() + 7));
const form = reactive({
  payment_method: 'cash' as string,
  customer_id: null as string | null,
  total_amount: 0 as number,
  customer_name: null as string | null,
  sale_date: plus.toISOString().split("T")[0] + ' ' + plus.toISOString().split("T")[1]?.split(".")[0],
  bank_transaction_no: null as string | null,
  list: [] as {
    price: number
    product_id: number
    quantity: number
  }[]
})

interface setProduct {
  id: number,
  name: string,
  description: string,
  quantity: number,
  barcode: string,
  original_price: number,
  price: string
}

const select = reactive({
  customer_name: '',
  name: '',
  choose_product:0,
  total_product: 0,
  show_total: 'Rp 0',
  origin_total: 0,
  list_product: <setProduct[]>([{name: '-- Select Product --', id : 0, barcode: '' }]),
  disabled_pay: true
})

const pageProd = ref(1)
const lastPageProd = ref(false)
const currentProd = ref('')

const tempProd = ref<setProduct[]>([{ 
                    name:'-- Select Product --', 
                    id: 0, 
                    description:'', 
                    quantity: 0, 
                    barcode: '', 
                    original_price: 0, 
                    price: '' 
                  }])
const listPayment = ref([
  { label: 'Cash', value: 'cash' },
  { label: 'Credit', value: 'credit' },
  { label: 'Debit', value: 'debit' },
  { label: 'Bank', value: 'bank' },
  { label: 'Digital Payment', value: 'digital_payment' },
  { label: 'QRIS', value: 'qris' },
  { label: 'Paylater', value: 'paylater' },
])

const columns: QTableProps['columns'] = [
  {
    name: 'name',
    align: 'center',
    label: 'Product',
    field: 'name',
    sortable: true
  },
  {
    name: 'quantity',
    align: 'center',
    label: 'Quantity',
    field: 'quantity',
    sortable: true
  },
  {
    name: 'price',
    align: 'center',
    label: 'Price',
    field: 'price',
    sortable: true
  },
  {
    name: 'action',
    align: 'center',
    label: 'Action',
    field: 'action',
    sortable: false
  },
]

/*
template standar data :
listOfCart.value.push({
  id: getdata.id,
  name: getdata.name,
  description: getdata.description,
  category_id: getdata.category_id,
  supplier_id: getdata.supplier_id,
  quantity: select.total_product + getold[0].quantity,
  barcode: getdata.barcode,
  original_price: getdata.price,
  price: convertIDR(getdata.price * (getold[0].quantity + select.total_product))
});
*/

const carts = ref<setProduct[]>([])

const listCust = ref([{ label:'-- Select customer --', value: 0 }])
const page = ref(1)
const lastPage = ref(false)
const currentSearch = ref('')
const temp = ref([{ label:'-- Select customer --', value: 0 }])

const filterCust = (
  val: string,
  update: (fn: () => void) => void
) => {
  update(() => {
    if (val === '') {
      listCust.value = [...temp.value]
    } else if (val.length >=3) {
      void searchCust(val)
    }
  })
}

const searchCust = async (val: string) => {
  if (val.toLowerCase() == currentSearch.value && lastPage.value == true) {
    console.log('udah mentok weh')
  } else {
    if(val != currentSearch.value) {
      form.customer_id = ''
      currentSearch.value = val
      page.value = 1
      lastPage.value = false
      listCust.value = [...temp.value]
    }
    const url = `${endPoint.value}customer/?limit=10&page=${page.value}&search=${val}`
    const res = await fetch(url , {
      method: 'GET'
    })
    const catchData = await res.json()
    if(catchData.status < 200 && catchData.status >= 300) {
      console.log(catchData);
    } else {
      const getdata = catchData.data;
      if(getdata.length != 0) {
        page.value = page.value + 1
      } else {
        lastPage.value = true
      }
      for(let x = 0; x < getdata.length; x++) {
        listCust.value.push({
          label: getdata[x].name,
          value: getdata[x].id
        })
      }
    }
  }
}

const filterProduct = (
  val: string,
  update: (fn: () => void) => void
) => {
  update(() => {
    if (val === '') {
      listCust.value = [...temp.value]
    } else if (val.length >=3) {
      void searchProduct(val)
    }
  })
}

const searchProduct = async (val: string) => {
  if (val.toLowerCase() == currentSearch.value && lastPage.value == true) {
    console.log('udah mentok weh')
  } else {
    if(val != currentProd.value) {
      select.choose_product = 0
      select.total_product = 0
      currentProd.value = val
      pageProd.value = 1
      lastPageProd.value = false
      select.list_product = [...tempProd.value]
    }
    const url = `${endPoint.value}product/?limit=10&page=${pageProd.value}&search=${val}&is_sale=1`
    const res = await fetch(url , {
      method: 'GET'
    })
    const catchData = await res.json()
    if(catchData.status < 200 && catchData.status >= 300) {
      console.log(catchData);
    } else {
      const getdata = catchData.data;
      if(getdata.length != 0) {
        pageProd.value = pageProd.value + 1
      } else {
        lastPageProd.value = true
        if(scanning.value == true) {
          showNotFound.value = true
        }
      }
      if(scanning.value == true) {
        select.list_product = [];
        select.list_product.push({
          name: getdata[0].name,
          id: getdata[0].id,
          description: getdata[0].description,
          quantity: getdata[0].quantity,
          barcode: getdata[0].barcode,
          original_price: getdata[0].price,
          price: ''
        })
        maxStock.value = getdata[0].quantity
      } else {
        for(let x = 0; x < getdata.length; x++) {
          select.list_product.push({
            name: getdata[x].name,
            id: getdata[x].id,
            description: getdata[x].description,
            quantity: getdata[x].quantity,
            barcode: getdata[x].barcode,
            original_price: getdata[x].price,
            price: ''
          })
        }
      }
    }
  }
}

const addToCart = () => {
  // aneh banget !! malah jadi object ???
  const product = JSON.parse(JSON.stringify(select.choose_product)) 
  const total = select.total_product
  const checkProduct = carts.value.filter((data) => data.id == product.id)
  const getdata = select.list_product.find((data) => data.id == product.id)
  if(checkProduct.length == 0) {
    carts.value.push({
      id: product.id,
      name: getdata?.name ?? '',
      description: getdata?.description ?? '',
      quantity: total,
      barcode: getdata?.barcode ?? '',
      original_price: getdata?.original_price ?? 0,
      price: formatIDR(total * (getdata?.original_price??0))
    })
    select.origin_total = select.origin_total + (total * (getdata?.original_price??0))
    select.show_total = formatIDR(select.origin_total)
  } else {
    select.origin_total = select.origin_total - ((checkProduct[0]?.original_price??0) * (checkProduct[0]?.quantity??0))
    const filterhapus = carts.value.filter((data) => data.id != product.id)
    const currentQuantity = checkProduct[0]?.quantity ?? 0
    carts.value = filterhapus
    carts.value.push({
      id: product.id,
      name: getdata?.name ?? '',
      description: getdata?.description ?? '',
      quantity: total,
      barcode: getdata?.barcode ?? '',
      original_price: getdata?.original_price ?? 0,
      price: formatIDR((total + currentQuantity) * (getdata?.original_price??0))
    })
    select.origin_total = select.origin_total + (total * (getdata?.original_price??0))
    select.show_total = formatIDR(select.origin_total)
  }
  select.disabled_pay = false
  // select.choose_product = 0
  // select.total_product = 0
  // select.list_product = [...tempProd.value]
}

const onScroll = ({ to }: { to: number }, type: string) => {
  if (to >= listCust.value.length - 1) {
    if (type === 'product') {
      void searchCust(currentSearch.value)
    } else if (type === 'customer') {
      void searchCust(currentSearch.value) 
    }
  }
}

const formatIDR = (value: number) => {
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(value)
}

const deleteItem = (id: number) => {
  const getdata = carts.value.filter((loop) => loop.id == id)
  select.origin_total = select.origin_total - ((getdata[0]?.original_price??0) * (getdata[0]?.quantity??0))
  select.show_total = formatIDR(select.origin_total)
  carts.value = carts.value.filter((loop) => loop.id != id)
  if(carts.value.length == 0) {
    select.disabled_pay = true
  }
}

const ITEM_HEIGHT = 48
const selectList = computed(() => {
  return listPayment.value.length > 5
    ? { style: `max-height: ${ITEM_HEIGHT * 5}px; overflow-y: auto;` }
    : {}
})

const startScan = async (): Promise<void> => {
  if (scanning.value) return

  try {
    showNotFound.value = false
    scanning.value = true
    error.value = ''
    resultText.value = ''
    rawData.value = ''
    setCamera.value = 'camera-area';

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
        setCamera.value = 'camera-area-steady';
        void searchProduct(resultText.value)

        void stopScan()
      },
    )

    errorListener = await BarcodeScanner.addListener(
      'scanError',
      (err) => {
        error.value = err.message
        errorLog.value.push(err.message)
        setCamera.value = 'camera-area-steady';
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
    setCamera.value = 'camera-area-steady';
  }
}

const stopScan = async (): Promise<void> => {
  try {
    await BarcodeScanner.stopScan()
    setCamera.value = 'camera-area-steady';
    // await BarcodeScanner.showBackground()

    await barcodeListener?.remove()
    await errorListener?.remove()

    barcodeListener = null
    errorListener = null
  } finally {
    scanning.value = false
  }
}

const payPrice = async () => {
  form.sale_date = new Date(form.sale_date).toISOString()
  form.total_amount = select.origin_total
  for(let x = 0; x < carts.value.length; x++) {
    if(carts.value[x]?.id??0 != 0) {
      form.list.push({
        product_id: carts.value[x]?.id??0,
        price: (carts.value[x]?.original_price??0) * (carts.value[x]?.quantity??0),
        quantity: parseInt(carts.value[x]?.quantity.toString()??'0')
      })
    }
  }

  let is_done = false
  try {
    const url = `${endPoint.value}sales/create-to-many/`
    const res = await fetch(url , {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const catchData = await res.json()
    if(catchData.status < 200 && catchData.status >= 300) {
      console.log(catchData);
    } else {
      const getdata = catchData.data;
      for(let x = 0; x < getdata.length; x++) {
        listCust.value.push({
          label: getdata[x].name,
          value: getdata[x].id
        })
      }
      is_done = true
    }
  } catch (error) {
    console.error('Error fetching data : ', error);
  } finally {
    console.log('Done')
    if(is_done == true) {
      await router.push({ name:'home' })
    }
  }
}

// const loadData = async () => {
//   try {
//     const url = `${endPoint.value}customer/'
//     const res = await fetch(url , {
//       method: 'GET'
//     })
//     const catchData = await res.json()
//     if(catchData.success != "All of data") {
//       console.log(catchData);
//     } else {
//       const getdata = catchData.data;
//       for(let x = 0; x < getdata.length; x++) {
//         listCust.value.push({
//           label: getdata[x].name,
//           value: getdata[x].id
//         })
//       }
//     }
//   } catch (error) {
//     console.error('Error fetching data : ', error);
//   } finally {
//     console.log('Done')
//   }
// }

onUnmounted(() => {
  void stopScan()
})

// onMounted(() => {
//   // void loadData()
// })

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

.centered {
  position: absolute;
  top: 12%;
  color: #ffffff;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Camera visible area */
.camera-area {
  height: 30vh;
  background: transparent;
}

.camera-area-steady {
  height: 30vh;
  background: #2b12c5;
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
