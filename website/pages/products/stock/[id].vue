<template>
  <IndexWeb :openSidebar="sidebarOpen" @update:openSidebar="sidebarOpen = $event">
    <div class="title-card">
      Input stock of product
    </div>
    <div class="body-card">
        <div class="floating-container">
            <input type="text" v-model="form.barcode" class="floating-input" placeholder=" "/>
            <label class="floating-input-label">Barcode</label>
        </div>
        <div class="floating-container">
            <input type="datetime-local" :min="minDate" v-model="form.expiration_date" class="floating-input" placeholder=" "/>
            <label class="floating-input-label">Expiration of Product</label>
        </div>
        <div class="floating-container">
            <input type="number" v-model="form.qty_received"  min="0" class="floating-input" placeholder=" "/>
            <label class="floating-input-label">Total Receive of Product</label>
        </div>
        <div class="floating-container">
            <input type="number" v-model="form.qty_damaged" min="0" class="floating-input" placeholder=" "/>
            <label class="floating-input-label">Total Product got damaged</label>
        </div>
        <div class="floating-container">
            <input type="number" v-model="form.qty_stolen" min="0" class="floating-input" placeholder=" "/>
            <label class="floating-input-label">Total Product got Stolen</label>
        </div>
        <div class="floating-container">
            <input type="number" v-model="form.qty_adjusted" min="0" class="floating-input" placeholder=" "/>
            <label class="floating-input-label">Total stock opname</label>
        </div>
        <div class="flex justify-between gap-4 pt-20">
            <div>
            <!-- <NuxtLink @click="() => navigateTo(`/products/`)" class="button-danger">Back</NuxtLink> -->
            </div>
            <div>
              <a @click="submitForm()" purpose="button" class="button-primary">Submit</a>
            </div>
        </div>
    </div>
    <br>
    <div class="w-3/4 title-card-gen">
      Stock
    </div>
    <div class="w-3/4 body-card-gen pt-6">
      <EasyDataTable
          table-class-name="admin-table"
          :headers="headers"
          :items="data"
          :rows-per-page="10"
          show-index
        >
           <template #item-actions="row">
            <div class="flex gap-2">
              <button class="button-sm-danger" @click="deleteData(row.name, row.id)"><Icon name="material-symbols:delete-outline" class="w-4 h-3"></Icon></button>
               <!-- apa musti pake v-bind kali ya ??? --
              <button class="button-sm-danger" @click.stop.prevent="() => danger.open(row.id, row.name, endPoint + 'product', '/products/')"><Icon name="material-symbols:delete" class="w-4 h-3"></Icon></button> -->
            </div>
           </template>
        </EasyDataTable>
    </div>
  </IndexWeb>
</template>

<script setup>
import IndexWeb from '~/components/navigations/IndexWeb.vue'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();

const route = useRoute()
const router = useRouter()
const endPoint = config.public.golangREST;
const sidebarOpen = ref(true)
// Access path param
const productId = route.params.id
const today = new Date()

const data = ref([])
const loading = ref(false)
const error = ref(null)

/*
  int64 id = 1;
  string expiration_date = 2; // nullable
  string batch_code = 3;
  int64 qty_received = 4;
  int64 qty_sold = 5;
  int64 qty_damaged = 6;
  int64 qty_stolen = 7;
  int64 qty_expired = 8;
  int64 qty_adjusted = 9;
  google.protobuf.Timestamp created_at = 10;
  google.protobuf.Timestamp updated_at = 11;
  google.protobuf.Timestamp deleted_at = 12;
  string created_by = 13;
  string updated_by = 14;
  string deleted_by = 15;
  int64 product_id = 16;
*/
const headers = [
  { text: 'Barcode', value: 'batch_code', sortable: true, filterable: true },
  { text: 'Expiration Date', value: 'expiration_date', sortable: true, filterable: true },
  { text: 'Receive', value: 'qty_received', sortable: true, filterable: true },
  { text: 'Sold', value: 'qty_sold', sortable: true, filterable: true },
  { text: 'Stolen', value: 'qty_stolen', sortable: true, filterable: true },
  { text: 'Expired', value: 'qty_expired', sortable: true, filterable: true },
  { text: 'Damaged', value: 'qty_damaged', sortable: true, filterable: true },
  { text: 'Stock Opname', value: 'qty_adjusted', sortable: true, filterable: true },
  { text: 'Actions', value: 'actions' }
]

async function loadData() {
  console.log('masuk load data')
  const res = await fetch(endPoint + 'product-batch/?product_id='+productId)
  const catchData = await res.json()
  data.value = catchData.data.map(item => ({
    ...item,
    qty_received: item.qty_received ?? 0,
    qty_sold: item.qty_sold ?? 0,
    qty_stolen: item.qty_stolen ?? 0,
    qty_expired: item.qty_expired ?? 0,
    qty_damaged: item.qty_damaged ?? 0,
    qty_adjusted: item.qty_adjusted ?? 0,
  }))
}

try {
  await loadData();
  loading.value = true
} catch (err) {
  error.value = err
  loading.value = false
} finally {
  console.log('DONE')
}

const formatDate = (date) => {
  return date.toISOString().split('T')[0]
}


// const minDate = ref(formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate())))
const minDate = ref(new Date(today.getFullYear(), today.getMonth(), today.getDate()))

const form = reactive({
  product_id: productId,
  batch_code: '',
  expiration_date: '',
  qty_received: 0,
  qty_sold: 0,
  qty_stolen: 0,
  qty_expired: 0,
  qty_damaged: 0,
  qty_adjusted: 0,
})

// Form submission
const submitForm = async () => {
  let required = true;
  const sendGrap = {}
  if(form.batch_code.length != 0 ) {
    sendGrap.batch_code = form.batch_code
  } else {
    required = false;
  }
  if(form.price > 0 ) {
    sendGrap.price = form.price
  } else {
    required = false;
  }
  if(form.barcode.length != 0 ) {
    sendGrap.barcode = form.barcode
  } else {
    required = false;
  }
  
  if(required == false) {
    alert('All Field is Required !!');
  } else {
    const res = await $fetch((endPoint + 'product-batch/'), {
      method: (productId.length != 0  && productId != 'new' ? 'PATCH' : 'POST'),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sendGrap)
    }).then((response) => {
      if(response != null && response != undefined) {
        data.value.push(sendGrap)
      } else {
        console.log('error');
        console.log(response);
      }
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      console.log('ℹ️ api successfully ran')
    });
  }
  

}
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
