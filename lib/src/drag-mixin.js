import { getParent, getOffsetTop, removeClass, addClass } from './helpers'

let preTr = null
let dragInfo = {}
let insertType = null

export default {
  data() {
    isDragging: false
  },
  methods: {
    customRowWrapper(record, index) {
      return {
        on: {
          dragover: (e) => {
            e.preventDefault()
            if (!this.isDragging) {
              return
            }

            e.dataTransfer.dropEffect = 'move'
            
            const target = e.target
            const tr = getParent(target)

            const offsetTop = getOffsetTop(e, tr)
            const offsetHeight = tr.offsetHeight

            const span = this.showDropLine()
            const table = this.$el.querySelector('.custom-table')
            if (offsetTop < offsetHeight / 2) {
              const top = this.getOffsetTop(table, tr)
              span.style.top = top + 'px'

              dragInfo.insertType = 'Before'
            } else {
              const top = this.getOffsetTop(table, tr) + offsetHeight
              span.style.top = top + 'px'
              dragInfo.insertType = 'After'
            }

            let header = this.$el.querySelector('.ant-table-header')
            if (!header) {
              header = this.$el.querySelector('thead.ant-table-thead')
            }
            span.style.width = header.clientWidth + 'px'
            span.style.opacity = 1
          },
          drop: (e) => {
            if (!this.isDragging) {
              return
            }
            
            if (dragInfo.index !== index) {
              const target = {
                data: record,
                index
              }
              if (this.rowDragEnd) {
                const promise = this.rowDragEnd(dragInfo, target)
                if (promise instanceof Promise) {
                  promise.then(() => {
                    this.sortDataSource(dragInfo, target)
                  }).catch(() => {})
                }
              } else {
                this.sortDataSource(dragInfo, target)
              }
            }
          }
        }
      }
    },
    onDragStart(e, obj, index) {
      const table = this.$el.querySelector('.custom-table')
      table && (table.style.position = 'relative')

      dragInfo.data = obj
      dragInfo.index = index
      this.isDragging = true
      
    },
    onDragEnd() {
      const span = this.showDropLine()
      span && (span.style.opacity = 0)

      const table = this.$el.querySelector('.custom-table')
      table && (table.style.removeProperty('position'))
      this.isDragging = false
    },
    getOffsetTop(target, el) {
      const targetRect = target.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      return elRect.top - targetRect.top
    },
    showDropLine() {
      let span =  this.$el.querySelector('.custom-table span.table-drag-placeholder')
      if (!span) {
        span = document.createElement('span')
        span.className = 'table-drag-placeholder'
        const table = this.$el.querySelector('.custom-table')
        table.appendChild(span)
      }
      return span
    },
    sortDataSource(dragInfo, target) {
      this.dataSource.splice(dragInfo.index, 1)

      const insertType = dragInfo.insertType
      if (insertType === 'Before') {
        if (dragInfo.index > target.index) {
          this.dataSource.splice(target.index, 0, dragInfo.data)
        } else {
          this.dataSource.splice(target.index - 1, 0, dragInfo.data)
        }
      } else if (insertType === 'After') {
        if (dragInfo.index > target.index) {
          this.dataSource.splice(target.index + 1, 0, dragInfo.data)
        } else {
          this.dataSource.splice(target.index, 0, dragInfo.data)
        }
      }
    }
  }
}