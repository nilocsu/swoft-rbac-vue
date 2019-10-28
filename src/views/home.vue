<template>
  <d2-container>
    <el-alert
      :title="welcomeMessage"
      :closable="false"
      type="info">
    </el-alert>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height:252px;">
            <div class="user-info">
              <img src="http://b-ssl.duitang.com/uploads/item/201208/30/20120830173930_PBfJE.jpeg" class="user-avator" alt="">
              <div class="user-info-cont">
                <div class="user-info-name">{{info.name}}</div>
              </div>
            </div>
            <div class="user-info-list">上次登录时间：<span>2018-01-01</span></div>
            <div class="user-info-list">上次登录地点：<span>东莞</span></div>
        </el-card>
      </el-col>
    </el-row>
  </d2-container>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'home',
  data () {
    return {
      todayIp: '',
      todayVisitCount: '',
      totalVisitCount: '',
      lastLoginTime: '',
      welcomeMessage: ''
    }
  },
  computed: {
    ...mapState('d2admin/user', ['info'])
  },
  methods: {
    welcome () {
      const date = new Date()
      const hour = date.getHours()
      let time = hour < 6 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour <= 18 ? '下午好' : '晚上好')))
      let welcomeArr = [
        '喝杯咖啡休息下吧☕',
        '要不要和朋友打局LOL',
        '要不要和朋友打局王者荣耀',
        '几天没见又更好看了呢😍',
        '今天又写了几个Bug🐞呢',
        '今天在群里吹水了吗',
        '今天吃了什么好吃的呢',
        '今天您微笑了吗😊',
        '今天帮助别人解决问题了吗',
        '准备吃些什么呢',
        '周末要不要去看电影？'
      ]
      let index = Math.floor((Math.random() * welcomeArr.length))
      return `${time}，${this.info.name},${welcomeArr[index]}`
    }
  },
  mounted () {
    this.welcomeMessage = this.welcome()
  }
}
</script>
<style>
  .el-row {
      margin-bottom: 20px;
  }
  .grid-content {
      display: flex;
      align-items: center;
      height: 100px;
  }
  .grid-cont-right {
      flex: 1;
      text-align: center;
      font-size: 14px;
      color: #999;
  }
  .grid-num {
      font-size: 30px;
      font-weight: bold;
  }
  .grid-con-icon {
      font-size: 50px;
      width: 100px;
      height: 100px;
      text-align: center;
      line-height: 100px;
      color: #fff;
  }
  .grid-con-1 .grid-con-icon {
      background: rgb(45, 140, 240);
  }
  .grid-con-1 .grid-num {
      color: rgb(45, 140, 240);
  }
  .grid-con-2 .grid-con-icon {
      background: rgb(100, 213, 114);
  }
  .grid-con-2 .grid-num {
      color: rgb(45, 140, 240);
  }
  .grid-con-3 .grid-con-icon {
      background: rgb(242, 94, 67);
  }
  .grid-con-3 .grid-num {
      color: rgb(242, 94, 67);
  }
  .user-info {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #ccc;
      margin-bottom: 20px;
  }
  .user-avator {
      width: 120px;
      height: 120px;
      border-radius: 50%;
  }
  .user-info-cont {
      padding-left: 50px;
      flex: 1;
      font-size: 14px;
      color: #999;
  }
  .user-info-cont div:first-child {
      font-size: 30px;
      color: #222;
  }
  .user-info-list {
      font-size: 14px;
      color: #999;
      line-height: 25px;
  }
  .user-info-list span {
      margin-left: 70px;
  }
  .mgb20 {
      margin-bottom: 20px;
  }
  .todo-item {
      font-size: 14px;
  }
  .todo-item-del {
      text-decoration: line-through;
      color: #999;
  }
  .schart {
      width: 100%;
      height: 300px;
  }

</style>
