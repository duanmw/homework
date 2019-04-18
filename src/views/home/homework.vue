<template>
  <div class="work-container">
    <template v-if="JSON.stringify(course) == '{}'">
      <transition enter-active-class="animated zoomInUp" appear>
        <el-alert title="无数据，请返回重试！" type="warning" center show-icon></el-alert>
      </transition>
    </template>
    <template v-else>
      <div class="cname">
        {{course.name}}
        <span>此课程由教师&nbsp;{{course.teacher.name?course.teacher.name:course.teacher.email}} {{course.createtime | substrDate}}创建</span>
      </div>
      <div class="info">课程简介：{{course.info?course.info:"暂无"}}</div>
    </template>

    <div class="content-area" v-loading="loading">
      <el-collapse v-if="homeworks.length!=0" v-model="activeName">
        <el-collapse-item v-for="i in homeworks" :key="'work'+i.id" :name="i.id">
          <div slot="title" class="panel-title">
            <el-tag v-if="i.state==1" type="warning" size="small">未开放</el-tag>
            <el-tag v-else-if="i.state==2" type="success" size="small">开放中</el-tag>
            <el-tag v-else type="info" size="small">已关闭</el-tag>
            <span class="work-name">{{i.name}}</span>
            <span
              class="open-time"
            >开放时间：{{i.starttime | substrDate}}&nbsp;-&nbsp;{{i.closetime | substrDate}}</span>
            <el-tooltip :content="'得分：'+'666'+' ， 总分：'+i.quescount*2" placement="top">
              <span class="submit-count">
                <span>{{666}}</span>
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
                <!-- <div v-for="i in 4" :key="i"> -->
                <div v-for="i in 4" :key="i">
                  第{{i}}次：耗时：{{8}}min，{{ 7777}}分
                  <div class="split-line"></div>
                </div>

                <!-- </div> -->
                <span slot="reference">
                  <span class="label-text">你已提交次数：</span>
                  {{3}}
                </span>
              </el-popover>
            </el-col>
            <el-col :xs="24" :sm="8">
              <router-link
                v-if="i.state===0"
                :to="{ name: 'WorkContent', params: { work:i, course}}"
                tag="span"
              >
                <el-button size="small" type="primary" plain icon="el-icon-tickets">查看作业</el-button>
              </router-link>
              <router-link
                v-if="i.state===2"
                :to="{ name: '', params: { wid:i.id,wname:i.name }}"
                tag="span"
              >
                <el-button size="small" type="success" plain icon="el-icon-edit">开始答题</el-button>
              </router-link>
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
import { getOneCourse } from "@/api/course";
import { addWork, deleteWork, allWorkByCid } from "@/api/homework";

export default {
  name: "Homework",
  components: {},
  data() {
    return {
      loading: false,
      course: {},
      homeworks: [],
      activeName: "1",
      stuCount: "",
      timer1: null, //记录定时器(更新作业状态)
      timer2: null //记录定时器（获取作业信息，主要是更新提交人数）
    };
  },
  methods: {
    getWork(courseId) {
      this.loading = true;

      if (this.timer1) {
        // 先清理定时器
        clearInterval(this.timer1);
      }
      allWorkByCid(courseId)
        .then(res => {
          this.loading = false;
          this.homeworks = res.data.works;

          let getState = function() {
            console.log("定时器里getState执行");
            let now = new Date();
            this.homeworks.forEach((item, index) => {
              let start = new Date(item.starttime);
              let end = new Date(item.closetime);
              if (now < start) {
                // item.state = 1; //1：未开始
                this.$set(this.homeworks[index], "state", 1); //这样改变对象属性值才能触发视图更新
              } else if (now >= start && now < end) {
                // item.state = 2; //2：开放中
                this.$set(this.homeworks[index], "state", 2);
              } else {
                // item.state = 0; //0：已关闭
                this.$set(this.homeworks[index], "state", 0);
              }
            });
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

    handleDelete(item) {
      this.$confirm(
        "此操作将永久删除作业：" + item.name + "，不可撤销，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loading = true;
          return deleteWork(item);
        })
        .then(res => {
          this.$message.success("删除成功！");
          this.getWork(item.cid);
        })
        .catch(() => {
          this.loading = false;
          this.$message({
            type: "info",
            duration: 2000,
            message: "已取消删除"
          });
        });
    }
  },
  created() {
    if (this.$route.params.course) {
      this.course = this.$route.params.course;

      this.getWork(this.course.id);
      // getOneCourse(this.course.id)
      //   .then(res => {
      //     this.course = res.data.course;
      //   })
      //   .catch(error => {
      //     // this.loading = false;
      //     this.$message.error(error + " 数据获取失败");
      //   });
    }
  },
  mounted() {
    // let times = 0; //记录次数
    // this.timer2 = setInterval(() => {
    //   if (this.homeworks.length > 0) {
    //     times++;
    //     if (times >= 50) {
    //       //如果请求次数到50，变成隔60s请求一次
    //       clearInterval(this.timer2); //清除原定时器
    //       this.timer2 = setInterval(() => {
    //         if (this.homeworks.length > 0) {
    //           allWorkByCid(this.courseId)
    //             .then(res => {
    //               if (this.homeworks.length === res.data.works.length) {
    //                 //此处暂时仅判断长度，不严谨
    //                 this.homeworks.forEach((item, index) => {
    //                   this.$set(
    //                     item,
    //                     "submitcount",
    //                     res.data.works[index].submitcount
    //                   ); //这样改变对象属性值才能触发视图更新
    //                 });
    //               }
    //             })
    //             .catch(err => {
    //               console.log("timer2(30s)里", err);
    //               clearInterval(this.timer2);
    //             });
    //         }
    //       }, 60 * 1000);
    //     }
    //     console.log("timer2里发送请求---");
    //     allWorkByCid(this.courseId)
    //       .then(res => {
    //         if (this.homeworks.length === res.data.works.length) {
    //           this.homeworks.forEach((item, index) => {
    //             this.$set(
    //               item,
    //               "submitcount",
    //               res.data.works[index].submitcount
    //             ); //这样改变对象属性值才能触发视图更新
    //           });
    //         }
    //       })
    //       .catch(err => {
    //         console.log("timer2里", err);
    //         times = 50;
    //       });
    //   }
    // }, 8 * 1000);
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
      color: #C0C4CC;
      float: right;
    }
  }
  .info {
    color: #909399;
    font-size: 13px;
    margin: 16px 0 20px;
  }
  .content-area {
    min-height: calc(100vh - 200px); // for v-loading
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
