<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>

<script>
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

export default {
  name: 'App',
  components: {
    AConfigProvider: ConfigProvider
  },
  data() {
    return {
      locale: zhCN
    }
  }
}
</script>