<template>
  <div class="work-container">
    <!-- <h3>全部作业</h3> -->
    <div class="title-bar">
      <el-row>
        <el-col :xs="24" :sm="12">
          课程：&nbsp;
          <el-select @change="getWork" v-model="courseId" placeholder="请选择课程" size="medium">
            <el-option
              v-for="course in courses"
              :key="'optc'+course.id"
              :label="course.name"
              :value="course.id"
            >
              <span style="float: left">{{ course.name }}</span>
              <span
                style="margin-left: 10px; line-height: 36px; float: right; color: #c0c4cc; font-size: 13px"
              >{{ '作业:'+course.workcount }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12">
          <router-link
            v-if="courseId"
            :to="{ name: 'addHomework', params: { courseId,courseName,suggestName}}"
            tag="span"
          >
            <el-button size="medium" icon="el-icon-circle-plus-outline">添加作业</el-button>
          </router-link>
          <el-button v-else disabled size="medium" icon="el-icon-circle-plus-outline">添加作业</el-button>

          <router-link
            v-if="courseId && homeworks.length>0"
            :to="{ name: 'CourseScore', params: { courseId,courseName,activeName }}"
            tag="span"
          >
            <el-button size="medium" icon="el-icon-printer">统计成绩</el-button>
          </router-link>
          <el-button v-else disabled size="medium" icon="el-icon-printer">统计成绩</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="content-area" v-loading="loading">
      <el-collapse v-model="activeName">
        <transition-group name="fade-up" tag="div" appear>
          <el-collapse-item v-for="i in homeworks" :key="'work'+i.id" :name="i.id">
            <div slot="title" class="panel-title">
              <!-- <span v-if="i.state==1" class="wait-state">未开放</span> -->
              <el-tag v-if="i.state==1" type="warning" size="small">未开放</el-tag>
              <!-- <span v-else-if="i.state==2" class="opening-state">开放中</span> -->
              <el-tag v-else-if="i.state==2" type="success" size="small">开放中</el-tag>
              <!-- <span v-else class="closed-state">已关闭</span>-->
              <el-tag v-else type="info" size="small">已关闭</el-tag>
              <span class="work-name">{{i.name}}</span>
              <span class="create-time">创建于 {{i.createtime}}</span>
              <el-tooltip :content="'已提交人数：'+i.submitcount" placement="top">
                <span class="submit-count">
                  <span>{{i.submitcount}}</span>
                  / {{stuCount}} 提交
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
                <span class="label-text">作业关闭后答案可见：</span>
                {{i.showanswer}}
              </el-col>
              <el-col :xs="24" :sm="12">
                <span class="label-text">允许提交次数：</span>
                {{i.maxsubmit}}
              </el-col>
              <el-col :xs="24" :sm="12">
                <span class="label-text">习题数量：</span>
                {{i.quescount}}&nbsp;&nbsp;&nbsp;
                <router-link
                  :to="{ name: 'Question', params: { wid:i.id,wname:i.name,courseId,courseName,activeName }}"
                  tag="span"
                >
                  <el-button size="small" icon="el-icon-tickets">查看习题</el-button>
                </router-link>
              </el-col>
              <el-col :xs="24" :sm="12">
                <router-link
                  :to="{ name: 'StuScore', params: { work:i, courseId,courseName,activeName }}"
                  tag="span"
                >
                  <el-button size="small" icon="el-icon-view">查看成绩</el-button>
                </router-link>
                <el-button
                  v-if="i.state"
                  size="small"
                  icon="el-icon-edit"
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
        </transition-group>
      </el-collapse>
      <br>
      <transition enter-active-class="animated zoomInUp" :duration="{ leave: 0 }" appear>
        <el-alert
          v-if="courses.length!=0&&!courseId"
          title="请先选择一个课程"
          type="warning"
          center
          show-icon
        ></el-alert>
      </transition>
      <transition name="slow-fade" appear>
        <div v-if="courses.length==0||(courses.length!=0&&homeworks.length==0)" class="nodata-tip">
          <svg-icon icon-class="nodata"/>
        </div>
      </transition>
    </div>
    <update-work-dialog
      @closeDialog="dialogVisible=false"
      @beforeUpdate="loading=true"
      @afterUpdate="loading=false;getWork(courseId)"
      :dialogVisible.sync="dialogVisible"
      :homework="activeHomework"
    ></update-work-dialog>
  </div>
</template>

<script>
import { allCourseByTid } from "@/api/course";
import { addWork, deleteWork, allWorkByCid } from "@/api/homework";
import UpdateWorkDialog from "./UpdateWorkDialog";
export default {
  name: "Homework",
  components: {
    UpdateWorkDialog
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      courses: [],
      homeworks: [],
      activeHomework: {},
      activeName: "",
      courseId: "",
      courseName: "",
      stuCount: "",
      suggestName: "",
      timer1: null, //记录定时器(更新作业状态)
      timer2: null //记录定时器（获取作业信息，主要是更新提交人数）
    };
  },
  watch: {
    homeworks(newWork) {
      this.suggestName =
        this.courseName + "第" + (newWork.length + 1) + "次作业";
    },
    courseId() {
      if (this.timer2) {
        clearInterval(this.timer2); //每次重新选择课程，先清理定时器
      }
      let times = 0; //记录次数
      let getFunc = () => {
        return allWorkByCid(this.courseId).then(res => {
          if (this.homeworks.length === res.data.works.length) {
            //此处暂时仅判断长度，不严谨
            let clearflag = true; //是否执行定时器的标志,true要清除
            this.homeworks.forEach((item, index) => {
              this.$set(item, "submitcount", res.data.works[index].submitcount); //这样改变对象属性值才能触发视图更新
              if (item.state == 1 || item.state == 2) {
                //状态为 未开放 或 开放中，则要执行定时器
                clearflag = false;
              }
            });
            if (clearflag && this.timer2) {
              clearInterval(this.timer2);
              // console.log("clearflag为true,清除timer2");
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
          // console.log("timer2里发送请求---" + times);
          getFunc().catch(err => {
            console.log("timer2里", err);
            times = 50;
          });
        }
      }, 8 * 1000);
    }
  },
  methods: {
    getWork(courseId) {
      this.loading = true;
      let obj = {};
      obj = this.courses.find(item => {
        return item.id === courseId; //筛选出匹配课程id的课程
      });
      if (obj.stucount) {
        //有可能还没有stucount属性
        this.stuCount = obj.stucount; //设置当前课程学生数
      }
      this.courseName = obj.name; //设置对应课程名
      if (this.timer1) {
        // 先清理定时器
        clearInterval(this.timer1);
      }
      allWorkByCid(courseId)
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
                //1：未开始
                this.$set(this.homeworks[index], "state", 1); //这样改变对象属性值才能触发视图更新
                clearflag = false;
              } else if (now >= start && now < end) {
                //2：开放中
                this.$set(this.homeworks[index], "state", 2);
                clearflag = false;
              } else {
                //0：已关闭
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
    handleUpdate(item) {
      this.activeHomework = item;
      this.dialogVisible = true;
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
    if (this.$route.params.courseId && this.$route.params.courseName) {
      this.courseId = this.$route.params.courseId;
      this.courseName = this.$route.params.courseName;
      this.courses.push({
        id: this.courseId,
        name: this.courseName
      });
      this.getWork(this.courseId);
    }
    if (this.$route.params.activeName) {
      this.activeName = this.$route.params.activeName;
    }
    allCourseByTid(this.$store.getters.id)
      .then(res => {
        this.courses = res.data.courses;
        if (this.courseId) {
          //若还没选课程（cid为空），则不用设置
          let obj = {};
          obj = this.courses.find(item => {
            return item.id === this.courseId; //筛选出匹配课程id的课程
          });
          this.stuCount = obj.stucount; //设置当前课程学生人数
        }
      })
      .catch(error => {
        this.$message.error(error + " 数据获取失败");
      });
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
  .title-bar {
    color: #444;
    padding: 0 0 20px;
    & > .el-row > .el-col {
      margin-bottom: 8px;
    }
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
