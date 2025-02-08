<template>
  <a-table
    row-key="name"
    :columns="columns"
    :data-source="dataSource"
    :scroll="{ x: 300, y: 400 }"
  />
</template>

<script>
import moment from 'moment'

export default {
  data() {
    return {
      dataSource: [],
      columns: [{
        title: '姓名',
        dataIndex: 'name',
        width: 100,
        // fixed: 'left'
      }, {
        title: '时间',
        dataIndex: 'time',
        width: 170,
      }, {
        title: '邮箱',
        dataIndex: 'email',
        width: 140,
      }, {
        title: '地址',
        dataIndex: 'address',
        width: 140,
        ellipsis: true,
      }, {
        title: '排序',
        dataIndex: 'dragSort',
        width: 60,
      }, {
        title: '操作',
        dataIndex: 'action',
        width: 180,
        scopedSlots: { customRender: 'action' },
        fixed: 'right'
      }]
    }
  },
  mounted() {
    this.queryList({ pageNum: 1, pageSize: 10 }).then(res => {
      this.dataSource = res.list || []
    })
  },
  methods: {
    queryList(params) {
      const promise = new Promise((resolve, reject) => {
        const list = []
        for (let i = 0; i < params.pageSize; i++) {
          list.push({
            id: `${params.pageNum}_${i}`,
            name: `张三_${params.pageNum}_${i}`,
            time: moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss'),
            email: '108937689278@qq.com',
            dragSort: '111',
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
  }
}
</script>