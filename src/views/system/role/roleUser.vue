<template>
  <el-dialog :visible.sync="dialogVisible" @open="dialogOpen">
    <div slot="title">维护
      <el-tag>{{role.name}}</el-tag>用户</div>
    <el-form :inline="true" :model="searchForm" ref="searchForm" size="mini" style="margin-bottom: -18px;">
      <el-form-item label="名称" prop="name">
        <el-input v-model="searchForm.name" placeholder="名称" style="width: 100px;" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="searchForm.email" placeholder="邮箱" style="width: 120px;" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearchFormSubmit">
          <d2-icon name="search" /> 查询
        </el-button>
      </el-form-item>

      <el-form-item>
        <el-button @click="handleSearchFormReset">
          <d2-icon name="refresh" /> 重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" v-loading="loading" size="small" stripe highlight-current-row style="width: 100%;" @sort-change="handleSortChange">
      <el-table-column label="账号名称" prop="username">
        <template slot-scope="scope">
          {{scope.row.username}}
        </template>
      </el-table-column>
      <el-table-column label="用户名称" prop="realName">
        <template slot-scope="scope">
          {{scope.row.realName}}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" sortable="custom" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.email}}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="isAdd">
        <template slot-scope="scope">
          <el-tag
            v-if="renderRole(scope.row.id)"
            size="mini"
            type="success"
          >已添加</el-tag>
          <el-tag
            v-else
            size="mini"
            type="info"
          >未添加</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="renderRole(scope.row.id)"
            v-hasPermission="['role:delete']"
            type="danger"
            title="移除"
            size="mini"
            icon="el-icon-minus"
            circle
            @click="modifyRoleUser(scope.row.id,0)"
          ></el-button>
          <el-button
            v-else
            v-hasPermission="['role:add']"
            type="primary"
            title="添加"
            size="mini"
            icon="el-icon-plus"
            circle
            @click="modifyRoleUser(scope.row.id,1)"
          ></el-button>
        </template>
      </el-table-column>

    </el-table>
    <div slot="footer">
      <el-pagination :current-page="page.current" :page-size="page.size" :total="page.total" :page-sizes="[1,100, 200, 300, 400]" layout="total, sizes, prev, pager, next, jumper" style="margin: -10px;" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </el-dialog>
</template>
<script>
import * as userService from '@/api/sys/user'
import * as roleService from '@/api/sys/role'
export default {
  name: 'roleUser',
  props: {
    role: Object,
    value: Boolean
  },
  data () {
    return {
      dialogVisible: false,
      searchForm: {
        name: '',
        email: ''
      },
      loading: false,
      tableData: [],
      userRoles: [],
      page: {
        current: 1,
        size: 100,
        total: 0
      },
      sort: {
        prop: '',
        order: ''
      }
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    async dialogOpen () {
      this.getTableData()
      roleService.getRoleUsers(this.role.id).then(res => {
        this.userRoles = res
      })
    },
    renderRole (v) {
      if (this.userRoles.includes(v)) {
        return true
      }
      return false
    },
    getTableData () {
      let query = {
        pageIndex: this.page.current,
        pageSize: this.page.size,
        sortBy: this.sort.prop,
        descending: this.sort.order === 'descending',
        filter: { ...this.searchForm }
      }
      userService.getUserList(query).then(res => {
        this.tableData = res.data
        this.page.total = res.total
      })
    },
    handleSearchFormSubmit () {
      this.getTableData()
    },
    handleSearchFormReset () {
      this.$refs.searchForm.resetFields()
    },
    handleSortChange (val) {
      this.sort.prop = val.prop
      this.sort.order = val.order
      this.getTableData()
    },
    handleSizeChange (val) {
      this.page.size = val
      this.getTableData()
    },
    handleCurrentChange (val) {
      this.page.current = val
      this.getTableData()
    },
    modifyRoleUser (userId, action) {
      userService
        .updateUserRole(
          userId, {
            roleId: this.role.id,
            action: action
          })
        .then(() => {
          let msg = action === 1 ? '已添加' : '已移除'
          if (action === 1) {
            this.userRoles.push(userId)
          } else {
            this.userRoles.splice(this.userRoles.indexOf(userId), 1)
          }
          this.$notify({
            title: '操作成功',
            message: msg,
            type: 'success'
          })
          this.getTableData()
        })
    }
  }
}
</script>
