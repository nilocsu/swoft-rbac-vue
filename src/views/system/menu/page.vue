<template>
  <d2-container>
    <el-button-group>
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="addMenu"
      >添加菜单</el-button>
      <el-button
        type="primary"
        icon="el-icon-circle-plus-outline"
        size="mini"
        @click="addButton"
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
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="icon"
        label="图标"
        sortable
      >
      <template slot-scope="scope">
          <i :class="'fa fa-'+scope.row.icon"></i>
      </template>
      </el-table-column>
      <el-table-column
        label="类型"
        prop="type"
        sortable
        width="180"
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
        width="180"
      >
      </el-table-column>
      <el-table-column
        label="权限"
        prop="perms"
        sortable
        width="180"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            title="编辑"
            size="mini"
            icon="el-icon-edit"
            circle
            @click="openEditForm(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            title="删除"
            size="mini"
            icon="el-icon-delete"
            circle
            @click="del(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
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
import buttonEdit from './buttonEdit'
import menuEdit from './menuEdit'
import * as menuService from '@/api/sys/menu'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'MenuPage',
  components: { buttonEdit, menuEdit },
  data () {
    return {
      buttonFormEdit: false,
      menuFormEdit: false,
      menu: {},
      menuList: []
    }
  },
  computed: {
    ...mapState('d2admin/menu', [
      'header',
      'aside'
    ])
  },
  methods: {
    ...mapMutations('d2admin/menu', [
    //   'headerSet',
      'asideSet'
    ]),
    getMenuList () {
      menuService.getMenuList().then(res => {
        this.menuList = res
      })
    },
    openEditForm (data) {
      let m = JSON.parse(JSON.stringify(data))
      this.menu = { ...m }
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
    //   menuService.saveMenu(this.menuform).then(() => {
    //     this.getMenuList()
    //     // todo 侧栏需要请求个人的accessRoute
    //     // this.asideSet(this.menuList)
    //   })
    }
  },
  created () {
    this.getMenuList()
  }
}
</script>
