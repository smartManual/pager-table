<template>
  <div>
    <a-table
      class="custom-table"
      :data-source="dataSource"
      :loading="loading"
      :pagination="false"
      :customRow="customRowWrapper"
      :components="tableComponents"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-for="_column in slotList" :slot="_column.slotName" slot-scope="text,record,index">
        <slot :name="_column.slotName" :text="text" :record="record" :index="index"></slot>
      </template>
      <!--文本溢出提示-->
      <overflow-tip 
        slot="overflow"
        slot-scope="text, record, index, column" 
        :placement="getVal(column, 'tooltip.placement', 'top')">
        {{ text }}
      </overflow-tip>
      <!--拖拽排序-->
      <div slot="dragSort" slot-scope="text, record, index">
        <custom-icon
          type="icon-tuozhuai"
          class="drag-icon"
          draggable="true"
          @dragstart="onDragStart($event, record, index)"
          @dragend="onDragEnd"
        />
      </div>
      <!--自增序号-->
      <span 
        slot="incrementIndex"
        slot-scope="text, record, index, column">
        {{ (pagination.current - 1) * pagination.pageSize + index + 1}}
      </span>
      <!--序号-->
      <span 
        slot="index"
        slot-scope="text, record, index, column">
        {{ index + 1}}
      </span>
    </a-table>
    <div class="pagination-wrapper" v-show="pagination.total > 0">
      <a-pagination
        :current="pagination.current"
        :pageSize="pagination.pageSize"
        :total="pagination.total"
        v-bind="$attrs"
        @change="onChange"
        @showSizeChange="onSizeChange"
      />
    </div>
  </div>
</template>

<script>
import { Table, Pagination, Input } from 'ant-design-vue'
import OverflowTip from '@zero-org/overflow-tip'
import VueDraggableResizable from 'vue-draggable-resizable'

import { getVal, DEFAULT_CURRENT, DEFAULT_PAGE_SIZE, DEFAULT_TOTAL } from './helpers'
import dragMixin from './drag-mixin'
import resizeMixin from './resize-mixin'

