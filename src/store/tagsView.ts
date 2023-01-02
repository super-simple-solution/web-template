import { defineStore } from 'pinia'
import { RouteLocationNormalized } from 'vue-router'

export interface TagView extends Partial<RouteLocationNormalized> {
  title?: string
  meta?: any
  name?: string
}

interface State {
  visitedViews: TagView[]
  cachedViews: (string | undefined)[]
}

export const useTagsViewStore = defineStore('tagsView', {
  state: (): State => ({
    visitedViews: [],
    cachedViews: [],
  }),
  actions: {
    initView() {
      this.visitedViews = []
      this.cachedViews = []
    },
    addVisitedView(view: TagView) {
      if (this.visitedViews.some((v) => v.path === view.path)) return
      this.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta.title || 'no-name',
        }),
      )
    },
    addCachedView(view: TagView) {
      if (this.cachedViews.includes(view.name)) return
      if (!view.meta.noCache) {
        this.cachedViews.push(view.name)
      }
    },

    delVisitedView(view: TagView) {
      for (const [i, v] of this.visitedViews.entries()) {
        if (v.path === view.path) {
          this.visitedViews.splice(i, 1)
          break
        }
      }
    },
    delCachedView(view: TagView) {
      for (const i of this.cachedViews) {
        if (i === view.name) {
          const index = this.cachedViews.indexOf(i)
          this.cachedViews.splice(index, 1)
          break
        }
      }
    },

    delOthersVisitedViews(view: TagView) {
      this.visitedViews = this.visitedViews.filter((v) => {
        return v.meta.affix || v.path === view.path
      })
    },
    delOthersCachedViews(view: TagView) {
      for (const i of this.cachedViews) {
        if (i === view.name) {
          const index = this.cachedViews.indexOf(i)
          this.cachedViews = this.cachedViews.slice(index, index + 1)
          break
        }
      }
    },

    delAllVisitedViews() {
      // keep affix tags
      const affixTags = this.visitedViews.filter((tag) => tag.meta.affix)
      this.visitedViews = affixTags
    },
    delAllCachedViews() {
      this.cachedViews = []
    },

    updateVisitedView(view: TagView) {
      for (let v of this.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    },
    addView(view: TagView) {
      this.addVisitedView(view)
      this.addCachedView(view)
    },

    delView(view: TagView) {
      return new Promise((resolve) => {
        this.delVisitedView(view)
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews],
        })
      })
    },

    delOthersViews(view: TagView) {
      return new Promise((resolve) => {
        this.delOthersVisitedViews(view)
        this.delOthersCachedViews(view)
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews],
        })
      })
    },

    delAllViews() {
      return new Promise((resolve) => {
        this.delAllVisitedViews()
        this.delAllCachedViews()
        resolve({
          visitedViews: [],
          cachedViews: [],
        })
      })
    },
  },
})
