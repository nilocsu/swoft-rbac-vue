<template>
  <el-drawer
    :title="(menu.id ? '编辑':'新增') + '按钮'"
    :visible.sync="dialogVisible"
    direction="rtl"
    custom-class="demo-drawer"
    ref="drawer"
    size="300"
    @open="dialogOpen"
    :before-close="close"
    >
    <div style="padding: 0 25px">
      <el-form
       :model="form"
        ref="form"
        label-width="80px"
        size="small"
       >
        <el-form-item
          label="按钮名称"
          prop="menuName"
          :rules="[{ required: true, message: '不能为空'}]"
        >
          <el-input
            v-model="form.menuName"
            placeholder="请输入按钮名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="相关权限"
          prop="perms"
          :rules="[{ required: true, message: '不能为空'}]"
        >
          <el-input
            v-model="form.perms"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item
          label="上级菜单"
          prop="parentId"
          :rules="[{ required: true, message: '不能为空'}]"
        >
          <el-cascader
            v-model="select"
            :options="menus"
            :props="{ checkStrictly: true, value: 'id', label: 'menuName' }"
            @change="handleChange"
            clearable
          >
          </el-cascader>
        </el-form-item>
      <div>
        <el-button @click="$refs.drawer.closeDrawer()" size="medium">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading" size="medium">确 定</el-button>
      </div>
      </el-form>
    </div>
  </el-drawer>
</template>

<script>
import * as menuService from '@/api/sys/menu'
export default {
  name: 'buttonEdit',
  props: {
    menu: Object,
    value: Boolean,
    type: String
  },
  data () {
    return {
      dialogVisible: false,
      loading: false,
      menus: [],
      select: [],
      form: {
        parentId: 0,
        path: '',
        menuName: '',
        perms: '',
        type: '1',
        sort: '1'
      },
      formLabelWidth: '80px'
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
      let menus = await menuService.getMenuListTree()
      if (menus) {
        this.menus = menus
      }
      if (this.menu) {
        this.form = this.menu
        if (this.menu.parentId !== 0) {
          this.select = this.menu.parentId
        } else {
          this.select = [0]
        }
      } else {
        this.form = {}
      }
    },
    handleChange (v) {
      if (v) {
        this.form.parentId = v[v.length - 1]
      }
    },
    submit () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.menu.id) {
            menuService
              .updateMenu(this.menu.id, { ...this.form })
              .then(data => {
                this.loading = false
                this.dialogVisible = false
                this.$emit('submit')
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            menuService
              .addMenu({ ...this.form })
              .then(data => {
                this.loading = false
                this.dialogVisible = false
                this.$emit('submit')
              })
              .catch(() => {
                this.loading = false
              })
          }
        } else {
          return false
        }
      })
    },
    close () {
      this.$refs['form'].resetFields()
      this.dialogVisible = false
      this.loading = false
    }
  }
}
</script>
