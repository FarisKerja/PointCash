<template>
  <IndexWeb :openSidebar="sidebarOpen" @update:openSidebar="sidebarOpen = $event">
    <div class="title-card">
        Create new data
    </div>
    <div class="body-card">
        <div class="floating-container">
            <input type="datetime-local" v-model="form.sale_date" class="floating-input" placeholder=" " disabled/>
            <label class="floating-input-label">Sale Date</label>
        </div>
        <div class="floating-container">
          <select v-model="form.payment_method" class="floating-select" required>
            <option v-for="setname in listPayment" :key="setname" :value="setname">{{ setname.replaceAll("_", " ").split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') }}</option>
          </select>
          <label class="floating-select-label">Payment Methods</label>
        </div>
        <div v-if="form.payment_method !== 'cash'" class="floating-container">
            <input type="text" v-model="form.bank_transaction_no" class="floating-input" placeholder=" " />
            <label class="floating-input-label">Bank Transaction Reference</label>
        </div>
        <div class="floating-container">
            <div class="flex justify-between pt-2 gap-4">
              <div class="w-full">
                <input type="text" @input="handleInputCustomer" v-model="select.customer_name" class="w-1/2 floating-input" placeholder=" " />
              </div>
              <div class="w-full">
                <select class="floating-select text-center">
                  <option v-for="key in cust" :key="key" :value="key.id">{{ key.name }}</option>
                </select>
              </div>
            </div>
            <label class="floating-input-label">Customer Name</label>
            <small class="text-gray-500">this is optional. search customer name first before choose data</small>
        </div>
        <div class="floating-container">
          <input type="text" :value="convertIDR(form.total_amount)" class="floating-input" placeholder=" " disabled/>
          <label class="floating-input-label">Total</label>
        </div>
        <div class="floating-container">
          <input type="text" @input="handleInputProduct" v-model="select.name" class="floating-input" placeholder=" " />
          <label class="floating-input-label">Search Product</label>
        </div>
        <div class="floating-container">
          <div class="flex justify-between pt-2 gap-4">
            <div class="w-full">
              <select class="floating-select text-center" v-model="select.choose_product" @change="settotable">
                <option v-for="key in product" :key="key" :value="key.id">{{ (key.id != 0 ? key.barcode + " | " : "") }}{{ key.name }}</option>
              </select>
            </div>
            <div class="w-full">
              <input type="number" @change="settotable" v-model="select.total_product" min="1" class="floating-input" placeholder=" " />
            </div>
          </div>
          <label class="floating-input-label">Total Quantity of Product</label>
          <small v-if="errorValidation.product.length != 0" class="text-red-500">{{ errorValidation.product }}</small>
        </div>
        <EasyDataTable
        table-class-name="admin-table"
        :headers="headers"
        :items="listOfCart"
        :rows-per-page="10"
        show-filter
        show-index
      >
        <template #item-actions="row">
            <div class="flex gap-2">
              <button class="button-sm-danger" @click="deleteData(row.product_id)"><Icon name="material-symbols:delete" class="w-4 h-3"></Icon></button>
            </div>
          </template>
      </EasyDataTable>
      <div class="flex justify-between gap-4 pt-20">
          <div>
              <NuxtLink to="/sales/" class="button-danger">Back</NuxtLink>
          </div>
          <div>
            <a @click="submitForm()" purpose="button" class="button-primary">Pay</a>
          </div>
      </div>
    </div>
  </IndexWeb>
</template>

<script setup>
import IndexWeb from '~/components/navigations/IndexWeb.vue'
import { ref, watch, onBeforeUnmount } from 'vue'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig } from '#app';
import { list } from 'postcss'

const config = useRuntimeConfig();

const route = useRoute()
const router = useRouter()
const endPoint = config.public.golangREST;
const sidebarOpen = ref(true)
const userId = route.params.id
const error = ref(null)
const listPayment = ref([
'cash',
'credit',
'debit',
'bank',
'digital_payment',
'qris',
'paylater',
])
let idleTimer = null
const IDLE_TIME = 2000

const category = ref([])
const cust = ref([
  {
    id:0,
    name:"-- select customer --"
  }
])
const product = ref([
  {
    id:0,
    name:"-- select product --"
  }
])
const listOfCart = ref([])
const cartToApi = ref([])

const newdate = new Date();
const plus = new Date(newdate.setHours(newdate.getHours() + 7));
const form = reactive({
  name: '',
  payment_method: 'cash',
  customer_id: 0,
  total_amount: 0,
  sale_date: plus.toISOString().split("T")[0] + ' ' + plus.toISOString().split("T")[1].split(".")[0],
  bank_transaction_no: ''
})

const errorValidation = reactive({
  total_amount:'',
  cart:'',
  product:'',
})

const select = reactive({
  customer_name: '',
  name: '',
  choose_product:0,
  total_product: 0,
  show_total: 'Rp 0',
})

const headers = [
  { text: 'Product', value: 'name', sortable: true, filterable: true },
  { text: 'Quantity', value: 'quantity', sortable: true, filterable: true },
  { text: 'Price', value: 'price', sortable: true, filterable: true },
  { text: 'Actions', value: 'actions' }
]

async function loadData() {
  const res = await fetch(endPoint + 'category/')
  const catchData = await res.json()
  category.value = catchData.data
//   const resSales = await fetch(endPoint + 'sales/' + userId)
//   const catchDataSales = await resSales.json()
//   listOfCart.value = catchDataSales.list
//   parent.value = catchDataSales.sales
}

onMounted(async () => {
  try {
    await loadData();
    // form.show_total = await convertIDR(form.total_amount)
  } catch (err) {
    console.log(err)
    error.value = err
  } finally {
    console.log('load')
  }
})

const convertIDR = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

const handleInputCustomer = () => {
  if (idleTimer) clearTimeout(idleTimer)

  idleTimer = setTimeout(async () => {
    if (select.customer_name != '' && select.customer_name.length >= 3) {
      //lakukan api disini untuk get data customer berdasarkan nama product
      const rescust = await fetch(endPoint + 'customer/?search='+select.customer_name)
      const catchDatacust = await rescust.json()
      if(catchproduct.data != null) {
        cust.value = [...[{ id: 0, name: "-- select customer --" }], ...catchDatacust.data];
      } else {
        cust.value = [{ id: 0, name: "-- select customer --" }]
      }
    }
  }, IDLE_TIME)
}

const handleInputProduct = () => {
  if (idleTimer) clearTimeout(idleTimer)

  idleTimer = setTimeout(async () => {
    if (select.name != '' && select.name.length >= 3) {
      //lakukan api disini untuk get data customer berdasarkan nama product
      const resproduct = await fetch(endPoint + 'product/?is_sale=1&search='+select.name)
      const catchproduct = await resproduct.json();
      if(catchproduct.data != null) {
        product.value = [...[{ id:0, name:"-- select product --"  }], ...catchproduct.data];
      } else {
        product.value = [{ id:0, name:"-- select product --"  }]
      }
    }
  }, IDLE_TIME)
}

const settotable = async () => {
  if(select.choose_product != 0)
  {
    const getdata = product.value.find((data) => data.id === select.choose_product)
    if(select.total_product >= 1 && getdata.name != undefined)
    {
      /*
      flow : 
      1. cek data exist dulu
      2. cek total qty
      3. kalo 1, langsung masukkan seperti biasa
      4. kalo kagak, cek dulu di array cart dan api
      5. abis tuh, masukkin semua yang ada di api berdasarkan qty dan ambil yang paling terbaru aja
      6. masukkan seperti biasa

      note = udah pasti kena stock opname !!
      */
      const getold = listOfCart.value.filter((lists) => lists.name == getdata.name)
      if(getold.length == 0) {
        if(select.total_product > getdata.quantity) {
          errorValidation.product = 'Sorry. we dont have no more stock for this product'
        } else {
          form.total_amount = form.total_amount + (select.total_product * getdata.price);
          listOfCart.value.push({
            id: getdata.id,
            name: getdata.name,
            description: getdata.description,
            category_id: getdata.category_id,
            supplier_id: getdata.supplier_id,
            quantity: select.total_product,
            barcode: getdata.barcode,
            original_price: getdata.price,
            price: convertIDR(getdata.price * select.total_product)
          });
        }    
      } else {
        if(select.total_product + getold[0].quantity > getdata.quantity) {
          errorValidation.product = 'Sorry. we dont have no more stock for this product'
        } else {
          const filterHapus = listOfCart.value.filter((lists) => lists.name != getdata.name);
          listOfCart.value = filterHapus;
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
          form.total_amount = form.total_amount + (select.total_product * getdata.price)
        }
      }

      // cartToApi.value.push(getdata);
      // if(getold.length == 0)
      // {
      //   getdata.quantity = 1;
      //   form.total_amount = form.total_amount + getdata.price;
      //   getdata.price = convertIDR(getdata.price);
      //   listOfCart.value.push(getdata);
      // }
      // else
      // {
      //   const filterHapus = listOfCart.value.filter((lists) => lists.name != getdata.name);
      //   getdata.quantity = select.total_product + getold[0].quantity;
      //   getdata.price = convertIDR(getdata.quantity * getdata.price);
      //   form.total_amount = form.total_amount + (getdata.quantity * getdata.price);
      //   filterHapus.value.push(getdata)
      //   listOfCart.value = filterHapus;
      // }
      // select.show_total = convertIDR(form.total_amount);
      select.choose_product = 0;
      select.total_product = 0;
    }
  }
}

onBeforeUnmount(() => {
  if (idleTimer) clearTimeout(idleTimer)
})

const deleteData = (id) => {
  const data = listOfCart.value.find((lists) => lists.product_id == id);
  form.total_amount = form.total_amount - (data.quantity * data.price)
  // select.show_total = convertIDR(form.total_amount)
  const hapusDataDiCart = listOfCart.value.filter((lists) => lists.product_id != id)
  listOfCart.value = hapusDataDiCart;
}

// const formatDate = (date) => {
//   return date.toISOString().split('T')[0]
// }

const submitForm = async () => {
  if(form.total_amount == 0) {
    errorValidation.total_amount = "Need item to buy";
    required = false;
  } else {
    errorValidation.total_amount = "";
  }
  
  const sendApi = {
    "list": [
      {
        "price": 0,
        "product_item_id": 0,
        "quantity": 0
      }
    ],
    "payment_method": form.payment_method,
    "sale_date": form.sale_date,
    "total_amount": form.total_amount
  }

  if(form.payment_method != 'cash') {
    sendApi.bank_transaction_no = form.bank_transaction_no;
  }

  if(form.customer_id != 0) {
    sendApi.customer_id = form.customer_id;
  }

  sendApi.sale_date = new Date(sendApi.sale_date)
  let setList = [];
  const cart = listOfCart.value;
  for(let x = 0; x < listOfCart.value.length; x++) {
    setList.push({
      price: cart[x].original_price * cart[x].quantity,
      product_id: cart[x].id,
      quantity: cart[x].quantity
    })
  }
  sendApi.list = setList
  const res = await $fetch(endPoint + 'sales/create-to-many/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sendApi)
    }).then((response) => {
      if(response != null && response != undefined) {
        router.push('/sales/')
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