<template>
  <IndexWeb :openSidebar="sidebarOpen" @update:openSidebar="sidebarOpen = $event">
    <div class="p-4 bg-white rounded-lg shadow-sm">

      <!-- Global Search -->
      <div class="flex justify-between p-4">
        <div class="floating-container">
          <input v-model="search" type="text" placeholder=" " class="floating-input"/>
          <label class="w-56 floating-input-label">Search</label>
        </div>
        <div class="mt-4">
          <NuxtLink to="/products/new" class="button-primary">New Data</NuxtLink>
        </div>
      </div>

      <!-- Data Table -->
      <EasyDataTable
        table-class-name="admin-table"
        :headers="headers"
        :items="data"
        :rows-per-page="10"
        :search-value="search"
        show-filter
        show-index
      >
        <!-- Actions Column -->
         <template #item-actions="row">
          <div class="flex gap-2">
            <button @click="() => navigateTo(`/products/${row.id}`)" class="button-sm-warning"><Icon name="material-symbols:edit-square" class="w-4 h-3"></Icon></button>
            <button @click="() => navigateTo(`/products/stock/${row.id}`)" class="button-sm-info"><Icon name="circum:boxes" class="w-4 h-3"></Icon></button>
            <!-- <button class="button-sm-danger" @click="deleteData(row.name, row.id)"><Icon name="material-symbols:delete-outline" class="w-4 h-3"></Icon></button> -->
             <!-- apa musti pake v-bind kali ya ??? -->
            <button class="button-sm-danger" @click.stop.prevent="() => danger.open(row.id, row.name, endPoint + 'product', '/products/')"><Icon name="material-symbols:delete" class="w-4 h-3"></Icon></button>
          </div>
         </template>
      </EasyDataTable>

    </div>

    <Modal @load="loadData"/>
  </IndexWeb>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import IndexWeb from '~/components/navigations/IndexWeb.vue'
import { useRuntimeConfig } from '#app';
import Modal from '~/components/forms/Modal.vue';
import { deleteData } from '~/composable/deleteData';

const config = useRuntimeConfig();

const sidebarOpen = ref(true)
const search = ref('')

const headers = [
  { text: 'Name', value: 'name', sortable: true, filterable: true },
  { text: 'Category', value: 'category_name', sortable: true, filterable: true },
  { text: 'Supplier', value: 'supplier_name', sortable: true, filterable: true },
  { text: 'About', value: 'description', sortable: true, filterable: true },
  { text: 'Actions', value: 'actions' }
]

const page = ref(100)

const endPoint = config.public.golangREST;
const danger = deleteData()

const data = ref([])
const loading = ref(false)
const error = ref(null)

async function loadData() {
  console.log('masuk load data')
  const res = await fetch(endPoint + 'product/')
  const catchData = await res.json()
  data.value = catchData.data
}

onMounted(async () => {
  try {
    await loadData();
    loading.value = true
  } catch (err) {
    error.value = err
    loading.value = false
  } finally {
    console.log('DONE')
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
