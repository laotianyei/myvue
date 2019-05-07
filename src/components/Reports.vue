<template>
  <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
  <div id="main" style="width: 700px;height:400px;"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  mounted() {
    this.aa()
  },
  methods: {
    async aa() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      const res = await this.$http.get(`reports/type/1`)
      let tubiao = res.data.data
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
      
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
      }
        let options = { ...option, ...tubiao }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(options)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
