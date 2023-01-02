import defaultSettings from '@/settings'
import { defineStore } from 'pinia'
const { tagsView } = defaultSettings

export const useSettingsStore = defineStore('setting', {
  state: () => ({
    tagsView,
  }),
})
