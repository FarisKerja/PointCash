<template>
  <IndexWeb :openSidebar="sidebarOpen" @update:openSidebar="sidebarOpen = $event">
    <div class="p-6 bg-white rounded-lg shadow max-w-2xl mx-auto">
        <h2 class="text-xl font-bold mb-6">Add New Product</h2>
        
        <div class="py-2">
            <InputField 
            v-model="form.firstName"
            label="Product Name"
            placeholder="e.g., Wireless Headphones"
            required
            />
        </div>
        
        <div class="py-2">
            <InputField 
                v-model="form.lastName"
                type="number"
                label="Price ($)"
                placeholder="0.00"
                required
            />
        </div>
        
        <div class="py-2">
            <InputField 
                v-model="form.email"
                type="textarea"
                label="Description"
                placeholder="Product description..."
                rows="4"
                class="mb-6"
            />
        </div>
        
        <div class="py-2">
            <InputField 
                v-model="form.resume"
                type="file"
                label="Product Images"
                accept="image/*"
                multiple
                
                :floating="false"
                class="mb-6"
            />
        </div>
        <!-- @file-change="handleImages" -->
        
        <div class="py-2">
            <InputField 
                v-model="form.country"
                type="select"
                label="Origin"
                :options="countries"
                :floating="true"
                class="mb-6"
            />
        </div>
        
        <div class="flex justify-between">
            <div class="gap-4">
                <button 
                    @click="saveDraft"
                    class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    Save Draft
                </button>
                
                <button 
                    @click="publishProduct"
                    class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    Publish Product
                </button>
            </div>
            <div>
                <NuxtLink to="/users/">Back</NuxtLink>
            </div>
        </div>
    </div>
  </IndexWeb>
</template>

<script setup>
import IndexWeb from '~/components/navigations/IndexWeb.vue'
import { useRuntimeConfig } from '#app';
import { ref } from 'vue'
import InputField from '~/components/forms/InputData.vue'

const config = useRuntimeConfig();

const sidebarOpen = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: '',
  country: '',
  resume: null
})

// Countries for select
const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  { value: 'other', label: 'Other Countries' }
]

// Form submission
const submitForm = () => {
  console.log('Form data:', form)
  // Submit to API
}
</script>