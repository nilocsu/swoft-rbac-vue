<template>
  <d2-container>

  </d2-container>
</template>

<script>
export default {
  name: 'SystemInfo',
  data () {
    return {
      time: '',
      loading: true,
      system: {
        cpu: {
          count: 0,
          usage: 0
        },
        process: {
          cpuUsage: 0,
          uptime: 0,
          startTime: 0
        }
      }
    }
  },
  mounted () {
    this.create()
  },
  methods: {
    create () {
      // this.time = moment().format('YYYY年MM月DD日 HH时mm分ss秒')
      // axios.all([
      //   this.$get('actuator/metrics/system.cpu.count'),
      //   this.$get('actuator/metrics/system.cpu.usage'),
      //   this.$get('actuator/metrics/process.uptime'),
      //   this.$get('actuator/metrics/process.start.time'),
      //   this.$get('actuator/metrics/process.cpu.usage')
      // ]).then((r) => {
      //   this.system.cpu.count = r[0].data.measurements[0].value
      //   this.system.cpu.usage = this.convert(r[1].data.measurements[0].value)
      //   this.system.process.uptime = r[2].data.measurements[0].value
      //   this.system.process.startTime = moment(r[3].data.measurements[0].value * 1000).format('YYYY-MM-DD HH:mm:ss')
      //   this.system.process.cpuUsage = this.convert(r[4].data.measurements[0].value)
      //   this.loading = false
      // }).catch((r) => {
      //   console.error(r)
      //   this.$message.error('获取服务器信息失败')
      // })
    },
    convert (value) {
      return Number(value * 100).toFixed(2)
    }
  }
}
</script>
