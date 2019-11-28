<template>
  <d2-container>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>个人信息</span>
        </div>
          <div class="head-info-avatar" style="float:left">
            <div style="margin-bottom:25px;margin-left:10px;">
              <el-avatar :size="75" src="https://tva3.sinaimg.cn/crop.0.0.100.100.180/006bfFfJjw8euif1u1gkrj302s02sjr7.jpg?KID=imgbed,tva&Expires=1573146953&ssig=ARZ8wxpqR4"></el-avatar>
            </div>
            <el-button icon="fa fa-gear" round size="mini" @click.native="editFormVisible = !editFormVisible">编辑资料</el-button>
          </div>
          <div class="info">
            <p>账号: {{info.username}}</p>
            <p>昵称: {{info.realName}}</p>
            <p>角色: {{showRole()}}</p>
            <p>部门: {{showDept()}}</p>
            <p>性别: {{info.sex}}</p>
            <p>电话: {{info.mobile}}</p>
            <p>邮箱: {{info.email}}</p>
            <p>简介: {{info.description}}</p>
          </div>
        </el-card>
    <user-edit
      :user="info"
      v-model="editFormVisible"
      @submit="getTableData"
    />
  </d2-container>
</template>

<script>
import UserEdit from './components/user-edit'
import { mapState } from 'vuex'
export default {
  name: 'profile',
  components: { UserEdit },
  data () {
    return {
      editFormVisible: false
    }
  },
  computed: {
    ...mapState('d2admin', {
      info: state => state.user.info,
      permission: state => state.permission
    })
  },
  mounted () {
  },
  methods: {
    showDept () {
      if (this.permission.dept.length > 0) {
        return this.permission.dept
      }
      return '暂无部门'
    },
    showRole () {
      if (this.permission.roles.length > 0) {
        return this.permission.roles.join('‧')
      }
      return '暂无角色'
    },
    getTableData () {
    }
  }
}
</script>

<style>
  .info {
    margin-left: 105px;
  }
  .info p {
    margin: 2px 0;
  }
</style>
