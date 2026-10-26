<template>
    <div class="sticky z-10 top-0 bg-teal-400 flex justify-between">
        <div class="flex justify-normal gap-4">
            <div class="px-3 py-4 text-white bg-violet-800">
                <Icon name="material-symbols:play-shapes-outline" class="w-8 h-8"/>
            </div>
            <div class="px-3 py-5">
                <button @click="$emit('toggle-sidebar')">
                    <Icon name="fa7-solid:bars" class="w-6 h-6" />
                </button>
            </div>
        </div>
        <div class="flex justify-normal gap-4">
            <div class="px-3 py-5">
                <Icon name="mdi:bell-outline" class="w-6 h-6" />
            </div>
            <div class="px-3 py-4 static">
                <button @click="open = !open">
                    <Icon name="fa7-solid:user-circle" class="w-8 h-8"/>
                </button>
    
                <div id="dropdown" v-if="open" class="z-10 absolute top-14 right-4 bg-white border border-default-medium rounded-lg shadow-lg w-44">
                    <ul class="text-sm text-body font-medium" aria-labelledby="dropdownDefaultButton">
                        <li v-for="item in links" :key="item.to">
                            <NuxtLink
                            :to="item.to"
                            :class="['inline-flex', 'items-center', 'w-full', 'p-2', 'hover:bg-gray-300', item.id == 1 ? 'hover:rounded-t-lg' : (item.id == links.length ? 'hover:rounded-b-lg' : '')]"
                            >
                            {{ item.label }}
                        </NuxtLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import { useRuntimeConfig } from '#app';

// const config = useRuntimeConfig();

export default {
    data() {
        return {
            open: false,
            links: [
                { id: 1, label: 'Home', to: '/dashboard' },
                { id: 2, label: 'Contact', to: '/contact' },
                { id: 3, label: 'Tes', to: '/tes' },
                { id: 4, label: 'Logout', to: '/tes' },
                // { id: 5, label: config.public.nestREST, to: '#' },
                // { id: 6, label: config.public.nestGRAPH, to: '#' },
                // { id: 7, label: config.public.golangREST, to: '#' },
            ]
        }
    },
    emits: ['toggle-sidebar']
}
</script>

<style scoped>
.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}
.menu li {
  margin: 5px 0;
}
</style>