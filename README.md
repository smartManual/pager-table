组件原理说明：UI视图层(即页面的查询条件)对应view对象，查询条件对应query对象，点击‘查询’按钮，执行如下代码示例

```javascript
this.query = Object.assign({}, this.query, {
  name: this.view.name
})
```

组件内部通过监听query属性对象的变化，从而触发查询接口。组件内部提供了overflow scopedSlot,采用tooltip进行溢出悬浮展示，具体见下方代码示例。



###### Props

| 参数            | 说明                                                         | 类型         | 默认值                                      |
| --------------- | ------------------------------------------------------------ | ------------ | ------------------------------------------- |
| queryApi        | 列表查询接口                                                 |              |                                             |
| query           | 查询条件对应的参数                                           | object       | 默认为空对象                                |
| queryOnMounted  | 是否在mounted时主动触发查询                                  | boolean      | true                                        |
| showLoading     | 查询时是否展示table的loading                                 | boolean      | true                                        |
| transformData   | 对列表数据进行转换，可以添加属性或对数据进行处理等           | function     |                                             |
| listKey         | 列表数据的属性path                                           | string       | 'list'                                      |
| currentKey      | 当前页的属性path                                             | string       | 'current'                                   |
| hasCurrent      | 后端接口是否返回了是第几页的信息                             | boolean      | false                                       |
| totalKey        | 总页数的属性path                                             | string       | 'total'                                     |
| pagerParams     | 分页查询对应的页码值,这个用来设置页码参数对应的入参，current表示当前页的入参，pageSize表示每页条数的入参 | object       | { current: 'pageNum',pageSize: 'pageSize' } |
| defaultPageSize | 默认的每页条数                                               | number       | 10                                          |
| refreshTime     | 查询接口轮询时间间隔，单位毫秒，如果设置改属性，列表数据将定时刷新 | number\|null | null                                        |
| rowDragEnd      | 行拖拽后触发的函数，返回 `promise`，可以做二次确认是否移动到目标位置 | function     |                                             |

###### columns

| 属性名称                                        | 说明                                                         | 类型    |
| ----------------------------------------------- | ------------------------------------------------------------ | ------- |
| resizable                                       | 设置该列是否可拖拽改变列框，true表示可拖拽，false或不设置表示不可拖拽 | boolean |
| tooltip                                         | 设置tooltip相关属性，只有在scopedSlots: { customRender: 'overflow' }时生效 | object  |
| scopedSlots: { customRender: 'overflow' }       | 可以让单元格内容根据宽度自动省略,悬停并出现tooltip,如果没有溢出则不显示tooltip |         |
| scopedSlots: { customRender: 'dragSort' }       | 显示行拖拽排序                                               |         |
| scopedSlots: { customRender: 'index' }          | 显示序号                                                     |         |
| scopedSlots: { customRender: 'incrementIndex' } | 显示自增序号                                                 |         |



###### events

| 事件名称     | 说明                   | 回调参数                         |
| ------------ | ---------------------- | -------------------------------- |
| query        | 查询前触发的回调函数   | Function()                       |
| querySuccess | 查询成功触发的回调函数 | Function(dataSource, pagination) |

###### 方法

| 方法名称    | 说明               | 入参                                                         |
| ----------- | ------------------ | ------------------------------------------------------------ |
| refreshPage | 重新查询第一页数据 |                                                              |
| refreshData | 刷新当前页数据     |                                                              |
| toPage      | 跳转到特定页       | toPage(page, pageSize),page：要跳转的页码,pageSize 每页的条数 |



代码示例：

```vue
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
        // fixed: 'left',
        // resizable: true,
        sorter: true,
        filters: [
          { text: 'Joe', value: 'Joe' },
          { text: 'Jim', value: 'Jim' },
        ],
      }, {
        title: '时间',
        dataIndex: 'timeText',
        width: 170,
        // resizable: true,
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
        // resizable: true
      }, {
        title: '排序',
        dataIndex: 'dragSort',
        width: 60,
        scopedSlots: { customRender: 'dragSort' },
        // resizable: true
      }, {
        title: '操作',
        width: 180,
        scopedSlots: { customRender: 'action' },
        // fixed: 'right',
        // resizable: true
      }]
    }
  },
  methods: {
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
      return new Promise((reslove, reject) => {
        resolve('')
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
```