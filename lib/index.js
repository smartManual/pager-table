import { Icon } from 'ant-design-vue'
import PagerTable from './src/index.vue'
import scriptUrl from './src/assets/font/iconfont.js'
import VueDraggableResizable from 'vue-draggable-resizable'

const CustomIcon = Icon.createFromIconfontCN({
  scriptUrl
})
PagerTable.install = (Vue) => {
  Vue.component('vue-draggable-resizable', VueDraggableResizable)
  Vue.component('CustomIcon', CustomIcon)
  Vue.component(PagerTable.name, PagerTable)
}

export default PagerTable