<template>
  <el-dialog :visible.sync="dialogVisible" @open="dialogOpen">
    <div slot="title">维护
      <el-tag>{{role.name}}</el-tag>权限</div>
    <el-input size="mini" placeholder="输入关键字进行过滤" v-model="filterText" style="padding-bottom: 5px;"></el-input>
    <div style="max-height:420px;overflow:auto">
      <el-tree
        ref="tree"
        show-checkbox
        check-on-click-node
        default-expand-all
        highlight-current
        node-key="id"
        :data="permissionList"
        :filter-node-method="filterNode"
        :default-checked-keys="checkedId"
        :expand-on-click-node="false"
        :check-strictly="true"
        @check="clickDeal"
      >
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
  name: 'RolePermission',
  props: {
    role: Object,
    value: Boolean
  },
  data () {
    return {
      loading: false,
      dialogVisible: false,
      filterText: '',
      permissionList: [],
      checkedId: []
    }
  },
  updated () {
    // 给多选树设置默认值
    // this.$refs.tree.setCheckedKeys(this.checkedId)
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
      let menus = await menuService.getMenuList()
      let roleMenus = await roleService.getRoleMenus(this.role.id)
      this.permissionList = menus
      this.$refs.tree.setCheckedKeys(roleMenus)
    },
    clickDeal (currentObj, treeStatus) {
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      let selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
      // 选中
      if (selected !== -1) {
        // 子节点只要被选中父节点就被选中
        this.selectedParent(currentObj)
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentObj, true)
      } else {
        // 未选中 处理子节点全部未选中
        if (currentObj.children && currentObj.children.length !== 0) {
          this.uniteChildSame(currentObj, false)
        }
      }
    },
    // 统一处理子节点为相同的勾选状态
    uniteChildSame (treeList, isSelected) {
      this.$refs.tree.setChecked(treeList.id, isSelected)
      if (treeList.children) {
        for (let i = 0; i < treeList.children.length; i++) {
          this.uniteChildSame(treeList.children[i], isSelected)
        }
      }
    },
    // 统一处理父节点为选中
    selectedParent (currentObj) {
      let currentNode = this.$refs.tree.getNode(currentObj)
      if (currentNode.parent.key !== undefined) {
        this.$refs.tree.setChecked(currentNode.parent, true)
        this.selectedParent(currentNode.parent)
      }
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
        this.$emit('submit')
      }).catch(() => {
        this.loading = false
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
