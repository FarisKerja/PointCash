<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-gray-800">Floating Label Demo - 3 Conditions</h1>
      
      <!-- INPUT FIELD EXAMPLES -->
      <div class="mb-12">
        <h2 class="text-xl font-semibold mb-6 text-gray-700">Input Field</h2>
        
        <!-- Condition 1: Empty & Not Focused -->
        <div class="mb-8 p-6 bg-white rounded-lg shadow border border-gray-200">
          <h3 class="text-lg font-medium mb-4 text-gray-600">1. Empty & Not Focused</h3>
          <div class="relative">
            <input 
              type="text"
              class="floating-input peer"
              placeholder=" "
            />
            <label class="floating-label">
              Username
            </label>
          </div>
          <div class="mt-4 p-3 bg-gray-50 rounded">
            <p class="text-sm text-gray-600">Label sits inside the input field</p>
          </div>
        </div>
        
        <!-- Condition 2: Focused (Empty or Not) -->
        <div class="mb-8 p-6 bg-white rounded-lg shadow border border-gray-200">
          <h3 class="text-lg font-medium mb-4 text-gray-600">2. Focused (Any State)</h3>
          <div class="relative">
            <input 
              type="text"
              class="floating-input peer"
              placeholder=" "
              ref="focusInput"
              @focus="activeInput = 'focusInput'"
            />
            <label class="floating-label">
              Email Address
            </label>
          </div>
          <div class="mt-4 p-3 bg-teal-50 rounded">
            <p class="text-sm text-teal-700">Label floats up and turns teal when focused</p>
          </div>
          <p class="mt-2 text-sm text-gray-500">Click the field to see it in action</p>
        </div>
        
        <!-- Condition 3: Has Value & Not Focused -->
        <div class="mb-8 p-6 bg-white rounded-lg shadow border border-gray-200">
          <h3 class="text-lg font-medium mb-4 text-gray-600">3. Has Value & Not Focused</h3>
          <div class="relative">
            <input 
              type="text"
              class="floating-input peer"
              placeholder=" "
              :value="prefilledInput"
            />
            <label class="floating-label">
              Full Name
            </label>
          </div>
          <div class="mt-4 p-3 bg-blue-50 rounded">
            <p class="text-sm text-blue-700">Label stays up when field has value (even when not focused)</p>
          </div>
        </div>
      </div>
      
      <!-- TEXTAREA EXAMPLES -->
      <div>
        <h2 class="text-xl font-semibold mb-6 text-gray-700">Textarea</h2>
        
        <!-- Condition 1: Empty & Not Focused -->
        <div class="mb-8 p-6 bg-white rounded-lg shadow border border-gray-200">
          <h3 class="text-lg font-medium mb-4 text-gray-600">1. Empty & Not Focused</h3>
          <div class="relative">
            <textarea 
              class="floating-textarea peer"
              placeholder=" "
              rows="3"
            ></textarea>
            <label class="floating-textarea-label">
              Description
            </label>
          </div>
          <div class="mt-4 p-3 bg-gray-50 rounded">
            <p class="text-sm text-gray-600">Label sits inside the textarea</p>
          </div>
        </div>
        
        <!-- Condition 2: Focused (Empty or Not) -->
        <div class="mb-8 p-6 bg-white rounded-lg shadow border border-gray-200">
          <h3 class="text-lg font-medium mb-4 text-gray-600">2. Focused (Any State)</h3>
          <div class="relative">
            <textarea 
              class="floating-textarea peer"
              placeholder=" "
              rows="3"
              ref="focusTextarea"
              @focus="activeInput = 'focusTextarea'"
            ></textarea>
            <label class="floating-textarea-label">
              Your Message
            </label>
          </div>
          <div class="mt-4 p-3 bg-teal-50 rounded">
            <p class="text-sm text-teal-700">Label floats up and turns teal when focused</p>
          </div>
          <p class="mt-2 text-sm text-gray-500">Click the textarea to see it in action</p>
        </div>
        
        <!-- Condition 3: Has Value & Not Focused -->
        <div class="p-6 bg-white rounded-lg shadow border border-gray-200">
          <h3 class="text-lg font-medium mb-4 text-gray-600">3. Has Value & Not Focused</h3>
          <div class="relative">
            <textarea 
              class="floating-textarea peer"
              placeholder=" "
              rows="3"
              :value="prefilledTextarea"
            ></textarea>
            <label class="floating-textarea-label">
              Notes
            </label>
          </div>
          <div class="mt-4 p-3 bg-blue-50 rounded">
            <p class="text-sm text-blue-700">Label stays up when textarea has content (even when not focused)</p>
          </div>
        </div>
      </div>
      
      <!-- INTERACTIVE DEMO -->
      <div class="mt-12 p-6 bg-white rounded-xl shadow-lg">
        <h2 class="text-xl font-semibold mb-6 text-gray-800">Try It Yourself</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Interactive Input -->
          <div>
            <h3 class="font-medium mb-4 text-gray-700">Input Field</h3>
            <div class="relative mb-4">
              <input 
                type="text"
                class="floating-input peer"
                placeholder=" "
                v-model="demoInput"
              />
              <label class="floating-label">
                Try typing here
              </label>
            </div>
            <div class="space-y-2">
              <button 
                @click="demoInput = 'Example text'"
                class="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
              >
                Fill with text
              </button>
              <button 
                @click="demoInput = ''"
                class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Clear
              </button>
            </div>
            <div class="mt-4 p-3 bg-gray-50 rounded-lg">
              <p class="text-sm">
                <span class="font-medium">Current state:</span> 
                <span class="ml-2 px-2 py-1 bg-white rounded text-sm">
                  {{ getInputState('input') }}
                </span>
              </p>
            </div>
          </div>
          
          <!-- Interactive Textarea -->
          <div>
            <h3 class="font-medium mb-4 text-gray-700">Textarea</h3>
            <div class="relative mb-4">
              <textarea 
                class="floating-textarea peer"
                placeholder=" "
                rows="3"
                v-model="demoTextarea"
              ></textarea>
              <label class="floating-textarea-label">
                Type your message
              </label>
            </div>
            <div class="space-y-2">
              <button 
                @click="demoTextarea = 'This is an example message to show how floating labels work with textareas.'"
                class="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
              >
                Fill with text
              </button>
              <button 
                @click="demoTextarea = ''"
                class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Clear
              </button>
            </div>
            <div class="mt-4 p-3 bg-gray-50 rounded-lg">
              <p class="text-sm">
                <span class="font-medium">Current state:</span> 
                <span class="ml-2 px-2 py-1 bg-white rounded text-sm">
                  {{ getInputState('textarea') }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- STATE SUMMARY -->
      <div class="mt-8 p-6 bg-gray-100 rounded-lg">
        <h3 class="font-medium mb-4 text-gray-800">Summary of 3 Conditions</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-white rounded-lg">
            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mb-3">
              <span class="font-bold">1</span>
            </div>
            <h4 class="font-medium mb-2">Empty & Not Focused</h4>
            <p class="text-sm text-gray-600">Label sits inside the field</p>
          </div>
          <div class="p-4 bg-white rounded-lg">
            <div class="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
              <span class="font-bold">2</span>
            </div>
            <h4 class="font-medium mb-2">Focused (Any State)</h4>
            <p class="text-sm text-gray-600">Label floats up, turns teal</p>
          </div>
          <div class="p-4 bg-white rounded-lg">
            <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
              <span class="font-bold">3</span>
            </div>
            <h4 class="font-medium mb-2">Has Value & Not Focused</h4>
            <p class="text-sm text-gray-600">Label stays up (gray)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Prefilled values
const prefilledInput = 'John Doe'
const prefilledTextarea = 'This is some pre-filled text in the textarea.'

// Interactive demo values
const demoInput = ref('')
const demoTextarea = ref('')
const activeInput = ref('')

// Helper to get current state
const getInputState = (type) => {
  const value = type === 'input' ? demoInput.value : demoTextarea.value
  const isActive = type === 'input' ? activeInput.value === 'focusInput' : activeInput.value === 'focusTextarea'
  
  if (value && !isActive) return 'Has Value & Not Focused'
  if (isActive) return 'Focused'
  return 'Empty & Not Focused'
}
</script>

<style scoped>

/* FIX: Add explicit empty state detection */
.floating-input:placeholder-shown::placeholder {
  opacity: 1 !important;
}

/* Force label inside when empty and not focused */
.floating-input:placeholder-shown:not(:focus) + .floating-label {
  transform: scale(1) translateY(0) !important;
  color: #6b7280 !important; /* text-gray-500 */
}

/* Same for textarea */
.floating-textarea:placeholder-shown:not(:focus) + .floating-textarea-label {
  transform: scale(1) translateY(0) !important;
  color: #6b7280 !important;
}

/* Floating Input Styles */
.floating-input {
  @apply block w-full px-2.5 pt-5 pb-2.5 text-base text-gray-900 
         bg-transparent border-0 border-b-2 border-gray-300 
         appearance-none focus:outline-none focus:ring-0 
         focus:border-teal-600 transition-colors duration-200;
}

.floating-input::placeholder {
  color: transparent;
}

.floating-label {
  @apply absolute text-base text-gray-500 duration-300 transform 
         -translate-y-4 scale-75 top-4 origin-[0] left-2.5 
         pointer-events-none transition-colors duration-200;
}

/* Condition 1: Empty & Not Focused */
.floating-input:placeholder-shown + .floating-label {
  @apply scale-100 translate-y-0;
}

/* Condition 2: Focused (Any State) */
.floating-input:focus + .floating-label {
  @apply scale-75 -translate-y-4 text-teal-600;
}

/* Condition 3: Has Value & Not Focused */
.floating-input:not(:placeholder-shown) + .floating-label {
  @apply scale-75 -translate-y-4;
}

/* Textarea Styles */
.floating-textarea {
  @apply block w-full px-2.5 pt-8 pb-2.5 text-base text-gray-900 
         bg-transparent border-0 border-b-2 border-gray-300 
         resize-none focus:outline-none focus:ring-0 
         focus:border-teal-600 transition-colors duration-200;
}

.floating-textarea::placeholder {
  color: transparent;
}

.floating-textarea-label {
  @apply absolute text-base text-gray-500 duration-300 transform 
         -translate-y-4 scale-75 top-2 origin-[0] left-2.5 
         pointer-events-none transition-colors duration-200;
}

/* Condition 1: Empty & Not Focused */
.floating-textarea:placeholder-shown + .floating-textarea-label {
  @apply scale-100 translate-y-0;
}

/* Condition 2: Focused (Any State) */
.floating-textarea:focus + .floating-textarea-label {
  @apply scale-75 -translate-y-4 text-teal-600;
}

/* Condition 3: Has Value & Not Focused */
.floating-textarea:not(:placeholder-shown) + .floating-textarea-label {
  @apply scale-75 -translate-y-4;
}
</style>