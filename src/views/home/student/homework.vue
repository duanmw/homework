<template>
  <div class="work-container">
    <template v-if="JSON.stringify(course) == '{}'">
      <transition enter-active-class="animated zoomInUp" appear>
        <el-alert title="无数据，请返回首页重试！" type="warning" center show-icon></el-alert>
      </transition>
    </template>
    <template v-else>
      <div v-waves class="cname">
        <svg-icon icon-class="book"></svg-icon>
        &nbsp;&nbsp;{{course.name}}
        <span>此课程由教师&nbsp;{{course.teacher.name?course.teacher.name:course.teacher.email}} {{course.createtime | substrDate}}创建</span>
      </div>
      <div class="info">课程简介：{{course.info?course.info:"暂无"}}</div>
    </template>
    <div class="content-area" v-loading="loading">
      <el-collapse accordion v-if="homeworks.length!=0" v-model="activeName">
        <el-collapse-item v-for="i in homeworks" :key="'work'+i.id" :name="i.id">
          <div slot="title" class="panel-title">
            <el-tag v-if="i.state==1" type="warning" size="small">未开放</el-tag>
            <el-tag v-else-if="i.state==2" type="success" size="small">开放中</el-tag>
            <el-tag v-else type="info" size="small">已关闭</el-tag>
            <span class="work-name">{{i.name}}</span>
            <span
              class="open-time"
            >开放时间：{{i.starttime | substrDate}}&nbsp;-&nbsp;{{i.closetime | substrDate}}</span>
            <el-tooltip
              :content="'成绩：'+(i.maxscore?i.maxscore:0)+' ， 总分：'+i.quescount*2"
              placement="top"
            >
              <span class="submit-count">
                <span>{{i.maxscore?i.maxscore:0}}</span>
                / {{i.quescount*2}}
              </span>
            </el-tooltip>
          </div>
          <el-row>
            <el-col :xs="24" :sm="16">
              <span class="label-text">允许提交次数：</span>
              {{i.maxsubmit}}
            </el-col>
            <el-col :xs="24" :sm="8">
              <span class="label-text">习题数量：</span>
              {{i.quescount}}
            </el-col>
            <el-col :xs="24" :sm="16">
              <el-popover trigger="hover" placement="right">
                <div v-for="(sc,index) in i.scores" :key="sc.submittime">
                  {{sc.submittime}}提交，成绩：{{ sc.score}}分，耗时：{{Math.floor(sc.spendtime/60)}}min{{sc.spendtime%60}}s
                  <div class="split-line"></div>
                </div>
                <div v-if="i.scores&&i.scores.length==0">无提交信息</div>

                <span slot="reference">
                  <span class="label-text">你已提交次数：</span>
                  {{i.scores?i.scores.length:0}}
                </span>
              </el-popover>
            </el-col>
            <el-col :xs="24" :sm="8">
              <router-link
                v-if="i.state===0"
                :to="{ name: 'WorkContent', params: { work:i, course, activeName}}"
                tag="span"
              >
                <el-button size="small" type="primary" plain icon="el-icon-tickets">查看作业</el-button>
              </router-link>

              <el-button
                v-if="i.state===2 && i.scores.length<i.maxsubmit"
                size="small"
                type="success"
                plain
                icon="el-icon-edit"
                @click="handleStart(i)"
              >开始答题</el-button>
              <el-button
                v-if="i.state===1 || (i.state===2 && i.scores.length>=i.maxsubmit)"
                disabled
                size="small"
                type="success"
                plain
                icon="el-icon-edit"
              >开始答题</el-button>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <br>
      <transition name="slow-fade" appear>
        <div v-if="homeworks.length==0" class="nodata-tip">
          <svg-icon icon-class="nodata"/>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { oneWork, workAndScore } from "@/api/homework";
