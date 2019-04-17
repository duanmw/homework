<template>
  <div class="work-container">
    <h3>{{courseName}}</h3>
    <div>{{course.info}}</div>
    <div class="content-area" v-loading="loading">
      <el-collapse v-model="activeName">
        <el-collapse-item v-for="i in homeworks" :key="'work'+i.id" :name="i.id">
          <div slot="title" class="panel-title">
            <el-tag v-if="i.state==1" type="warning" size="small">未开放</el-tag>
            <el-tag v-else-if="i.state==2" type="success" size="small">开放中</el-tag>
            <el-tag v-else type="info" size="small">已关闭</el-tag>
            <span class="work-name">{{i.name}}</span>
            <span class="create-time">创建于 {{i.createtime}}</span>
            <el-tooltip :content="'已提交人数：'+i.submitcount" placement="top">
              <span class="submit-count">
                <span>{{i.submitcount}}</span>
                / {{stuCount}}
              </span>
            </el-tooltip>
          </div>
          <el-row>
            <el-col :xs="24" :sm="12">
              <span class="label-text">开始时间：</span>
              {{i.starttime}}
            </el-col>
            <el-col :xs="24" :sm="12">
              <span class="label-text">关闭时间：</span>
              {{i.closetime}}
            </el-col>
            <el-col :xs="24" :sm="12">
              <span class="label-text">关闭后是否显示答案：</span>
              {{i.showanswer}}
            </el-col>
            <el-col :xs="24" :sm="12">
              <span class="label-text">最大提交次数：</span>
              {{i.maxsubmit}}
            </el-col>
            <el-col :xs="24" :sm="12">
              <span class="label-text">习题数量：</span>
              {{i.quescount}}&nbsp;&nbsp;&nbsp;
              <router-link
                :to="{ name: '', params: { wid:i.id,wname:i.name,courseId,courseName }}"
                tag="span"
              >
                <el-button size="small" icon="el-icon-tickets">查看习题</el-button>
              </router-link>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-button size="small" icon="el-icon-view">查看成绩</el-button>
              <el-button
                size="small"
                icon="el-icon-edit"
                :disabled="!i.state"
                @click="handleUpdate(i)"
              >修改设置</el-button>
              <el-button
                plain
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="handleDelete(i)"
              >删除作业</el-button>
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
      courseId: "",
      courseName: "",
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
    if (this.$route.params.cid && this.$route.params.cname) {
      this.courseId = this.$route.params.cid;
      this.courseName = this.$route.params.cname;

      this.getWork(this.courseId);
      getOneCourse(this.courseId)
        .then(res => {
          this.course = res.data.course;
        })
        .catch(error => {
          // this.loading = false;
          this.$message.error(error + " 数据获取失败");
        });
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
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.work-container {
  margin: 30px;
  h3 {
    margin-top: 0;
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
    min-width: 50%;
    .el-tag {
      margin-right: 6px;
    }

    .work-name {
      font-size: 14px;
    }
    .create-time {
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
      span {
        color: #53a8ff;
      }
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
