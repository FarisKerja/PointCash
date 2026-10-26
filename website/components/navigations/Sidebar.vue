<template>
    <div v-if="setSidebar" class="min-h-screen text-white bg-teal-800">
        <div class="p-4 grid grid-col-1 sm:flex sm:justify-between bg-violet-950 border-violet-600 border-b-4">
            <div class="block sm:hidden flex justify-end">
                <div class="m-2" @click="$emit('toggle-sidebar')">
                    <Icon name="material-symbols:cancel-outline" class="w-8 h-8" />
                </div>
            </div>
            <div class="text-center">
                <button @click="$emit('toggle-sidebar')">
                    <Icon name="fa7-solid:user-circle" class="w-24 h-24"/>
                </button>
            </div>
            <div class="content-around">
                <p class="place-content-start break-all">
                    test1test2test3test4test5
                </p>
                <p class="py-2">
                    <Icon name="material-symbols:circle" class="bg-green-500 w-4 h-4" />
                    Online
                </p>
            </div>
        </div>
        <div>
            <ul>
                <li>
                    <NuxtLink to="/dashboard/" :class="['hover:bg-teal-400 p-4 flex items-center gap-3 text-xl font-semibold hover:text-black', (currentUrl === 'dashboard' ? 'bg-teal-400 text-black ' : 'text-white')]">
                        <Icon name="material-symbols:bar-chart-4-bars" class="w-6 h-6" />
                        <span>Dashboard</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/users/" :class="['hover:bg-teal-400 p-4 flex items-center gap-3 text-xl font-semibold hover:text-black', (currentUrl === 'users' ? 'bg-teal-400 text-black ' : 'text-white')]">
                        <Icon name="material-symbols:groups" class="w-6 h-6" />
                        <span>Users</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/suppliers/" :class="['hover:bg-teal-400 p-4 flex items-center gap-3 text-xl font-semibold hover:text-black', (currentUrl === 'suppliers' ? 'bg-teal-400 text-black ' : 'text-white')]">
                        <Icon name="material-symbols:local-shipping" class="w-6 h-6" />
                        <span>Suppliers</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/category/" :class="['hover:bg-teal-400 p-4 flex items-center gap-3 text-xl font-semibold hover:text-black', (currentUrl === 'category' ? 'bg-teal-400 text-black ' : 'text-white')]">
                        <Icon name="material-symbols:category-search" class="w-6 h-6"/>
                        <span>Category</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/products/" :class="['hover:bg-teal-400 p-4 flex items-center gap-3 text-xl font-semibold hover:text-black', (currentUrl === 'products' ? 'bg-teal-400 text-black ' : 'text-white')]">
                        <Icon name="material-symbols:box" class="w-6 h-6" />
                        <span>Products</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/customers/" :class="['hover:bg-teal-400 p-4 flex items-center gap-3 text-xl font-semibold hover:text-black', (currentUrl === 'customers' ? 'bg-teal-400 text-black ' : 'text-white')]">
                        <Icon name="material-symbols:stars" class="w-6 h-6" />
                        <span>Customers</span>
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/sales/" :class="['hover:bg-teal-400 p-4 flex items-center gap-3 text-xl font-semibold hover:text-black', (currentUrl === 'sales' ? 'bg-teal-400 text-black ' : 'text-white')]">
                        <Icon name="material-symbols:shopping-cart" class="w-6 h-6" />
                        <span>Sales</span>
                    </NuxtLink>
                </li>
                <li class="block sm:hidden">
                    <div :class="['hover:bg-teal-400 p-4 flex items-center gap-3 text-xl font-semibold hover:text-black text-white']">
                        <Icon name="material-symbols:logout-rounded" class="w-6 h-6" />
                        <span>Logout</span>
                    </div>
                </li>
                <!-- <li>
                    <div :class="['hover:bg-teal-400 p-4 flex items-center gap-3 text-xl font-semibold hover:text-black', (currentUrl === '#' ? 'bg-teal-400 text-black ' : 'text-white')]">
                        <Icon name="mdi-light:link" class="w-6 h-6" />
                        <span>{{ config.public.nestREST }}</span>
                    </div>
                </li>
                <li>
                    <div :class="['hover:bg-teal-400 p-4 flex items-center gap-3 text-xl font-semibold hover:text-black', (currentUrl === '#' ? 'bg-teal-400 text-black ' : 'text-white')]">
                        <Icon name="mdi-light:link" class="w-6 h-6" />
                        <span>{{ config.public.nestGRAPH }}</span>
                    </div>
                </li>
                <li>
                    <div :class="['hover:bg-teal-400 p-4 flex items-center gap-3 text-xl font-semibold hover:text-black', (currentUrl === '#' ? 'bg-teal-400 text-black ' : 'text-white')]">
                        <Icon name="mdi-light:link" class="w-6 h-6" />
                        <span>{{ config.public.golangREST }}</span>
                    </div>
                </li> -->
            </ul>
        </div>
    </div>
</template>

<script setup>
// Define props
const props = defineProps({
    setSidebar: {
        type: Boolean,
        required: true
    }
});

// Define emits
const emit = defineEmits(['toggle-sidebar']);

// Handle URL logic - This works on both Server and Client
const route = useRoute();
const currentUrl = computed(() => {
    // Get the first part of the path (e.g., 'dashboard' from '/dashboard/')
    return route.path.split("/")[1] || "";
});
</script>