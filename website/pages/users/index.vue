<template>
  <IndexWeb :openSidebar="sidebarOpen" @update:openSidebar="sidebarOpen = $event">
    <div class="p-4 bg-white rounded-lg shadow-sm">

      <!-- Global Search -->
      <div class="flex justify-between p-4">
        <div class="floating-container">
          <input v-model="search" type="text" placeholder=" " class="floating-input"/>
          <label class="w-56 floating-input-label">Search</label>
        </div>
        <div>
          <NuxtLink to="/users/new" class="button-primary">New Data</NuxtLink>
        </div>
      </div>

      <!-- Data Table -->
      <EasyDataTable
        table-class-name="admin-table"
        :headers="headers"
        :items="data.findUser"
        :rows-per-page="10"
        :search-value="search"
        v-model:page="page"
        show-filter
        show-index
      >
        <!-- Actions Column -->
         <template #item-actions="row">
          <div class="flex gap-2">
            <button @click="() => navigateTo(`/users/${row.employeeId}`)" class="button-sm-warning"><Icon name="material-symbols:edit-square" class="w-4 h-3"></Icon></button>
          </div>
         </template>
        <!-- <template #item-actions="{ item }">
          <div class="flex gap-2" v-if="item?.value">
            <NuxtLink
              :to="`/users/${item.value.id}/edit`"
              class="px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Edit
            </NuxtLink>

            <button
              class="px-3 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700"
              @click="deleteUser(item.value.id)"
            >
              Delete
            </button>
          </div>
        </template> -->
      </EasyDataTable>

    </div>
  </IndexWeb>
</template>

<script setup>
import { ref } from 'vue'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import IndexWeb from '~/components/navigations/IndexWeb.vue'
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();

const sidebarOpen = ref(true)
const search = ref('')

const headers = [
  { text: 'Name', value: 'name', sortable: true, filterable: true },
  { text: 'Username', value: 'username', sortable: true, filterable: true },
  { text: 'Email', value: 'email', sortable: true, filterable: true },
  { text: 'Phone', value: 'phone', sortable: true, filterable: true },
  { text: 'Ktp', value: 'ktp', sortable: true, filterable: true },
  { text: 'Role', value: 'role', sortable: true, filterable: true },
  // { text: 'Status', value: 'status', sortable: true, filterable: true },
  { text: 'Actions', value: 'actions' }
]

const page = ref(100)

const graphqlEndpoint = config.public.nestGRAPH;

// 1. Basic GraphQL Query
const query = `
    query {
    findUser(filter: {
      page: 1,
      limit: 10,
    }) {
      employeeId
      email
      name
      phone
      username
      status
      role
      ktp
    } 
  }

`
// const query = `
//   query GetUsers($limit: Int!) {
//     users(limit: $limit) {
//       id
//       name
//       email
//     }
//   }
// `

console.log('Bearer ' + config.public.tempToken)
console.log(graphqlEndpoint)
const { data } = await $fetch(graphqlEndpoint, {
  method: 'POST',
  headers: { 
    'Authorization': `Bearer ${config.public.tempToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query,
    variables: { }
  })
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
