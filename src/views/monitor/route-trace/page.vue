<template>
  <d2-container>
    <el-tabs v-model="activeName" @tab-click="handleClick"  type="border-card">
      <el-tab-pane label="http-router" name="first">http-router</el-tab-pane>
      <el-tab-pane label="ws-router" name="second">ws-router</el-tab-pane>
      <el-tab-pane label="rpc-router" name="third">rpc-router</el-tab-pane>
      <el-table
        :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%">
        <el-table-column
          label="url"
          prop="path">
        </el-table-column>
        <el-table-column
          label="请求方法"
          prop="method">
        </el-table-column>
        <el-table-column
          label="handler"
          prop="handler">
        </el-table-column>
        <el-table-column
          label="uri规则"
          prop="pathRegex">
        </el-table-column>
        <el-table-column
          align="right">
          <template slot="header">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"/>
          </template>
        </el-table-column>
      </el-table>
    </el-tabs>
  </d2-container>
</template>

<script>
import * as routeService from '@/api/monitor/router'
export default {
  name: 'routeTrace',
  data () {
    return {
      tableData: [],
      search: '',
      activeName: 'second'
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    fetchList () {
      routeService.getHttpRoutes().then(res => {
        this.tableData = res
      })
    }
  },
  created () {
    this.fetchList()
  }
}
</script>
