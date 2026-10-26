// stores/counter.ts
import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    sidebar: true,
  }),
  actions: {
    change() {
      if(this.sidebar == false) {
        this.sidebar = true;
      } else {
        this.sidebar = false;
      }
    }
  }
})