import { getOneCourse } from "@/api/course";
import waves from "@/directive/waves/index.js"; // 水波纹指令
export default {
  name: "Homework",
  data() {
    return {
      loading: false,
      course: {},
      homeworks: [],
      activeName: "",
      timer1: null, //记录定时器(更新作业状态)
      timer2: null //记录定时器（更新作业信息，主要是）
    };
  },
  directives: {
    waves
  },
  methods: {
    getWork(courseId) {
      this.loading = true;

      if (this.timer1) {
        // 先清理定时器
        clearInterval(this.timer1);
      }
      workAndScore(courseId, this.$store.getters.id)
        .then(res => {
          this.loading = false;
          this.homeworks = res.data.works;

          let getState = function() {
            // console.log("定时器里getState执行");
            let now = new Date();
            let clearflag = true; //是否执行定时器的标志,true要清除
            this.homeworks.forEach((item, index) => {
              let start = new Date(item.starttime);
              let end = new Date(item.closetime);
              if (now < start) {
                // item.state = 1; //1：未开始
                this.$set(this.homeworks[index], "state", 1); //这样改变对象属性值才能触发视图更新
                clearflag = false;
              } else if (now >= start && now < end) {
                // item.state = 2; //2：开放中
                this.$set(this.homeworks[index], "state", 2);
                clearflag = false;
              } else {
                // item.state = 0; //0：已关闭
                this.$set(this.homeworks[index], "state", 0);
              }
            });
            if (clearflag && this.timer1) {
              clearInterval(this.timer1);
            }
          }.bind(this); //此处绑定this，到定时器里this就不会被改变了
          getState();
          if (this.homeworks.length > 0) {
            this.timer1 = setInterval(getState, 2000);
          }
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error + " 数据获取失败");
        });
    },
    handleStart(work) {
      oneWork(work.id)
        .then(res => {
          let start = new Date(res.data.work.starttime);
          let now = new Date();
          if (now < start) {
            //作业未开始
            this.$alert("页面需要刷新数据以便继续", "提示", {
              confirmButtonText: "确定",
              callback: action => {
                if (action == "confirm") {
                  this.getWork(this.course.id);
                }
              }
            });
          } else {
            this.$confirm(
              work.name +
                "，即将开始第" +
                (work.scores.length + 1) +
                "次答题，答题过程请勿刷新页面！！！ 是否立即开始?",
              "提示",
              {
                confirmButtonText: "开始",
                cancelButtonText: "取消",
                type: "warning"
              }
            )
              .then(() => {
                this.$router.push({
                  name: "DoWork",
                  // query: { work: work.id },
                  params: {
                    work,
                    course: this.course,
                    activeName: this.activeName
                  }
                });
              })
              .catch(err => {
                if (err != "cancel")
                  this.$message({
                    type: "info",
                    message: err
                  });
              });
          }
        })
        .catch();
    }
  },
  created() {
    if (this.$route.params.course) {
      this.course = this.$route.params.course;
      if (this.course.id) {
        this.getWork(this.course.id);
      }
    }

    if (this.$route.params.activeName) {
      this.activeName = this.$route.params.activeName;
    }
  },
  mounted() {
    let times = 0; //记录次数
    let getFunc = () => {
      return workAndScore(this.course.id, this.$store.getters.id).then(res => {
        if (this.homeworks.length === res.data.works.length) {
          //此处暂时仅判断长度，不严谨
          let clearflag = true; //是否执行定时器的标志,true要清除
          this.homeworks.forEach((item, index) => {
            this.$set(item, "submitcount", res.data.works[index].submitcount); //这样改变对象属性值才能触发视图更新
            this.$set(item, "starttime", res.data.works[index].starttime); //这样改变对象属性值才能触发视图更新
            this.$set(item, "closetime", res.data.works[index].closetime); //这样改变对象属性值才能触发视图更新
            this.$set(item, "maxsubmit", res.data.works[index].maxsubmit); //这样改变对象属性值才能触发视图更新
            this.$set(item, "name", res.data.works[index].name); //这样改变对象属性值才能触发视图更新
            if (item.state == 1 || item.state == 2) {
              //状态为 未开放 或 开放中，则要执行定时器
              clearflag = false;
            }
          });
          if (clearflag && this.timer2) {
            clearInterval(this.timer2);
            console.log("clearflag为true,清除timer2");
          }
        }
      });
    };
    this.timer2 = setInterval(() => {
      if (this.homeworks.length > 0) {
        times++;
        if (times >= 50) {
          //如果请求次数到50，变成隔60s请求一次
          clearInterval(this.timer2); //清除原定时器
          this.timer2 = setInterval(() => {
            if (this.homeworks.length > 0) {
              getFunc().catch(err => {
                console.log("timer2(60s)里", err);
                clearInterval(this.timer2);
              });
            }
          }, 60 * 1000);
        }
        console.log("timer2里发送请求---" + times);
        getFunc().catch(err => {
          console.log("timer2里", err);
          times = 50;
        });
      }
    }, 8 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer1);
    clearInterval(this.timer2);
    console.log("定时器清理了");
    this.timer1 = null;
    this.timer2 = null;
  }
};
</script>
<style lang="scss">
.work-container {
  .el-collapse-item__header {
    // font-size: 14px;
    &.is-active {
      .work-name {
        color: #409eff;
      }
      .submit-count {
        span {
          // color: #53a8ff;
          color: #409eff;
        }
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.work-container {
  margin: 30px;
  .cname {
    font-size: 18px;
    color: #303133;

    span {
      font-size: 13px;
      line-height: 20px;
      color: #c0c4cc;
      float: right;
    }
  }
  .info {
    color: #909399;
    font-size: 13px;
    margin: 16px 0 20px;
  }
  .content-area {
    min-height: calc(100vh - 160px); // for-loading
    .el-col {
      color: #606266;
      .label-text {
        color: #909399;
      }
    }
  }
  .panel-title {
    min-width: 66.66%;
    .el-tag {
      margin-right: 6px;
    }

    .work-name {
      font-size: 14px;
    }
    .open-time {
      margin-left: 10px;
      color: #c0c4cc;
    }
    .submit-count {
      color: #909399;
      float: right;
      transform: translateX(100%);
      margin-top: 15px;
      height: 20px;
      line-height: 20px;
      // span {
      //   // color: #53a8ff;
      //   // color: #409EFF;
      // }
    }
    .el-button {
      float: right;
      margin-top: 8px;
      margin-right: 10px;
      // line-height: 48px;
    }
  }
  .el-collapse-item .el-col {
    margin-top: 12px;
  }
}
</style>
