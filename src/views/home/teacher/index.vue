<template>
  <div class="home-container">

    <div class="just-loading" v-if="loading" v-loading="loading"></div>
    <!-- 对于还未开放的作业暂时用v-if隐藏 -->
    <el-row v-for="(i,index) in chartData" :key="'chart'+index" v-if="new Date(i.lastwork.starttime).getTime()<new Date().getTime()">
      <router-link
        :to="{ name: 'Homework', params: { courseId:i.cid,courseName:i.cname ,activeName:i.lastwork.id}}"
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
      <el-col v-if="index%2==0" :xs="24" :sm="12">
        <pie-chart :chart-data="i.pie"></pie-chart>
      </el-col>
      <el-col :xs="24" :sm="12">
        <bar-chart v-if="i.bar" :chart-data="i.bar"></bar-chart>
      </el-col>
      <el-col v-if="index%2!=0" :xs="24" :sm="10" :offset="2">
        <pie-chart :chart-data="i.pie"></pie-chart>
      </el-col>
    </el-row>
    <transition name="slow-fade" appear>
      <el-row v-if="chartData.length==0" class="nodata-tip">
        <svg-icon icon-class="nodata"/>
      </el-row>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import countTo from "vue-count-to"; //https://github.com/PanJiaChen/vue-countTo
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import { chartDataByTid } from "@/api/course";

export default {
  name: "Dashboard",
  components: {
    countTo,
    PieChart,
    BarChart
  },
  data() {
    return {
      startVal: 0,
      endVal: 27,
      loading: false,
      chartData: [],
      courseCount: 0, //查询出来的课程数，以此判断是否用轮询的结果去更新数据
      timer1: null
    };
  },
  methods: {
    showSetTip() {
      if (!this.$store.getters.name || this.$store.getters.name == "null") {
        this.$confirm("您还未设置用户名，是否立即前往设置?", "提示", {
          confirmButtonText: "前往",
          cancelButtonText: "暂不",
          type: "warning"
        })
          .then(() => {
            this.$router.push({
              name: "Profile"
            });
          })
          .catch(err => {});
      }
    }
  },
  created() {
    this.loading = true;
    chartDataByTid(this.$store.getters.id)
      .then(res => {
        // console.log(res.data);
        let tempArr = [];
        this.courseCount = res.data.courses.length;
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
  },
  mounted() {
    this.showSetTip();
    let times = 0; //记录次数
    let getFunc = () => {
      return chartDataByTid(this.$store.getters.id).then(res => {
        if (this.courseCount === res.data.courses.length) {
          //此处暂时仅判断长度，不严谨

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
        }
      });
    };
    this.timer1 = setInterval(() => {
      if (this.chartData.length > 0) {
        times++;
        if (times >= 50) {
          //如果请求次数到50，变成隔60s请求一次
          clearInterval(this.timer1); //清除原定时器
          this.timer1 = setInterval(() => {
            if (this.chartData.length > 0) {
              getFunc().catch(err => {
                console.log("timer1(60s)里", err);
                clearInterval(this.timer1);
              });
            }
          }, 60 * 1000);
        }
        getFunc().catch(err => {
          console.log("timer1里", err);
          times = 50;
        });
      }
    }, 8 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer1);
    console.log("定时器清理了");
    this.timer1 = null;
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
  .el-row {
    border-radius: 5px;
    background-color: #fff;
    margin-bottom: 32px;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.07);
    .chart-title {
      font-size: 18px;
      margin: 14px 20px 20px;
      color: #909399;
      transition: color 0.4s;
      span {
        font-size: 12px;
        margin-left: 12px;
      }
      &:hover {
        cursor: pointer;
        color: #409eff;
      }
    }
    .chart {
      padding: 16px 16px 0;
    }
  }
}
</style>
