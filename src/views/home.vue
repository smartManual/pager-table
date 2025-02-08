<template>
  <div class="home">
    <a-space class="query-panel">
      <a-input v-model="view.name" placeholder="请输入姓名"></a-input>
      <a-button type="primary" @click="search">查询</a-button>
    </a-space>
    <div>
      <PagerTable
        ref="pagerTableRef"
        showQuickJumper
        showSizeChanger
        row-key="id"
        listKey="list"
        :queryApi="queryList"
        :query="query"
        :columns="columns"
        :show-loading="true"
        :transformData="transformData"
        :defaultPageSize="10"
        :pageSizeOptions="pageSizeOptions"
        :scroll="{ x: 790, y: 400 }"
        :rowDragEnd="rowDragEnd"
        @query="onQuery"
        @querySuccess="onQuerySuccess"
      >
        <template slot="action" slot-scope="{text, record}">
          <div>
            <a href="javascript:void(0)">查看</a>
            <a-divider type="vertical" />
            <a href="javascript:void(0)">编辑</a>
            <a-divider type="vertical" />
            <a href="javascript:void(0)">删除</a>
          </div>
        </template>
      </PagerTable>
    </div>
    <div>
      <a-space>
        <a-button type="primary" @click="refreshData">刷新当前页数据</a-button>
        <a-button type="primary" @click="refreshPage">刷新页面</a-button>
        <a-button type="primary" @click="toPage">跳转到第4页数据</a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import { Space, Input, Button, Divider } from 'ant-design-vue'
import moment from 'moment'

export default {
  name: 'Home',
  components: {
    ASpace: Space,
    AInput: Input,
    AButton: Button,
    ADivider: Divider
  },
  data() {
    return {
      pageSizeOptions: ['10', '30', '40'],
      // 对应UI视图层
      view: {
        name: ''
      },
      // 对应数据层
      query: {
        name: ''
      },
      columns: [{
        title: '序号',
        width: 60,
        scopedSlots: { customRender: 'incrementIndex' },
      }, {
        title: '姓名',
        dataIndex: 'name',
        width: 100,
        resizable: true,
        sorter: true,
        filters: [
          { text: 'Joe', value: 'Joe' },
          { text: 'Jim', value: 'Jim' },
        ],
      }, {
        title: '时间',
        dataIndex: 'timeText',
        width: 170,
        resizable: true,
      }, {
        title: '邮箱',
        dataIndex: 'email',
        width: 140,
        scopedSlots: { customRender: 'overflow' },
        tooltip: { placement: 'topLeft' },
        // resizable: true
      }, {
        title: '地址',
        dataIndex: 'address',
        width: 140,
        scopedSlots: { customRender: 'overflow' },
        resizable: true
      }, {
        title: '排序',
        dataIndex: 'dragSort',
        width: 60,
        scopedSlots: { customRender: 'dragSort' },
        // resizable: true
      }, {
        title: '操作',
        dataIndex: 'action',
        width: 180,
        scopedSlots: { customRender: 'action' },
        // fixed: 'right',
        // resizable: true
      }]
    }
  },
  methods: {
    onChange() {
    },
    queryList(params) {
      console.error('调用接口进行查询:', params)
      const promise = new Promise((resolve, reject) => {
        const list = []
        for (let i = 0; i < params.pageSize; i++) {
          list.push({
            id: `${params.pageNum}_${i}`,
            name: `张三_${params.pageNum}_${i}`,
            time: new Date().getTime(),
            email: '108937689278@qq.com',
            address: '斯柯达九分裤时间段客服监控斯柯达九分裤就可视对讲付款就看涉及到付款接口设计的开发就看手机打开房间看束带结发'
          })
        }

        const json = {
          list,
          current: params.pageNum,
          total: 1000
        }
        setTimeout(() => {
          resolve(json)
        }, 0)
      })

      return promise
    },
    transformData(list) {
      console.error(111, list)
      return list.map((obj) => {
        obj.timeText = moment(obj.time).format('YYYY-MM-DD HH:mm:ss')
        return obj
      })
    },
    showTotal(total) {
      return `总共 ${total} 条`
    },
    search() {
      this.query = Object.assign({}, this.query, {
        name: this.view.name
      })
    },
    onQuery() {
      console.error('开始查询')
    },
    onQuerySuccess(dataSource, pagination) {
      console.error('查询成功：', dataSource, pagination)
    },
    rowDragEnd(dragInfo, target) {
      return new Promise((resolve, reject) => {
        this.$confirm({
          title: '确认',
          content: '确认拖拽到此位置吗？',
          onOk: () => resolve('')
        })
      })
    },
    refreshData() {
      const vm = this.$refs.pagerTableRef
      vm.refreshData()
    },
    refreshPage() {
      const vm = this.$refs.pagerTableRef
      vm.refreshPage()
    },
    toPage() {
      const vm = this.$refs.pagerTableRef
      vm.toPage(4, 30)
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  padding: 10px;
}

.query-panel {
  margin-bottom: 10px;
}
</style>