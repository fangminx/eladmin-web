<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <!-- <github-corner class="github-corner" /> -->

      <!-- <panel-group @handleSetLineChartData="handleSetLineChartData" />

      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart :chart-data="lineChartData" />
      </el-row> -->

      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <el-calendar>
          <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
          <template
            slot="dateCell"
            slot-scope="{date, data}">
            <p> <!--这里原本有动态绑定的class，去掉-->
              {{ data.day.split('-').slice(1).join('月') + '日' }}<br /> {{dealMyDate(data.day)}}
            </p>
          </template>
        </el-calendar>
      </el-row>

      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <ve-histogram width="100%" height="700px" :data="chartData" :data-zoom="dataZoom"></ve-histogram>
      </el-row>
      <!-- <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <radar-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <pie-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <bar-chart />
          </div>
        </el-col>
      </el-row> -->
    </div>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RadarChart from '@/components/Echarts/RadarChart'
import PieChart from '@/components/Echarts/PieChart'
import BarChart from '@/components/Echarts/BarChart'
import { getAllHoliday } from '@/api/configUser'
import { getCanlendarInfo } from '@/api/holidayRecord'
import dataZoom from 'echarts/lib/component/dataZoom'


// const lineChartData = {
//   newVisitis: {
//     expectedData: [100, 120, 161, 134, 105, 160, 165],
//     actualData: [120, 82, 91, 154, 162, 140, 145]
//   },
//   messages: {
//     expectedData: [200, 192, 120, 144, 160, 130, 140],
//     actualData: [180, 160, 151, 106, 145, 150, 130]
//   },
//   purchases: {
//     expectedData: [80, 100, 121, 104, 105, 90, 100],
//     actualData: [120, 90, 100, 138, 142, 130, 130]
//   },
//   shoppings: {
//     expectedData: [130, 140, 141, 142, 145, 150, 160],
//     actualData: [120, 82, 91, 154, 162, 140, 130]
//   }
// }

export default {
  name: 'Dashboard',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RadarChart,
    PieChart,
    BarChart
  },
  data() {
    this.dataZoom = [
        {
          type: 'slider',
          start: 0,
          end: 10
        }
      ]
    return {
      // lineChartData: lineChartData.newVisitis,
      chartData: {
          columns: ['用户名', '假期总数', '剩余假期','优先级'],
          rows: [
          ]
        },
      resDate: [
      
       ]
    }
  },
  created() {
    getAllHoliday().then(res => {
        this.chartData.rows = res
    }),
    this.getCanlendarInfoByUserName()
  },
  methods: {
    // handleSetLineChartData(type) {
    //   this.lineChartData = lineChartData[type]
    // },
    // getAllHolidayForVChar() {
    //   getAllHoliday().then(res => {
    //     this.chartData.rows = res
    //   })
    // }

    dealMyDate(v) {
      let len = this.resDate.length
      let res = ""
      for(let i=0; i<len; i++){
          if(this.resDate[i].date == v) { 
              if(this.resDate[i].content == '申请成功' || this.resDate[i].content == '已休假'){
                res = '🍓' + this.resDate[i].content
              }else{
                res = '🍆' + this.resDate[i].content
              }
              break
         }
      }
      return res
    },
    getCanlendarInfoByUserName() {
      this.$store.dispatch('GetInfo').then(res => {
          console.log(res.user.username)
          getCanlendarInfo(res.user.username).then(res => {
            this.resDate = res
          })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
