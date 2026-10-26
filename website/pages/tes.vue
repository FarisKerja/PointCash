<script setup>
import IndexWeb from '~/components/navigations/IndexWeb.vue'
import { ref } from 'vue'

const sidebarOpen = ref(true)
</script>

<template>
    <IndexWeb :openSidebar="sidebarOpen" @update:openSidebar="sidebarOpen = $event">
        <h1>Change Password</h1>
        <h1>TES</h1>
    </IndexWeb>
</template>