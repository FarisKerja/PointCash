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
            <input type="number" v-model="form.phone" min="80000000" max="9999999999999999" class="floating-input" placeholder=" "/>
            <label class="floating-input-label">Phone</label>
        </div>
        <div class="floating-container">
            <input type="email" v-model="form.email" class="floating-input" placeholder=" "/>
            <label class="floating-input-label">Email</label>
        </div>
        <div class="floating-container">
            <input type="number" v-model="form.ktp" min="1000000000000000" max="9999999999999999" class="floating-input" placeholder=" "/>
            <label class="floating-input-label">Identity Card</label>
        </div>
        <div class="floating-container">
            <input type="date" v-model="form.birthDate" :min="minDate" :max="maxDate" class="floating-input" placeholder=" "/>
            <label class="floating-input-label">Birth of Date</label>
        </div>
        <div v-if="userId !== 'new'" class="floating-container">
          <select v-model="form.status" class="floating-select" required>
            <option value="1">Active</option>
            <option value="0">Non-active</option>
          </select>
          <label class="floating-select-label">Status</label>
        </div>
        <div v-if="userId !== 'new'" class="floating-container">
          <select v-model="form.role" class="floating-select" required>
            <option value="cashier">Cashier</option>
            <option value="owner">Owner</option>
          </select>
          <label class="floating-select-label">Role</label>
        </div>
        <div class="flex justify-between gap-4 pt-20">
            <div>
                <NuxtLink to="/users/" class="button-danger">Back</NuxtLink>
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
  birthDate: '',
  email: '',
  phone: '',
  ktp: '',
  role: 'cashier',
  name: '',
  status: (userId == 'new' ? 1 : 0)
})

if(userId != 'new') {
  try {
    const res = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query {
          detailUser(id: "${userId}") {
            status
            name
            email
            birthDate
            phone
            role
            ktp
          }
        }
        `,
        variables: { }
      })
    });
    const catchData = await res.json()
    form.birthDate = catchData.data.detailUser.birthDate
    form.status = catchData.data.detailUser.status
    form.name = catchData.data.detailUser.name
    form.email = catchData.data.detailUser.email
    form.phone = catchData.data.detailUser.phone
    form.role = catchData.data.detailUser.role
    form.ktp = catchData.data.detailUser.ktp
  } catch (err) {
    console.log(err)
  } finally {
    console.log('Api successfully loaded')
  }
}


// Form submission
const submitForm = async () => {
  let text = '';
  let required = true;
  const sendGrap = {}
  if(form.birthDate != '') {
    sendGrap.birthDate = form.birthDate
    text = text + 'birthDate : "' + form.birthDate + '"'
  }
  if(form.email != '') {
    sendGrap.email = form.email
    text = text + 'email : "' + form.email + '"'
  }
  if(form.ktp != '') {
    required = false;
    sendGrap.ktp = form.ktp
    text = text + 'ktp : "' + form.ktp + '"'
  }
  if(form.name != '') {
    required = false;
    sendGrap.name = form.name
    text = text + 'name : "' + form.name + '"'
  }
  if(form.phone != '') {
    required = false;
    sendGrap.phone = form.phone
    text = text + 'phone : "' + form.phone + '"'
  }
  
  if(required == true) {
    alert('Name, Phone and Identity Field is Required !!');
  } else {
    sendGrap.role = form.role
    text = text + 'role : "' + form.role + '"'
    const query = `
    mutation {
      createUser(
        createUserInput: {`+ text +`}) {
          birthDate
          employeeId
          name
          role
          status     
      }
    }
  
    `
    const queryUpdate = `
    mutation {
      updateUser(
        id: "${userId}"
        updateUserInput: {`+ text +`}) {
          birthDate
          employeeId
          name
          role
          status     
      }
    }
  
    `
  
    console.log(query);
    const res = await $fetch(graphqlEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          query: (userId != 'new' ? queryUpdate:query),
          // variables: sendGrap
      })
    }).then((response) => {
      if(userId == 'new') {
        if(response.data.createUser != null && response.data.createUser != undefined) {
          router.push('/users/')
        } else {
          console.log('error');
          console.log(response);
        }
      } else {
        if(response.data.updateUser != null && response.data.updateUser != undefined) {
          router.push('/users/')
        } else {
          console.log('error');
          console.log(response);
        }
      }
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      console.log('ℹ️ api successfully ran')
    });
    
    // console.log(sendGrap)
    // console.log('result')
    // console.log(res);
    // if ("data.createUser" in res) {
    //   console.log("Property 'age' does not exist.");
    // } else {
    //   console.log('error');
    // }
  }
  

}
</script>