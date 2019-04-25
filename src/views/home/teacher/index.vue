<template>
  <div class="home-container">
    <!-- <h3>laoshi</h3> -->

    <div class="just-loading" v-if="loading" v-loading="loading"></div>
    <el-row v-for="(i,index) in chartData" :key="'chart'+index">
      <router-link
        :to="{ name: 'Homework', params: { courseId:i.cid,courseName:i.cname ,activeName:i.wid}}"
        tag="a"
      >
        <div class="chart-title">
          {{i.lastwork.name}}
          <!-- <span>创建于{{i.lastwork.createtime | substrDate}}</span> -->
          <el-tooltip :content="'作业创建于'+i.lastwork.createtime" placement="top">
            <span>开放时间：{{i.lastwork.starttime | substrDate}} - {{i.lastwork.closetime | substrDate}}</span>
          </el-tooltip>
        </div>
      </router-link>
      <el-col :xs="24" :sm="12">
        <pie-chart :chart-data="i.pie"></pie-chart>
        <!-- <bar-chart></bar-chart> -->
      </el-col>
      <el-col :xs="24" :sm="12">
        <!-- <pie-chart></pie-chart> -->
        <bar-chart v-if="i.bar" :chart-data="i.bar"></bar-chart>
      </el-col>
      <!-- <el-col :xs="24" :sm="12">
        <line-chart :chart-data="lineChartData"/>
      </el-col>-->
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import countTo from "vue-count-to"; //https://github.com/PanJiaChen/vue-countTo
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import { chartDataByTid } from "@/api/course";

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  }
};

export default {
  name: "Dashboard",
  components: {
    countTo,
    LineChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      startVal: 0,
      endVal: 27,
      lineChartData: lineChartData.newVisitis,
      loading: false,
      chartData: []
    };
  },
  methods: {},
  // computed: {
  //   ...mapGetters(["name", "roles", "email", "number"])
  // },
  created() {
    this.loading = true;
    chartDataByTid(this.$store.getters.id)
      .then(res => {
        console.log(res.data);

        let tempArr = [];
        res.data.courses.forEach(c => {
          if (c.lastwork) {
            let stucount = c.stucount;
            let submitcount = c.lastwork.submitcount;

            tempArr.push({
              cid: c.id,
              cname: c.name,
              lastwork: c.lastwork, //最新作业
              pie: {
                wname: c.lastwork.name,
                stucount: stucount,
                data: [
                  { name: "已提交", value: submitcount },
                  { name: "未提交", value: stucount - submitcount }
                ]
              },
              bar: {
                quescount: c.lastwork.quescount,
                data: c.numByScore
              }
            });
          }
        });
        this.chartData = tempArr.sort((a, b) => {
          //按作业创建日期对作业降序排序
          if (a.lastwork.createtime == b.lastwork.createtime) {
            return b.lastwork.id - a.lastwork.id; //按作业id降序排序
          }
          return (
            new Date(b.lastwork.createtime).getTime() -
            new Date(a.lastwork.createtime).getTime()
          ); //按作业创建日期降序排序
        });
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        this.$message.error(err);
      });
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.home-container {
  background-color: #fafafa;
  padding: 30px;

  .just-loading {
    min-height: calc(100vh - 150px);
    max-height: 100vh;
    width: 94%;
    position: absolute;
    z-index: 3;
  }
  .chart-title {
    font-size: 17px;
    padding-bottom: 6px;
    color: #909399;
    transition: color 0.4s;
    span {
      font-size: 12px;
      margin-left: 8px;
    }
    &:hover {
      cursor: pointer;
      color: #409eff;
    }
  }
  .chart {
    background-color: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
    border-radius: 5px;
  }
}
</style>
