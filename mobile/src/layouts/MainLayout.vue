<template>
  <q-layout view="lHh Lpr lFf" :class="[route.name == 'newSales'?'':'q-pa-lg', 'screen-md']" :style="[route.name == 'newSales'?'':'background:#c6e1ff']">
    <!-- Main page content -->
    <q-page-container :style="[route.name == 'newSales'?'padding-bottom:0px':'']">
      <router-view />
    </q-page-container>

    <!-- Bottom menu -->
    <q-footer>
      <q-tabs
        align="justify"
        class="tw-bg-teal-400 tw-h-20"
      >
        <q-route-tab
          flat
          icon="shopping_cart"
          size="xl"
          :class="[route.name == 'newSales' ? 'opacity-100 text-white tw-bg-sky-500 no-pointer-events' : 'pointer-events-none']"
          transparent
          rounded
          :to="{name: 'newSales'}"
        />
        <q-route-tab
          flat
          icon="payments"
          size="xl"
          :class="[route.name == 'sales' ? 'opacity-100 text-white tw-bg-sky-500 no-pointer-events' : 'pointer-events-none']"
          transparent
          rounded
          :to="{name: 'sales'}"
        />
        <q-route-tab
          flat
          icon="home"
          size="xl"
          :class="[route.name == 'home' ? 'opacity-100 text-white tw-bg-sky-500 no-pointer-events' : 'pointer-events-none']"
          transparent
          rounded
          :to="{name: 'home'}"
        />
        <q-route-tab
          flat
          icon="notifications"
          size="xl"
          :class="[route.name == 'notification' ? 'opacity-100 text-white tw-bg-sky-500 no-pointer-events' : 'pointer-events-none']"
          transparent
          rounded
          :to="{name: 'notification'}"
        />
        <q-route-tab
          flat
          icon="person"
          size="xl"
          :class="[route.name == 'profile' ? 'opacity-100 text-white tw-bg-sky-500 no-pointer-events' : 'pointer-events-none']"
          rounded
          :to="{name: 'profile'}"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

// import { ref } from 'vue'

const route = useRoute();

// const active = ref('/')
</script>