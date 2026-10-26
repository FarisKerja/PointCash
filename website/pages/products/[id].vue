<template>
  <IndexWeb :openSidebar="sidebarOpen" @update:openSidebar="sidebarOpen = $event">
    <div class="title-card">
        {{ (userId == 'new' ? 'Create new data' : 'Edit data: ' + form.name) }}
    </div>
    <div class="body-card">
        <div class="floating-container">
            <input type="text" v-model="form.name" class="floating-input" placeholder=" "/>
            <label class="floating-input-label">Name</label>
        </div>
        <div class="floating-container">
          <select v-model="form.category_id" class="floating-select" required>
            <option v-for="(value, index) in category" :key="index" :value="value.id">{{ value.name }}</option>
          </select>
          <label class="floating-select-label">Category</label>
        </div>
        <div class="floating-container">
            <select v-model="form.supplier_id" class="floating-select" required>
                <option v-for="(value, index) in supp" :key="index" :value="value.id">{{ value.name }}</option>
            </select>
            <label class="floating-select-label">Supplier</label>
        </div>
        <div class="floating-container">
            <input type="number" v-model="form.price" min="1" class="floating-input" placeholder=" "/>
            <label class="floating-input-label">Price</label>
        </div>
        <div class="floating-container">
            <input type="text" v-model="form.barcode" class="floating-input" placeholder=" "/>
            <label class="floating-input-label">Barcode</label>
        </div>
        <div class="floating-container">
            <textarea class="floating-input" rows="5" v-model="form.description" placeholder=" "></textarea>
            <label class="floating-input-label">About</label>
        </div>
        <div class="flex justify-between gap-4 pt-20">
            <div>
                <NuxtLink to="/products/" class="button-danger">Back</NuxtLink>
            </div>
            <div>
              <a @click="submitForm()" purpose="button" class="button-primary">Submit</a>
            </div>
        </div>
    </div>
  </IndexWeb>
</template>

<script setup>
import IndexWeb from '~/components/navigations/IndexWeb.vue'
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

const category = ref([])
const supp = ref([])

async function loadData() {
  const res = await fetch(endPoint + 'category/')
  const catchData = await res.json()
  category.value = catchData.data
  const resSup = await fetch(endPoint + 'supplier/')
  const catchDataSup = await resSup.json()
  supp.value = catchDataSup.data
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

const formatDate = (date) => {
  return date.toISOString().split('T')[0]
}


const maxDate = ref(formatDate(today))

const minDate = ref(formatDate(new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())))

const form = reactive({
  category_id: '',
  supplier_id: '',
  description: '',
  name: '',
  price: '',
  barcode: '',
})

if(userId != 'new') {
  try {
    const res = await fetch(endPoint + 'product/' + userId)
    const catchData = await res.json()
    form.category_id = catchData.data.category_id
    form.supplier_id = catchData.data.supplier_id
    form.description = catchData.data.description
    form.name = catchData.data.name
    form.price = catchData.data.price
    form.barcode = catchData.data.barcode
  } catch (err) {
    console.log(err)
  } finally {
    console.log('Api successfully loaded')
  }
}


// Form submission
const submitForm = async () => {
  let required = true;
  const sendGrap = {}
  if(form.category_id.length != 0 ) {
    sendGrap.category_id = form.category_id
  } else {
    required = false;
  }
  if(form.supplier_id.length != 0 ) {
    sendGrap.supplier_id = form.supplier_id
  } else {
    required = false;
  }
  if(form.description.length != 0 ) {
    sendGrap.description = form.description
  } else {
    required = false;
  }
  if(form.name.length != 0 ) {
    sendGrap.name = form.name
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
    console.log(endPoint + 'product' + (userId.replaceAll('\s','') != 'new' ? '/' + userId: '/'))
    const res = await $fetch(endPoint + 'product' + (userId.replaceAll('\s','') != 'new' ? '/' + userId: '/'), {
      method: (userId.length != 0  && userId != 'new' ? 'PATCH' : 'POST'),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sendGrap)
    }).then((response) => {
      if(response != null && response != undefined) {
        router.push('/products/')
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