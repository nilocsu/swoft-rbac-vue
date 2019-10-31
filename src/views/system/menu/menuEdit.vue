<template>
  <el-drawer
    :title="(menu.id ? '编辑':'新增') + '菜单'"
    :visible.sync="dialogVisible"
    direction="rtl"
    custom-class="demo-drawer"
    ref="drawer"
    size="300"
    @open="dialogOpen"
    >
    <div style="padding: 0 25px">
      <el-popover
        ref="popover"
        placement="top-start"
        title="提示"
        width="200"
        trigger="focus"
        content="vue组件的name，不如果是正确的name，该组件不缓存；不支持中文输入">
      </el-popover>
      <el-form
        ref="form"
       :model="form"
        label-width="80px"
        size="small"
       >
        <el-form-item
          label="菜单名称"
          prop="menuName"
          :rules="[{ required: true, message: '不能为空'}]"
        >
          <el-input
            v-model="form.menuName"
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="菜单Url"
          prop="path"
          :rules="[{ required: true, message: '不能为空'}]"
        >
          <el-input
            v-model="form.path"
            placeholder="请输入菜单Url"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="组件名称"
          prop="path"
          :rules="[{ required: true, message: '不能为空'}]"
        >
          <el-input
            v-model="form.name"
            placeholder="组件name"
            onkeyup="this.value=this.value.replace(/[^\w_-]/g,'');"
            @focus="visible = !visible"
            v-popover:popover
          ></el-input>
        </el-form-item>
        <el-form-item
          label="组件地址"
          prop="component"
          :rules="[{ required: true, message: '不能为空'}]"
        >
          <el-input
            v-model="form.component"
            placeholder="请输入组件地址"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="相关权限"
          prop="perms"
        >
          <el-input
            v-model="form.perms"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item
          label="图标"
          prop="icon"
          :rules="[{ required: true, message: '不能为空'}]"
        >
          <d2-icon-select
            v-model="form.icon"
            :user-input="true"
          />
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
        <el-form-item
          label="菜单排序"
          prop="sort"
          :rules="[{ required: true, message: '不能为空'}]"
        >
          <el-input
            v-model="form.sort"
            type='number'
            placeholder=""
          ></el-input>
        </el-form-item>
      <div class="demo-drawer__footer">
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
  name: 'menuEdit',
  props: {
    menu: Object,
    value: Boolean
  },
  data () {
    return {
      dialogVisible: false,
      visible: false,
      loading: false,
      menuObj: {},
      menus: [],
      select: [],
      form: {
        parentId: 0,
        menuName: '',
        path: '',
        component: '',
        perms: '',
        icon: '',
        type: '0',
        sort: ''
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
    },
    menu (val) {
      this.menuObj = val
    }
  },
  methods: {
    async dialogOpen () {
      let menus = await menuService.getMenuListTree()
      if (menus) {
        this.menus = [{ id: 0, menuName: '顶级菜单' }, ...menus]
      } else {
        this.menus = [{ id: 0, menuName: '顶级菜单' }]
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
          this.form.type = '0'
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
