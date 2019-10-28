<template>
  <el-dialog :visible.sync="dialogVisible" @open="dialogOpen">
    <div slot="title">维护
      <el-tag>{{role.name}}</el-tag>权限</div>
    <el-input size="mini" placeholder="输入关键字进行过滤" v-model="filterText" style="padding-bottom: 5px;"></el-input>
    <div style="max-height:420px;overflow:auto">
      <el-tree ref="tree" show-checkbox check-on-click-node highlight-current node-key="id" :data="permissionList" :filter-node-method="filterNode" :expand-on-click-node="false">
        <span slot-scope="{ node , data }">
          {{data.menuName}}
        </span>
      </el-tree>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="loading" @click="saveRolePermission">保存</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </el-dialog>

</template>
<script>
import * as roleService from '@/api/sys/role'
import * as menuService from '@/api/sys/menu'
export default {
  name: 'rolePermission',
  props: {
    role: Object,
    value: Boolean
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      filterText: '',
      permissionList: []
    }
  },
  watch: {
    value (val) {
      this.dialogVisible = val
    },
    dialogVisible (val) {
      this.$emit('input', val)
    },
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    async dialogOpen () {
      let menus = await menuService.getMenuListTree()
      let roleMenus = await roleService.getRoleMenus(this.role.id)
      this.permissionList = menus.data
      let newArr = []
      roleMenus.forEach(item => {
        this.checked(item, menus.data, newArr)
      })
      this.$refs.tree.setCheckedKeys(newArr)
    },
    checked (id, data, newArr) {
      data.forEach(item => {
        if (item.id === id) {
          if (item.children !== undefined) {
            newArr.push(item.id)
          }
        } else {
          if (item.children && item.children.length !== 0) {
            this.checked(id, item.children, newArr)
          }
        }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.menuName.indexOf(value) !== -1
    },
    saveRolePermission () {
      let checkedNodes = this.$refs.tree.getCheckedNodes(false, true)
      let checkedMenus = []
      for (let checked of checkedNodes) {
        checkedMenus.push(checked.id)
      }
      let data = {
        menuIds: checkedMenus
      }
      this.loading = true
      roleService.updateRoleMenus(this.role.id, data).then(data => {
        this.loading = false
        this.dialogVisible = false
      })
    },
    getParentNode () {

    },
    close () {
      this.dialogVisible = false
    }
  }
}
</script>
