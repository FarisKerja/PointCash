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
            <input type="text" v-model="form.description" class="floating-input" placeholder=" "/>
            <label class="floating-input-label">Description</label>
        </div>
        <div class="flex justify-between gap-4 pt-20">
            <div>
                <NuxtLink to="/category/" class="button-danger">Back</NuxtLink>
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
const graphqlEndpoint = config.public.nestGRAPH;
const endPoint = config.public.golangREST;
const sidebarOpen = ref(true)
// Access path param
const userId = route.params.id
const today = new Date()

const formatDate = (date) => {
  return date.toISOString().split('T')[0]
}


const maxDate = ref(formatDate(today))

const minDate = ref(formatDate(new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())))

const form = reactive({
  name: '',
  description: '',
})

if(userId.length != 0  && userId != 'new') {
  try {
    const res = await fetch(endPoint + 'category/' + userId)
    const catchData = await res.json()
    form.name = catchData.data.name
    form.description = catchData.data.description
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
  if(form.name.length != 0 ) {
    sendGrap.name = form.name
  } else {
    required = false;
  }
  if(form.description.length != 0 ) {
    sendGrap.description = form.description
  } else {
    required = false;
  }
  
  if(required == false) {
    alert('All Field is Required !!');
  } else {
    const res = await $fetch(endPoint + 'category' + (userId.length != 0  && userId.replaceAll('\s','') != 'new' ? '/' + userId: '/'), {
      method: (userId.length != 0  && userId != 'new' ? 'PATCH' : 'POST'),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sendGrap)
    }).then((response) => {
      if(response != null && response != undefined) {
        router.push('/category/')
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