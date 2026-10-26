<template>
    <div class="grid grid-cols-12 overflow-y-auto">
        <div :class="[sidebar.sidebar ? 'col-span-12 sm:col-span-3' : 'col-span-0',]">
            <navigations-sidebar @toggle-sidebar="toggleSidebar" :setSidebar="sidebar.sidebar" />
        </div>
        <div :class="[sidebar.sidebar ? 'hidden sm:block sm:col-span-9' : 'col-span-12', 'max-h-screen', 'overflow-y-auto']">
            <navigations-header @toggle-sidebar="toggleSidebar" />
            <main class="p-8 z-0">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup>
const sidebar = useSidebarStore()

function toggleSidebar() {
  sidebar.change()
}
</script>
