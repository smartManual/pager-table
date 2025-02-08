export default {
  data() {
    return {
      tableComponents: {
        header: {
          cell: (h, props, children) => {
            const { key, ...restProps } = props

            const _children = []
            const divider =  h('div', { class: 'table-th-divider' })
            
            const columns = this.$attrs.columns
            const index = columns.findIndex(col => (col.dataIndex || col.key) === key)
            const col = columns[index]

            if (!col || !col.width || col.key === 'manipulate' || !col.resizable) {
              if (index !== columns.length - 1) {
                _children.push(divider)
              }
            } else {
              const dragProps = {
                key: col.dataIndex || col.key,
                class: 'table-draggable-handler',
                attrs: {
                  x: parseFloat(col.width),
                  z: 1,
                  axis: 'x',
                  draggable: true,
                  resizable: false,
                  classNameDragging: 'dragging'
                },
                on: {
                  dragging: (x) => {
                    col.width = Math.max(x, 16)
                  }
                }
              }
              const resizeLine = h('div', { class: 'table-th-resize-line'})
              const drag = h('vue-draggable-resizable', { ...dragProps }, [resizeLine])
              _children.push(drag, divider)
            }

            restProps.class = restProps.class + ' resize-table-th'
            return h('th', { ...restProps }, [...children, ..._children])
          }
        }
      }
    }
  }
}