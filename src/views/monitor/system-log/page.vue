<template>
  <d2-container>
    <template slot="header">
      <el-form
        :inline="true"
        :model="searchForm"
        ref="searchForm"
        size="mini"
        style="margin-bottom: -18px;"
      >
        <el-form-item
          label="操作人"
          prop="username"
        >
          <el-input
            v-model="searchForm.username"
            placeholder="操作人"
            style="width: 100px;"
          />
        </el-form-item>
        <el-form-item
          label="操作描述"
          prop="operation"
        >
          <el-input
            v-model="searchForm.operation"
            placeholder="操作描述"
            style="width: 120px;"
          />
        </el-form-item>
        <el-form-item
          label="操作时间"
          prop="operation"
        >
          <el-date-picker
            v-model="dateTime"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd hh:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleSearchFormSubmit"
          >
            <d2-icon name="search" /> 查询
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button @click="handleSearchFormReset">
            <d2-icon name="refresh" /> 重置
          </el-button>
        </el-form-item>
        <el-button
          v-if="multipleSelection.length>0"
          type="danger"
          size="mini"
          icon="el-icon-delete"
          @click="batchDel"
        >
          删除
        </el-button>
      </el-form>
    </template>
    <el-table
      :data="logList"
      ref="multipleTable"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="username"
        label="操作人"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="operation"
        label="操作描述"
      >
      </el-table-column>
      <el-table-column
        prop="time"
        label="耗时"
      >
      <template slot-scope="scope">
        <el-tag v-if="scope.row.time < 500" :type="getType(scope.row.time)">{{scope.row.time}}ms</el-tag>
      </template>
      </el-table-column>
      <el-table-column
        prop="method"
        label="执行方法"
      >
      </el-table-column>
      <el-table-column
        prop="params"
        label="方法参数"
        width="180"
        height="180"
      >
      </el-table-column>
      <el-table-column
        prop="ip"
        label="IP地址"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="location"
        label="操作地点"
      >
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="操作时间"
        sortable
      >
      </el-table-column>
    </el-table>
    <template slot="footer">
      <el-pagination
        :current-page="page.current"
        :page-size="page.size"
        :total="page.total"
        :page-sizes="[1,100, 200, 300, 400]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin: -10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </template>
  </d2-container>
</template>

<script>
import * as logService from '@/api/monitor/log'
export default {
  name: 'systemLog',
  data () {
    return {
      searchForm: {},
      logList: [],
      page: {
        current: 1,
        size: 100,
        total: 0
      },
      sort: {
        prop: '',
        order: ''
      },
      multipleSelection: [],
      dateTime: ''
    }
  },
  methods: {
    getLogList () {
      if (this.dateTime && this.dateTime.length > 0) {
        this.searchForm.createTimeFrom = this.dateTime[0]
        this.searchForm.createTimeTo = this.dateTime[1]
      } else {
        this.searchForm.createTimeFrom = ''
        this.searchForm.createTimeTo = ''
      }
      let query = {
        page: this.page.current,
        pageSize: this.page.size,
        sortBy: this.sort.prop,
        descending: this.sort.order === 'descending',
        filter: this.searchForm
      }
      logService.getLogList(query).then(res => {
        this.logList = res.data
        this.page.total = res.total
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.page.size = val
      this.getLogList()
    },
    handleCurrentChange (val) {
      this.page.current = val
      this.getLogList()
    },
    handleSearchFormReset () {
      this.$refs.searchForm.resetFields()
    },
    handleSearchFormSubmit () {
      this.getLogList()
    },
    batchDel () {
      this.$confirm('确认删除？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(() => {
        logService
          .delLog({
            ids: this.multipleSelection.map(s => s.id)
          })
          .then(() => {
            this.getLogList()
          })
      })
    },
    getType (v) {
      if (v < 500) {
        return 'success'
      } else if (v < 1000) {
        return ''
      } else if (v < 1500) {
        return 'warning'
      } else {
        return 'danger'
      }
    }
  },
  created () {
    this.getLogList()
  }
}
</script>
