<template>
  <div class="relative" :class="wrapperClass">
    <!-- Regular Label -->
    <label
      v-if="label && !floating"
      :for="fieldId"
      class="block mb-2 text-md font-small text-gray-500"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Text Input -->
    <input
      v-if="type !== 'textarea' && type !== 'select' && type !== 'file'"
      :type="type"
      :id="fieldId"
      :value="value"
      @input="updateValue($event.target.value)"
      @change="$emit('change', $event)"
      :placeholder="floating ? ' ' : placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :class="inputClasses"
      :accept="accept"
      :multiple="multiple"
    />
    
    <!-- Textarea -->
    <textarea
      v-else-if="type === 'textarea'"
      :id="fieldId"
      :value="value"
      @input="updateValue($event.target.value)"
      @change="$emit('change', $event)"
      :placeholder="floating ? ' ' : placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :rows="rows"
      :class="inputClasses"
    ></textarea>
    
    <!-- Select -->
    <select
      v-else-if="type === 'select'"
      :id="fieldId"
      :value="value"
      @change="updateValue($event.target.value)"
      :disabled="disabled"
      :class="inputClasses"
    >
      <option value="" disabled v-if="placeholder">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value || option"
        :value="option.value || option"
      >
        {{ option.label || option }}
      </option>
    </select>
    
    <!-- File Input -->
    <input
      v-else-if="type === 'file'"
      type="file"
      :id="fieldId"
      @change="handleFileChange"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      :class="inputClasses"
      ref="fileInput"
    />

    <!-- <div v-if="type === 'file' && selectedFiles.length > 0" class="mt-2">
      <div class="text-sm text-gray-600 mb-1">Selected files:</div>
      <div class="flex flex-wrap gap-2">
        <div 
          v-for="(file, index) in selectedFiles" 
          :key="index"
          class="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg text-sm"
        >
          <span>{{ file.name }}</span>
          <button 
            type="button"
            @click="removeFile(index)"
            class="text-red-500 hover:text-red-700"
          >
            &times;
          </button>
        </div>
      </div>
    </div> -->
    
    <!-- Floating Label -->
    <label
      v-if="floating && label"
      :for="fieldId"
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <!-- Error & Helper Text -->
    <div v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </div>
    <div v-if="helperText" class="mt-1 text-sm text-gray-500">
      {{ helperText }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputField',
  
  // v-model support
  model: {
    prop: 'modelValue',
    event: 'update:modelValue'
  },
  
  props: {
    // v-model value
    modelValue: {
      type: [String, Number, Array, Object, File, Array],
      default: ''
    },
    
    // Input type
    type: {
      type: String,
      default: 'text',
      validator: function(value) {
        return [
          'text', 'email', 'password', 'number', 'tel', 'url', 'date',
          'time', 'datetime-local', 'textarea', 'select', 'file', 'checkbox',
          'radio', 'color', 'range', 'search'
        ].includes(value)
      }
    },
    
    // Labels & placeholders
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    floating: {
      type: Boolean,
      default: true
    },
    
    // Validation
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    
    // Select options
    options: {
      type: Array,
      default: function() {
        return []
      }
    },
    
    // File input
    accept: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    
    // Textarea
    rows: {
      type: [Number, String],  // Accept both Number and String
      default: 4,
      // Add a custom validator to convert string to number
      validator: function(value) {
        // Convert string to number if needed
        if (typeof value === 'string') {
          const num = parseInt(value, 10)
          return !isNaN(num)
        }
        return typeof value === 'number'
      }
    },
    
    // Styling
    wrapperClass: {
      type: String,
      default: ''
    },
    
    // States
    error: {
      type: String,
      default: ''
    },
    helperText: {
      type: String,
      default: ''
    },
    
    // ID
    id: {
      type: String,
      default: ''
    },

    showPreview: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      fieldId: '',
      internalValue: this.modelValue
    }
  },
  
  computed: {
    // For v-model binding
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    
    // Dynamic CSS classes
    inputClasses() {
      const classes = [
        'peer block w-full px-2.5',
        'bg-transparent border-0',
        'text-base text-gray-900',
        'focus:outline-none focus:ring-0'
      ]
      
      // Add type-specific classes
      if (this.type !== 'file' && this.type !== 'checkbox' && this.type !== 'radio') {
        classes.push('pt-5 pb-2.5 border-b-2 border-gray-300')
        classes.push('focus:border-teal-600')
      }
      
      if (this.type === 'textarea') {
        classes.push('pt-3 pb-2')
      }
      
      if (this.type === 'file') {
        classes.push('py-2.5 file:mr-4 file:py-2 file:px-4 file:rounded-full')
        classes.push('file:border-0 file:text-sm file:font-semibold')
        classes.push('file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100')
      }
      
      if (this.disabled) {
        classes.push('opacity-50 cursor-not-allowed')
      }
      
      if (this.error) {
        classes.push('border-red-500 focus:border-red-600')
      }
      
      return classes.join(' ')
    },
    
    labelClasses() {
      const classes = [
        'absolute text-base text-gray-500 duration-300 transform',
        'top-4 origin-[0]',
        'peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0',
        'peer-focus:scale-75 peer-focus:-translate-y-4',
      ]
      
      if (this.error) {
        classes.push('text-red-500 peer-focus:text-red-600')
      } else {
        classes.push('peer-focus:text-teal-600')
      }
      
      if (this.type === 'textarea') {
        classes.push('top-2')
      }
      
      return classes.join(' ')
    }
  },
  
  watch: {
    // Update internal value when prop changes
    modelValue: {
      handler(newVal) {
        this.internalValue = newVal
      },
      immediate: true
    }
  },
  
  mounted() {
    // Generate unique ID
    this.fieldId = this.id || `input-${Math.random().toString(36).substr(2, 9)}`
  },
  
  methods: {
    // Update value and emit event
    updateValue(value) {
      this.value = value
    },
    
    // Handle file input
    handleFileChange(event) {
      const files = event.target.files
      const value = this.multiple ? files : files[0]
      
      this.$emit('update:modelValue', value)
      this.$emit('file-change', files)
    }
  }
}
</script>