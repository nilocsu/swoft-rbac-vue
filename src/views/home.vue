<template>
  <d2-container>
    <el-row :gutter="8" class="head-info" style="margin-bottom:10px">
      <el-card class="head-info-card">
        <el-col :span="16">
          <div class="head-info-avatar" style="float:left">
            <el-avatar :size="75" src="https://tva3.sinaimg.cn/crop.0.0.100.100.180/006bfFfJjw8euif1u1gkrj302s02sjr7.jpg?KID=imgbed,tva&Expires=1573146953&ssig=ARZ8wxpqR4"></el-avatar>
          </div>
          <div class="head-info-count">
            <div class="head-info-welcome">
              {{welcomeMessage}}
            </div>
            <div class="head-info-desc">
              <p>{{showDept()}} | {{showRole()}}</p>
            </div>
            <div class="head-info-time">上次登录时间：{{info.lastLoginTime ? info.lastLoginTime : '第一次访问系统'}}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <el-row class="more-info">
              <el-col :span="8">
                <p>今日IP</p>
                <p>{{todayIp}}</p>
              </el-col>
              <el-col :span="8">
                <p>今日访问</p>
                <p>{{todayVisitCount}}</p>
              </el-col>
              <el-col :span="8">
                <p>总访问量</p>
                <p>{{totalVisitCount}}</p>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-card>
    </el-row>
    <el-row :gutter="8">
      <el-col :span="14">
        <el-card>
          <apexchart ref="count" type=bar height=300 :options="chartOptions" :series="series" />
        </el-card>
      </el-col>
      <el-col :span="10" class="project-wrapper">
        <el-card shadow="hover" style="height:343px;">
          <div slot="header" class="clearfix">
            <span>待办事项</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">添加</el-button> -->
          </div>
          <!-- <el-table :show-header="false" :data="todoList" style="width:100%;">
            <el-table-column>
              <template slot-scope="scope">
                <div
                  class="todo-item"
                >{{scope.row.title}}</div>
              </template>
            </el-table-column>
            <el-table-column width="60">
              <template slot-scope="scope">
                <div>{{scope.row.num}}</div>
              </template>
            </el-table-column>
          </el-table> -->
          <el-row :gutter="8">
            <el-col v-for="(item, i) in todoList" :key="i" :span="12" style="margin-bottom: 9px;">
              <div  class="todo-list">
                <p class="todo-list-title">{{item.title}}</p>
                <p class="todo-list-num">{{item.num}}</p>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </d2-container>
</template>
<script>
import * as userService from '@/api/sys/user'
import { mapState } from 'vuex'
import moment from 'moment'
moment.locale('zh-cn')
export default {
  name: 'home',
  data () {
    return {
      todayIp: '',
      todayVisitCount: '',
      totalVisitCount: '',
      lastLoginTime: '',
      welcomeMessage: '',
      series: [],
      chartOptions: {
        chart: {
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '35%'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: []
        },
        fill: {
          opacity: 1
        }
      },
      todoList: [
        {
          title: '待审核评论',
          num: 88
        },
        {
          title: '待审帖子',
          num: 88
        },
        {
          title: '待审商品',
          num: 88
        },
        {
          title: '待发货',
          num: 88
        }
      ]
    }
  },
  computed: {
    ...mapState('d2admin', {
      info: state => state.user.info,
      permission: state => state.permission
    })
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
      return `${time}，${this.info.realName},${welcomeArr[index]}`
    },
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
    }
  },
  mounted () {
    this.welcomeMessage = this.welcome()
    userService.index(this.info.username).then(res => {
      this.todayIp = res.todayIp
      this.todayVisitCount = res.todayVisitCount
      this.totalVisitCount = res.totalVisitCount
      let sevenVisitCount = []
      let dateArr = []
      for (let i = 6; i >= 0; i--) {
        let time = moment().subtract(i, 'days').format('MM-DD')
        let contain = false
        for (let o of res.lastSevenVisitCount) {
          if (o.days === time) {
            contain = true
            sevenVisitCount.push(o.count)
          }
        }
        if (!contain) {
          sevenVisitCount.push(0)
        }
        dateArr.push(time)
      }
      let sevenUserVistCount = []
      for (let i = 6; i >= 0; i--) {
        let time = moment().subtract(i, 'days').format('MM-DD')
        let contain = false
        for (let o of res.lastSevenUserVisitCount) {
          if (o.days === time) {
            contain = true
            sevenUserVistCount.push(o.count)
          }
        }
        if (!contain) {
          sevenUserVistCount.push(0)
        }
      }
      this.$refs.count.updateSeries([
        {
          name: '总数',
          data: sevenVisitCount
        },
        {
          name: '您',
          data: sevenUserVistCount
        }
      ], true)
      this.$refs.count.updateOptions({
        xaxis: {
          categories: dateArr
        },
        title: {
          text: '近七日系统访问记录',
          align: 'left'
        }
      }, true, true)
    })
  }
}
</script>

<style>
.head-info-count {
  margin-left: 85px;
}
.head-info-count p{
  margin: 5px 0;
}
.head-info-desc p, .head-info-time {
  color:#8c8e91;
  font-size: 13px;
}
.todo-list {
  padding-left: 15px;
  padding-top: 15px;
  height: 100px;
  background-color: #ececec;
}
.todo-list p{
  margin: 0;
}
.todo-list .todo-list-title{
  font-size: 14px;
}
.todo-list .todo-list-num{
  padding-top: 15px;
  font-size: 25px;
  color: darkgreen
}

</style>
