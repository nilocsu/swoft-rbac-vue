<template>
  <d2-container>
    <el-button-group>
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="addMenu"
        v-hasPermission="['menu:add']"
      >添加菜单</el-button>
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="addButton"
        v-hasPermission="['menu:add']"
      >添加按钮</el-button>
    </el-button-group>
    <el-popover
      placement="top-start"
      title="温馨提示"
      width="400"
      trigger="hover"
    >
      <li>请不要在`按钮`类型节点下建子节点</li>
      <li>`菜单`类型节点的权限标识请设置为其某个`按钮`类型子节点的权限标识</li>
      <el-button
        slot="reference"
        size="mini"
        icon="el-icon-info"
        style="float:right"
      >操作提示</el-button>
    </el-popover>
    <el-row>
      <el-table
      :data="menuList"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      ref="tree"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
      <el-table-column
        prop="menuName"
        label="名称"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="icon"
        label="图标"
        sortable
        width="80"
      >
      <template slot-scope="scope">
          <i :class="'fa fa-'+scope.row.icon"></i>
      </template>
      </el-table-column>
      <el-table-column
        label="类型"
        prop="type"
        sortable
        width="80"
      >
      <template slot-scope="scope">
        <el-tag
          :type="scope.row.type === '1' ? 'primary' : 'success'"
          disable-transitions>{{scope.row.type === '1' ? '按钮': '菜单'}}</el-tag>
      </template>
      </el-table-column>
      <el-table-column
        label="Vue组件"
        prop="component"
        sortable
      >
      </el-table-column>
      <el-table-column
        label="权限"
        prop="perms"
        sortable
        width="120"
      >
      </el-table-column>
      <el-table-column
        label="菜单Url"
        prop="path"
        sortable
      >
      </el-table-column>
      <d2-permission :authority="['menu:update', 'menu:delete']">
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="120"
          v-hasAnyPermission="['menu:update', 'menu:delete']"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              title="编辑"
              size="mini"
              icon="el-icon-edit"
              circle
              @click="openEditForm(scope.row)"
              v-hasPermission="['menu:update']"
            ></el-button>
            <el-button
              type="danger"
              title="删除"
              size="mini"
              icon="el-icon-delete"
              circle
              @click="del(scope.row)"
              v-hasPermission="['menu:delete']"
            ></el-button>
          </template>
        </el-table-column>
      </d2-permission>
      </el-table>
    </el-row>
    <button-edit
      v-model="buttonFormEdit"
      :menu="menu"
      @submit="getMenuList"
    ></button-edit>
    <menu-edit
      v-model="menuFormEdit"
      :menu="menu"
      @submit="getMenuList"
    ></menu-edit>
  </d2-container>
</template>

<script>
import ButtonEdit from './components/button-edit'
import MenuEdit from './components/menu-edit'
import * as menuService from '@/api/sys/menu'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'MenuPage',
  components: { ButtonEdit, MenuEdit },
  data () {
    return {
      buttonFormEdit: false,
      menuFormEdit: false,
      menu: {},
      menuList: []
    }
  },
  computed: {
    ...mapState('d2admin/permission', [
      'router'
    ])
  },
  methods: {
    ...mapActions('d2admin/permission', ['reload']),
    getMenuList () {
      menuService.getMenuList().then(res => {
        this.menuList = res
      })
    },
    openEditForm (data) {
      let m = JSON.parse(JSON.stringify(data))
      this.menu = { ...m }
      this.menu.children = null
      if (data.type === '0') {
        this.menuFormEdit = true
      } else {
        this.buttonFormEdit = true
      }
      this.formEdit = true
    },
    addMenu () {
      this.menuFormEdit = true
      this.menu = {}
    },
    addButton () {
      this.buttonFormEdit = true
      this.menu = {}
    },
    del (data) {
      this.$confirm('当您点击确定按钮后，这些记录将会被彻底删除，如果其包含子记录，也将一并删除！', '确定删除所选中的记录?', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      }).then(() => {
        let deleteIds = []
        if (data.children && data.length !== 0) {
          this.getChildredIds(data.children, deleteIds)
        }
        let ids = [...[data.id], ...deleteIds]
        menuService
          .delMenu({
            ids: ids
          })
          .then(() => {
            this.getMenuList()
            this.submit()
          })
      })
    },
    getChildredIds (data, newArr) {
      data.forEach(item => {
        newArr.push(item.id)
        if (item.children && item.children.length !== 0) {
          this.getChildredIds(item.children, newArr)
        }
      })
    },
    submit () {
      this.getMenuList()
      this.reload(() => {
        this.$router.addRoutes(this.router)
      })
    }
  },
  created () {
    this.getMenuList()
  }
}
</script>
