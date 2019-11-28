<template>
    <d2-container>
    <el-button-group>
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="add"
      >添加</el-button>
      <el-button
        type="primary"
        icon="el-icon-edit"
        size="mini"
        @click="edit"
      >编辑</el-button>
      <el-button
        type="danger"
        icon="el-icon-delete"
        size="mini"
        @click="del"
        v-if="multipleSelection.length>0"
      >删除</el-button>
    </el-button-group>
    <el-row :gutter="8">
      <el-col
        :span="11"
        style="margin-top:15px;"
      >
        <el-tree
          ref="tree"
          class="filter-tree"
          node-key="id"
          highlight-current
          show-checkbox
          :expand-on-click-node="false"
          :data="deptList"
          :props="defaultProps"
          @node-click="getDeptData"
          :filter-node-method="filterNode"
          :check-strictly="true"
          @check="clickDeal"
          @check-change="handleSelectionChange"
        ></el-tree>
      </el-col>
      <el-col
        :span="13"
        style="margin-top:15px;"
      >
      <el-card shadow="always">
          <el-form
            label-position="right"
            label-width="80px"
            :model="deptform"
            ref="deptform"
          >
            <el-form-item
              label="父级节点"
              prop="parentId"
            >
            <el-cascader
              v-model="select"
              :options="depts"
              :props="{ checkStrictly: true, value: 'id', label: 'deptName' }"
              @change="handleChange"
              clearable
            >
            </el-cascader>
            </el-form-item>

            <el-form-item
              label="部门名称"
              prop="deptName"
            >
              <el-input
                v-model="deptform.deptName"
                placeholder="请输入部门名称"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="部门排序"
              prop="orderNum"
            >
              <el-input
                v-model="deptform.orderNum"
                placeholder="请输入部门排序"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-button
            type="primary"
            @click="submit"
            style="float:right;margin-bottom:20px"
            :loading="loading"
          >保存</el-button>
      </el-card>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
import * as deptService from '@/api/sys/dept'
export default {
  name: 'DeptPage',
  data () {
    return {
      loading: false,
      formEdit: false,
      currentId: 0,
      deptList: [],
      select: [0],
      depts: [],
      defaultProps: {
        label: 'deptName'
      },
      deptform: {
        id: '',
        parentId: 0
      },
      multipleSelection: [],
      editFormDialogVisible: false,
      relateInterfaceDialogVisible: false
    }
  },
  methods: {
    getDeptList () {
      deptService.getDeptTree().then(data => {
        this.deptList = data
        this.depts = [{ id: 0, deptName: '顶级部门' }, ...data]
      })
    },
    clickDeal (currentObj, treeStatus) {
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      let selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
      // 选中
      if (selected !== -1) {
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentObj, true)
      } else {
        // 未选中 处理子节点全部未选中
        if (currentObj.children && currentObj.children.length !== 0) {
          this.uniteChildSame(currentObj, false)
        }
        // 未选中 期处理父节点全部未选中
        if (currentObj.parentId !== 0) {
          this.selectedParent(currentObj)
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
    // 统一处理父节点为未选中
    selectedParent (currentObj) {
      let currentNode = this.$refs.tree.getNode(currentObj)
      if (currentNode.parent.key !== undefined) {
        this.$refs.tree.setChecked(currentNode.parent, false)
        this.selectedParent(currentNode.parent)
      }
    },
    handleSelectionChange (data, checked, indeterminate) {
      this.multipleSelection = this.$refs.tree.getCheckedNodes(false, true)
    },
    filterNode (value, data) {
      if (!value) return true
      return data.menuName.indexOf(value) !== -1
    },
    handleChange (v) {
      if (v) {
        this.deptform.parentId = v[v.length - 1]
      }
    },
    getDeptData (data) {
      this.deptform = data
      if (data.parentId === 0) {
        this.select = [0]
      } else {
        this.select = data.parentId
      }
    },
    add () {
      this.deptform = {
        id: 0,
        parentId: this.currentId
      }
      this.formEdit = true
      this.select = [0]
    },
    edit () {
      this.formEdit = true
    },
    del () {
      this.$confirm('确认删除？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(() => {
        deptService
          .delDept(this.multipleSelection.map(s => s.id))
          .then(() => {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            })
            this.getDeptList()
            this.multipleSelection = []
          })
          .catch(() => {
            this.$message({
              showClose: true,
              message: '删除失败',
              type: 'error'
            })
          })
      })
    },
    reset () {
      this.deptform = {
      }
    },
    submit () {
      this.$refs['deptform'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.deptform.id) {
            deptService
              .saveRole(this.deptform.id, { ...this.deptform })
              .then(data => {
                this.$message({
                  showClose: true,
                  message: '更新成功',
                  type: 'success'
                })
                this.loading = false
                this.getDeptList()
              })
              .catch(() => {
                this.loading = false
                this.$message({
                  showClose: true,
                  message: '更新失败',
                  type: 'error'
                })
              })
          } else {
            deptService
              .addDept({ ...this.deptform })
              .then(data => {
                this.$message({
                  showClose: true,
                  message: '添加成功',
                  type: 'success'
                })
                this.loading = false
                this.getDeptList()
              })
              .catch(() => {
                this.loading = false
                this.$message({
                  showClose: true,
                  message: '新增失败',
                  type: 'error'
                })
              })
          }
        } else {
          return false
        }
      })
    }
  },
  created () {
    this.getDeptList()
  }
}
</script>