export default {
  name: 'PagerTable',
  components: {
    ATable: Table,
    APagination: Pagination,
    AInput: Input,
    OverflowTip,
    VueDraggableResizable
  },
  props: {
    /**
     * 查询的接口api
     */
    queryApi: {
      type: Function,
      required: true
    },
    /**
     * 查询条件
     */
    query: {
      type: Object,
      default: () => Object.create(null)
    },
    /**
     * 是否在mounted时主动进行查询
     */
    queryOnMounted: {
      type: Boolean,
      default: true
    },
    /**
     * 查询时是否展示table的loading
     */
    showLoading: {
      type: Boolean,
      default: true
    },
    /**
     * 对列表数据进行转换，可以添加属性或对数据进行处理等
     */
    transformData: {
      type: Function | undefined
    },
    /**
     * 列表数据的属性path
     */
    listKey: {
      type: String,
      default: ''
    },
    /**
     * 当前页的属性path
     */
    currentKey: {
      type: String,
      default: 'current'
    },
    hasCurrent: {
      type: Boolean,
      default: false
    },
    /**
     * 总页数的属性path
     */
    totalKey: {
      type: String,
      default: 'total'
    },
    /**
     * 分页查询对应的页码值
     */
    pagerParams: {
      default: () => {
        return {
          current: 'pageNum',
          pageSize: 'pageSize'
        }
      }
    },
    /**
     * 默认的每页条数
     */
    defaultPageSize: {
      type: Number,
      default: DEFAULT_PAGE_SIZE
    },
    /**
     *  刷新时间，单位毫秒
     */
    refreshTime: {
      type: Number | undefined,
    },
    rowDragEnd: {
      type: Function | undefined,
    }
  },
  mixins: [dragMixin, resizeMixin],
  data() {
    return {
      getVal,
      loading: false,
      timer: null,
      dataSource: [],
      pagination: {
        current: DEFAULT_CURRENT,
        pageSize: this.defaultPageSize,
        total: DEFAULT_TOTAL
      }
    }
  },
  computed: {
    slotList() {
      return this.$attrs.columns.filter(obj => {
        const customRender = getVal(obj, 'scopedSlots.customRender', '')
        return !!customRender
      }).map(obj => {
        obj.slotName = getVal(obj, 'scopedSlots.customRender', '')
        return obj
      })
    }
  },
  watch: {
    query() {
      this.$nextTick(() => {
        this.pagination.current = DEFAULT_CURRENT
        this.queryList().then((res) => {
          this.onSuccess(res)
        }).catch(() => {
          this.onError()
        })
      })
    }
  },
  mounted() {
    if (this.queryOnMounted) {
      this.queryList().then((res) => {
        this.onSuccess(res)
      }).catch((err) => {
        this.onError()
      })
    }
  },
  beforeDestroy () {
    this.clearTimer()
  },
  deactivated () {
    this.clearTimer()
  },
  methods: {
    /**
     * 查询列表数据
     * @param {*} showLoading 是否展示loading,默认为true
     */
    queryList(showLoading = true) {
      this.$emit('query')

      const params = {
        ...this.query
      }
      params[this.pagerParams.current] = this.pagination.current
      params[this.pagerParams.pageSize] = this.pagination.pageSize

      const promise = new Promise((resolve, reject) => {
        showLoading && (this.loading = true)
        this.queryApi(params).then(res => {
          showLoading && (this.loading = false)
          resolve(res)
        }).catch(err => {
          showLoading && (this.loading = false)
          reject(err)
        })
      })

      return promise
    },
    /**
     * 查询成功的回调函数
     */
    onSuccess(res) {
      // 设置列表数据
      const dataList = getVal(res, this.listKey, [])
      this.dataSource = this.transformData ? this.transformData(dataList, this.pagination.pageSize, this.pagination.current) : dataList
      // 设置总条数
      const total = getVal(res, this.totalKey, DEFAULT_TOTAL)
      this.pagination.total = total
      // 设置分页数据
      if (this.hasCurrent) {
        this.pagination.current = getVal(res, this.currentKey, DEFAULT_CURRENT)
      } else {
        this.pagination.current = Math.min(this.pagination.current, Math.ceil(total / this.pagination.pageSize))
      }

      // 数据更新后滚动到顶部，暂时未找到更好的方法
      const tableBody = this.$el.querySelector('div.ant-table-body')
      tableBody && (tableBody.scrollTop = 0)

      // 定时刷新数据
      this.clearTimer()
      if (this.refreshTime) {
        this.timer = setTimeout(() => {
          this.refreshData()
        }, this.refreshTime)
      }

      // 触发查询成功事件
      this.$nextTick(() => {
        this.$emit('querySuccess', this.dataSource, this.pagination)
      })
    },
    /**
     * 查询失败的回调函数
     */
    onError() {
      this.dataSource = []
      this.currentPage = DEFAULT_CURRENT
      this.total = DEFAULT_TOTAL
    },
    /**
     * 页码改变的回调
     * @param {*} page 
     * @param {*} pageSize 
     */
    onChange (page, pageSize) {
      this.pagination.current = page
      this.pagination.pageSize = pageSize

      this.queryList().then(res => {
        this.onSuccess(res)
      }).catch(err => {
        this.onError(err)
      })
    },
    /**
     * 分页条数发生变化
     * @param {*} current 
     * @param {*} size 
     */
    onSizeChange (current, size) {
      this.pagination.current = DEFAULT_CURRENT
      this.pagination.pageSize = size

      this.queryList().then(res => {
        this.onSuccess(res)
      }).catch(err => {
        this.onError(err)
      })
    },
    /**
     * 重新查询第一页数据
     */
    refreshPage () {
      this.pagination.current = DEFAULT_CURRENT
      this.queryList().then(res => {
        this.onSuccess(res)
      }).catch(err => {
        this.onError(err)
      })
    },
    /**
     * 刷新当前页数据
     */
    refreshData () {
      this.queryList(false).then(res => {
        this.onSuccess(res)
      }).catch(err => {
        this.onError(err)
      })
    },
    /**
     * 跳转到特定页
     * @param {*} page 要跳转的页码
     * @param {*} pageSize 每页的条数
     */
    toPage(page, pageSize = this.defaultPageSize) {
      this.pagination.current = page
      this.pagination.pageSize = pageSize
  
      this.queryList().then(res => {
        this.onSuccess(res)
      }).catch(err => {
        this.onError(err)
      })
    },
    clearTimer () {
      this.timer && clearInterval(this.timer)
      this.timer = null
    }
  }
}
</script>

<style lang="less">
@import './styles/index.less';
</style>