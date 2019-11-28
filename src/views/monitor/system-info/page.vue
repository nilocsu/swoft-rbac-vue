<template>
  <d2-container>
    <el-row :gutter="8">
      <el-col :span="14">
      <!-- <el-row :gutter="8"> -->
      <el-card>
        <div slot="header" class="clearfix">
          <span>swoole stats</span>
        </div>
        <el-table
          :data="stats"
          style="width: 100%">
            <el-table-column
              prop="key"
              label="参数">
            </el-table-column>
            <el-table-column
              prop="description"
              label="描述">
            </el-table-column>
            <el-table-column
              prop="value"
              label="当前值">
            </el-table-column>
        </el-table>
      </el-card>
      <!-- </el-row> -->

      </el-col>
      <el-col :span="10">
        <!-- <el-card>
          <p>swoole信息</p>
          <template v-if="swooleInfo.enable">
            <el-table
              :data="swooleInfo.enable"
              style="width: 100%">
                <el-table-column
                  prop="name"
                  label="参数">
                </el-table-column>
                <el-table-column
                  prop="value"
                  label="当前值">
                </el-table-column>
            </el-table>
          </template>
        </el-card> -->
        <el-card>
          <div slot="header" class="clearfix">
            <span>服务器信息</span>
          </div>
          <div>php版本:{{system.env.phpVersion}}</div>
          <div>swoole版本:{{system.env.swooleVersion}}</div>
          <div>swoft版本:{{system.env.swoftVersion}}</div>
          <div>mysql版本:{{system.mysqlVersion}}</div>
          <div>上传文件限制大小:{{system.upSize}}</div>
          <div>request&nbsp;请求最长耗时:{{system.max_execution_time}}</div>
          <div>硬盘可用空间:{{system.free_space}}</div>
          <div>系统os:{{system.env.os}}</div>
        </el-card>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
import * as informationService from '@/api/monitor/info'
export default {
  name: 'Info',
  data () {
    return {
      time: '',
      loading: true,
      system: {
        mysqlVersion: '',
        upSize: '',
        max_execution_time: '',
        free_space: '',
        env: {
          os: '',
          phpVersion: '',
          swooleVersion: '',
          swoftVersion: ''
        }
      },
      extList: [],
      processes: {},
      swooleInfo: [],
      stats: []
    }
  },
  mounted () {
    informationService.information().then(data => {
      this.system = data
    })
    informationService.stats().then(data => {
      this.stats = data
    })
    informationService.processes().then(data => {
      this.processes = data
      console.log(data)
    })
    // informationService.swooleInfo().then(data => {
    //   this.swooleInfo = data
    // })
    // informationService.phpExts().then(data => {
    //   this.extList = data
    // })
  },
  methods: {
    create () {
    },
    convert (value) {
      return Number(value * 100).toFixed(2)
    }
  }
}
</script>
