<template>
  <IndexWeb :openSidebar="sidebarOpen" @update:openSidebar="sidebarOpen = $event">
    <div class="title-card">
        {{ (userId == 'new' ? 'Create new data' : 'Detail data transaction: ' + form.name) }}
    </div>
    <div class="body-card">
        <div class="floating-container">
            <input type="text" v-model="form.name" class="floating-input" placeholder=" " disabled/>
            <label class="floating-input-label">Name</label>
        </div>
        <div class="floating-container">
            <input type="datetime-local" v-model="form.sale_date" class="floating-input" placeholder=" " disabled/>
            <label class="floating-input-label">Sale Date</label>
        </div>
        <div class="floating-container">
            <input type="text" v-model="form.payment_method" class="floating-input" placeholder=" " disabled/>
            <label class="floating-input-label">Payment Method</label>
        </div>
        <div class="floating-container">
            <input type="text" v-model="form.bank_transaction_no" class="floating-input" placeholder=" " disabled/>
            <label class="floating-input-label">Bank Reference</label>
        </div>
        <div class="floating-container">
            <input type="text" v-model="form.customer_name" class="floating-input" placeholder=" " disabled/>
            <label class="floating-input-label">Customer Name</label>
        </div>
        <div class="floating-container">
            <input type="text" v-model="form.total_amount" class="floating-input" placeholder=" " disabled/>
            <label class="floating-input-label">Total</label>
        </div>
        <div class="p-2">
          <label>List</label>
        </div>
        <EasyDataTable
        table-class-name="admin-table"
        :headers="headers"
        :items="child"
        :rows-per-page="10"
        show-filter
        show-index
      >
      </EasyDataTable>
      <div class="flex justify-between gap-4 pt-20">
          <div>
              <NuxtLink to="/sales/" class="button-danger">Back</NuxtLink>
          </div>
          <div>
            <!-- <a @click="submitForm()" purpose="button" class="button-primary">Submit</a> -->
          </div>
      </div>
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
const userId = route.params.id
const today = new Date()
const error = ref(null)

const category = ref([])
const supp = ref([])
const child = ref([])
const parent = ref({})
const form = reactive({
  name: '',
  payment_method: '',
  customer_id: '',
  total_amount: '',
  customer_name: '',
  sale_date: '',
  bank_transaction_no: '',
})



const headers = [
  { text: 'Product', value: 'product_name', sortable: true, filterable: true },
  { text: 'Quantity', value: 'quantity', sortable: true, filterable: true },
  { text: 'Price', value: 'price', sortable: true, filterable: true },
]

async function loadData() {
  const res = await fetch(endPoint + 'category/')
  const catchData = await res.json()
  category.value = catchData.data
  const resSup = await fetch(endPoint + 'supplier/')
  const catchDataSup = await resSup.json()
  supp.value = catchDataSup.data
  const resSales = await fetch(endPoint + 'sales/' + userId)
  const catchDataSales = await resSales.json()
  child.value = catchDataSales.list
  parent.value = catchDataSales.sales
  form.name = catchDataSales.sales.name
  form.customer_id = catchDataSales.sales.customer_id
  form.sale_date = catchDataSales.sales.sale_date.replace(" ","T").substring(0, 16)
  form.total_amount = catchDataSales.sales.total_amount
  form.payment_method = catchDataSales.sales.payment_method
  form.customer_name = catchDataSales.sales.customer_name
}

onMounted(async () => {
  try {
    await loadData();
  } catch (err) {
    error.value = err
  } finally {
    console.log('load')
  }
})

// const formatDate = (date) => {
//   return date.toISOString().split('T')[0]
// }


// const maxDate = ref(formatDate(today))

// const minDate = ref(formatDate(new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())))

// if(userId != 'new') {
//   try {
//     const res = await fetch(endPoint + 'product/' + userId)
//     const catchData = await res.json()
//     form.category_id = catchData.data.category_id
//     form.supplier_id = catchData.data.supplier_id
//     form.description = catchData.data.description
//     form.name = catchData.data.name
//   } catch (err) {
//     console.log(err)
//   } finally {
//     console.log('Api successfully loaded')
//   }
// }


// // Form submission
// const submitForm = async () => {
//   let required = true;
//   const sendGrap = {}
//   if(form.category_id.length != 0 ) {
//     sendGrap.category_id = form.category_id
//   } else {
//     required = false;
//   }
//   if(form.supplier_id.length != 0 ) {
//     sendGrap.supplier_id = form.supplier_id
//   } else {
//     required = false;
//   }
//   if(form.description.length != 0 ) {
//     sendGrap.description = form.description
//   } else {
//     required = false;
//   }
//   if(form.name.length != 0 ) {
//     sendGrap.name = form.name
//   } else {
//     required = false;
//   }
  
//   if(required == false) {
//     alert('All Field is Required !!');
//   } else {
//     console.log(endPoint + 'product' + (userId.replaceAll('\s','') != 'new' ? '/' + userId: '/'))
//     const res = await $fetch(endPoint + 'product' + (userId.replaceAll('\s','') != 'new' ? '/' + userId: '/'), {
//       method: (userId.length != 0  && userId != 'new' ? 'PATCH' : 'POST'),
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(sendGrap)
//     }).then((response) => {
//       if(response != null && response != undefined) {
//         router.push('/products/')
//       } else {
//         console.log('error');
//         console.log(response);
//       }
//     }).catch((error) => {
//       console.log(error);
//     }).finally(() => {
//       console.log('ℹ️ api successfully ran')
//     });
//   }
  

// }
</script>